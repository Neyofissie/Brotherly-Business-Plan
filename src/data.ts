import { Mentor, PrivateCircle, GrowthTrack, FinancialMetric, RiskItem, MilestoneItem } from './types';

export const INITIAL_MENTORS: Mentor[] = [
  {
    id: 'niyi',
    name: 'Niyi Osoba',
    role: 'Founder & Head Mentor (Diaspora & Careers)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    bio: '8+ years Senior UX & Product Designer based in Scotland. Lived experience navigating UK immigration, career transitions, and diaspora fatherhood.',
    age: 34,
    location: 'Edinburgh, UK',
    livedExperience: ['Fatherhood', 'Career Transition', 'Immigration & Identity', 'Marriage'],
    culturalBackground: 'West African (Nigerian)',
    faith: 'Christianity',
    languages: ['English', 'Yoruba'],
    matchesCompleted: 142,
    rating: 4.9,
    longBio: "I built Brotherly because I have lived the silence. As a man, as a member of a diaspora community, and as someone who has navigated the challenges of building a new career and family in the UK, I know how hard it is to carry private weight without a trusted space to speak. I understand the nuances of cultural identity, high-pressure design careers, and the deep emotional reality of fatherhood. I'm here to provide structured, supportive peer mentorship to help you thrive rather than just survive."
  },
  {
    id: 'marcus',
    name: 'Marcus Vance',
    role: 'Senior Family & Co-parenting Mentor',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    bio: '12+ years experience in social work and fatherhood facilitation. Specialized in family reconciliation, divorce support, and positive co-parenting.',
    age: 42,
    location: 'London, UK',
    livedExperience: ['Divorce & Co-parenting', 'Fatherhood', 'Spiritual Growth'],
    culturalBackground: 'Black British / Caribbean',
    faith: 'Christianity',
    languages: ['English'],
    matchesCompleted: 210,
    rating: 4.8,
    longBio: "Navigating divorce while staying present for your children is one of the toughest tests a man can face. I went through a highly difficult separation myself ten years ago and came out the other side with healthy co-parenting habits and a deeply strengthened relationship with my kids. My goal is to equip men with the emotional tools and level-headed strategies they need to prevent bitterness, support their children, and build a positive new chapter of life."
  },
  {
    id: 'david',
    name: 'David Chen',
    role: 'Mindfulness & Mental Health Recovery Peer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face', // Using high contrast male face
    bio: 'Former high-stress fintech executive now advocating for male mental health, emotional awareness, and recovery from burnout.',
    age: 38,
    location: 'Manchester, UK',
    livedExperience: ['Burnout & Career Crisis', 'Grief & Healing', 'Mindfulness & Healing'],
    culturalBackground: 'East Asian (British-Chinese)',
    faith: 'Secular / Buddhist Values',
    languages: ['English', 'Mandarin'],
    matchesCompleted: 98,
    rating: 5.0,
    longBio: "To the outside world, I was a successful executive leading engineering teams. Privately, I was on the brink of absolute collapse due to burnout and unresolved grief after losing my brother. Finding men who spoke openly about stress saved my life. I trained in mindfulness and stress-reduction techniques because I wanted to show other men that vulnerability is not a weakness—it is the highest form of courage. Let's work together to re-center your values and live with intention."
  },
  {
    id: 'kwame',
    name: 'Kwame Mensah',
    role: 'Young Fathers & Identity Coach',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop&crop=face',
    bio: 'Community worker specialized in guiding young diaspora husbands and fathers. Passionate about community action and generational healing.',
    age: 29,
    location: 'Birmingham, UK',
    livedExperience: ['First-Time Fatherhood', 'Self-Worth', 'Community & Identity'],
    culturalBackground: 'West African (Ghanaian)',
    faith: 'Christianity',
    languages: ['English', 'Twi'],
    matchesCompleted: 74,
    rating: 4.7,
    longBio: "Becoming a father at 24 changed everything for me. In our cultures, young men are often expected to know exactly what they are doing and never show doubt. But under a strong exterior, we are often lost. I focus on helper-coaching for young fathers, creating a safe, judgment-free zone to discuss child-raising, financial stress, balancing marriage, and breaking generational trauma. Let's build healthy habits for our lineages."
  },
  {
    id: 'samuel',
    name: 'Samuel Goldstein',
    role: 'Senior Career Transition & Midlife Growth Specialist',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    bio: 'Life design partner for men over 40. Lived experience dealing with retirement anxiety, finding purpose, and recovery from physical health changes.',
    age: 51,
    location: 'Glasgow, UK',
    livedExperience: ['Finding Purpose after 40', 'Physical Recovery', 'Career Transition', 'Grief & Healing'],
    culturalBackground: 'Jewish Descent / British',
    faith: 'Judaism',
    languages: ['English', 'Hebrew'],
    matchesCompleted: 154,
    rating: 4.9,
    longBio: "When a man hits fifty, he often starts asking himself 'is this all there is?' Society is very focused on young builders, but midlife transitions deserve structural support. After overcoming a severe thyroid illness that forced me to close my architectural practice, I reconstructed my life to center on deep relationships and legacy. I want to help you design a second half of life that is richer, more joyful, and thoroughly aligned with your core truth."
  }
];

