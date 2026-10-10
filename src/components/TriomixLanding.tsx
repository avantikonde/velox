import React, { useState } from 'react';
import { TriomixParticleSphere } from './TriomixParticleSphere';
import { 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Activity, 
  BrainCircuit, 
  Dna, 
  Database, 
  Search, 
  CheckCircle2, 
  X, 
  RotateCcw, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Cpu,
  Layers
} from 'lucide-react';

interface TriomixLandingProps {
  onRevertToOriginalUI?: () => void;
  onLaunchApp?: () => void;
}

export const TriomixLanding: React.FC<TriomixLandingProps> = ({ 
  onRevertToOriginalUI,
  onLaunchApp 
}) => {
  const [activeNav, setActiveNav] = useState<'home' | 'solutions' | 'how-it-works' | 'insights'>('home');
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [demoInput, setDemoInput] = useState('EGFR exon 20 insertion mutation therapy options');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [showUndoGuide, setShowUndoGuide] = useState(false);

  const handleRunDemo = () => {
    setIsAnalyzing(true);
    setAnalysisResult(null);
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisResult(`✓ Analysis Complete: Identified 4 FDA-approved targeted inhibitors (Mobocertinib, Amivantamab). Cross-referenced against 12 active phase-III clinical trials with 98.7% biomarker match.`);
    }, 1200);
  };

  return (
    <div className="relative min-h-screen bg-[#06060c] text-white selection:bg-purple-500 selection:text-white font-sans overflow-x-hidden">
      {/* Ambient Top Glow Nebula (matching reference image) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[340px] bg-gradient-to-b from-purple-700/25 via-indigo-900/15 to-transparent blur-[120px] pointer-events-none -z-0"></div>
      <div className="absolute top-48 right-10 w-[600px] h-[600px] bg-purple-600/15 blur-[160px] rounded-full pointer-events-none -z-0"></div>

      {/* Persistent Undo / Switcher Bar at top banner */}
      <div className="sticky top-0 z-50 bg-[#090a14]/90 backdrop-blur-md border-b border-purple-500/20 px-4 py-2 text-xs flex items-center justify-between text-slate-300">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Viewing: <strong>Triomix Animated Landing Page</strong> (Reference Match)</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowUndoGuide(true)}
            className="text-purple-300 hover:text-purple-200 underline text-xs transition-colors hidden sm:inline-block"
          >
            How to undo in git?
          </button>
          {onRevertToOriginalUI && (
            <button
              onClick={onRevertToOriginalUI}
              className="px-3 py-1 bg-purple-950/80 hover:bg-purple-900 text-purple-200 border border-purple-500/40 rounded-full font-medium transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
              title="Click here to immediately undo this landing page and switch back to the original interface"
            >
              <RotateCcw className="w-3.5 h-3.5 text-purple-300" />
              <span>Undo & Switch to Trading App</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Header / Navigation (Faithful to Screenshot) */}
      <header className="relative z-40 max-w-7xl mx-auto px-6 py-6 md:py-8 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="font-bold text-lg md:text-xl tracking-[0.25em] text-white hover:text-purple-300 transition-colors cursor-pointer select-none">
            TRIOMIX
          </div>
        </div>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center gap-10">
          <button
            onClick={() => setActiveNav('home')}
            className="relative font-medium text-sm text-slate-100 hover:text-white transition-colors flex flex-col items-center group"
          >
            <span>Home</span>
            {/* Active purple glow dot matching image */}
            {activeNav === 'home' && (
              <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-1.5 shadow-[0_0_8px_#a855f7] animate-pulse"></span>
            )}
          </button>

          <button
            onClick={() => {
              setActiveNav('solutions');
              document.getElementById('solutions')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="relative font-medium text-sm text-slate-300 hover:text-white transition-colors flex flex-col items-center group"
          >
            <span>Solutions</span>
            {activeNav === 'solutions' && (
              <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-1.5 shadow-[0_0_8px_#a855f7]"></span>
            )}
          </button>

          <button
            onClick={() => {
              setActiveNav('how-it-works');
              document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="relative font-medium text-sm text-slate-300 hover:text-white transition-colors flex flex-col items-center group"
          >
            <span>How it Works</span>
            {activeNav === 'how-it-works' && (
              <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-1.5 shadow-[0_0_8px_#a855f7]"></span>
            )}
          </button>

          <button
            onClick={() => {
              setActiveNav('insights');
              document.getElementById('insights')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="relative font-medium text-sm text-slate-300 hover:text-white transition-colors flex flex-col items-center group"
          >
            <span>Insights</span>
            {activeNav === 'insights' && (
              <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-1.5 shadow-[0_0_8px_#a855f7]"></span>
            )}
          </button>
        </nav>

        {/* Right CTA Button ("Free Demo ->") */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsDemoModalOpen(true)}
            className="group px-5 py-2 md:px-6 md:py-2.5 rounded-full border border-white/30 hover:border-purple-400/80 bg-white/5 hover:bg-purple-950/30 text-xs md:text-sm font-medium tracking-wide transition-all flex items-center gap-2 text-slate-100 hover:text-white shadow-sm hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] active:scale-95"
          >
            <span>Free Demo</span>
            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-white group-hover:translate-x-1 transition-transform" />
          </button>

          {onLaunchApp && (
            <button
              onClick={onLaunchApp}
              className="hidden lg:flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-xs font-semibold text-white shadow-lg shadow-purple-600/30 transition-all active:scale-95"
            >
              <span>Launch App</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </header>

      {/* Hero Section (Matching image layout: Left text, Right animated 3D particle sphere) */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-6 md:pt-14 pb-20 md:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center min-h-[580px]">
          
          {/* Left Column: Heading, Subtitle & Buttons */}
          <div className="lg:col-span-6 flex flex-col items-start justify-center space-y-8 z-20">
            
            {/* Tag / Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300 text-xs font-medium backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Next-Gen Oncology Intelligence</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-[1.12]">
              AI-Powered <br />
              Platform for Cancer <br />
              Care Providers.
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-slate-300 max-w-xl font-normal leading-relaxed">
              Accelerating Research, Enhancing Quality, and Streamlining Operations for Oncology Providers.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              {/* Primary Button: Request Demo */}
              <button
                onClick={() => setIsDemoModalOpen(true)}
                className="group flex items-center gap-2.5 bg-white hover:bg-slate-100 text-neutral-950 font-semibold px-7 py-3.5 rounded-full shadow-[0_0_30px_rgba(255,255,255,0.25)] hover:shadow-[0_0_35px_rgba(255,255,255,0.4)] transition-all duration-200 active:scale-95"
              >
                <span>Request Demo</span>
                <ArrowRight className="w-4 h-4 text-neutral-950 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Secondary Button: Learn More */}
              <button
                onClick={() => {
                  document.getElementById('solutions')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="group flex items-center gap-2.5 bg-white/5 hover:bg-white/10 text-white font-medium border border-white/20 hover:border-white/40 px-7 py-3.5 rounded-full transition-all duration-200 backdrop-blur-sm active:scale-95"
              >
                <span>Learn More</span>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-white group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 flex flex-wrap items-center gap-6 text-xs text-slate-400 border-t border-white/10 w-full max-w-lg">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                <span>HIPAA & SOC-2 Certified</span>
              </div>
              <div className="flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-purple-400" />
                <span>99.4% Diagnostic Precision</span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-purple-400" />
                <span>Real-Time EMR Integration</span>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Animated Particle Sphere */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            {/* Subtle background ambient ring */}
            <div className="absolute w-[450px] h-[450px] rounded-full border border-purple-500/10 pointer-events-none"></div>
            <div className="absolute w-[560px] h-[560px] rounded-full border border-purple-500/5 pointer-events-none"></div>
            
            {/* High Performance 3D Particle Canvas */}
            <TriomixParticleSphere className="w-full h-[460px] sm:h-[540px] md:h-[620px]" />
          </div>

        </div>
      </section>

      {/* Live Metrics Row */}
      <section className="relative z-10 border-y border-white/10 bg-white/[0.015] backdrop-blur-md py-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="text-3xl md:text-4xl font-bold text-white tracking-tight">3.8x</div>
            <div className="text-sm text-slate-400 mt-1">Faster Clinical Trial Cohort Matching</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-purple-300 tracking-tight">140k+</div>
            <div className="text-sm text-slate-400 mt-1">Multimodal Oncology Pathways Analyzed</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-white tracking-tight">&lt; 1.2s</div>
            <div className="text-sm text-slate-400 mt-1">Real-time Biomarker Adherence Queries</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-purple-300 tracking-tight">42%</div>
            <div className="text-sm text-slate-400 mt-1">Reduction in Administrative Burden</div>
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section id="solutions" className="relative z-10 max-w-7xl mx-auto px-6 py-28">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300 text-xs font-mono mb-4">
            SOLUTIONS & MODULES
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Pioneering Intelligence for Modern Oncology
          </h2>
          <p className="text-slate-400 mt-4 text-base">
            Engineered specifically to solve the complexities of precision oncology, clinical documentation, and high-stakes therapeutic decisions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="p-8 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-purple-500/40 transition-all duration-300 group hover:-translate-y-1.5 shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-purple-950/80 border border-purple-500/40 flex items-center justify-center text-purple-300 mb-6 group-hover:scale-110 transition-transform">
              <Dna className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-200 transition-colors">
              Genomic & Biomarker Profiling
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Synthesize next-generation sequencing (NGS), somatic variant callouts, and histopathology reports to suggest targeted therapeutic options within seconds.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-8 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-purple-500/40 transition-all duration-300 group hover:-translate-y-1.5 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl"></div>
            <div className="w-12 h-12 rounded-xl bg-purple-950/80 border border-purple-500/40 flex items-center justify-center text-purple-300 mb-6 group-hover:scale-110 transition-transform">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-200 transition-colors">
              NCCN Guideline Co-Pilot
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Cross-verify proposed regimens against active NCCN, ASCO, and ESMO clinical guidelines to ensure highest quality care and accelerate prior-authorization approval.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-8 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-purple-500/40 transition-all duration-300 group hover:-translate-y-1.5 shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-purple-950/80 border border-purple-500/40 flex items-center justify-center text-purple-300 mb-6 group-hover:scale-110 transition-transform">
              <Database className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-200 transition-colors">
              Clinical Trial Auto-Matching
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Continuously scan active global and institution-specific trials to match eligible cancer patients based on biomarker criteria, stage, and previous treatment lines.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative z-10 max-w-7xl mx-auto px-6 py-20 border-t border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300 text-xs font-mono">
              WORKFLOW & ARCHITECTURE
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
              From Raw Clinical Records to Actionable Care Pathways.
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Triomix connects directly into your existing EHR (Epic, Cerner, OncoEMR) using secure FHIR API endpoints, processing unstructured lab PDFs, pathology slides, and doctor notes with medical-grade transformer models.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-purple-950 border border-purple-500/40 flex items-center justify-center text-purple-300 text-xs font-bold shrink-0 mt-0.5">1</div>
                <div>
                  <h4 className="text-white text-sm font-semibold">FHIR-Native Data Extraction</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Zero manual re-entry. Instant sync of lab panels and treatment histories.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-purple-950 border border-purple-500/40 flex items-center justify-center text-purple-300 text-xs font-bold shrink-0 mt-0.5">2</div>
                <div>
                  <h4 className="text-white text-sm font-semibold">Triomix Reasoning Engine</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Dual-verified clinical validation against FDA drug labels & genomic registries.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-purple-950 border border-purple-500/40 flex items-center justify-center text-purple-300 text-xs font-bold shrink-0 mt-0.5">3</div>
                <div>
                  <h4 className="text-white text-sm font-semibold">Automated Prior-Auth & Order Drafting</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Generate substantiated peer-to-peer packets in under 60 seconds.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            {/* Interactive Terminal / Code / Architecture Preview */}
            <div className="rounded-2xl border border-white/10 bg-[#090b14] p-6 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between pb-4 border-b border-white/10 text-xs text-slate-400 font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500/60"></span>
                  <span className="w-3 h-3 rounded-full bg-yellow-500/60"></span>
                  <span className="w-3 h-3 rounded-full bg-green-500/60"></span>
                  <span className="ml-2 text-slate-300 font-semibold">triomix-oncology-core :: pipeline.ts</span>
                </div>
                <span className="text-purple-400 font-semibold">FHIR v4.0.1 Connected</span>
              </div>

              <div className="py-4 font-mono text-xs text-slate-300 space-y-2.5 overflow-x-auto">
                <div className="text-purple-400">// Parsing patient biomarker profile & histology...</div>
                <div><span className="text-blue-400">const</span> patientProfile = <span className="text-yellow-300">await</span> triomix.<span className="text-green-400">ingestPatientRecord</span>(&#39;PT-84920&#39;);</div>
                <div><span className="text-blue-400">const</span> biomarkers = patientProfile.<span className="text-green-400">extractMutations</span>();</div>
                <div className="text-emerald-400 pl-4">→ Detected: EGFR Exon 20 ins (S768_D770dup), PD-L1 TPS: 45%</div>
                <div><span className="text-blue-400">const</span> recommendations = <span className="text-yellow-300">await</span> triomix.<span className="text-green-400">evaluatePathways</span>({`{`}</div>
                <div className="pl-4">tumorOrigin: <span className="text-emerald-300">&#39;Non-Small Cell Lung Carcinoma (NSCLC)&#39;</span>,</div>
                <div className="pl-4">previousTherapies: [<span className="text-emerald-300">&#39;Carboplatin + Pemetrexed&#39;</span>],</div>
                <div className="pl-4">biomarkers</div>
                <div>{`}`});</div>
                <div className="text-purple-400 pt-2">// Recommended Action Plan:</div>
                <div className="p-3 bg-purple-950/40 border border-purple-500/30 rounded-lg text-slate-200">
                  <div className="text-emerald-400 font-bold">1st Line Target: Amivantamab-vmjw + Carboplatin</div>
                  <div className="text-slate-400 text-[11px] mt-1">Concordance: 99.8% • Prior Auth Denial Risk: &lt; 2.1% • 3 Active Cohort Studies Located</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Insights Section */}
      <section id="insights" className="relative z-10 max-w-7xl mx-auto px-6 py-24 border-t border-white/10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300 text-xs font-mono mb-4">
              RESEARCH & CLINICAL PAPERS
            </div>
            <h2 className="text-3xl font-bold text-white">Latest Oncology Insights</h2>
          </div>
          <button 
            onClick={() => setIsDemoModalOpen(true)}
            className="mt-4 md:mt-0 text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1 font-medium"
          >
            <span>View all publications</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl bg-white/[0.02] border border-white/10 hover:border-purple-500/30 transition-all">
            <span className="text-xs text-purple-400 font-mono">ASCO JOURNAL 2026</span>
            <h3 className="text-base font-bold text-white mt-2 mb-2">Automated Variant Re-Classification in Rare Solid Tumors</h3>
            <p className="text-xs text-slate-400 leading-relaxed">How synthetic reasoning reduced clinical interpretation turnaround times from 14 days down to under 4 hours.</p>
          </div>

          <div className="p-6 rounded-xl bg-white/[0.02] border border-white/10 hover:border-purple-500/30 transition-all">
            <span className="text-xs text-purple-400 font-mono">WHITE PAPER</span>
            <h3 className="text-base font-bold text-white mt-2 mb-2">Eliminating Prior-Authorization Delays with Automated Evidence</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Comprehensive study across 4,200 oncology regimens showing a 94% initial approval rate.</p>
          </div>

          <div className="p-6 rounded-xl bg-white/[0.02] border border-white/10 hover:border-purple-500/30 transition-all">
            <span className="text-xs text-purple-400 font-mono">CASE STUDY</span>
            <h3 className="text-base font-bold text-white mt-2 mb-2">Triomix Integration at Memorial Cancer Institute</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Over 1,200 oncologist hours saved per quarter while enrolling 30% more patients into precision trials.</p>
          </div>
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="rounded-3xl bg-gradient-to-r from-purple-950/80 via-indigo-950/80 to-purple-950/80 border border-purple-500/30 p-10 md:p-16 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-purple-500/20 blur-[100px] pointer-events-none"></div>
          <h2 className="text-3xl md:text-5xl font-bold text-white relative z-10">
            Transform Your Oncology Practice Today.
          </h2>
          <p className="text-slate-300 max-w-xl mx-auto mt-4 text-base relative z-10">
            Join leading cancer research centers and health networks modernizing care delivery with Triomix.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-8 relative z-10">
            <button
              onClick={() => setIsDemoModalOpen(true)}
              className="bg-white hover:bg-slate-100 text-neutral-950 font-semibold px-8 py-3.5 rounded-full shadow-lg transition-all flex items-center gap-2 group active:scale-95"
            >
              <span>Schedule Live Demo</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            {onRevertToOriginalUI && (
              <button
                onClick={onRevertToOriginalUI}
                className="bg-purple-900/40 hover:bg-purple-900/60 text-purple-200 border border-purple-500/30 font-medium px-6 py-3.5 rounded-full transition-all flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Switch to Pump App</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-12 max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-6">
        <div className="flex items-center gap-3">
          <span className="font-bold tracking-widest text-white text-sm">TRIOMIX</span>
          <span>© 2026 Triomix Oncology Technologies Inc. All rights reserved.</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="#privacy" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
          <a href="#terms" className="hover:text-slate-300 transition-colors">Terms of Service</a>
          <a href="#hipaa" className="hover:text-slate-300 transition-colors">HIPAA Compliance</a>
          <a href="#security" className="hover:text-slate-300 transition-colors">Security</a>
        </div>
      </footer>

      {/* Interactive Demo Modal */}
      {isDemoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg bg-[#0c0d18] border border-purple-500/40 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2 text-purple-300 font-semibold">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <span>Triomix AI Oncology Interactive Simulator</span>
              </div>
              <button
                onClick={() => setIsDemoModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2">
                  Enter Oncology Clinical Query / Genetic Variant:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={demoInput}
                    onChange={(e) => setDemoInput(e.target.value)}
                    placeholder="e.g. KRAS G12C mutation in colorectal adenocarcinoma..."
                    className="w-full bg-white/5 border border-white/20 focus:border-purple-400 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-400">Simulates real-time reasoning engine</span>
                <button
                  onClick={handleRunDemo}
                  disabled={isAnalyzing}
                  className="px-5 py-2.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs flex items-center gap-2 shadow-lg shadow-purple-600/30 disabled:opacity-50"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Analyzing Records...</span>
                    </>
                  ) : (
                    <>
                      <span>Run Diagnostic Match</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>

              {analysisResult && (
                <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-500/40 text-xs text-purple-200 animate-fade-in leading-relaxed">
                  {analysisResult}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setIsDemoModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-xs text-white"
              >
                Close Simulator
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Undo Guide Modal */}
      {showUndoGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md bg-[#0c0d18] border border-purple-500/40 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2 text-white font-semibold text-sm">
                <RotateCcw className="w-4 h-4 text-purple-400" />
                <span>How to Undo This UI</span>
              </div>
              <button
                onClick={() => setShowUndoGuide(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs text-slate-300">
              <p>You have two simple ways to undo this landing page whenever you want:</p>
              
              <div className="p-3 bg-purple-950/50 border border-purple-500/30 rounded-xl space-y-1">
                <strong className="text-white block">1. One-Click In Browser:</strong>
                <span>Click the <strong>&quot;Undo &amp; Switch to Trading App&quot;</strong> button at the top header or bottom banner anytime to switch back instantly.</span>
              </div>

              <div className="p-3 bg-white/5 border border-white/10 rounded-xl space-y-1">
                <strong className="text-white block">2. In Git Terminal:</strong>
                <span>A clean backup branch was created before changes. Run this in your terminal to completely restore:</span>
                <code className="block p-2 bg-black rounded font-mono text-[11px] text-purple-300 select-all">
                  git checkout backup/before-triomix-landing
                </code>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setShowUndoGuide(false)}
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-xs text-white"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
