import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, User, Star, MapPin, Calendar, BookOpen, Send, Sparkles, 
  Check, Play, Heart, RefreshCw, ChevronRight, Lock, MessageSquare, 
  Video, Mic, MicOff, VideoOff, Award, ArrowRight, ShieldCheck, CheckCircle2, CheckCircle
} from 'lucide-react';
import { Mentor, PrivateCircle, GrowthTrack, UserProfile, DirectMessage } from '../types';
import { INITIAL_MENTORS, INITIAL_CIRCLES, INITIAL_TRACKS } from '../data';

// Simple default profile
const DEFAULT_PROFILE: UserProfile = {
  name: 'Marcus Williams',
  age: 32,
  location: 'Manchester, UK',
  lifeSituations: ['Fatherhood', 'Careers/Burnout'],
  culturalBackground: 'West African (Nigerian)',
  faith: 'Christianity',
  communicationPreference: 'Warm & Empathetic',
  joinedAt: 'June 2026'
};

export default function PlatformApp() {
  // Onboarding & user profile states
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('brotherly_user_profile');
    return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
  });
  
  const [isOnboarded, setIsOnboarded] = useState<boolean>(() => {
    return localStorage.getItem('brotherly_onboarded') === 'true';
  });

  const [onboardingStep, setOnboardingStep] = useState(1);
  const [onboardingForm, setOnboardingForm] = useState<UserProfile>({ ...userProfile });
  const [isMatchingSpinner, setIsMatchingSpinner] = useState(false);
  const [matchingStatus, setMatchingStatus] = useState('');

  // Dashboard state controllers
  const [activeTab, setActiveTab] = useState<'mentors' | 'circles' | 'tracks' | 'upgrade'>('mentors');
  const [selectedMentor, setSelectedMentor] = useState<Mentor>(INITIAL_MENTORS[0]);
  const [chatMessages, setChatMessages] = useState<Record<string, DirectMessage[]>>({});
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [freeCreditCount, setFreeCreditCount] = useState(3); // 3 free requests

  // Circles States
  const [activeCircleRoom, setActiveCircleRoom] = useState<PrivateCircle | null>(null);
  const [circleMicMuted, setCircleMicMuted] = useState(true);
  const [circleVideoOff, setCircleVideoOff] = useState(false);
  const [circleLiveFeed, setCircleLiveFeed] = useState<{ sender: string; text: string }[]>([]);
  const feedTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Growth Tracks States
  const [activeTrack, setActiveTrack] = useState<GrowthTrack>(INITIAL_TRACKS[0]);
  const [activeTrackWeek, setActiveTrackWeek] = useState(1);
  const [journalInputs, setJournalInputs] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('brotherly_journal_inputs');
    return saved ? JSON.parse(saved) : {};
  });
  const [checkedTasks, setCheckedTasks] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('brotherly_checked_tasks');
    return saved ? JSON.parse(saved) : {};
  });

  // Stripe Mock Subscribed state
  const [membershipPlan, setMembershipPlan] = useState<'free' | 'connect' | 'brother' | 'mentor-pro'>(() => {
    return (localStorage.getItem('brotherly_membership_plan') as any) || 'free';
  });

  // Calculate customized compatibility matching percentage
  const calculateCompatibility = (profile: UserProfile, mentor: Mentor): number => {
    let score = 65; // Base relatability

    // Share lived experiences
    const commonLife = mentor.livedExperience.filter(exp => 
      profile.lifeSituations.some(situation => situation.toLowerCase().includes(exp.toLowerCase()) || exp.toLowerCase().includes(situation.toLowerCase()))
    );
    score += commonLife.length * 10;

    // Cultural background match
    if (mentor.culturalBackground.toLowerCase().includes(profile.culturalBackground.toLowerCase()) || 
        profile.culturalBackground === 'Any') {
      score += 15;
    }

    // Faith match
    if (mentor.faith === profile.faith || profile.faith === 'Any') {
      score += 10;
    }

    // Clamp score
    return Math.min(score, 100);
  };

  // Run Onboarding simulation matching
  const handleCompleteOnboarding = (e: React.FormEvent) => {
    e.preventDefault();
    setIsMatchingSpinner(true);
    setMatchingStatus('Analyzing lived life transitions...');
    
    setTimeout(() => {
      setMatchingStatus('Filtering cultural background parameters...');
      setTimeout(() => {
        setMatchingStatus('Ranking mentor-mentee compatibility ratios...');
        setTimeout(() => {
          localStorage.setItem('brotherly_user_profile', JSON.stringify(onboardingForm));
          localStorage.setItem('brotherly_onboarded', 'true');
          setUserProfile(onboardingForm);
          setIsOnboarded(true);
          setIsMatchingSpinner(false);
          setOnboardingStep(1);
          // Auto select best matched mentor
          const sorted = [...INITIAL_MENTORS].sort((a, b) => 
            calculateCompatibility(onboardingForm, b) - calculateCompatibility(onboardingForm, a)
          );
          setSelectedMentor(sorted[0]);
        }, 600);
      }, 600);
    }, 600);
  };

  // Onboarding situations toggles
  const toggleOnboardingSituation = (sit: string) => {
    setOnboardingForm(prev => {
      const exists = prev.lifeSituations.includes(sit);
      const updated = exists 
        ? prev.lifeSituations.filter(s => s !== sit)
        : [...prev.lifeSituations, sit];
      return { ...prev, lifeSituations: updated };
    });
  };

  // Direct chat handler calling /api/chat express server proxy with Gemini
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    // Credit validation for Free Plan
    if (membershipPlan === 'free' && freeCreditCount <= 0) {
      alert('You have reached the limit of 3 direct messages on the Free Plan. Please upgrade to the "Connect" or "Brother" plan inside the subscription tab for unlimited conversational coaching!');
      setActiveTab('upgrade');
      return;
    }

    const currentMsgText = inputMessage;
    setInputMessage('');

    const mentorId = selectedMentor.id;
    const userMsg: DirectMessage = {
      id: Math.random().toString(),
      sender: 'user',
      text: currentMsgText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Update messages local list
    const currentMentorMsgs = chatMessages[mentorId] || [];
    const updatedMsgs = [...currentMentorMsgs, userMsg];
    
    setChatMessages(prev => ({
      ...prev,
      [mentorId]: updatedMsgs
    }));

    setIsTyping(true);
    if (membershipPlan === 'free') {
      setFreeCreditCount(prev => prev - 1);
    }

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: currentMsgText,
          history: currentMentorMsgs,
          mentor: selectedMentor,
          userProfile: userProfile
        })
      });

      const data = await response.json();
      
      const responseMsg: DirectMessage = {
        id: Math.random().toString(),
        sender: 'mentor',
        text: data.reply || "I am reflecting on what you've shared, brother. Let’s digest this over our next call.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setChatMessages(prev => ({
        ...prev,
        [mentorId]: [...updatedMsgs, responseMsg]
      }));

    } catch (err) {
      console.error(err);
      const errorMsg: DirectMessage = {
        id: Math.random().toString(),
        sender: 'mentor',
        text: "I read you loud and clear, brother. Let's touch base on details of this block when we chat. We can get through this.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => ({
        ...prev,
        [mentorId]: [...updatedMsgs, errorMsg]
      }));
    } finally {
      setIsTyping(false);
    }
  };

  // Simulated private circle live workspace chats
  const enterCircleRoom = (circle: PrivateCircle) => {
    setActiveCircleRoom(circle);
    setCircleMicMuted(true);
    // Initialize live feeds
    setCircleLiveFeed([
      { sender: circle.mentorName, text: `Welcome back into the circle room, brothers. Today we are focusing on: ${circle.topics[0]}. Let's go around.` },
      { sender: 'Tunde O.', text: 'Thanks for scheduling this. It has been a heavy week with co-parenting handovers.' }
    ]);
  };

  // Add timed simulation chat feed inside the circle room to feel realistic
  useEffect(() => {
    if (activeCircleRoom) {
      const simulatedReplies = [
        { sender: 'Dave K.', text: 'I faced that same reaction from my partners. Pausing for 5 minutes inside the car before going in helps.' },
        { sender: 'Samuel G.', text: 'Grounding ourselves is key. Tunde, remind me what your cooldown looks like?' },
        { sender: 'Amin S.', text: 'Yes, fully agree with Dave. Tense transitions are usually when anger triggers fire.' },
        { sender: circleMicMuted ? activeCircleRoom.mentorName : userProfile.name, text: 'We have to be intentional. Reclaiming those first ten minutes yields huge differences for kids.' }
      ];

      let msgIndex = 0;
      feedTimerRef.current = setInterval(() => {
        if (msgIndex < simulatedReplies.length) {
          setCircleLiveFeed(prev => [...prev, simulatedReplies[msgIndex]]);
          msgIndex++;
        }
      }, 5000);
    } else {
      if (feedTimerRef.current) clearInterval(feedTimerRef.current);
    }

    return () => {
      if (feedTimerRef.current) clearInterval(feedTimerRef.current);
    };
  }, [activeCircleRoom]);

  // Handle subscriber conversions mock checkout
  const handleUpgradeSubscription = (plan: 'free' | 'connect' | 'brother' | 'mentor-pro') => {
    setMembershipPlan(plan);
    localStorage.setItem('brotherly_membership_plan', plan);
    if (plan === 'brother' || plan === 'connect') {
      setFreeCreditCount(999);
    }
    alert(`Success! You have officially subscribed to the "${plan.toUpperCase()}" plan tier. All corresponding features are now freshly unlocked in your workspace.`);
  };

  // Handle client-side journals saving
  const handleSaveJournal = (trackId: string, weekNum: number, content: string) => {
    const key = `${trackId}_week_${weekNum}`;
    const newJournals = { ...journalInputs, [key]: content };
    setJournalInputs(newJournals);
    localStorage.setItem('brotherly_journal_inputs', JSON.stringify(newJournals));
    alert('Journal reflection saved safely inside your secure local wellness database.');
  };

  // Handle tasks checking persistence
  const handleToggleTask = (trackId: string, weekNum: number, taskIndex: number) => {
    const key = `${trackId}_wk${weekNum}_idx${taskIndex}`;
    const newTasksState = { ...checkedTasks, [key]: !checkedTasks[key] };
    setCheckedTasks(newTasksState);
    localStorage.setItem('brotherly_checked_tasks', JSON.stringify(newTasksState));
  };

  const currentCircleFeedEndRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    currentCircleFeedEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [circleLiveFeed]);

  // Dynamic matched sorting of mentors based on calculated compatibility score
  const sortedCompatibleMentors = [...INITIAL_MENTORS].sort((a, b) => {
    const scoreA = calculateCompatibility(userProfile, a);
    const scoreB = calculateCompatibility(userProfile, b);
    return scoreB - scoreA;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans" id="app-platform-portal">
      
      {/* Platform Header Panel */}
      <header className="border-b border-slate-900 bg-slate-950 p-4 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center font-black text-slate-950 tracking-tighter shadow-md">
              BR
            </div>
            <div>
              <h1 className="font-bold text-sm tracking-tight text-slate-200">BROTHERLY PLATFORM</h1>
              <p className="text-[10px] text-slate-500 font-mono">BETA WORKSPACE • MOBILE-RESILIENT</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Onboarding State highlight */}
            <div className="hidden md:flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] uppercase text-slate-400 font-mono">
                Matching Active • {userProfile.name} ({membershipPlan.toUpperCase()} Plan)
              </span>
            </div>

            <button 
              onClick={() => {
                localStorage.removeItem('brotherly_onboarded');
                setIsOnboarded(false);
                setOnboardingStep(1);
              }}
              className="px-2.5 py-1 text-[10px] bg-slate-900 border border-slate-800 rounded font-mono hover:bg-slate-800 text-slate-400"
            >
              Restart Onboarding
            </button>
          </div>
        </div>
      </header>

      {/* RENDER ONBOARDING SYSTEM */}
      {!isOnboarded ? (
        <div className="flex-1 max-w-lg mx-auto w-full p-6 flex flex-col justify-center py-12" id="onboarding-portal">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl relative overflow-hidden">
            {/* progress line */}
            <div className="absolute top-0 left-0 w-full bg-slate-800 h-1">
              <div 
                className="bg-emerald-500 h-full transition-all duration-300"
                style={{ width: `${(onboardingStep / 5) * 100}%` }}
              />
            </div>

            {/* Spinner loader state */}
            {isMatchingSpinner ? (
              <div className="py-12 flex flex-col items-center justify-center text-center gap-4">
                <RefreshCw className="w-10 h-10 text-emerald-400 animate-spin" />
                <h3 className="font-bold text-lg text-slate-200">BROTHERLY MATCH ENGINE</h3>
                <p className="text-xs text-slate-400 font-mono animate-pulse">{matchingStatus}</p>
              </div>
            ) : (
              <form onSubmit={handleCompleteOnboarding} className="space-y-6">
                
                {/* Onboarding Step 1 */}
                {onboardingStep === 1 && (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <span className="text-[10px] text-emerald-400 font-mono uppercase bg-emerald-500/10 px-2 py-0.5 rounded">Step 1 of 5</span>
                      <h2 className="text-2xl font-bold text-slate-200">Let's set your base identity</h2>
                      <p className="text-xs text-slate-400 leading-normal">Your information is completely anonymous and kept on-device.</p>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-mono text-slate-500 uppercase block mb-1">How should mentors address you?</label>
                        <input 
                          type="text" 
                          required
                          value={onboardingForm.name}
                          onChange={(e) => setOnboardingForm(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 outline-none focus:border-emerald-500"
                          placeholder="e.g. Nicholas"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-mono text-slate-500 uppercase block mb-1">Your Age</label>
                          <input 
                            type="number" 
                            required
                            min="18"
                            max="99"
                            value={onboardingForm.age}
                            onChange={(e) => setOnboardingForm(prev => ({ ...prev, age: parseInt(e.target.value) || 30 }))}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 outline-none focus:border-emerald-500"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-mono text-slate-500 uppercase block mb-1">Current UK Base</label>
                          <input 
                            type="text" 
                            required
                            value={onboardingForm.location}
                            onChange={(e) => setOnboardingForm(prev => ({ ...prev, location: e.target.value }))}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 outline-none focus:border-emerald-500"
                            placeholder="e.g. London, UK"
                          />
                        </div>
                      </div>
                    </div>

                    <button 
                      type="button"
                      onClick={() => setOnboardingStep(2)}
                      className="w-full bg-emerald-500 text-slate-950 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 hover:bg-emerald-400 transition mt-4"
                    >
                      Next Step <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Onboarding Step 2: Life situations */}
                {onboardingStep === 2 && (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <span className="text-[10px] text-emerald-400 font-mono uppercase bg-emerald-500/10 px-2 py-0.5 rounded">Step 2 of 5</span>
                      <h2 className="text-2xl font-bold text-slate-200">What seasons are you navigating?</h2>
                      <p className="text-xs text-slate-400 leading-normal">Matches are situation-led (not diagnostic). Select all that apply:</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3" id="situation-grid">
                      {['Fatherhood', 'Co-parenting', 'Divorce/Separation', 'Careers/Burnout', 'Bereavement/Grief', 'Identity & Purpose'].map((sit) => {
                        const isSelected = onboardingForm.lifeSituations.includes(sit);
                        return (
                          <div
                            key={sit}
                            onClick={() => toggleOnboardingSituation(sit)}
                            className={`p-3 rounded-xl border text-left cursor-pointer transition ${
                              isSelected 
                                ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' 
                                : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                            }`}
                          >
                            <p className="text-xs font-semibold">{sit}</p>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button 
                        type="button"
                        onClick={() => setOnboardingStep(1)}
                        className="w-1/3 bg-slate-950 border border-slate-800 text-slate-400 font-bold py-2.5 rounded-xl text-xs hover:bg-slate-900 transition"
                      >
                        Back
                      </button>
                      <button 
                        type="button"
                        onClick={() => {
                          if (onboardingForm.lifeSituations.length === 0) {
                            alert('Please select at least one lived season situation.');
                            return;
                          }
                          setOnboardingStep(3);
                        }}
                        className="w-2/3 bg-emerald-500 text-slate-950 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 hover:bg-emerald-400 transition"
                      >
                        Next <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Onboarding Step 3: Cultural Registry */}
                {onboardingStep === 3 && (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <span className="text-[10px] text-emerald-400 font-mono uppercase bg-emerald-500/10 px-2 py-0.5 rounded">Step 3 of 5</span>
                      <h2 className="text-2xl font-bold text-slate-200">Cultural Ancestry Context</h2>
                      <p className="text-xs text-slate-400 leading-normal">Brotherly is culturally inclusive. We pair with mentors representing similar backgrounds to aid relatability.</p>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-mono text-slate-500 uppercase block mb-1">Select your primary heritage background:</label>
                        <select 
                          value={onboardingForm.culturalBackground}
                          onChange={(e) => setOnboardingForm(prev => ({ ...prev, culturalBackground: e.target.value }))}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 outline-none focus:border-emerald-500 cursor-pointer"
                        >
                          <option value="West African (Nigerian)">West African (Nigerian)</option>
                          <option value="West African (Ghanaian)">West African (Ghanaian)</option>
                          <option value="Black British / Caribbean">Black British / Caribbean</option>
                          <option value="East Asian (British-Chinese)">East Asian (British-Chinese)</option>
                          <option value="Jewish Descent / British">Jewish Descent / British</option>
                          <option value="British / European Heritage">British / European Heritage</option>
                          <option value="Any">Preference: No heritage filter (Any)</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button 
                        type="button"
                        onClick={() => setOnboardingStep(2)}
                        className="w-1/3 bg-slate-950 border border-slate-800 text-slate-400 font-bold py-2.5 rounded-xl text-xs hover:bg-slate-900 transition"
                      >
                        Back
                      </button>
                      <button 
                        type="button"
                        onClick={() => setOnboardingStep(4)}
                        className="w-2/3 bg-emerald-500 text-slate-950 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 hover:bg-emerald-400 transition"
                      >
                        Next <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Onboarding Step 4: Faith Context */}
                {onboardingStep === 4 && (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <span className="text-[10px] text-emerald-400 font-mono uppercase bg-emerald-500/10 px-2 py-0.5 rounded">Step 4 of 5</span>
                      <h2 className="text-2xl font-bold text-slate-200">Faith & Believing Values</h2>
                      <p className="text-xs text-slate-400 leading-normal">For many men, belief structures are anchors. We respect and can matches with mentors representing similar perspectives.</p>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-mono text-slate-500 uppercase block mb-1">Select faith context alignment:</label>
                        <select 
                          value={onboardingForm.faith}
                          onChange={(e) => setOnboardingForm(prev => ({ ...prev, faith: e.target.value }))}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 outline-none focus:border-emerald-500 cursor-pointer"
                        >
                          <option value="Christianity">Christianity</option>
                          <option value="Secular / Buddhist Values">Secular / Buddhist / Humanist Values</option>
                          <option value="Judaism">Judaism</option>
                          <option value="Islam">Islam</option>
                          <option value="Any">Preference: No faith alignment filter (Any)</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button 
                        type="button"
                        onClick={() => setOnboardingStep(3)}
                        className="w-1/3 bg-slate-950 border border-slate-800 text-slate-400 font-bold py-2.5 rounded-xl text-xs hover:bg-slate-900 transition"
                      >
                        Back
                      </button>
                      <button 
                        type="button"
                        onClick={() => setOnboardingStep(5)}
                        className="w-2/3 bg-emerald-500 text-slate-950 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 hover:bg-emerald-400 transition"
                      >
                        Next <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Onboarding Step 5: Communication tone */}
                {onboardingStep === 5 && (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <span className="text-[10px] text-emerald-400 font-mono uppercase bg-emerald-500/10 px-2 py-0.5 rounded">Step 5 of 5</span>
                      <h2 className="text-2xl font-bold text-slate-200">Coaching communication preference</h2>
                      <p className="text-xs text-slate-400 leading-normal">What communication style feels most aligned with your goals?</p>
                    </div>

                    <div className="space-y-3">
                      {['Warm & Empathetic', 'Direct & Honest', 'Structured & Accountable'].map((style) => {
                        const isMatch = onboardingForm.communicationPreference === style;
                        return (
                          <div 
                            key={style}
                            onClick={() => setOnboardingForm(prev => ({ ...prev, communicationPreference: style }))}
                            className={`p-3.5 rounded-xl border cursor-pointer flex items-center justify-between transition ${
                              isMatch ? 'bg-emerald-500/15 border-emerald-500 text-emerald-400' : 'bg-slate-950 border-slate-800 text-slate-400'
                            }`}
                          >
                            <span className="text-xs font-semibold">{style}</span>
                            {isMatch && <Check className="w-4 h-4" />}
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button 
                        type="button"
                        onClick={() => setOnboardingStep(4)}
                        className="w-1/3 bg-slate-950 border border-slate-800 text-slate-400 font-bold py-2.5 rounded-xl text-xs hover:bg-slate-900 transition"
                      >
                        Back
                      </button>
                      <button 
                        type="submit"
                        className="w-2/3 bg-emerald-500 text-slate-950 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 hover:bg-emerald-400 transition"
                      >
                        Run Relatability Matcher <Sparkles className="w-3.5 h-3.5 shrink-0" />
                      </button>
                    </div>
                  </div>
                )}

              </form>
            )}

          </div>
        </div>
      ) : (
        /* ONBOARDED PLATFORM MAIN PORTAL */
        <div className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6" id="dashboard-container">
          
          {/* Sub-application navigation buttons */}
          <div className="lg:col-span-3 flex flex-col gap-5 shrink-0" id="portal-side-nav">
            
            {/* User Profile Mini summary */}
            <div className="bg-slate-900 border border-slate-850 p-4 rounded-2xl flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-full flex items-center justify-center font-bold text-slate-950">
                  {userProfile.name[0]}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">{userProfile.name}</h4>
                  <p className="text-[10px] text-slate-500 font-mono">{userProfile.location}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1">
                {userProfile.lifeSituations.map(s => (
                  <span key={s} className="bg-slate-950 text-slate-400 text-[9px] font-mono px-2 py-0.5 rounded border border-slate-900">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Menu options buttons */}
            <div className="flex flex-col gap-1.5 bg-slate-900/40 p-2 border border-slate-900 rounded-2xl">
              <button
                onClick={() => {
                  setActiveTab('mentors');
                  setActiveCircleRoom(null);
                }}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition text-left text-xs ${
                  activeTab === 'mentors' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <MessageSquare className="w-4 h-4 shrink-0" />
                <span>1:1 Peer Mentors</span>
                <span className="ml-auto text-[9px] bg-slate-950 text-slate-500 px-1.5 py-0.5 rounded border border-slate-900 font-mono font-bold uppercase">
                  Connected
                </span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('circles');
                }}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition text-left text-xs ${
                  activeTab === 'circles' || activeCircleRoom ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Video className="w-4 h-4 shrink-0" />
                <span>Private circles</span>
                <span className="ml-auto text-[9px] bg-indigo-500/20 text-indigo-400 px-1.5 py-0.5 rounded font-mono font-bold">
                  Weekly Live
                </span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('tracks');
                  setActiveCircleRoom(null);
                }}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition text-left text-xs ${
                  activeTab === 'tracks' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <BookOpen className="w-4 h-4 shrink-0" />
                <span>Growth tracks</span>
                <span className="ml-auto text-[9px] bg-slate-950 text-slate-500 px-1.5 py-0.5 rounded border border-slate-900 font-mono leading-none">
                  Journal
                </span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('upgrade');
                  setActiveCircleRoom(null);
                }}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition text-left text-xs ${
                  activeTab === 'upgrade' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Award className="w-4 h-4 shrink-0 animate-pulse text-amber-500" />
                <span>Premium membership</span>
                <span className="ml-auto text-[9px] bg-amber-500/15 text-amber-400 px-1.5 py-0.5 rounded font-mono font-bold">
                  SaaS Plans
                </span>
              </button>
            </div>

            {/* Credit Counter Status if User is on Free Plan */}
            {membershipPlan === 'free' && (
              <div className="bg-slate-900 border border-slate-850 p-4 rounded-2xl space-y-2">
                <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                  <span>FREE DAILY API COUNTS</span>
                  <span className="font-bold text-amber-400">{freeCreditCount} / 3 left</span>
                </div>
                <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-900">
                  <div 
                    className="bg-amber-500 h-full transition-all duration-300"
                    style={{ width: `${(freeCreditCount / 3) * 100}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-500 leading-normal">
                  Our core matching chatbot calls Gemini. Upgrade to "Brother" plan tier for unlimited chats, coaching session notes, and customized sentiment alerts.
                </p>
              </div>
            )}

          </div>

          {/* ACTIVE TAB DISPLAY PORTAL */}
          <div className="lg:col-span-9" id="active-viewport-workspace">
            
            {/* 1. MENTORS DIRECT CHAT VIEW */}
            {activeTab === 'mentors' && !activeCircleRoom && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 h-full max-h-[80vh]" id="mentors-tab">
                
                {/* matched list */}
                <div className="md:col-span-4 bg-slate-950 border border-slate-900 rounded-2xl p-4 flex flex-col gap-3 min-h-[300px] overflow-y-auto">
                  <div className="flex justify-between items-center text-xs text-slate-400 font-mono border-b border-slate-900 pb-2 mb-1">
                    <span>RELATABILITY MATCHES</span>
                    <span>% Core Match</span>
                  </div>
                  
                  <div className="space-y-2">
                    {sortedCompatibleMentors.map((item) => {
                      const compatibilityScore = calculateCompatibility(userProfile, item);
                      const isSelected = selectedMentor.id === item.id;
                      return (
                        <div
                          key={item.id}
                          onClick={() => setSelectedMentor(item)}
                          className={`p-2.5 rounded-xl cursor-pointer border transition flex items-center gap-3 ${
                            isSelected 
                              ? 'bg-emerald-500/10 border-emerald-500/50 text-slate-200' 
                              : 'bg-slate-900 border-slate-900 text-slate-400 hover:border-slate-800'
                          }`}
                        >
                          <img 
                            src={item.avatar} 
                            alt={item.name} 
                            className="w-8 h-8 rounded-full bg-slate-950 shrink-0 border border-slate-800"
                            referrerPolicy="no-referrer"
                          />
                          <div className="overflow-hidden flex-1">
                            <h4 className="text-xs font-bold text-slate-200 truncate">{item.name}</h4>
                            <p className="text-[10px] text-slate-500 truncate">{item.role}</p>
                          </div>
                          <span className="text-[11px] font-mono font-bold text-emerald-400 shrink-0">
                            {compatibilityScore}%
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* chat window */}
                <div className="md:col-span-8 bg-slate-900/40 border border-slate-900 rounded-2xl flex flex-col h-[520px]" id="chat-window-box">
                  
                  {/* Selected mentor detail bar */}
                  <div className="p-4 border-b border-slate-900 flex items-center justify-between shrink-0 bg-slate-950/40">
                    <div className="flex items-center gap-3">
                      <img 
                        src={selectedMentor.avatar} 
                        alt={selectedMentor.name} 
                        className="w-10 h-10 rounded-full border border-emerald-500/30"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-xs font-bold text-slate-200">{selectedMentor.name}</h3>
                          <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded font-mono uppercase">
                            Mentor Match
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 truncate max-w-sm">{selectedMentor.role}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-0.5 justify-end">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span className="text-xs font-bold text-slate-200 font-mono">{selectedMentor.rating}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">{selectedMentor.location}</span>
                    </div>
                  </div>

                  {/* Message logging window */}
                  <div className="flex-1 p-4 overflow-y-auto space-y-4" id="direct-chat-log">
                    {/* Default introduction bubble */}
                    <div className="bg-slate-900/60 p-4 border border-slate-850 rounded-2xl flex flex-col gap-1.5 max-w-xl">
                      <p className="text-[10px] text-emerald-400 font-mono uppercase tracking-wider font-semibold">Matched Mentor Bio & Wisdom</p>
                      <p className="text-xs text-slate-300 leading-relaxed italic text-justify">
                        "{selectedMentor.longBio}"
                      </p>
                      <hr className="border-slate-850 mt-1" />
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedMentor.livedExperience.map(exp => (
                          <span key={exp} className="bg-slate-950 text-slate-400 text-[9px] font-mono px-2 py-0.5 rounded border border-slate-900">
                            Lived: {exp}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Conversation thread messages mapping */}
                    {(chatMessages[selectedMentor.id] || []).map((msg) => {
                      const isUser = msg.sender === 'user';
                      return (
                        <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed border ${
                            isUser 
                              ? 'bg-emerald-500 border-emerald-500 text-slate-950 font-medium rounded-tr-none' 
                              : 'bg-slate-950 border-slate-900 text-slate-300 rounded-tl-none font-normal'
                          }`}>
                            <p>{msg.text}</p>
                            <span className={`text-[9px] block text-right mt-1.5 font-mono ${
                              isUser ? 'text-slate-800' : 'text-slate-500'
                            }`}>
                              {msg.timestamp}
                            </span>
                          </div>
                        </div>
                      );
                    })}

                    {/* Gemini waiting indicator */}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-slate-950 border border-slate-900 text-slate-500 rounded-2xl rounded-tl-none p-3 flex items-center gap-1.5 text-xs">
                          <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                          <span className="text-[10px] font-mono text-slate-600 ml-1">Mentor writing reply...</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Input message form box */}
                  <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-900 shrink-0 bg-slate-950/40 flex gap-2">
                    <input 
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder={`Message ${selectedMentor.name} (Lived situation peer mentor)...`}
                      className="flex-1 bg-slate-950 border border-slate-850 rounded-xl px-4 py-2 text-xs outline-none focus:border-emerald-500"
                    />
                    <button 
                      type="submit"
                      disabled={isTyping}
                      className="bg-emerald-500 text-slate-950 font-bold px-4 rounded-xl flex items-center justify-center hover:bg-emerald-400 transition"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>

                </div>

              </div>
            )}

            {/* 2. PRIVATE CIRCLES VIEW SECTION */}
            {activeTab === 'circles' && (
              <div className="space-y-4" id="circles-tab">
                
                {activeCircleRoom ? (
                  /* SIMULATED ACTIVE LIVE CIRCLE WORKSPACE MEETING ROOM */
                  <div className="bg-slate-900 border border-slate-805 rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 h-[550px]" id="circle-workspace-room">
                    
                    {/* Left: Video cameras grids mock representing active brothers */}
                    <div className="lg:col-span-8 p-4 flex flex-col justify-between bg-slate-950">
                      
                      {/* circle status banner header */}
                      <div className="flex justify-between items-center bg-slate-900/60 p-3 rounded-lg border border-slate-900">
                        <div>
                          <h4 className="text-xs font-bold text-slate-200">{activeCircleRoom.name}</h4>
                          <p className="text-[10px] text-slate-500 font-mono">Facilitator: {activeCircleRoom.mentorName}</p>
                        </div>
                        <span className="text-[10px] font-mono bg-indigo-500/20 text-indigo-400 px-2.5 py-0.5 rounded-full animate-pulse border border-indigo-500/20">
                          ● WEEKLY LIVE CIRCLE CONVERSATION
                        </span>
                      </div>

                      {/* Video Camera Panels Grid */}
                      <div className="grid grid-cols-3 gap-3 my-4 flex-1">
                        {/* Facilitator Panel */}
                        <div className="bg-slate-900 border border-emerald-500/30 rounded-xl relative overflow-hidden flex flex-col justify-center items-center text-center p-3">
                          <img 
                            src={INITIAL_MENTORS.find(m => m.name === activeCircleRoom.mentorName)?.avatar || 'https://picsum.photos/seed/test/150/150'} 
                            alt="Moderator avatar" 
                            className="w-14 h-14 rounded-full border border-emerald-500/20 object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <p className="text-xs font-bold text-slate-200 mt-2 truncate max-w-full">{activeCircleRoom.mentorName}</p>
                          <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1 py-0.2 rounded mt-1 font-mono uppercase">
                            FACILITATOR
                          </span>
                        </div>

                        {/* Brother Participant 1 */}
                        <div className="bg-slate-900 border border-slate-850 rounded-xl relative overflow-hidden flex flex-col justify-center items-center text-center p-3">
                          <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center font-bold text-indigo-400 border border-slate-700">
                            TO
                          </div>
                          <p className="text-xs font-bold text-slate-300 mt-2">Tunde O. (Burnout)</p>
                          <span className="text-[9px] text-slate-500 mt-1 font-mono flex items-center gap-1">
                            <Mic className="w-3 h-3 text-emerald-400" /> Active Mic
                          </span>
                        </div>

                        {/* Brother Participant 2 */}
                        <div className="bg-slate-900 border border-slate-850 rounded-xl relative overflow-hidden flex flex-col justify-center items-center text-center p-3">
                          <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center font-bold text-indigo-400 border border-slate-700">
                            DK
                          </div>
                          <p className="text-xs font-bold text-slate-300 mt-2">Dave K. (Grief)</p>
                          <span className="text-[9px] text-slate-500 mt-1 font-mono flex items-center gap-1">
                            <MicOff className="w-3 h-3 text-red-500" /> Muted
                          </span>
                        </div>

                        {/* Brother Participant 3 */}
                        <div className="bg-slate-900 border border-slate-850 rounded-xl relative overflow-hidden flex flex-col justify-center items-center text-center p-3">
                          <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center font-bold text-indigo-400 border border-slate-700">
                            AS
                          </div>
                          <p className="text-xs font-bold text-slate-300 mt-2">Amin S. (Careers)</p>
                          <span className="text-[9px] text-slate-500 mt-1 font-mono flex items-center gap-1">
                            <MicOff className="w-3 h-3 text-red-500" /> Muted
                          </span>
                        </div>

                        {/* Self User Panel */}
                        <div className="bg-slate-900 border border-dashed border-slate-700 rounded-xl relative overflow-hidden flex flex-col justify-center items-center text-center p-3">
                          <div className="w-12 h-12 rounded-full bg-indigo-500 text-slate-950 flex items-center justify-center font-bold">
                            {userProfile.name[0]}
                          </div>
                          <p className="text-xs font-bold text-slate-300 mt-2">You ({userProfile.name})</p>
                          <span className={`text-[9px] font-mono border px-1.5 py-0.2 rounded mt-1.5 uppercase ${
                            circleMicMuted ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                          }`}>
                            {circleMicMuted ? 'Muted' : 'Speaking'}
                          </span>
                        </div>

                        {/* Background filler panel */}
                        <div className="bg-slate-900/40 border border-dashed border-slate-850/60 rounded-xl flex items-center justify-center text-center p-3">
                          <p className="text-[10px] text-slate-600 font-mono">Circle Seat Available ({activeCircleRoom.membersCount}/{activeCircleRoom.limit})</p>
                        </div>
                      </div>

                      {/* Circle hardware controllers */}
                      <div className="flex justify-center gap-3 border-t border-slate-900 pt-3 shrink-0 bg-slate-950">
                        <button 
                          onClick={() => setCircleMicMuted(!circleMicMuted)}
                          className={`p-2.5 rounded-full transition ${
                            circleMicMuted ? 'bg-red-500 text-slate-100 hover:bg-red-400' : 'bg-slate-800 text-emerald-400 hover:bg-slate-700'
                          }`}
                        >
                          {circleMicMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                        </button>
                        <button 
                          onClick={() => setCircleVideoOff(!circleVideoOff)}
                          className={`p-2.5 rounded-full transition ${
                            circleVideoOff ? 'bg-red-500 text-slate-100' : 'bg-slate-800 text-emerald-400 hover:bg-slate-700'
                          }`}
                        >
                          {circleVideoOff ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                        </button>
                        <button 
                          onClick={() => setActiveCircleRoom(null)}
                          className="px-4 py-1.5 bg-rose-500 text-slate-950 rounded-xl text-xs font-bold transition hover:bg-rose-400"
                        >
                          Leave Connection Circle
                        </button>
                      </div>

                    </div>

                    {/* Right: Circle Active Chat logs sidebar */}
                    <div className="lg:col-span-4 p-4 border-l border-slate-850/50 flex flex-col justify-between bg-slate-900/60 overflow-hidden">
                      <h4 className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider border-b border-slate-850 pb-2">Circle Room Chat</h4>
                      
                      <div className="flex-1 my-3 overflow-y-auto space-y-3" id="circle-feed">
                        {circleLiveFeed.map((chat, idx) => (
                          <div key={idx} className="space-y-0.5">
                            <span className="text-[9px] font-bold text-indigo-400 font-mono block">{chat.sender}</span>
                            <p className="text-xs text-slate-300 bg-slate-950 p-2 rounded-lg border border-slate-950">
                              {chat.text}
                            </p>
                          </div>
                        ))}
                        <div ref={currentCircleFeedEndRef} />
                      </div>

                      <div className="text-[10px] text-slate-500 leading-normal border-t border-slate-850 pt-3">
                        *Brothers are typing... Timed chat simulations refresh automatically to model peer activity streams.
                      </div>
                    </div>

                  </div>
                ) : (
                  /* PRIVATE CIRCLES SELECTION LIST SECTION */
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <h2 className="text-2xl font-bold text-slate-200 tracking-tight">Active Connection Circles</h2>
                      <p className="text-xs text-slate-400 leading-normal">Weekly small-group (5-8 men) moderated by certified senior peer facilitators. Zero diagnostic hoops needed.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {INITIAL_CIRCLES.map((circle) => {
                        return (
                          <div 
                            key={circle.id}
                            className="bg-slate-900 border border-slate-805/80 p-5 rounded-2xl flex flex-col justify-between gap-4"
                          >
                            <div className="space-y-2">
                              <div className="flex justify-between items-start gap-2">
                                <h3 className="text-sm font-bold text-slate-200">{circle.name}</h3>
                                <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                                  circle.accentColor === 'rose' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                                  circle.accentColor === 'amber' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                                  circle.accentColor === 'indigo' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                                  'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                }`}>
                                  {circle.dayAndTime}
                                </span>
                              </div>
                              <p className="text-xs text-slate-400 leading-relaxed text-justify">{circle.description}</p>
                            </div>

                            <div className="border-t border-slate-850 pt-3 flex items-center justify-between text-xs text-slate-500 font-mono">
                              <span>Facilitator: <strong>{circle.mentorName}</strong></span>
                              <span>Seats: {circle.membersCount} / {circle.limit} full</span>
                            </div>

                            <button 
                              onClick={() => enterCircleRoom(circle)}
                              className="w-full bg-slate-950 border border-slate-800 text-slate-200 font-bold py-2 rounded-xl text-xs hover:bg-slate-900 transition flex items-center justify-center gap-2"
                            >
                              Enter Weekly Circle Room <Video className="w-3.5 h-3.5 text-indigo-400" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* 3. GROWTH TRACKS TAB */}
            {activeTab === 'tracks' && (
              <div className="space-y-4" id="tracks-tab">
                
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold text-slate-200 tracking-tight">Structured Growth Pathways</h2>
                  <p className="text-xs text-slate-400 leading-normal">Guided wellness milestones, interactive task lists, and confidential journaling.</p>
                </div>

                {/* Track Selector buttons */}
                <div className="flex gap-2 border-b border-slate-900 pb-2">
                  {INITIAL_TRACKS.map(track => {
                    const isSelected = activeTrack.id === track.id;
                    return (
                      <button
                        key={track.id}
                        onClick={() => {
                          setActiveTrack(track);
                          setActiveTrackWeek(1);
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                          isSelected 
                            ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-500' 
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {track.title}
                      </button>
                    );
                  })}
                </div>

                {/* Active track week viewer layout */}
                <div className="bg-slate-900 border border-slate-850 p-6 rounded-2xl grid grid-cols-1 md:grid-cols-12 gap-6">
                  
                  {/* Left: Weeks navigation numbers */}
                  <div className="md:col-span-3 flex flex-col gap-1.5">
                    <p className="text-[10px] font-mono text-slate-500 uppercase block mb-1">COURSE CURRICULUM</p>
                    
                    {activeTrack.weeks.map(wk => {
                      const isActive = activeTrackWeek === wk.week;
                      return (
                        <button
                          key={wk.week}
                          onClick={() => setActiveTrackWeek(wk.week)}
                          className={`w-full text-left p-3 rounded-xl border transition ${
                            isActive 
                              ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-400 font-bold' 
                              : 'bg-slate-950 border-slate-950 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          <p className="text-[10px] font-mono">WEEK {wk.week}</p>
                          <p className="text-[11px] truncate mt-0.5">{wk.title}</p>
                        </button>
                      );
                    })}
                  </div>

                  {/* Right: Week Details and task ticking */}
                  <div className="md:col-span-9 space-y-4">
                    {(() => {
                      const weekObj = activeTrack.weeks.find(w => w.week === activeTrackWeek)!;
                      const journalKey = `${activeTrack.id}_week_${activeTrackWeek}`;
                      const currentJournalText = journalInputs[journalKey] || '';
                      
                      return (
                        <>
                          <div className="space-y-1">
                            <span className="text-[10px] uppercase font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded">
                              Week {weekObj.week} objective
                            </span>
                            <h3 className="text-base font-bold text-slate-200 mt-1">{weekObj.title}</h3>
                            <p className="text-xs text-slate-400 leading-relaxed text-justify">{weekObj.description}</p>
                          </div>

                          <div className="bg-slate-950 p-4 border border-slate-850 rounded-xl space-y-2">
                            <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Required Weekly Action Checklist</h4>
                            
                            <div className="space-y-2 text-xs">
                              {weekObj.tasks.map((task, idx) => {
                                const taskKey = `${activeTrack.id}_wk${activeTrackWeek}_idx${idx}`;
                                const isChecked = !!checkedTasks[taskKey];
                                return (
                                  <div 
                                    key={idx} 
                                    onClick={() => handleToggleTask(activeTrack.id, activeTrackWeek, idx)}
                                    className="flex items-start gap-2.5 cursor-pointer select-none"
                                  >
                                    <div className="mt-0.5">
                                      <div className={`w-4 h-4 rounded border flex items-center justify-center transition ${
                                        isChecked ? 'bg-emerald-500 border-emerald-500 text-slate-950' : 'border-slate-800'
                                      }`}>
                                        <Check className="w-2.5 h-2.5 stroke-3" />
                                      </div>
                                    </div>
                                    <span className={`${isChecked ? 'line-through text-slate-500' : 'text-slate-300'}`}>{task}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Personal Local Storage Journals */}
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider block">
                              Confidential Wellness Journal prompt:
                            </label>
                            <p className="text-xs text-slate-400 leading-normal bg-slate-950 p-3 rounded-lg border border-slate-850 text-justify">
                              {weekObj.journalPrompt}
                            </p>
                            
                            <textarea
                              value={currentJournalText}
                              onChange={(e) => {
                                setJournalInputs(prev => ({
                                  ...prev,
                                  [journalKey]: e.target.value
                                }));
                              }}
                              placeholder="Type your personal confidential thoughts here to check off..."
                              className="w-full h-24 bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-500 text-slate-200 text-justify"
                            />
                            
                            <button
                              onClick={() => handleSaveJournal(activeTrack.id, activeTrackWeek, currentJournalText)}
                              className="bg-indigo-500 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs hover:bg-indigo-400 transition"
                            >
                              Save Journal Entry
                            </button>
                          </div>
                        </>
                      );
                    })()}
                  </div>

                </div>

              </div>
            )}

            {/* 4. PREMIUM UPGRADE TAB */}
            {activeTab === 'upgrade' && (
              <div className="space-y-6" id="upgrade-tab">
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold text-slate-200 tracking-tight">Structured Platform Pricing Plans</h2>
                  <p className="text-xs text-slate-400 leading-normal">Support Niyi's project viability. Standard corporate employer and individual tiers configured as defined inside the slides.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {/* Plan 1 */}
                  <div className={`p-5 rounded-2xl bg-slate-900 border flex flex-col justify-between ${
                    membershipPlan === 'free' ? 'border-emerald-500' : 'border-slate-805'
                  }`}>
                    <div className="space-y-3">
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">B2C INDIVIDUALS</span>
                      <h3 className="text-lg font-bold text-slate-200">Free Tier</h3>
                      <p className="text-2xl font-extrabold text-slate-200">£0 <span className="text-xs text-slate-500">/ forever</span></p>
                      
                      <hr className="border-slate-850" />
                      <ul className="text-xs text-slate-400 space-y-2 list-none">
                        <li>✔ Weekly live circle workspace access</li>
                        <li>✔ Connect 1 lived situation mentor</li>
                        <li>✔ Standard matching algorithm</li>
                        <li className="text-slate-600">❌ Unlimited conversational API calls</li>
                        <li className="text-slate-600">❌ Peer coaching notes trackers</li>
                      </ul>
                    </div>

                    <button
                      onClick={() => handleUpgradeSubscription('free')}
                      className={`w-full py-2 rounded-xl text-xs font-bold mt-5 transition ${
                        membershipPlan === 'free' 
                          ? 'bg-emerald-500 text-slate-950' 
                          : 'bg-slate-950 border border-slate-800 text-slate-300 hover:bg-slate-900'
                      }`}
                    >
                      {membershipPlan === 'free' ? 'Currently Selected' : 'Revert to Free'}
                    </button>
                  </div>

                  {/* Plan 2 */}
                  <div className={`p-5 rounded-2xl bg-slate-900 border flex flex-col justify-between relative overflow-hidden ${
                    membershipPlan === 'brother' ? 'border-emerald-500' : 'border-slate-805'
                  }`}>
                    <div className="absolute top-0 right-0 bg-emerald-500 text-slate-950 text-[9px] font-extrabold uppercase px-3 py-1 rounded-bl">
                      MOST RECOMMENDED
                    </div>

                    <div className="space-y-3">
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">B2C COVALENCE</span>
                      <h3 className="text-lg font-bold text-slate-200">Brother Plan</h3>
                      <p className="text-2xl font-extrabold text-slate-200">£19.99 <span className="text-xs text-slate-500">/ month</span></p>
                      
                      <hr className="border-slate-850" />
                      <ul className="text-xs text-slate-400 space-y-2 list-none font-bold">
                        <li className="text-slate-200">✔ Unlimited weekly circle rooms</li>
                        <li className="text-slate-250">✔ Priority advisor matching</li>
                        <li className="text-slate-250">✔ Unlimited direct chats (Gemini)</li>
                        <li className="text-slate-250">✔ Session progress notes</li>
                        <li className="text-slate-250">✔ Custom weekly smart prompt triggers</li>
                      </ul>
                    </div>

                    <button
                      onClick={() => handleUpgradeSubscription('brother')}
                      className={`w-full py-2 rounded-xl text-xs font-bold mt-5 transition ${
                        membershipPlan === 'brother' 
                          ? 'bg-emerald-500 text-slate-950' 
                          : 'bg-slate-950 border border-slate-800 text-slate-300 hover:bg-slate-900'
                      }`}
                    >
                      {membershipPlan === 'brother' ? 'Currently Active' : 'Subscribe to Brother'}
                    </button>
                  </div>

                  {/* Plan 3 */}
                  <div className={`p-5 rounded-2xl bg-slate-900 border flex flex-col justify-between ${
                    membershipPlan === 'mentor-pro' ? 'border-emerald-500' : 'border-slate-805'
                  }`}>
                    <div className="space-y-3">
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">TRAINED COACHES</span>
                      <h3 className="text-lg font-bold text-slate-200">Mentor Pro</h3>
                      <p className="text-2xl font-extrabold text-slate-200">£24.99 <span className="text-xs text-slate-500">/ month</span></p>
                      
                      <hr className="border-slate-850" />
                      <ul className="text-xs text-slate-400 space-y-2 list-none">
                        <li>✔ Includes all Brother coaching utilities</li>
                        <li>✔ Brotherly Certification Courseware</li>
                        <li>✔ Professional Mentor CMS dashboard</li>
                        <li>✔ Aggregated impact analytics (B2B share)</li>
                        <li>✔ Listed on approved referral boards</li>
                      </ul>
                    </div>

                    <button
                      onClick={() => handleUpgradeSubscription('mentor-pro')}
                      className={`w-full py-2 rounded-xl text-xs font-bold mt-5 transition ${
                        membershipPlan === 'mentor-pro' 
                          ? 'bg-emerald-500 text-slate-950' 
                          : 'bg-slate-950 border border-slate-800 text-slate-300 hover:bg-slate-900'
                      }`}
                    >
                      {membershipPlan === 'mentor-pro' ? 'Currently Active' : 'Activate Mentor Pro'}
                    </button>
                  </div>
                </div>

                {/* B2B license segment highlights */}
                <div className="bg-slate-950 border border-slate-850 p-5 rounded-xl space-y-2">
                  <h4 className="text-xs font-bold text-teal-400 font-mono tracking-widest uppercase">Stream 2 & 3: Corporate Wellbeing & Public Procurement</h4>
                  <p className="text-xs text-slate-400 leading-relaxed text-justify">
                    In addition to B2C plans, Brotherly licenses packages for hazard corporate workforces (finance, construction, tech) and NHS/VCSE partnership referral pathways:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono text-slate-500 pt-1">
                    <div className="bg-slate-900/50 p-3 rounded border border-slate-900">
                      <strong className="text-slate-300 block">STARTER PACKAGE</strong>
                      <span>Up to 50 corporate seats: £2,500/year</span>
                    </div>
                    <div className="bg-slate-900/50 p-3 rounded border border-slate-900">
                      <strong className="text-slate-300 block">BUSINESS PACKAGE</strong>
                      <span>50-250 corporate seats: £7,500/year</span>
                    </div>
                    <div className="bg-slate-900/50 p-3 rounded border border-slate-900">
                      <strong className="text-slate-300 block">PUBLIC CONTRACTS</strong>
                      <span>NHS grant funding Referral Pathways</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>
      )}
    </div>
  );
}