export const INITIAL_CIRCLES: PrivateCircle[] = [
  {
    id: 'first-father',
    name: 'First-Time Fatherhood Circle',
    description: 'Weekly facilitated group for men navigating early fatherhood. Share sleep struggles, identity shifts, and partner communication challenges.',
    mentorId: 'kwame',
    mentorName: 'Kwame Mensah',
    membersCount: 6,
    limit: 8,
    dayAndTime: 'Tuesdays, 8:00 PM GMT',
    topics: ['Sleep & Routine', 'Marital Support', 'Father Identity', 'Stress Management'],
    accentColor: 'indigo'
  },
  {
    id: 'divorce-coparent',
    name: 'Divorce & Healthy Co-Parenting',
    description: 'For fathers navigating legal separation, marital grief, and keeping children center stage. Guided weekly support focusing on emotional balance.',
    mentorId: 'marcus',
    mentorName: 'Marcus Vance',
    membersCount: 7,
    limit: 8,
    dayAndTime: 'Thursdays, 7:30 PM GMT',
    topics: ['Legal Realities', 'Child Emotional Stability', 'Processing Anger', 'New Beginnings'],
    accentColor: 'rose'
  },
  {
    id: 'healing-grief',
    name: 'Grief, Loss & Healing Space',
    description: 'A confidential, supportive space for men who have experienced major family bereavement or life-shattering losses. Step-by-step emotional grounding.',
    mentorId: 'david',
    mentorName: 'David Chen',
    membersCount: 5,
    limit: 8,
    dayAndTime: 'Mondays, 7:00 PM GMT',
    topics: ['Unpacking Shock', 'Constructive Mourning', 'Combating Isolation', 'Finding Light'],
    accentColor: 'amber'
  },
  {
    id: 'diaspora-careers',
    name: 'Diaspora Male Careers & Identity Journey',
    description: 'Navigate professional growth, systemic barriers, family expectations, and building a secure home base as a diaspora man in the UK.',
    mentorId: 'niyi',
    mentorName: 'Niyi Osoba',
    membersCount: 6,
    limit: 8,
    dayAndTime: 'Wednesdays, 8:30 PM GMT',
    topics: ['Systemic Dynamics', 'Self-Worth & Salary', 'Work-Family Balance', 'Cultural Legacy'],
    accentColor: 'emerald'
  }
];

