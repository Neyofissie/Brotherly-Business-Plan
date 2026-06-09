import React, { useState } from 'react';
import { 
  FileText, AlertTriangle, Cpu, TrendingUp, DollarSign, Target, 
  UserCheck, ShieldCheck, AlertOctagon, CheckSquare, Award, ArrowRight,
  ChevronRight, Sparkles, Check, CheckCircle2, RefreshCw, BarChart2,
  Lock, Calendar, MapPin, Users, BookOpen
} from 'lucide-react';
import { FinancialMetric, RiskItem, MilestoneItem } from '../types';
import { FINANCIAL_METRICS, RISK_ITEMS, MILESTONE_ITEMS, PITCH_SECTIONS } from '../data';
import { 
  ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, 
  Tooltip as RechartsTooltip, Legend, Bar, AreaChart, Area 
} from 'recharts';

export default function PitchDeck() {
  const [activeSection, setActiveSection] = useState('intro');
  
  // Interactive Financial Simulator State
  const [userGrowthMultiplier, setUserGrowthMultiplier] = useState(1);
  const [b2cConversionRate, setB2cConversionRate] = useState(15); // industry target 15%
  const [arpuB2c, setArpuB2c] = useState(15.00); // average monthly basket

  // Section 8 Risks Filter and Interactive Selected Risk State
  const [riskFilter, setRiskFilter] = useState<string>('All');
  const [selectedRisk, setSelectedRisk] = useState<RiskItem | null>(RISK_ITEMS[0]);

  // Section 9 Milestone List State (Toggle completion to test)
  const [milestones, setMilestones] = useState<MilestoneItem[]>(MILESTONE_ITEMS);

  // Toggle milestone status
  const toggleMilestone = (id: string) => {
    setMilestones(prev => prev.map(m => m.id === id ? { ...m, completed: !m.completed } : m));
  };

  // Calculations for year 3 dynamic projections
  // Baseline: Yr 3 has 100,000 registered users, 22,000 paid subscribers (22% conversion)
  // Let the client adjust targets with sliders
  const dynamicYear3Registered = Math.round(100000 * userGrowthMultiplier);
  const dynamicYear3Paid = Math.round(dynamicYear3Registered * (b2cConversionRate / 100));
  
  // £15/mo avg spend on paid * 12 months * dynamicYear3Paid
  const dynamicYear3B2CRevenue = Math.round(dynamicYear3Paid * arpuB2c * 12);
  const dynamicYear3B2BRevenue = 560000 * userGrowthMultiplier; // scales loosely with general enterprise sales/reach
  const dynamicYear3TotalRevenue = dynamicYear3B2CRevenue + dynamicYear3B2BRevenue + 250000;
  const dynamicYear3Costs = Math.round(1800000 * Math.max(0.7, userGrowthMultiplier * 0.85));
  const dynamicYear3Net = dynamicYear3TotalRevenue - dynamicYear3Costs;

  // Formatting currency safely
  const formatGBP = (value: number) => {
    if (value >= 1000000) {
      return `£${(value / 1000000).toFixed(2)}M`;
    }
    return `£${value.toLocaleString()}`;
  };

  // Recharts Market Growth Data
  const marketChartData = [
    { year: 2024, size: 294, desc: '£294M Baseline' },
    { year: 2025, size: 340, desc: '+15.8% Est' },
    { year: 2026, size: 394, desc: 'June 2026 Launch' },
    { year: 2027, size: 456, desc: 'Scale phase' },
    { year: 2028, size: 528, desc: 'Diaspora growth' },
    { year: 2029, size: 6120 / 10, desc: 'B2B contracts' },
    { year: 2030, size: 700, desc: '£700M+ Projection' },
  ];

  // Financial Projection Chart Data mapped with dynamic slider output for Year 3
  const financialChartData = [
    {
      name: 'Year 1',
      Revenue: 89500,
      Costs: 145000,
      Net: -55500,
    },
    {
      name: 'Year 2',
      Revenue: 725000,
      Costs: 420000,
      Net: 305000,
    },
    {
      name: 'Year 3 (Simulated)',
      Revenue: dynamicYear3TotalRevenue,
      Costs: dynamicYear3Costs,
      Net: dynamicYear3Net,
    }
  ];

  return (
    <div className="flex h-full min-h-[calc(100vh-4rem)] bg-slate-900 text-slate-100 font-sans" id="pitch-container">
      {/* Pitch Deck Left sidebar navigation */}
      <aside className="w-80 bg-slate-950 border-r border-slate-800 flex flex-col justify-between shrink-0" id="pitch-sidebar">
        <div className="p-5 flex flex-col gap-6">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-5">
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
              <FileText className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-200 text-sm tracking-tight">Visa Evaluation Deck</h3>
              <p className="text-xs text-slate-500 font-mono">BROTHERLY LTD • June 2026</p>
            </div>
          </div>

          <div className="flex flex-col gap-1.5" id="pitch-nav-links">
            {PITCH_SECTIONS.map((section) => {
              const isActive = activeSection === section.id;
              return (
                <button
                  id={`pitch-tab-${section.id}`}
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-start gap-3 p-3 rounded-xl transition duration-200 text-left ${
                    isActive 
                      ? 'bg-gradient-to-r from-emerald-500/10 to-teal-500/5 border border-emerald-500/20 text-emerald-400 font-medium shadow-sm'
                      : 'border border-transparent text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                  }`}
                >
                  <span className="mt-0.5 shrink-0">
                    {section.id === 'intro' && <FileText className="w-4 h-4" />}
                    {section.id === 'problem' && <AlertTriangle className="w-4 h-4 text-rose-400" />}
                    {section.id === 'solution' && <Cpu className="w-4 h-4 text-cyan-400" />}
                    {section.id === 'market' && <TrendingUp className="w-4 h-4 text-indigo-400" />}
                    {section.id === 'financials' && <DollarSign className="w-4 h-4 text-teal-400" />}
                    {section.id === 'strategy' && <Target className="w-4 h-4 text-amber-400" />}
                    {section.id === 'founder' && <UserCheck className="w-4 h-4 text-purple-400" />}
                    {section.id === 'innovation' && <ShieldCheck className="w-4 h-4 text-green-400" />}
                    {section.id === 'risks' && <AlertOctagon className="w-4 h-4 text-yellow-500" />}
                    {section.id === 'timeline' && <CheckSquare className="w-4 h-4 text-sky-400" />}
                  </span>
                  <div className="overflow-hidden">
                    <p className={`text-xs capitalize ${isActive ? 'text-emerald-300' : 'text-slate-300'}`}>{section.title}</p>
                    <p className="text-[10px] text-slate-500 truncate">{section.subtitle}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Confidential footer status block */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-900 flex flex-col gap-2.5">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>ENDORSEMENT VERDICT:</span>
            <span className="font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">READY</span>
          </div>
          <div className="flex flex-col gap-1.5 text-[10px] font-mono text-slate-500 leading-snug">
            <p>✔ INNOVATIVE: Meets threshold</p>
            <p>✔ VIABLE: Balanced 3-Stream SaaS</p>
            <p>✔ SCALABLE: UK to USA / Nigeria Corridor</p>
          </div>
          <div className="text-[9px] text-center text-slate-600 uppercase border-t border-slate-900 pt-2 font-semibold">
            Confidential Visa Presentation © 2026
          </div>
        </div>
      </aside>

      {/* Main Slide Viewer */}
      <main className="flex-1 bg-slate-900/40 p-8 overflow-y-auto max-w-5xl mx-auto flex flex-col gap-6" id="pitch-slide-viewer">
        
        {/* Top bar header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono tracking-wider text-slate-500 uppercase bg-slate-950 px-2.5 py-1 rounded-full border border-slate-800">
              UK Innovator Founder Visa Route
            </span>
            <span className="text-[11px] font-mono text-rose-400 uppercase bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/20 font-bold">
              Confidential
            </span>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400 font-mono">Prepared by: <strong className="text-emerald-400">Niyi Osoba</strong> (Founder & CEO)</p>
            <p className="text-[10px] text-slate-500 font-mono">Location Context: Edinburgh, Scotland</p>
          </div>
        </div>

        {/* Active slide body switcher */}
        <div className="flex-1 bg-gradient-to-b from-slate-950 to-slate-950/80 border border-slate-800/80 rounded-2xl p-8 shadow-xl min-h-[500px]" id="slide-contents">
          
          {/* COVER & INTRO SLIDE */}
          {activeSection === 'intro' && (
            <div className="flex flex-col justify-between h-full gap-8" id="slide-intro">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
                  <Sparkles className="w-3.5 h-3.5" /> June 2026 • Proposal Document v1.0
                </div>
                <div className="space-y-2">
                  <h1 className="text-5xl font-extrabold text-slate-100 tracking-tight leading-none">
                    BROTHERLY
                  </h1>
                  <p className="text-2xl font-medium text-emerald-400 italic">
                    "Men Connect. Men Grow. Men Lead."
                  </p>
                </div>
                
                <p className="text-slate-300 text-lg leading-relaxed max-w-2xl">
                  An innovative mobile-first web ecosystem delivering structured, human-led peer-mentorship for men navigating fatherhood, divorce, marriage, grief, wellness, and diaspora identity.
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                  <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
                    <p className="text-[10px] text-slate-500 font-mono uppercase">Document Type</p>
                    <p className="text-sm font-semibold text-slate-200 mt-1">Business Plan & Endorsement Proposal</p>
                  </div>
                  <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
                    <p className="text-[10px] text-slate-500 font-mono uppercase">Target Visa Route</p>
                    <p className="text-sm font-semibold text-slate-200 mt-1">UK Innovator Founder Visa</p>
                  </div>
                  <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
                    <p className="text-[10px] text-slate-500 font-mono uppercase">Project State</p>
                    <p className="text-sm font-semibold text-emerald-400 mt-1">Working Client Prototype + Core API</p>
                  </div>
                  <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
                    <p className="text-[10px] text-slate-500 font-mono uppercase">Venture Classification</p>
                    <p className="text-sm font-semibold text-rose-400 mt-1">Strictly Confidential</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-850 pt-6 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" 
                    alt="Niyi Osoba Avatar" 
                    className="w-10 h-10 rounded-full border border-emerald-500/30 bg-slate-800"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="text-sm font-medium text-slate-200">Niyi Osoba</h4>
                    <p className="text-xs text-slate-500 font-mono">Founder & CEO • Edinburgh, Scotland</p>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveSection('problem')}
                  className="flex items-center gap-2 bg-emerald-500 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs hover:bg-emerald-400 transition"
                >
                  Unpack the Opportunity <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* SECTION 1: THE PROBLEM SPACE */}
          {activeSection === 'problem' && (
            <div className="space-y-6" id="slide-problem">
              <div className="text-xs font-mono text-rose-400 uppercase tracking-widest font-semibold flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" /> SECTION 1 — THE PROBLEM
              </div>
              <h2 className="text-3xl font-bold text-slate-200 tracking-tight">The Male Mental Health Crisis & Diaspora Silence</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-rose-500/5 border border-rose-500/20 p-5 rounded-2xl flex flex-col justify-between gap-4">
                  <p className="text-4xl font-extrabold text-rose-400">75%</p>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-200">Male Suicide Proportion</h4>
                    <p className="text-xs text-slate-400 leading-normal mt-1">Suicide is the leading cause of death for UK men under 50. Men account for 3/4 of all completions.</p>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between gap-4">
                  <p className="text-4xl font-extrabold text-blue-400">46%</p>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-200">Government Priority</h4>
                    <p className="text-xs text-slate-400 leading-normal mt-1">Identified mental health as top-priority inside the UK Government's Men's Health Strategy Consultation.</p>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between gap-4">
                  <p className="text-4xl font-extrabold text-amber-500">44%</p>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-200">Difficulty Accessing Support</h4>
                    <p className="text-xs text-slate-400 leading-normal mt-1">Reported struggle obtaining timely care due to clinical queues, cost, and compounding social isolation.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <h3 className="text-lg font-bold text-slate-200">Why Existing Solutions Fall Short</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-900/50 border border-slate-850 p-4 rounded-xl flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 shrink-0" />
                    <div>
                      <h4 className="text-xs font-semibold text-slate-300">Clinical & Medicalized Stigma (BetterHelp, Talkspace)</h4>
                      <p className="text-xs text-slate-500 leading-relaxed mt-1">Traditional psychotherapy apps are parsed as clinical and cold. Men self-report significant reluctance to enter structured therapy.</p>
                    </div>
                  </div>
                  <div className="bg-slate-900/50 border border-slate-850 p-4 rounded-xl flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 shrink-0" />
                    <div>
                      <h4 className="text-xs font-semibold text-slate-300">Passive / Solo Mindfulness (Calm, Headspace)</h4>
                      <p className="text-xs text-slate-500 leading-relaxed mt-1">Self-directed meditation content lacks community connection, voice check-ins, or the relational accountability men require.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-indigo-500/10 border border-indigo-500/20 p-5 rounded-xl">
                <h4 className="text-sm font-bold text-indigo-400 uppercase tracking-widest font-mono">The Compounding Cultural Dimension</h4>
                <p className="text-xs text-slate-300 leading-relaxed mt-2 text-justify">
                  For Black, Asian, and minority ethnic men—including large diaspora communities—stigma is twice as silent. The complete lack of peer advisors sharing lived experiences of race, immigration status, faith, or family expectation renders general-purpose mental health support systems irrelevant and dry.
                </p>
              </div>
            </div>
          )}

          {/* SECTION 2: THE BROTHERLY SOLUTION */}
          {activeSection === 'solution' && (
            <div className="space-y-6" id="slide-solution">
              <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-semibold flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5" /> SECTION 2 — THE SOLUTION
              </div>
              <h2 className="text-3xl font-bold text-slate-200 tracking-tight">Structured, Human-Led Male Peer Mentorship</h2>

              <p className="text-sm text-slate-400">
                Brotherly is some things but NOT others. It's a non-clinical, structured relationship-match builder enabling husbands, fathers, and single men across the UK and globe to navigate transitions together.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col justify-between">
                  <span className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg w-max mb-3"><Sparkles className="w-4 h-4" /></span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">1. Mentor Matching</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed mt-1">Relatability-led matching matching by life situation, cultural matrix, faith, and communication styles.</p>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col justify-between">
                  <span className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg w-max mb-3"><Users className="w-4 h-4" /></span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">2. Private Circles</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed mt-1">Facilitated circles of 5–8 brothers navigating identical seasons. Live weekly video sessions and circle chat feeds.</p>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col justify-between">
                  <span className="p-2 bg-cyan-500/10 text-cyan-400 rounded-lg w-max mb-3"><Calendar className="w-4 h-4" /></span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">3. 1:1 Sessions</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed mt-1">Structured 1:1 audio/video sessions scheduled with an experienced aligned mentor holding similar life miles.</p>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col justify-between">
                  <span className="p-2 bg-amber-500/10 text-amber-400 rounded-lg w-max mb-3"><BookOpen className="w-4 h-4 animate-pulse" /></span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">4. Growth Tracks</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed mt-1">Guided multi-week pathways (e.g. Present Father, Emotional Regulation) combining journaling with check-lists.</p>
                  </div>
                </div>
              </div>

              {/* Competitive positioning framework table */}
              <div className="border border-slate-850 rounded-xl overflow-hidden bg-slate-900/20">
                <div className="bg-slate-950 p-3 border-b border-slate-850 text-xs font-bold text-slate-400 font-mono tracking-wider">
                  COMPETITIVE COMPARISON MATRIX
                </div>
                <div className="divide-y divide-slate-850 text-xs">
                  <div className="grid grid-cols-4 p-3 bg-slate-900/40 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                    <div>DIMENSION</div>
                    <div>THERAPY APPS</div>
                    <div>WELLNESS APPS</div>
                    <div className="text-emerald-400 font-bold">BROTHERLY</div>
                  </div>
                  <div className="grid grid-cols-4 p-3 hover:bg-slate-900/30">
                    <div className="font-semibold text-slate-300">Approach</div>
                    <div className="text-slate-500">Clinical, diagnoses-led</div>
                    <div className="text-slate-500">Solo, meditation library</div>
                    <div className="text-emerald-300 font-medium">Relational peer mentors</div>
                  </div>
                  <div className="grid grid-cols-4 p-3 hover:bg-slate-900/30">
                    <div className="font-semibold text-slate-300">Cost Structure</div>
                    <div className="text-slate-500">High (£150-300/mo)</div>
                    <div className="text-slate-500">Low (£50-80/yr)</div>
                    <div className="text-emerald-300 font-medium">Accessible (£9.99-19.99/mo)</div>
                  </div>
                  <div className="grid grid-cols-4 p-3 hover:bg-slate-900/30">
                    <div className="font-semibold text-slate-300">Social Loop</div>
                    <div className="text-slate-500">None 1:1 doctor</div>
                    <div className="text-slate-500">Completely passive</div>
                    <div className="text-emerald-300 font-medium">Live video circle cohorts</div>
                  </div>
                  <div className="grid grid-cols-4 p-3 hover:bg-slate-900/30">
                    <div className="font-semibold text-slate-300">Cultural Focus</div>
                    <div className="text-slate-500">Western generic</div>
                    <div className="text-slate-500">Western generic</div>
                    <div className="text-emerald-300 font-medium font-mono">Diaspora, context aligned</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 3: MARKET ANALYSIS */}
          {activeSection === 'market' && (
            <div className="space-y-6" id="slide-market">
              <div className="text-xs font-mono text-indigo-400 uppercase tracking-widest font-semibold flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5" /> SECTION 3 — MARKET ANALYSIS
              </div>
              <h2 className="text-3xl font-bold text-slate-200 tracking-tight">Large underserved TAM boosted by Government Focus</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest font-mono">UK TAM & Dynamics</h3>
                  <div className="divide-y divide-slate-800 text-xs">
                    <div className="py-2.5 flex justify-between">
                      <span className="text-slate-400">UK Digital Mental Health Market (2024)</span>
                      <strong className="text-slate-100">£294 Million</strong>
                    </div>
                    <div className="py-2.5 flex justify-between">
                      <span className="text-slate-400">Projected Market CAGR (2025–2030)</span>
                      <strong className="text-emerald-400">15.8% Per Annum</strong>
                    </div>
                    <div className="py-2.5 flex justify-between">
                      <span className="text-slate-400">Projected Market Size (By 2030)</span>
                      <strong className="text-slate-100">£700+ Million</strong>
                    </div>
                    <div className="py-2.5 flex justify-between">
                      <span className="text-slate-400">UK Adult Male Population</span>
                      <strong className="text-slate-100">~26 Million Men</strong>
                    </div>
                    <div className="py-2.5 flex justify-between">
                      <span className="text-slate-400">Addressable UK Experiencing Difficulty</span>
                      <strong className="text-rose-400 font-bold">~7.8 Million Men</strong>
                    </div>
                  </div>

                  <div className="bg-slate-900 border border-slate-850 p-4 rounded-xl">
                    <h4 className="text-xs font-bold text-slate-300 tracking-tight">Primary segment priorities:</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed mt-1 text-justify">
                      Target segment represents UK physical and digital diaspora (Men aged 25-54: major life crisis, career stressors, fathers looking for healthy guidance). Expanding dynamically to Canada, Nigeria and US corridors from day 1 with English speaking diaspora affinity.
                    </p>
                  </div>
                </div>

                {/* Market growth visual represent using Recharts */}
                <div className="bg-slate-950 p-4 border border-slate-850 rounded-2xl flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">Digital NHS & Private TAM Growth</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">UK Market Size valuation (£ millions)</p>
                  </div>
                  
                  <div className="h-44 w-full mt-4 text-[10px] text-slate-400">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={marketChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorMarket" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis dataKey="year" stroke="#475569" />
                        <YAxis stroke="#475569" unit="M" />
                        <RechartsTooltip 
                          contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', borderRadius: '8px' }}
                          labelStyle={{ color: '#94a3b8', fontSize: '10px' }}
                        />
                        <Area type="monotone" dataKey="size" name="TAM (£M)" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorMarket)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="text-[9px] text-slate-500 font-mono text-center pt-2 italic">
                    *Source: NHS Digital 2022/23 Data matched with UK Health Strategy nov 2025 allocations.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 4: BUSINESS MODEL AND FINANCIAL CALCULATOR */}
          {activeSection === 'financials' && (
            <div className="space-y-6" id="slide-financials">
              <div className="text-xs font-mono text-teal-400 uppercase tracking-widest font-semibold flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5" /> SECTION 4 — REVENUE & FINANCIAL MODEL
              </div>
              
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-bold text-slate-200 tracking-tight">Structured SaaS with High Margin Projections</h2>
                  <p className="text-xs text-slate-500 font-mono mt-1">Freemium • Corporate B2B Seat Licensing • NHS and Social Procurement Partnerships</p>
                </div>
                <div className="bg-slate-900 border border-slate-850 px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs text-slate-300">
                  <RefreshCw className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                  <span>Dynamic Projection Calculator Enabled</span>
                </div>
              </div>

              {/* Projections financial snapshot */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1.5">
                  <p className="text-[10px] text-slate-500 font-mono uppercase">Year 1 (Conservative Base)</p>
                  <p className="text-xl font-bold text-slate-200">£89,500 <span className="text-xs text-slate-500">Revenue</span></p>
                  <p className="text-[11px] text-rose-400 font-mono">Net Flow: (£55,500) deficit</p>
                  <p className="text-[10px] text-slate-500 leading-normal mt-2 italic">Building user baseline, certifying head mentors.</p>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1.5">
                  <p className="text-[10px] text-slate-500 font-mono uppercase">Year 2 (Reaching Profitability)</p>
                  <p className="text-xl font-bold text-slate-200">£725,000 <span className="text-xs text-slate-500">Revenue</span></p>
                  <p className="text-[11px] text-emerald-400 font-mono">Net Flow: +£305,000 profit</p>
                  <p className="text-[10px] text-slate-500 leading-normal mt-2 italic">Secured by 12+ corporate B2B wellbeing agreements.</p>
                </div>

                <div className="bg-teal-500/10 border border-teal-500/20 p-4 rounded-xl space-y-1.5">
                  <p className="text-[10px] text-teal-400 font-mono uppercase">Year 3 (Simulated Projection)</p>
                  <p className="text-xl font-bold text-teal-400">{formatGBP(dynamicYear3TotalRevenue)} <span className="text-xs text-slate-400">Revenue</span></p>
                  <p className="text-[11px] font-mono font-semibold" style={{ color: dynamicYear3Net >= 0 ? '#34d399' : '#f87171' }}>
                    Net Flow: {formatGBP(dynamicYear3Net)} {dynamicYear3Net >= 0 ? 'profit' : 'deficit'}
                  </p>
                  <p className="text-[10px] text-slate-400 leading-normal mt-2 italic">Simulated users: {dynamicYear3Registered.toLocaleString()}</p>
                </div>
              </div>

              {/* Interactive sliders for financial modeling */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-850 space-y-5">
                <h3 className="text-sm font-bold text-slate-300 font-mono uppercase tracking-wider">Interactive Performance Sandbox</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Adjust targets below to simulate dynamic Year 3 subscriber models. Our baseline targets 100k registered (1.3% UK market penetration) with a standard B2C conversion rate average of 15-20% and £15.00 ARPU.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Slider 1 */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-400">Y3 Registered Scale</span>
                      <strong className="text-emerald-400">{(100000 * userGrowthMultiplier).toLocaleString()}</strong>
                    </div>
                    <input 
                      type="range"
                      min="0.5"
                      max="3"
                      step="0.1"
                      value={userGrowthMultiplier}
                      onChange={(e) => setUserGrowthMultiplier(parseFloat(e.target.value))}
                      className="w-full accent-emerald-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                    />
                    <p className="text-[10px] text-slate-600 mt-1">Multiplier: {userGrowthMultiplier}x baseline</p>
                  </div>

                  {/* Slider 2 */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-400">Conversion to Paid</span>
                      <strong className="text-teal-400">{b2cConversionRate}%</strong>
                    </div>
                    <input 
                      type="range"
                      min="5"
                      max="30"
                      step="1"
                      value={b2cConversionRate}
                      onChange={(e) => setB2cConversionRate(parseInt(e.target.value))}
                      className="w-full accent-teal-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                    />
                    <p className="text-[10px] text-slate-600 mt-1">Industry Standard average: 10% - 20%</p>
                  </div>

                  {/* Slider 3 */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-400">Monthly Avg Basket</span>
                      <strong className="text-cyan-400">£{arpuB2c.toFixed(2)}</strong>
                    </div>
                    <input 
                      type="range"
                      min="9.99"
                      max="24.99"
                      step="1"
                      value={arpuB2c}
                      onChange={(e) => setArpuB2c(parseFloat(e.target.value))}
                      className="w-full accent-cyan-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                    />
                    <p className="text-[10px] text-slate-600 mt-1">Connect: £9.99 • Brother: £19.99</p>
                  </div>
                </div>

                {/* Simulated Chart Outputs using Recharts */}
                <div className="h-44 w-full pt-4 text-[10px] text-slate-400 border-t border-slate-900">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={financialChartData} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="name" stroke="#475569" />
                      <YAxis stroke="#475569" unit="£" />
                      <RechartsTooltip 
                        contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', borderRadius: '8px' }}
                        labelStyle={{ color: '#94a3b8', fontSize: '10px' }}
                      />
                      <Legend />
                      <Bar dataKey="Revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="Costs" fill="#64748b" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="Net" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 5: GO TO MARKET STRATEGY */}
          {activeSection === 'strategy' && (
            <div className="space-y-6" id="slide-strategy">
              <div className="text-xs font-mono text-amber-500 uppercase tracking-widest font-semibold flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5" /> SECTION 5 — GO-TO-MARKET STRATEGY
              </div>
              <h2 className="text-3xl font-bold text-slate-200 tracking-tight">Community First: Building Credibility and Organic Moats</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 bg-amber-500 h-full" />
                  <p className="text-[10px] font-mono text-slate-500">PHASE 1</p>
                  <h4 className="text-sm font-bold text-slate-200 mt-1">Foundation (Months 1–6)</h4>
                  <ul className="text-xs text-slate-400 space-y-2 mt-3 list-disc pl-4 leading-normal">
                    <li>Recruit 50 key founding diaspora mentors.</li>
                    <li>Sift 500 waitlist registered subscribers.</li>
                    <li>Setup partnerships with UK diaspora charities.</li>
                    <li>Submit documentation of compliance to NHS Health Accelerators.</li>
                  </ul>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 bg-emerald-500 h-full" />
                  <p className="text-[10px] font-mono text-slate-500">PHASE 2</p>
                  <h4 className="text-sm font-bold text-slate-200 mt-1">Growth (Months 7–18)</h4>
                  <ul className="text-xs text-slate-400 space-y-2 mt-3 list-disc pl-4 leading-normal">
                    <li>National PR coordinated with Men’s Health Week.</li>
                    <li>Launch first paying cohorts of Circles (£19.99).</li>
                    <li>B2B outreach to focused hazard sectors (finance, tech, logistics).</li>
                  </ul>
                </div>

                <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 bg-cyan-400 h-full" />
                  <p className="text-[10px] font-mono text-slate-500">PHASE 3</p>
                  <h4 className="text-sm font-bold text-slate-200 mt-1">Scale (Months 19–36)</h4>
                  <ul className="text-xs text-slate-400 space-y-2 mt-3 list-disc pl-4 leading-normal">
                    <li>Establish active nodes in US / NY and Lagos (Nigeria) corridors.</li>
                    <li>Implement AI-enhanced matching triggers based on sentiment context.</li>
                    <li>Launch the charitable grant-funded "Brotherly Foundation".</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 bg-slate-900/50 border border-slate-850 rounded-xl space-y-2">
                <h4 className="text-xs font-bold text-slate-300 font-mono tracking-widest uppercase">Target B2C & B2B Channels</h4>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-[11px]">
                  <div className="p-3 bg-slate-950 rounded-lg">
                    <strong className="text-amber-400 block font-mono">CHARITY HUBS</strong>
                    <span className="text-slate-500 leading-normal block mt-1">GPs & local organizations referral loops.</span>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-lg">
                    <strong className="text-emerald-400 block font-mono">B2B EMPLOYERS</strong>
                    <span className="text-slate-500 leading-normal block mt-1">EAPs for safety-critical / high salary burnout lines.</span>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-lg">
                    <strong className="text-cyan-400 block font-mono">PODCAST & MEDIA</strong>
                    <span className="text-slate-500 leading-normal block mt-1">Coordinating founder features on UK wellness networks.</span>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-lg">
                    <strong className="text-indigo-400 block font-mono">SEO CONTENT</strong>
                    <span className="text-slate-500 leading-normal block mt-1">Long-form male health topic-indexing.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 6: FOUNDER & TEAM */}
          {activeSection === 'founder' && (
            <div className="space-y-6" id="slide-founder">
              <div className="text-xs font-mono text-purple-400 uppercase tracking-widest font-semibold flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5" /> SECTION 6 — FOUNDER PROFILE & TEAM
              </div>
              <h2 className="text-3xl font-bold text-slate-200 tracking-tight">The Vision of Niyi Osoba & Key Advisors</h2>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col items-center text-center gap-4">
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&h=160&fit=crop&crop=face" 
                    alt="Niyi Osoba Big Portrait" 
                    className="w-24 h-24 rounded-full border-2 border-emerald-500/30 bg-slate-950"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="text-base font-bold text-slate-200">Niyi Osoba</h4>
                    <p className="text-xs text-emerald-400 font-mono mt-0.5">Founder & CEO, Brotherly Ltd</p>
                    <p className="text-[10px] text-slate-500 font-mono mt-1">Edinburgh, Scotland • UX Specialist</p>
                  </div>
                  
                  <div className="w-full divide-y divide-slate-850 text-left text-[11px] leading-relaxed text-slate-400 border-t border-slate-800 mt-2">
                    <p className="py-2"><strong>8+ Years Experience:</strong> User-centered UX & product strategy in UK tech.</p>
                    <p className="py-2"><strong>Platform Developer:</strong> Built native high-contrast prototype.</p>
                    <p className="py-2"><strong>Personal Statement:</strong> "I built Brotherly because I lived the silence. Vulnerability is a bridge."</p>
                  </div>
                </div>

                <div className="lg:col-span-2 space-y-4">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest font-mono">Critical Advisory Board Plan</h3>
                  
                  <div className="bg-slate-900/60 p-4 border border-slate-850 rounded-xl flex items-start gap-3">
                    <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg"><Check className="w-4 h-4" /></div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-200">Male Mental Health Advisor (Planned)</h4>
                      <p className="text-xs text-slate-500 leading-relaxed mt-0.5">NHS-affiliated Clinical Psychologist overseeing safeguarding blueprints, distress routing triggers, and mentor training frameworks.</p>
                    </div>
                  </div>

                  <div className="bg-slate-900/60 p-4 border border-slate-850 rounded-xl flex items-start gap-3">
                    <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg"><Check className="w-4 h-4" /></div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-200">UK Tech Board Lead (Planned)</h4>
                      <p className="text-xs text-slate-500 leading-relaxed mt-0.5">Experienced SaaS Entrepreneur with exit history in the UK digital health space advising on TAM conversions, B2B sales cycles, and pricing scales.</p>
                    </div>
                  </div>

                  <div className="bg-slate-900/60 p-4 border border-slate-850 rounded-xl flex items-start gap-3">
                    <div className="p-2 bg-amber-500/10 text-amber-500 rounded-lg"><Check className="w-4 h-4" /></div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-200">Diaspora Sector Lead (Planned)</h4>
                      <p className="text-xs text-slate-500 leading-relaxed mt-0.5">Experienced black community representative bridging key faith hubs, local churches, and grassroots organizations with active referral codes.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 7: INNOVATION & IP */}
          {activeSection === 'innovation' && (
            <div className="space-y-6" id="slide-innovation">
              <div className="text-xs font-mono text-green-400 uppercase tracking-widest font-semibold flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" /> SECTION 7 — VISA ENDORSEMENT MAPPING
              </div>
              <h2 className="text-3xl font-bold text-slate-200 tracking-tight">Fulfilling the 3 Core Business Proposal Criteria</h2>

              <p className="text-sm text-slate-400 leading-relaxed">
                The Home Office requires approved UK endorsing bodies to verify the venture is genuinely **Innovative, Viable, and Scalable**. Brotherly aligns cleanly with these definitions:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 bg-emerald-500/15 text-emerald-400 rounded-full font-bold text-xs">01</span>
                    <h4 className="font-bold text-sm text-slate-200 font-mono">INNOVATIVE</h4>
                  </div>
                  <hr className="border-slate-800" />
                  <p className="text-xs text-slate-400 leading-relaxed">
                    <strong>Unique Lived Situation Segmenting:</strong> Zero platforms structure male support by lived transitions (fatherhood, co-parenting, diaspora dynamics) rather than cold clinical diagnosis.
                  </p>
                  <p className="text-[10px] text-slate-500 italic">
                    Proprietary Relatability Matching algorithm.
                  </p>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 bg-emerald-500/15 text-emerald-400 rounded-full font-bold text-xs">02</span>
                    <h4 className="font-bold text-sm text-slate-200 font-mono">VIABLE</h4>
                  </div>
                  <hr className="border-slate-800" />
                  <p className="text-xs text-slate-400 leading-relaxed">
                    <strong>Sustained Revenue Models:</strong> Freemium subscription loops combined with immediate corporate wellbeing seat pricing are validated by strong UK Government strategy commitments.
                  </p>
                  <p className="text-[10px] text-slate-500 italic">
                    No minimum external investment required.
                  </p>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 bg-emerald-500/15 text-emerald-400 rounded-full font-bold text-xs">03</span>
                    <h4 className="font-bold text-sm text-slate-200 font-mono">SCALABLE</h4>
                  </div>
                  <hr className="border-slate-800" />
                  <p className="text-xs text-slate-400 leading-relaxed">
                    <strong>International Corridors:</strong> English speaking diaspora represents 30-50M potential users across Canada, West Africa and US without requiring fundamental architecture code changes.
                  </p>
                  <p className="text-[10px] text-slate-500 italic">
                    Targeting 100k users by Year 3.
                  </p>
                </div>
              </div>

              <div className="bg-emerald-500/5 p-4 border border-emerald-500/10 rounded-xl flex items-center justify-between text-xs text-emerald-300">
                <span>INTELLECTUAL PROPERTY MOAT: Proprietary matching code, trademarked Brotherly certification, and anonymized corporate B2B wellbeing analytics database.</span>
              </div>
            </div>
          )}

          {/* SECTION 8: RISKS & MITIGATION MATRIX */}
          {activeSection === 'risks' && (
            <div className="space-y-6" id="slide-risks">
              <div className="text-xs font-mono text-yellow-500 uppercase tracking-widest font-semibold flex items-center gap-1.5">
                <AlertOctagon className="w-3.5 h-3.5" /> SECTION 8 — RISKS & MITIGATIONS
              </div>
              <h2 className="text-3xl font-bold text-slate-200 tracking-tight">Active Safeguarding, Security, and Pipeline Mitigations</h2>

              <p className="text-sm text-slate-400">
                Every business holds risk. Click on any core risk category item to see our active operational mitigations and structures.
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Risk Selector */}
                <div className="space-y-2">
                  <div className="flex gap-2 border-b border-slate-800 pb-2 mb-2 justify-between items-center text-xs text-slate-400">
                    <span>RISK MATRIX SELECTOR</span>
                    <div className="flex gap-1.5">
                      {['All', 'High', 'Medium'].map(cat => (
                        <button
                          key={cat}
                          onClick={() => setRiskFilter(cat)}
                          className={`px-2 py-0.5 rounded text-[10px] ${
                            riskFilter === cat ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-900 border border-slate-800'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 max-h-64 overflow-y-auto" id="risk-list">
                    {RISK_ITEMS.filter(r => riskFilter === 'All' || r.impact === riskFilter || r.likelihood === riskFilter).map((item) => {
                      const isSelected = selectedRisk?.id === item.id;
                      return (
                        <div
                          key={item.id}
                          onClick={() => setSelectedRisk(item)}
                          className={`p-3 rounded-xl cursor-pointer border transition ${
                            isSelected 
                              ? 'bg-amber-500/10 border-amber-500/50 text-slate-200'
                              : 'bg-slate-900 border-slate-850 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-amber-400">{item.category}</span>
                            <div className="flex items-center gap-1.5 text-[9px] font-mono">
                              <span className="bg-slate-950 text-slate-400 px-1.5 py-0.5 rounded">Likelihood: {item.likelihood}</span>
                              <span className="bg-rose-500/10 text-rose-400 px-1.5 py-0.5 rounded font-bold">Impact: {item.impact}</span>
                            </div>
                          </div>
                          <p className="text-xs leading-normal mt-1.5 truncate">{item.risk}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Risk mitigation detailed display */}
                <div className="bg-slate-950 border border-slate-850 p-5 rounded-2xl flex flex-col justify-between gap-4">
                  {selectedRisk ? (
                    <>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-widest font-mono">Detailed Analysis</h4>
                          <span className="bg-amber-500 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded-full">ACTIVE CONTROLLERS</span>
                        </div>
                        
                        <div>
                          <p className="text-[10px] font-mono text-slate-500 uppercase">Selected core risk:</p>
                          <p className="text-xs text-slate-200 leading-relaxed font-medium mt-1">{selectedRisk.risk}</p>
                        </div>

                        <div>
                          <p className="text-[10px] font-mono text-slate-500 uppercase">Operational Mitigation & Safeguards:</p>
                          <p className="text-xs text-slate-300 leading-relaxed text-justify mt-1.5 bg-slate-900/40 p-3 rounded-xl border border-slate-900">
                            {selectedRisk.mitigation}
                          </p>
                        </div>
                      </div>

                      <div className="border-t border-slate-900 pt-3 flex items-center justify-between text-[10px] font-mono text-slate-500">
                        <span>Classification: ISO Compliant</span>
                        <span>Owner: Niyi Osoba</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center h-full gap-2 text-slate-500">
                      <AlertOctagon className="w-8 h-8 opacity-40" />
                      <p className="text-xs font-mono">Please select a risk from the left matrix to review active mitigations.</p>
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

          {/* SECTION 9: 12-MONTH MILESTONES & KPIS */}
          {activeSection === 'timeline' && (
            <div className="space-y-6" id="slide-timeline">
              <div className="text-xs font-mono text-sky-400 uppercase tracking-widest font-semibold flex items-center gap-1.5">
                <CheckSquare className="w-3.5 h-3.5" /> SECTION 9 — Execution Timeline & KPIs
              </div>
              
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-slate-200 tracking-tight">Sustained Execution over our 12-Month Launch Phase</h2>
                <div className="hidden md:block text-right">
                  <span className="text-[11px] font-mono text-emerald-400">Target Year 1 ARR: <strong>£89,500</strong></span>
                </div>
              </div>

              {/* Interactive timeline milestone check boxes */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>INTERACTIVE MILESTONE LAUNCH LIST</span>
                  <span>Click boxes to check off completed stages:</span>
                </div>
                
                <div className="divide-y divide-slate-850 border border-slate-850 rounded-xl overflow-hidden bg-slate-900/20" id="milestones-container">
                  {milestones.map((milestone) => (
                    <div 
                      key={milestone.id} 
                      onClick={() => toggleMilestone(milestone.id)}
                      className={`p-3.5 flex items-start gap-4 cursor-pointer hover:bg-slate-900/30 transition ${
                        milestone.completed ? 'opacity-70 bg-emerald-500/[0.01]' : ''
                      }`}
                    >
                      <div className="mt-0.5">
                        <div className={`w-4.5 h-4.5 rounded flex items-center justify-center border transition ${
                          milestone.completed 
                            ? 'bg-emerald-500 border-emerald-500 text-slate-950' 
                            : 'border-slate-700 bg-slate-950 text-transparent'
                        }`}>
                          <Check className="w-3 h-3 stroke-3" />
                        </div>
                      </div>
                      <div className="flex-1 select-none">
                        <div className="flex items-center gap-2 justify-between">
                          <h4 className={`text-xs font-bold ${milestone.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                            {milestone.title}
                          </h4>
                          <span className="text-[10px] font-mono text-slate-500 uppercase bg-slate-950 px-2 py-0.5 rounded border border-slate-900 shrink-0">
                            {milestone.timeline}
                          </span>
                        </div>
                        <p className={`text-[11px] mt-1 ${milestone.completed ? 'text-slate-500' : 'text-slate-400'}`}>
                          {milestone.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="bg-slate-950 p-4 border border-slate-880 rounded-xl space-y-1">
                  <strong className="text-emerald-400 font-mono block text-xs tracking-wider">KPI: registered users</strong>
                  <p className="text-xl font-bold font-mono text-slate-200">2,500 <span className="text-xs text-slate-500">Month 12</span></p>
                </div>
                <div className="bg-slate-950 p-4 border border-slate-880 rounded-xl space-y-1">
                  <strong className="text-cyan-400 font-mono block text-xs tracking-wider">KPI: PAID CONVERSION</strong>
                  <p className="text-xl font-bold font-mono text-slate-200">15% <span className="text-xs text-slate-500">Average target</span></p>
                </div>
                <div className="bg-slate-950 p-4 border border-slate-880 rounded-xl space-y-1">
                  <strong className="text-indigo-400 font-mono block text-xs tracking-wider">KPI: MENTOR RETENTION</strong>
                  <p className="text-xl font-bold font-mono text-slate-200">80% <span className="text-xs text-slate-500">6-Month average</span></p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Closing presentation card statement */}
        <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/5 p-6 border border-emerald-500/20 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-slate-200">Ready to explore Niyi Osoba's platform prototype?</h4>
            <p className="text-xs text-slate-400 leading-normal max-w-xl">
              See Brotherly's client onboarding questionnaires, dynamic matching logic, 1:1 chat simulator, private weekly circle previews, and core pathways.
            </p>
          </div>
          <div className="shrink-0 text-amber-400 font-mono text-xs font-bold uppercase animate-pulse flex items-center gap-1">
            <span>Toggle "Open Platform Prototype" above</span> <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </main>
    </div>
  );
}
