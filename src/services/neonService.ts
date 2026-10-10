import { neon } from '@neondatabase/serverless';
import { User, Token, Trade } from '../types';

// Connection String from environment or configured Neon PostgreSQL instance
const FALLBACK_URL = 'postgresql://neondb_owner:npg_aKOGP2npqY8h@ep-cold-band-b4plgdyc-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

const getDatabaseUrl = (): string => {
  try {
    return (import.meta as any).env?.VITE_DATABASE_URL || FALLBACK_URL;
  } catch {
    return FALLBACK_URL;
  }
};

let sqlClient: ReturnType<typeof neon> | null = null;

const getSql = () => {
  if (!sqlClient) {
    const url = getDatabaseUrl();
    sqlClient = neon(url);
  }
  return sqlClient;
};

export const neonService = {
  // 1. Save or Update User
  saveUser: async (user: User): Promise<User> => {
    try {
      const sql = getSql();
      const now = new Date().toISOString();
      await sql`
        INSERT INTO velox_users (id, username, email, avatar_url, auth_provider, wallet_address, created_at, updated_at)
        VALUES (${user.id}, ${user.username}, ${user.email}, ${user.avatarUrl}, ${user.authProvider}, ${user.monadWalletAddress}, ${user.createdAt || now}, NOW())
        ON CONFLICT (email) 
        DO UPDATE SET 
          username = EXCLUDED.username,
          avatar_url = EXCLUDED.avatar_url,
          wallet_address = EXCLUDED.wallet_address,
          updated_at = NOW();
      `;
      return user;
    } catch (err) {
      console.warn('Neon DB: Error saving user, using local fallback:', err);
      return user;
    }
  },

  // 2. Fetch User by Email or Username
  getUserByEmail: async (email: string): Promise<User | null> => {
    try {
      const sql = getSql();
      const rows = (await sql`
        SELECT * FROM velox_users 
        WHERE LOWER(email) = LOWER(${email.trim()}) 
        LIMIT 1;
      `) as any[];
      if (rows && rows.length > 0) {
        const row = rows[0];
        return {
          id: row.id,
          username: row.username,
          email: row.email,
          avatarUrl: row.avatar_url,
          authProvider: row.auth_provider,
          createdAt: row.created_at,
          monadWalletAddress: row.wallet_address
        };
      }
      return null;
    } catch (err) {
      console.warn('Neon DB: Error querying user by email:', err);
      return null;
    }
  },

  // 3. Fetch All Stored Users
  getAllUsers: async (): Promise<User[]> => {
    try {
      const sql = getSql();
      const rows = (await sql`
        SELECT * FROM velox_users 
        ORDER BY updated_at DESC 
        LIMIT 50;
      `) as any[];
      return rows.map((row: any) => ({
        id: row.id,
        username: row.username,
        email: row.email,
        avatarUrl: row.avatar_url,
        authProvider: row.auth_provider,
        createdAt: row.created_at,
        monadWalletAddress: row.wallet_address
      }));
    } catch (err) {
      console.warn('Neon DB: Error querying all users:', err);
      return [];
    }
  },

  // 4. Save Community Launched Token
  saveToken: async (token: Token): Promise<Token> => {
    try {
      const sql = getSql();
      const sparklineJson = JSON.stringify(token.sparkline7d || []);
      await sql`
        INSERT INTO velox_tokens (
          id, name, symbol, description, image_url, creator, created_at, created_timestamp_ms,
          market_cap_mon, price_mon, bonding_progress, mon_raised, mon_target, holders_count,
          volume_24h, price_change_24h, is_graduated, replies_count, shield_active,
          shield_remaining_seconds, max_shield_buy_mon, chain, chain_symbol, contract_address,
          usd_price, usd_market_cap, usd_24h_vol, sparkline_7d, updated_at
        ) VALUES (
          ${token.id}, ${token.name}, ${token.symbol}, ${token.description || ''}, ${token.imageUrl || ''},
          ${token.creator || ''}, ${token.createdAt || 'Just now'}, ${token.createdTimestampMs || Date.now()},
          ${token.marketCapMon || 5.0}, ${token.priceMon || 0.0001}, ${token.bondingProgress || 2},
          ${token.monRaised || 0}, ${token.monTarget || 50.0}, ${token.holdersCount || 1},
          ${token.volume24h || 0}, ${token.priceChange24h || 0}, ${Boolean(token.isGraduated)},
          ${token.repliesCount || 0}, ${Boolean(token.shieldActive)}, ${token.shieldRemainingSeconds || 60},
          ${token.maxShieldBuyMon || 0.5}, ${token.chain || 'monad'}, ${token.chainSymbol || 'MON'},
          ${token.contractAddress || ''}, ${token.usdPrice || 0.0001}, ${token.usdMarketCap || 50000},
          ${token.usd24hVol || 0}, ${sparklineJson}::jsonb, NOW()
        )
        ON CONFLICT (id) 
        DO UPDATE SET
          mon_raised = EXCLUDED.mon_raised,
          bonding_progress = EXCLUDED.bonding_progress,
          market_cap_mon = EXCLUDED.market_cap_mon,
          price_change_24h = EXCLUDED.price_change_24h,
          updated_at = NOW();
      `;
      return token;
    } catch (err) {
      console.warn('Neon DB: Error saving token, using local fallback:', err);
      return token;
    }
  },

  // 5. Fetch Community Launched Tokens
  getCommunityTokens: async (): Promise<Token[]> => {
    try {
      const sql = getSql();
      const rows = (await sql`
        SELECT * FROM velox_tokens 
        ORDER BY updated_at DESC 
        LIMIT 50;
      `) as any[];
      return rows.map((row: any) => ({
        id: row.id,
        name: row.name,
        symbol: row.symbol,
        description: row.description,
        imageUrl: row.image_url,
        creator: row.creator,
        createdAt: row.created_at,
        createdTimestampMs: row.created_timestamp_ms ? Number(row.created_timestamp_ms) : undefined,
        marketCapMon: Number(row.market_cap_mon),
        priceMon: Number(row.price_mon),
        bondingProgress: Number(row.bonding_progress),
        monRaised: Number(row.mon_raised),
        monTarget: Number(row.mon_target),
        holdersCount: Number(row.holders_count),
        volume24h: Number(row.volume_24h),
        priceChange24h: Number(row.price_change_24h),
        isGraduated: Boolean(row.is_graduated),
        repliesCount: Number(row.replies_count),
        shieldActive: Boolean(row.shield_active),
        shieldRemainingSeconds: Number(row.shield_remaining_seconds),
        maxShieldBuyMon: Number(row.max_shield_buy_mon),
        chain: row.chain,
        chainSymbol: row.chain_symbol,
        contractAddress: row.contract_address,
        usdPrice: row.usd_price ? Number(row.usd_price) : undefined,
        usdMarketCap: row.usd_market_cap ? Number(row.usd_market_cap) : undefined,
        usd24hVol: row.usd_24h_vol ? Number(row.usd_24h_vol) : undefined,
        sparkline7d: typeof row.sparkline_7d === 'string' ? JSON.parse(row.sparkline_7d) : (row.sparkline_7d || [])
      }));
    } catch (err) {
      console.warn('Neon DB: Error fetching community tokens:', err);
      return [];
    }
  },

  // 6. Save Executed Trade
  saveTrade: async (trade: Trade): Promise<Trade> => {
    try {
      const sql = getSql();
      await sql`
        INSERT INTO velox_trades (
          id, token_id, token_symbol, token_image_url, type, user_address,
          mon_amount, token_amount, timestamp_text, timestamp_ms, tx_hash,
          latency_ms, currency_symbol, created_at
        ) VALUES (
          ${trade.id}, ${trade.tokenId}, ${trade.tokenSymbol}, ${trade.tokenImageUrl || ''},
          ${trade.type}, ${trade.user}, ${trade.monAmount}, ${trade.tokenAmount},
          ${trade.timestamp}, ${trade.timestampMs || Date.now()}, ${trade.txHash || ''},
          ${trade.latencyMs || 780}, ${trade.currencySymbol || 'MON'}, NOW()
        )
        ON CONFLICT (id) DO NOTHING;
      `;
      return trade;
    } catch (err) {
      console.warn('Neon DB: Error saving trade:', err);
      return trade;
    }
  },

  // 7. Save or Update Rewards Daily Claim
  saveRewards: async (userAddress: string, points: number, streak: number, timestampMs: number): Promise<void> => {
    try {
      const sql = getSql();
      await sql`
        INSERT INTO velox_rewards (user_address, points, streak_days, last_claim_timestamp, updated_at)
        VALUES (${userAddress.toLowerCase()}, ${points}, ${streak}, ${timestampMs}, NOW())
        ON CONFLICT (user_address)
        DO UPDATE SET 
          points = EXCLUDED.points,
          streak_days = EXCLUDED.streak_days,
          last_claim_timestamp = EXCLUDED.last_claim_timestamp,
          updated_at = NOW();
      `;
    } catch (err) {
      console.warn('Neon DB: Error saving rewards:', err);
    }
  },

  // 8. Fetch User Rewards Record
  getRewards: async (userAddress: string): Promise<{ points: number; streak: number; lastClaim: number } | null> => {
    try {
      const sql = getSql();
      const rows = (await sql`
        SELECT * FROM velox_rewards 
        WHERE LOWER(user_address) = LOWER(${userAddress.trim()}) 
        LIMIT 1;
      `) as any[];
      if (rows && rows.length > 0) {
        const row = rows[0];
        return {
          points: Number(row.points),
          streak: Number(row.streak_days),
          lastClaim: Number(row.last_claim_timestamp)
        };
      }
      return null;
    } catch (err) {
      console.warn('Neon DB: Error fetching rewards:', err);
      return null;
    }
  }
};