export const INITIAL_TRACKS: GrowthTrack[] = [
  {
    id: 'present-father',
    title: 'Becoming a Present Father',
    subtitle: 'A 4-week structured pathway to conscious parenting for busy men.',
    description: 'Transition from passive provider to deeply engaged protector. Learn emotional validation skills, establish meaningful family rituals, and manage your stress cues.',
    durationWeeks: 4,
    participantsCount: 412,
    weeks: [
      {
        week: 1,
        title: 'Calming the Nervous System',
        description: 'Understand how fatigue and work stress lead to reactivity at home. Practice active self-regulation.',
        objective: 'Learn to transition from career mode to father mode without carrying emotional fatigue.',
        journalPrompt: 'Identify three triggers that make you impatient at home. How do they relate to your professional workday?',
        tasks: ['Establish a 10-minute "de-escalation transition" before entering the house or turning off work.', 'Log your stress indicators on scale 1-10 when your child shows big emotions.']
      },
      {
        week: 2,
        title: 'The Art of Undivided Attention',
        description: 'Master the quality of presence. Replace device distraction with conscious looking, listening, and play.',
        objective: 'Differentiate between physical supervision and active emotional presence.',
        journalPrompt: 'Reflect on a time this week where you felt completely locked out of your screen and engaged with your child. How did they respond?',
        tasks: ['Execute 15 minutes of "Floor Time" per day with zero devices or work thoughts.', 'Observe your child quietly for 2 minutes and notice something new about their behavior.']
      },
      {
        week: 3,
        title: 'Emotional Vocabulary & Validation',
        description: 'Move past logical fixing. Help boys and girls understand their feelings by learning to label your own and stay steady.',
        objective: 'Support your child through temper tantrums without matching their noise or shutting down.',
        journalPrompt: 'How did your own father react when you expressed fear, sadness, or intense anger as a child?',
        tasks: ['Practice the "Identify and Validate" technique twice relative to children\'s outbursts ("I see you are angry that...").', 'Avoid using the phrase "you are fine" or "dont cry" for one full week.']
      },
      {
        week: 4,
        title: 'Building Relational Anchors',
        description: 'Set up sustainable family rituals, weekly check-ins, and consistent memories that establish safety.',
        objective: 'Implement concrete, repeatable actions that say "You are important to me" without spending money.',
        journalPrompt: 'What is one tradition from your childhood you wish to preserve, and one you wish to discard?',
        tasks: ['Create and schedule a unique weekly "Special Date" or structural bedtime conversation with each child.', 'Complete your present father graduation plan with your assigned mentor.']
      }
    ]
  },
  {
    id: 'emotional-regulation',
    title: 'Emotional Regulation for Men',
    subtitle: 'A 4-week journey into shifting from anger and avoidance into intentional poise.',
    description: 'A scientifically validated process wrapped in real peer accountability. Learn to catch physical anger symptoms, decode anxiety, and communicate with assertiveness.',
    durationWeeks: 4,
    participantsCount: 529,
    weeks: [
      {
        week: 1,
        title: 'Mapping the Body Alarm',
        description: 'Identify where tension resides. Discover your signature physical signals before anger outbursts occur.',
        objective: 'Create a personal body-alarm checklist to catch reactivity in the first 3 seconds.',
        journalPrompt: 'Where in your body do you feel frustration first? Clenched jaw? Chest heat? Shallow breathing? Describe it.',
        tasks: ['Review your physical heat map during stressful discussions.', 'Observe heart rate patterns during work or family friction.']
      },
      {
        week: 2,
        title: 'Interrogating the Under-Story',
        description: 'Understand that anger is almost always a secondary emotion protecting fear, shame, or grief.',
        objective: 'Decode the unexpressed worry hidden underneath your last big outburst.',
        journalPrompt: 'Recall your last major flash of anger. If anger was a shield, what fear or sense of lack was it shielding?',
        tasks: ['Use the "Iceberg Method" worksheet with your mentor to list secondary stressors.', 'Avoid finger-pointing language in disputes; replace with "I-centered" feelings statements.']
      },
      {
        week: 3,
        title: 'Mindful Boundaries & The Cooling Protocol',
        description: 'Establish structural pauses. Learn how and when to call a "timeout" safely without triggering abandonment fear.',
        objective: 'Establish a mutual, healthy cooldown agreement with your partner or co-workers.',
        journalPrompt: 'How easy or hard is it for you to say, "I need to take a break to cool down, but I will return in 20 minutes to solve this"? Why?',
        tasks: ['Publish a Cooldown protocol agreement with key family members.', 'Maintain a daily 5-minute breathing focus to establish baseline calm.']
      },
      {
        week: 4,
        title: 'The Assertive Communicator',
        description: 'Move from passive-aggressive silent treatment into clear, high-integrity boundaries.',
        objective: 'Speak your emotional needs directly, without accusation or defensive posture.',
        journalPrompt: 'Draft an honest script asking for one supportive change in your household that you have been bottling of late.',
        tasks: ['Engage in one difficult but necessary direct discussion utilizing the peer blueprint.', 'Register your graduation with the general group session.']
      }
    ]
  }
];

