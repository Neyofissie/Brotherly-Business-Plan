export interface Mentor {
  id: string;
  name: string;
  role: string;
  avatar: string;
  bio: string;
  age: number;
  location: string;
  livedExperience: string[];
  culturalBackground: string;
  faith: string;
  languages: string[];
  matchesCompleted: number;
  rating: number;
  longBio: string;
}

export interface PrivateCircle {
  id: string;
  name: string;
  description: string;
  mentorId: string;
  mentorName: string;
  membersCount: number;
  limit: number;
  dayAndTime: string;
  topics: string[];
  accentColor: string;
}

export interface GrowthTrack {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  durationWeeks: number;
  participantsCount: number;
  weeks: {
    week: number;
    title: string;
    description: string;
    objective: string;
    journalPrompt: string;
    tasks: string[];
  }[];
}

export interface UserProfile {
  name: string;
  age: number;
  location: string;
  lifeSituations: string[];
  culturalBackground: string;
  faith: string;
  communicationPreference: string;
  joinedAt: string;
}

export interface DirectMessage {
  id: string;
  sender: 'user' | 'mentor';
  text: string;
  timestamp: string;
}

export interface FinancialMetric {
  year: number;
  registeredUsers: number;
  paidSubscribers: number;
  b2bClients: number;
  b2cRevenue: number;
  b2bRevenue: number;
  grantRevenue: number;
  totalRevenue: number;
  operatingCosts: number;
  netPosition: number;
}

export interface RiskItem {
  id: string;
  category: string;
  risk: string;
  likelihood: 'Low' | 'Medium' | 'High';
  impact: 'Low' | 'Medium' | 'High';
  mitigation: string;
}

export interface MilestoneItem {
  id: string;
  timeline: string;
  title: string;
  description: string;
  completed: boolean;
}
