export type Accent = 'cyan' | 'magenta';

export interface Car {
  id: string;
  name: string;
  category: string;
  pricePerDay: number;
  accent: Accent;
  tagline: string;
  description: string;
  imageSrc: string;
  imagePrompt: string;
  imageLabel: string;
  imageStyle: string;
  performance: {
    acceleration: string;
    horsepower: string;
    topSpeed: string;
  };
}

export interface Benefit {
  id: string;
  title: string;
  description: string;
  accent: Accent;
}

export interface BookingStep {
  id: string;
  step: string;
  title: string;
  description: string;
  accent: Accent;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface ProtectionPlan {
  id: string;
  name: string;
  description: string;
  priceLabel: string;
  coverageLabel: string;
  recommended?: boolean;
}

export interface BookingRecord {
  id: string;
  vehicle: string;
  status: string;
  duration: string;
  total: string;
}

export interface InquiryPayload {
  fullName: string;
  email: string;
  phone: string;
  pickupLocation: string;
  pickupDate: string;
  returnDate: string;
  carId: string;
  planId: string;
}