export const FINANCIAL_METRICS: FinancialMetric[] = [
  {
    year: 1,
    registeredUsers: 2500,
    paidSubscribers: 375,
    b2bClients: 3,
    b2cRevenue: 52000,
    b2bRevenue: 22500,
    grantRevenue: 15000,
    totalRevenue: 89500,
    operatingCosts: 145000,
    netPosition: -55500
  },
  {
    year: 2,
    registeredUsers: 18000,
    paidSubscribers: 3600,
    b2bClients: 12,
    b2cRevenue: 540000,
    b2bRevenue: 105000,
    grantRevenue: 80000,
    totalRevenue: 725000,
    operatingCosts: 420000,
    netPosition: 305000
  },
  {
    year: 3,
    registeredUsers: 100000,
    paidSubscribers: 22000,
    b2bClients: 35,
    b2cRevenue: 3300000,
    b2bRevenue: 560000,
    grantRevenue: 250000,
    totalRevenue: 4110000,
    operatingCosts: 1800000,
    netPosition: 2310000
  }
];

export const RISK_ITEMS: RiskItem[] = [
  {
    id: 'risk1',
    category: 'User Acquisition',
    risk: 'User acquisition slower than projected due to male resistance and stigma.',
    likelihood: 'Medium',
    impact: 'High',
    mitigation: 'Implement our Community-First growth strategy: recruit 50 founding community hubs, diaspora churches, and fatherhood charities. Highly viral peer referrals with low CAC (£12-18).'
  },
  {
    id: 'risk2',
    category: 'B2B Sales',
    risk: 'Employer B2B sales cycles take longer than planned.',
    likelihood: 'Medium',
    impact: 'Medium',
    mitigation: 'Consumer B2C subscriptions provide independent organic margins. We also tap secure UK Government Men’s Health Strategy grant structures for non-cyclical early seed injections.'
  },
  {
    id: 'risk3',
    category: 'Mentor Quality',
    risk: 'Sourcing, training, and retaining high-caliber volunteers/mentors.',
    likelihood: 'Medium',
    impact: 'High',
    mitigation: 'Standardize onboarding via our proprietary Brotherly Mentor Certification program. Introduce professional Mentor Pro (£24.99) tooling, year 2 stipends, and structured B2B coaching roles.'
  },
  {
    id: 'risk4',
    category: 'Duty of Care',
    risk: 'Safeguarding issues or acute psychological crises on a peer-to-peer app.',
    likelihood: 'Low',
    impact: 'High',
    mitigation: 'Explicitly market and structure the service as non-clinical peer support. Build a highly visible Safeguarding Crisis Hotline protocol, AI sentiment flag triggers, and NHS referral hot-lines.'
  },
  {
    id: 'risk5',
    category: 'Competition',
    risk: 'Mainstream therapy apps (BetterHelp) or wellness apps (Calm) replicate our model.',
    likelihood: 'Low',
    impact: 'Medium',
    mitigation: 'Therapy apps are perceived as expensive and medicalized. Wellness apps are solo. Brotherly stands unique in lived situation-matching (not diagnostic) and highly inclusive diaspora focus.'
  },
  {
    id: 'risk6',
    category: 'Regulatory',
    risk: 'GDPR issues regarding hosting sensitive men’s wellness journals and chat data.',
    likelihood: 'Low',
    impact: 'Medium',
    mitigation: 'Engage legal counsel in Year 1. Server database isolates and anonymizes sensitive data; we operate zero clinical record stores. Fully sandboxed authentication.'
  }
];

