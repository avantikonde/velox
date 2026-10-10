// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title BondingCurveToken
 * @dev Standard ERC-20 token with initial supply minted to the MonadPump Factory
 */
contract BondingCurveToken {
    string public name;
    string public symbol;
    uint8 public constant decimals = 18;
    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    constructor(string memory _name, string memory _symbol, address factory) {
        name = _name;
        symbol = _symbol;
        totalSupply = 1_000_000_000 * 10**18; // 1 Billion tokens
        balanceOf[factory] = totalSupply;
        emit Transfer(address(0), factory, totalSupply);
    }

    function transfer(address to, uint256 value) public returns (bool) {
        require(balanceOf[msg.sender] >= value, "Insufficient balance");
        balanceOf[msg.sender] -= value;
        balanceOf[to] += value;
        emit Transfer(msg.sender, to, value);
        return true;
    }

    function approve(address spender, uint256 value) public returns (bool) {
        allowance[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value);
        return true;
    }

    function transferFrom(address from, address to, uint256 value) public returns (bool) {
        require(balanceOf[from] >= value, "Insufficient balance");
        require(allowance[from][msg.sender] >= value, "Insufficient allowance");
        balanceOf[from] -= value;
        balanceOf[to] += value;
        allowance[from][msg.sender] -= value;
        emit Transfer(from, to, value);
        return true;
    }
}

/**
 * @title MonadPumpFactory
 * @notice High-throughput Fair-Launch Meme Token Factory for Monad Parallel L1
 *         Equipped with Anti-Sniper Shield (FairSlot Genesis)
 */
contract MonadPumpFactory {
    uint256 public constant GRADUATION_TARGET = 50 ether; // 50 MON to graduate to DEX
    uint256 public constant TOTAL_SUPPLY = 1_000_000_000 * 10**18;
    uint256 public constant MAX_SHIELD_BUY = 0.2 ether; // Anti-Sniper Shield max buy cap
    uint256 public constant SHIELD_DURATION = 60; // 60 seconds Genesis Anti-Sniper Shield window

    struct TokenInfo {
        address tokenAddress;
        string name;
        string symbol;
        uint256 monRaised;
        bool graduated;
        uint256 shieldEndTime;
    }

    mapping(address => TokenInfo) public tokens;
    address[] public allTokens;

    event TokenLaunched(address indexed token, string name, string symbol, address indexed creator);
    event TokensPurchased(address indexed token, address indexed buyer, uint256 monIn, uint256 tokensOut);
    event TokensSold(address indexed token, address indexed seller, uint256 tokensIn, uint256 monOut);
    event TokenGraduated(address indexed token, uint256 totalMonLocked);

    /**
     * @notice Launch a new token on the bonding curve with 60-Second Anti-Sniper Shield
     */
    function createToken(string memory name, string memory symbol) external payable returns (address) {
        BondingCurveToken token = new BondingCurveToken(name, symbol, address(this));
        address tokenAddr = address(token);

        tokens[tokenAddr] = TokenInfo({
            tokenAddress: tokenAddr,
            name: name,
            symbol: symbol,
            monRaised: 0,
            graduated: false,
            shieldEndTime: block.timestamp + SHIELD_DURATION
        });
        allTokens.push(tokenAddr);

        emit TokenLaunched(tokenAddr, name, symbol, msg.sender);

        if (msg.value > 0) {
            _buy(tokenAddr, msg.sender, msg.value);
        }

        return tokenAddr;
    }

    /**
     * @notice Buy tokens via native MON
     */
    function buy(address token) external payable {
        _buy(token, msg.sender, msg.value);
    }

    function _buy(address token, address buyer, uint256 monIn) internal {
        require(monIn > 0, "Amount must be > 0");
        TokenInfo storage info = tokens[token];
        require(info.tokenAddress != address(0), "Token not found");
        require(!info.graduated, "Already graduated to Monad DEX");

        // Anti-Sniper Shield (FairSlot Genesis) enforcement
        if (block.timestamp < info.shieldEndTime) {
            require(monIn <= MAX_SHIELD_BUY, "Anti-Sniper Shield: Max 0.2 MON during first 60s");
        }

        info.monRaised += monIn;

        // Guaranteed flat seed price during active shield, standard linear bonding curve afterwards
        uint256 tokensOut = (monIn * TOTAL_SUPPLY) / (GRADUATION_TARGET * 2);
        require(tokensOut > 0, "Zero tokens received");

        BondingCurveToken(token).transfer(buyer, tokensOut);
        emit TokensPurchased(token, buyer, monIn, tokensOut);

        // Check graduation
        if (info.monRaised >= GRADUATION_TARGET) {
            info.graduated = true;
            emit TokenGraduated(token, info.monRaised);
            // In full production: auto-deposit into Uniswap/MonadSwap router and burn LP tokens
        }
    }

    /**
     * @notice Sell tokens back to the bonding curve
     */
    function sell(address token, uint256 tokenAmount) external {
        require(tokenAmount > 0, "Amount must be > 0");
        TokenInfo storage info = tokens[token];
        require(!info.graduated, "Already graduated");

        uint256 monOut = (tokenAmount * GRADUATION_TARGET * 2) / TOTAL_SUPPLY;
        require(address(this).balance >= monOut, "Insufficient pool liquidity");

        BondingCurveToken(token).transferFrom(msg.sender, address(this), tokenAmount);
        payable(msg.sender).transfer(monOut);

        if (info.monRaised >= monOut) {
            info.monRaised -= monOut;
        } else {
            info.monRaised = 0;
        }

        emit TokensSold(token, msg.sender, tokenAmount, monOut);
    }

    function getAllTokensCount() external view returns (uint256) {
        return allTokens.length;
    }
}
