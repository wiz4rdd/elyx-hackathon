export interface HealthPillar {
  key: string;
  name: string;
  color: string;
}

export interface JourneyData {
  month: string;
  Autonomic_Health: number;
  Sleep: number;
  Nutrition: number;
  Structural_Health: number;
  Stress_Resilience: number;
}

export interface TeamMember {
  name: string;
  role: string;
  avatar: string;
}

export interface Message {
    id: number;
    sender: string;
    text: string;
    avatar: string;
    timestamp: string;
}