export const MILESTONE_ITEMS: MilestoneItem[] = [
  { id: 'm1', timeline: 'Month 1-1.5', title: 'Visa Grant & Incorporation', description: 'Innovator Founder Visa endorsed and granted. Company incorporated. Legal frameworks/banking established.', completed: true },
  { id: 'm2', timeline: 'Month 2-3', title: 'Platform MVP Build', description: 'Platform MVP code finalization. Recruit, train, and certify our 50 founding mentors.', completed: true },
  { id: 'm3', timeline: 'Month 3-4', title: 'Closed Beta Launch', description: 'Onboard 200 select waitlisted users. First 3 Private Circles go live.', completed: false },
  { id: 'm4', timeline: 'Month 4-6', title: 'First B2B Contract & NHS Referral', description: 'Sign first 50-seat corporate employee wellbeing package. Submit application to the NHS Digital Health Accelerator.', completed: false },
  { id: 'm5', timeline: 'Month 6-7', title: 'Public Expansion PR', description: 'Public national launch carefully coordinated with UK Men\'s Mental Health Month (November). Focused press pieces.', completed: false },
  { id: 'm6', timeline: 'Month 8-10', title: 'International Corridor Corroboration', description: 'Acquire 500 active paid subscribers. Launch pilot matching nodes across NY (USA) and Lagos (Nigeria) corridors.', completed: false },
  { id: 'm7', timeline: 'Month 10-12', title: 'ARR Target Review', description: 'Reach £89,500 run-rate target. Review milestones complete with the Visa Endorsing Body for year 2 transition.', completed: false }
];

export const PITCH_SECTIONS = [
  {
    id: 'intro',
    title: 'Cover & Opportunity',
    subtitle: 'Niyi Osoba - UK Innovator Founder Visa Proposal',
    icon: 'FileText'
  },
  {
    id: 'problem',
    title: '1. The Problem Space',
    subtitle: 'The Male Mental Health Silence & Diaspora Gap',
    icon: 'AlertTriangle'
  },
  {
    id: 'solution',
    title: '2. Brotherly Solution',
    subtitle: 'Peer-Mentorship vs Clinical and Solo Apps',
    icon: 'Cpu'
  },
  {
    id: 'market',
    title: '3. Market Analysis',
    subtitle: 'Government Tailwinds & Addressable Sizing',
    icon: 'TrendingUp'
  },
  {
    id: 'financials',
    title: '4. Business Model & Forecasts',
    subtitle: 'Unit Economics and 3-Year Projections',
    icon: 'DollarSign'
  },
  {
    id: 'strategy',
    title: '5. Go-To-Market Phase',
    subtitle: 'Community-First Growth & Acquisition Lifecycle',
    icon: 'Target'
  },
  {
    id: 'founder',
    title: '6. Founder & Credentials',
    subtitle: 'UX Credibility, Lived-experience and Advisory Board',
    icon: 'UserCheck'
  },
  {
    id: 'innovation',
    title: '7. Innovation & Endorsement',
    subtitle: 'Meeting Home Office Criteria under Innovative/Viable/Scalable',
    icon: 'ShieldCheck'
  },
  {
    id: 'risks',
    title: '8. Risks & Mitigations',
    subtitle: 'Proactive safeguarding and structural backups',
    icon: 'AlertOctagon'
  },
  {
    id: 'timeline',
    title: '9. 12-Month Milestones',
    subtitle: 'Execution timeline and Key Performance Indicators',
    icon: 'CheckSquare'
  }
];
