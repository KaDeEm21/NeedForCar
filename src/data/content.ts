import aventadorHero from '../../assets/Aventador.png';
import chatgptImage004235 from '../../assets/ChatGPT Image 3 kwi 2026, 00_42_35.png';
import chatgptImage004636 from '../../assets/ChatGPT Image 3 kwi 2026, 00_46_36.png';
import chatgptImage004829 from '../../assets/ChatGPT Image 3 kwi 2026, 00_48_29.png';
import chatgptImage005458 from '../../assets/ChatGPT Image 3 kwi 2026, 00_54_58.png';
import type { Benefit, BookingRecord, BookingStep, Car, FaqItem, ProtectionPlan } from '../types';

export const navLinks = [
  { href: '#hero', label: 'Home' },
  { href: '#booking-module', label: 'Booking' },
  { href: '#faq', label: 'FAQ' }
];

export const heroArtwork = {
  title: 'Main hero background',
  imageSrc: aventadorHero,
  imagePrompt:
    'Cinematic high-performance sports car parked on a wet city street at night, front three-quarter view, teal and magenta neon reflections, luxury rental campaign, ultra realistic, dramatic haze, glossy black road, premium editorial lighting, no text, no logos, wide composition',
  imageLabel: 'AI hero background placeholder'
};

export const fleet: Car[] = [
  {
    id: 'aventador-sv',
    name: 'Aventador SV',
    category: 'Super Sport',
    pricePerDay: 899,
    accent: 'magenta',
    tagline: 'Superveloce Performance Tier',
    description: 'Carbon-heavy theatre with brutal acceleration and a night-run silhouette.',
    imageSrc: chatgptImage004235,
    imagePrompt:
      'Silver luxury sports coupe parked in a dim city alley at dusk, premium car rental editorial shot, realistic reflections, moody cyan-magenta accents, wide crop, no people, no text',
    imageLabel: 'Silver luxury sports coupe mockup',
    imageStyle: 'silver-coupe',
    performance: { acceleration: '2.8s', horsepower: '740 HP', topSpeed: '350 km/h' }
  },
  {
    id: 'urus-performante',
    name: 'Urus Performante',
    category: 'Performance SUV',
    pricePerDay: 540,
    accent: 'cyan',
    tagline: 'Street Command Package',
    description: 'Four-door aggression for airport runs, city transfers and fast exits.',
    imageSrc: chatgptImage004829,
    imagePrompt:
      'Black high-end performance SUV on an urban street at night, headlights on, cinematic reflections, premium automotive campaign, realistic, no people, no text',
    imageLabel: 'Black performance SUV mockup',
    imageStyle: 'night-suv',
    performance: { acceleration: '3.3s', horsepower: '657 HP', topSpeed: '306 km/h' }
  },
  {
    id: 's-class-maybach',
    name: 'S-Class Maybach',
    category: 'Luxury Sedan',
    pricePerDay: 399,
    accent: 'cyan',
    tagline: 'Executive Comfort Spec',
    description: 'Low-drama luxury with a silent cabin and premium chauffeur-grade presence.',
    imageSrc: chatgptImage004636,
    imagePrompt:
      'Dark charcoal luxury sedan photographed in a refined night city setting, understated premium mood, realistic reflections, editorial automotive ad, no people, no text',
    imageLabel: 'Dark charcoal luxury sedan mockup',
    imageStyle: 'dark-sedan',
    performance: { acceleration: '4.5s', horsepower: '496 HP', topSpeed: '250 km/h' }
  }
];

export const styleReferences = [
  { id: 'hero-background', label: 'Hero background', imageSrc: chatgptImage004235 },
  { id: 'night-coupe-01', label: 'Night coupe 01', imageSrc: chatgptImage004235 },
  { id: 'night-coupe-02', label: 'Night coupe 02', imageSrc: chatgptImage004235 },
  { id: 'day-coupe', label: 'Day coupe', imageSrc: chatgptImage004636 },
  { id: 'night-coupe-03', label: 'Night coupe 03', imageSrc: chatgptImage004829 },
  { id: 'beach-coupe', label: 'Beach coupe', imageSrc: chatgptImage005458 }
];

export const benefits: Benefit[] = [
  {
    id: 'pricing',
    title: 'Transparent Pricing',
    description: 'No hidden fees, all-inclusive rates and full insurance visibility before checkout.',
    accent: 'cyan'
  },
  {
    id: 'fleet',
    title: 'Premium Fleet',
    description: 'A tightly curated set of recent high-spec vehicles maintained for reliable handovers.',
    accent: 'magenta'
  },
  {
    id: 'reservation',
    title: 'Fast Reservation',
    description: 'A search-first booking flow designed to move from idea to confirmation in minutes.',
    accent: 'cyan'
  }
];

export const bookingSteps: BookingStep[] = [
  {
    id: 'step-1',
    step: '01',
    title: 'Select Your Ride',
    description: 'Browse our curated collection of high-performance machines and luxury cruisers.',
    accent: 'cyan'
  },
  {
    id: 'step-2',
    step: '02',
    title: 'Verify Your Details',
    description: 'Submit your contact details and driving credentials in a controlled digital flow.',
    accent: 'magenta'
  },
  {
    id: 'step-3',
    step: '03',
    title: 'Drive The Night',
    description: 'Receive confirmation, pickup details and premium support for the full reservation window.',
    accent: 'cyan'
  }
];

export const faq: FaqItem[] = [
  {
    id: 'insurance',
    question: 'Insurance',
    answer: 'All rentals include comprehensive collision damage waiver and third-party liability insurance.'
  },
  {
    id: 'deposit',
    question: 'Security Deposit',
    answer: 'Held on credit card at pickup. Amount varies by car class from $1,500 to $5,000.'
  },
  {
    id: 'cancellation',
    question: 'Cancellation',
    answer: 'Free up to 48 hours before booking. Late cancellations incur a 20% processing fee.'
  }
];

export const protectionPlans: ProtectionPlan[] = [
  {
    id: 'standard',
    name: 'Standard',
    description: 'Basic coverage including collision damage waiver and third-party liability.',
    priceLabel: 'Included',
    coverageLabel: 'Coverage'
  },
  {
    id: 'full-velocity',
    name: 'Full Velocity',
    description: 'Zero deductible, tire and glass protection, plus concierge roadside assistance.',
    priceLabel: '+$149 / day',
    coverageLabel: 'Coverage',
    recommended: true
  }
];

export const recentBookings: BookingRecord[] = [
  {
    id: 'booking-1',
    vehicle: 'Lamborghini Huracan',
    status: 'Completed',
    duration: 'Jun 18 — Jun 19, 2023',
    total: '$1,900.00'
  },
  {
    id: 'booking-2',
    vehicle: 'McLaren 720S',
    status: 'Priority Member',
    duration: 'Oct 24 — Oct 27, 2024',
    total: '$3,058.26'
  }
];
