export type SubscriptionPlan = 'free' | 'weekly' | 'yearly' | 'lifetime';

export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  imageUrl?: string;
  credits?: number;
  subscription?: SubscriptionPlan;
  subscriptionExpiresAt?: string;
  lastCreditRefreshAt?: string;
  created_at: string;
}

export interface UserProfile extends User {
  totalGenerations: number;
}

export interface UpdateProfileDto {
  name?: string;
  avatar?: string;
  imageUrl?: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
}
