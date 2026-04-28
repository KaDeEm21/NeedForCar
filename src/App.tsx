import { useEffect, useRef, useState } from 'react';
import astonMartinDbsImage from '../assets/Aston Martin DBS.webp';
import bmwM4Image from '../assets/BMW M4.webp';
import bmwM6CompetitionImage from '../assets/BMW M6 Competition.webp';
import bmwX5mImage from '../assets/BMW X5M.webp';
import ferrariSf90Image from '../assets/Ferrari SF90.webp';
import lamborghiniAventadorImage from '../assets/Lamborghini Aventador.webp';
import maybachLineupImage from '../assets/Maybach.webp';
import nissanGtrImage from '../assets/Nissan GT-R.webp';
import porscheGt2Image from '../assets/Porshe GT2.webp';
import porscheGt3RsImage from '../assets/Porshe GT3 RS.webp';
import { benefits, bookingSteps, faq as fallbackFaq, fleet as fallbackFleet, heroArtwork, navLinks, protectionPlans } from './data/content';
import { useModal } from './hooks/useModal';
import { fetchFaq, fetchFleet, fetchRecentBookings, submitInquiry } from './lib/api';
import type { BookingRecord, Car, FaqItem, InquiryPayload } from './types';

interface InquiryFormState {
  fullName: string;
  email: string;
  phone: string;
  pickupLocation: string;
  pickupDate: string;
  returnDate: string;
  carId: string;
  planId: string;
}

interface MemberSession {
  name: string;
  email: string;
  password: string;
  tier: string;
  memberSince: string;
  initials: string;
}

const initialForm: InquiryFormState = {
  fullName: '',
  email: '',
  phone: '',
  pickupLocation: 'Downtown Manhattan',
  pickupDate: '2026-04-08',
  returnDate: '2026-04-11',
  carId: fallbackFleet[0].id,
  planId: protectionPlans[1].id
};

const mockMembers: MemberSession[] = [
  {
    name: 'Admin Driver',
    email: 'admin@gmail.com',
    password: 'admin123',
    tier: 'Priority Member',
    memberSince: 'Since 2024',
    initials: 'AD'
  }
];

const fallbackRecentBookings: BookingRecord[] = [
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
  },
  {
    id: 'booking-3',
    vehicle: 'Ferrari SF90',
    status: 'Upcoming',
    duration: 'Apr 18 — Apr 21, 2026',
    total: '$4,920.00'
  }
];

const lineupShowcaseCars: Car[] = [
  {
    id: 'lineup-aston-martin-dbs',
    name: 'Aston Martin DBS',
    category: 'Grand Tourer',
    pricePerDay: 690,
    accent: 'magenta',
    tagline: 'V12 Midnight Spec',
    description: 'Long-bonnet British GT with elegant proportions, heavy torque and a more refined high-speed character.',
    imageSrc: astonMartinDbsImage,
    imagePrompt: 'Local asset showcase for Aston Martin DBS.',
    imageLabel: 'Aston Martin DBS',
    imageStyle: 'dark-sedan',
    performance: { acceleration: '3.4s', horsepower: '715 HP', topSpeed: '340 km/h' }
  },
  {
    id: 'lineup-bmw-m4',
    name: 'BMW M4',
    category: 'Performance Coupe',
    pricePerDay: 540,
    accent: 'cyan',
    tagline: 'Street Precision Pack',
    description: 'Front-engine coupe with aggressive bodywork, precise chassis balance and enough punch for fast city exits.',
    imageSrc: bmwM4Image,
    imagePrompt: 'Local asset showcase for BMW M4.',
    imageLabel: 'BMW M4',
    imageStyle: 'silver-coupe',
    performance: { acceleration: '3.8s', horsepower: '503 HP', topSpeed: '290 km/h' }
  },
  {
    id: 'lineup-bmw-m6-competition',
    name: 'BMW M6 Competition',
    category: 'Executive GT',
    pricePerDay: 610,
    accent: 'magenta',
    tagline: 'Autobahn Business Class',
    description: 'Big-bodied BMW grand tourer with long-range comfort, twin-turbo shove and a more mature luxury feel.',
    imageSrc: bmwM6CompetitionImage,
    imagePrompt: 'Local asset showcase for BMW M6 Competition.',
    imageLabel: 'BMW M6 Competition',
    imageStyle: 'dark-sedan',
    performance: { acceleration: '4.1s', horsepower: '600 HP', topSpeed: '305 km/h' }
  },
  {
    id: 'lineup-bmw-x5m',
    name: 'BMW X5M',
    category: 'Performance SUV',
    pricePerDay: 610,
    accent: 'cyan',
    tagline: 'Command SUV Package',
    description: 'High-output M SUV with launch-ready grip, wide stance and daily usability wrapped in an aggressive shell.',
    imageSrc: bmwX5mImage,
    imagePrompt: 'Local asset showcase for BMW X5M.',
    imageLabel: 'BMW X5M',
    imageStyle: 'night-suv',
    performance: { acceleration: '3.8s', horsepower: '617 HP', topSpeed: '290 km/h' }
  },
  {
    id: 'lineup-ferrari-sf90',
    name: 'Ferrari SF90',
    category: 'Hybrid Supercar',
    pricePerDay: 980,
    accent: 'magenta',
    tagline: 'Electrified Velocity Tier',
    description: 'Plug-in Ferrari flagship with brutal response, sharp aero and proper poster-car energy after dark.',
    imageSrc: ferrariSf90Image,
    imagePrompt: 'Local asset showcase for Ferrari SF90.',
    imageLabel: 'Ferrari SF90',
    imageStyle: 'silver-coupe',
    performance: { acceleration: '2.5s', horsepower: '986 HP', topSpeed: '340 km/h' }
  },
  {
    id: 'lineup-lamborghini-aventador',
    name: 'Lamborghini Aventador',
    category: 'V12 Supercar',
    pricePerDay: 899,
    accent: 'magenta',
    tagline: 'Theatre Mode Active',
    description: 'Naturally aspirated V12 icon with wild presence, scissor-door drama and a louder, more theatrical persona.',
    imageSrc: lamborghiniAventadorImage,
    imagePrompt: 'Local asset showcase for Lamborghini Aventador.',
    imageLabel: 'Lamborghini Aventador',
    imageStyle: 'silver-coupe',
    performance: { acceleration: '2.8s', horsepower: '769 HP', topSpeed: '350 km/h' }
  },
  {
    id: 'lineup-maybach',
    name: 'Maybach',
    category: 'Ultra Luxury Sedan',
    pricePerDay: 499,
    accent: 'cyan',
    tagline: 'Chauffeur Quiet Spec',
    description: 'Low-drama luxury sedan with a calmer silhouette, premium rear-cabin comfort and effortless cruising pace.',
    imageSrc: maybachLineupImage,
    imagePrompt: 'Local asset showcase for Maybach.',
    imageLabel: 'Maybach',
    imageStyle: 'dark-sedan',
    performance: { acceleration: '4.7s', horsepower: '621 HP', topSpeed: '250 km/h' }
  },
  {
    id: 'lineup-nissan-gt-r',
    name: 'Nissan GT-R',
    category: 'AWD Icon',
    pricePerDay: 580,
    accent: 'cyan',
    tagline: 'Twin-Turbo Legend Spec',
    description: 'Japanese performance icon with huge tuning heritage, all-wheel-drive traction and relentless straight-line speed.',
    imageSrc: nissanGtrImage,
    imagePrompt: 'Local asset showcase for Nissan GT-R.',
    imageLabel: 'Nissan GT-R',
    imageStyle: 'dark-sedan',
    performance: { acceleration: '3.1s', horsepower: '565 HP', topSpeed: '315 km/h' }
  },
  {
    id: 'lineup-porshe-gt2',
    name: 'Porshe GT2',
    category: 'Turbo Track Coupe',
    pricePerDay: 860,
    accent: 'magenta',
    tagline: 'Rear-Drive Attack Pack',
    description: 'Hard-edged turbo Porsche with serious speed, sharper aero and a more intimidating rear-drive attitude.',
    imageSrc: porscheGt2Image,
    imagePrompt: 'Local asset showcase for Porshe GT2.',
    imageLabel: 'Porshe GT2',
    imageStyle: 'silver-coupe',
    performance: { acceleration: '2.8s', horsepower: '700 HP', topSpeed: '340 km/h' }
  },
  {
    id: 'lineup-porshe-gt3-rs',
    name: 'Porshe GT3 RS',
    category: 'Track Weapon',
    pricePerDay: 790,
    accent: 'magenta',
    tagline: 'Circuit Attack Tier',
    description: 'Track-focused Porsche with huge aero, razor turn-in and a stripped-back setup aimed at lap-time obsession.',
    imageSrc: porscheGt3RsImage,
    imagePrompt: 'Local asset showcase for Porshe GT3 RS.',
    imageLabel: 'Porshe GT3 RS',
    imageStyle: 'silver-coupe',
    performance: { acceleration: '3.2s', horsepower: '518 HP', topSpeed: '296 km/h' }
  }
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value);
}

function formatDisplayDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
}

function calculateDays(startDate: string, endDate: string) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const milliseconds = end.getTime() - start.getTime();

  if (Number.isNaN(milliseconds) || milliseconds <= 0) {
    return 1;
  }

  return Math.ceil(milliseconds / (1000 * 60 * 60 * 24));
}

function LinedHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="lined-heading">
      <span aria-hidden="true" />
      <h3>{children}</h3>
      <span aria-hidden="true" />
    </div>
  );
}

function BenefitIcon({ benefitId, accent }: { benefitId: string; accent: 'cyan' | 'magenta' }) {
  const className = `benefit-icon accent-${accent}`;

  if (benefitId === 'pricing') {
    return (
      <div className={className} aria-hidden="true">
        <svg viewBox="0 0 48 48" className="benefit-icon-svg">
          <path d="M15 11h18l7 7v19H8V11h7Z" />
          <path d="M15 11v8h18v-8" />
          <path d="M18 26h12" />
          <path d="M18 31h8" />
        </svg>
      </div>
    );
  }

  if (benefitId === 'fleet') {
    return (
      <div className={className} aria-hidden="true">
        <svg viewBox="0 0 48 48" className="benefit-icon-svg">
          <path d="M12 29l3-9h18l5 9" />
          <path d="M10 29h28v6H10z" />
          <path d="M16 35v2" />
          <path d="M32 35v2" />
          <circle cx="17" cy="35" r="2.5" />
          <circle cx="31" cy="35" r="2.5" />
        </svg>
      </div>
    );
  }

  return (
    <div className={className} aria-hidden="true">
      <svg viewBox="0 0 48 48" className="benefit-icon-svg">
        <path d="M10 31c8-1 15-8 16-16 6 2 12 8 12 15 0 5-4 8-10 8H18c-5 0-8-3-8-7Z" />
        <path d="M24 11v8" />
        <path d="M29 14l-5 5" />
      </svg>
    </div>
  );
}

function TopNav({
  activeHref,
  activeModal,
  onNavClick,
  isSignedIn,
  memberInitials,
  onOpenModal,
  onHistoryClick
}: {
  activeHref: string;
  activeModal: string | null;
  onNavClick: (href: string, event: React.MouseEvent<HTMLAnchorElement>) => void;
  isSignedIn: boolean;
  memberInitials?: string;
  onOpenModal: (modalId: string) => void;
  onHistoryClick: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navIsOverlayed = activeModal === 'sign-in' || activeModal === 'account';

  return (
    <header className="site-header">
      <nav className={`nav-shell ${navIsOverlayed ? 'nav-shell-auth' : ''}`} aria-label="Main navigation">
        <a className="brand-mark" href="#hero">
          Need For Car
        </a>

        <button
          type="button"
          className="nav-toggle"
          aria-expanded={menuOpen}
          aria-controls="primary-nav"
          onClick={() => setMenuOpen((value) => !value)}
        >
          Menu
        </button>

        <div id="primary-nav" className={`nav-links ${menuOpen ? 'is-open' : ''}`}>
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={activeHref === link.href ? 'is-active' : ''}
              onClick={(event) => {
                onNavClick(link.href, event);
                setMenuOpen(false);
              }}
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="nav-actions">
          {isSignedIn ? (
            <>
              <button type="button" className="ghost-button" onClick={() => onOpenModal('account')} aria-label="Open account">
                {memberInitials ?? 'AC'}
              </button>
              <button type="button" className="primary-button small" onClick={onHistoryClick}>
                History
              </button>
            </>
          ) : (
            <>
              <button type="button" className="ghost-button" onClick={() => onOpenModal('sign-in')}>
                Sign In
              </button>
              <button type="button" className="primary-button small" onClick={() => onOpenModal('sign-up')}>
                Sign Up
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

function HeroSection({
  cars,
  form,
  onFieldChange,
  onPrimaryAction
}: {
  cars: Car[];
  form: InquiryFormState;
  onFieldChange: (field: keyof InquiryFormState, value: string) => void;
  onPrimaryAction: () => void;
}) {
  return (
    <section className="hero-section" id="hero">
      <div className="hero-backdrop" aria-hidden="true">
        <img className="hero-background-image" src={heroArtwork.imageSrc} alt="Luxury performance car on a wet city street at night." />
        <div className="hero-overlay" />
        <div className="hero-radial hero-radial-top" />
        <div className="hero-radial hero-radial-bottom" />
      </div>

      <div className="hero-shell">
        <div className="hero-copy">
          <div className="hero-copy-stack">
            <h1>
              <span>Take The</span>
              <strong>Night</strong>
            </h1>
            <p className="hero-text">
              Premium car rental for the urban elite. Transparent pricing. Fast booking. Experience the midnight velocity in
              its purest form.
            </p>
          </div>

          <div className="booking-module" id="booking-module">
            <label className="field-group full">
              <span>Pick-up Location</span>
              <input value={form.pickupLocation} onChange={(event) => onFieldChange('pickupLocation', event.target.value)} />
            </label>
            <label className="field-group">
              <span>Pick-up Date</span>
              <input type="date" value={form.pickupDate} onChange={(event) => onFieldChange('pickupDate', event.target.value)} />
            </label>
            <label className="field-group">
              <span>Return Date</span>
              <input type="date" value={form.returnDate} onChange={(event) => onFieldChange('returnDate', event.target.value)} />
            </label>
            <label className="field-group full">
              <span>Car Class</span>
              <select value={form.carId} onChange={(event) => onFieldChange('carId', event.target.value)}>
                {cars.map((car) => (
                  <option key={car.id} value={car.id}>
                    {car.name}
                  </option>
                ))}
              </select>
            </label>
            <button type="button" className="primary-button wide" onClick={onPrimaryAction}>
              Book Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function FleetSection({ cars: _cars, onPrimaryAction }: { cars: Car[]; onPrimaryAction: () => void }) {
  const [activePage, setActivePage] = useState(0);
  const cardsPerPage = 3;
  const totalPages = Math.ceil(lineupShowcaseCars.length / cardsPerPage);
  const pageStart = activePage * cardsPerPage;
  const currentCars = lineupShowcaseCars.slice(pageStart, pageStart + cardsPerPage);

  function handlePageChange(direction: 'prev' | 'next') {
    setActivePage((currentPage) => {
      if (direction === 'prev') {
        return (currentPage - 1 + totalPages) % totalPages;
      }

      return (currentPage + 1) % totalPages;
    });
  }

  return (
    <section className="section-shell fleet-shell" id="fleet">
      <div className="section-heading split fleet-heading">
        <div className="heading-block">
          <p className="eyebrow">Garage</p>
          <h2>The Lineup</h2>
        </div>
        <div className="heading-line" aria-hidden="true" />
        <div className="carousel-actions">
          <span className="carousel-page-indicator">
            {String(activePage + 1).padStart(2, '0')} / {String(totalPages).padStart(2, '0')}
          </span>
          <button type="button" className="icon-button icon-button-muted" aria-label="Previous lineup page" onClick={() => handlePageChange('prev')}>
            ←
          </button>
          <button type="button" className="icon-button icon-button-active" aria-label="Next lineup page" onClick={() => handlePageChange('next')}>
            →
          </button>
        </div>
      </div>

      <div className="fleet-grid" key={`lineup-page-${activePage}`}>
        {currentCars.map((car) => (
          <article key={car.id} className="fleet-card">
            <div className={`car-visual car-art-${car.imageStyle}`}>
              <img className="car-reference-image" src={car.imageSrc} alt={`${car.name} rental showcase.`} />
              <div className="vip-badge">{car.tagline}</div>
              <div className="car-photo-overlay" />
            </div>

            <div className="fleet-card-body">
              <div className="fleet-card-header">
                <div>
                  <h3>{car.name}</h3>
                  <p>{car.category}</p>
                </div>
                <div className="price-stack">
                  <strong>{formatCurrency(car.pricePerDay)}</strong>
                  <span>/ day</span>
                </div>
              </div>

              <p className="fleet-description">{car.description}</p>

              <dl className="stats-grid">
                <div className={`stat-chip accent-${car.accent}`}>
                  <dt>0-100 KM</dt>
                  <dd>{car.performance.acceleration}</dd>
                </div>
                <div className="stat-chip accent-magenta">
                  <dt>HP</dt>
                  <dd>{car.performance.horsepower.replace(/\s*HP$/i, '')}</dd>
                </div>
                <div className={`stat-chip accent-${car.accent}`}>
                  <dt>V-MAX</dt>
                  <dd>{car.performance.topSpeed}</dd>
                </div>
              </dl>

              <button type="button" className="secondary-button wide" onClick={onPrimaryAction}>
                Book Now
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function BenefitsSection() {
  return (
    <section className="section-shell contrast" id="benefits">
      <div className="section-heading centered">
        <p className="eyebrow">Excellence</p>
        <h2>Drive Without Limits</h2>
      </div>

      <div className="benefits-grid">
        {benefits.map((benefit) => (
          <article key={benefit.id} className="benefit-card">
            <BenefitIcon benefitId={benefit.id} accent={benefit.accent} />
            <h3>{benefit.title}</h3>
            <p>{benefit.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function BookingStepsSection() {
  return (
    <section className="section-shell booking-steps-shell" id="booking-steps">
      <div className="section-heading">
        <h2>Fast Lane Access</h2>
      </div>

      <div className="steps-watermark" aria-hidden="true">
        01 02 03
      </div>

      <div className="steps-grid">
        {bookingSteps.map((item) => (
          <article key={item.id} className={`step-card accent-${item.accent}`}>
            <span>{item.step}</span>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function FaqSection({ faqItems }: { faqItems: FaqItem[] }) {
  return (
    <section className="faq-shell" id="faq">
      <div className="faq-panel">
        <div className="section-heading centered compact">
          <h2>FAQ</h2>
        </div>

        <div className="faq-list">
          {faqItems.map((item) => (
            <article key={item.id} className="faq-item">
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer className="site-footer">
      <a className="brand-mark footer-brand" href="#hero">
        Need For Car
      </a>
      <div className="footer-links">
        <a href="#fleet">Fleet</a>
        <a href="#faq">FAQ</a>
        <a href="#booking-module">Contact</a>
      </div>
      <p>© 2026. All rights reserved.</p>
    </footer>
  );
}

function BookingOverlay({
  cars,
  form,
  submitState,
  onFieldChange,
  onPlanChange,
  onSubmit
}: {
  cars: Car[];
  form: InquiryFormState;
  submitState: { loading: boolean; message: string | null; error: string | null };
  onFieldChange: (field: keyof InquiryFormState, value: string) => void;
  onPlanChange: (planId: string) => void;
  onSubmit: () => void;
}) {
  const selectedCar = cars.find((car) => car.id === form.carId) ?? fallbackFleet[0];
  const selectedPlan = protectionPlans.find((plan) => plan.id === form.planId) ?? protectionPlans[0];
  const days = calculateDays(form.pickupDate, form.returnDate);
  const insuranceFee = 146;
  const protectionPlanCost = selectedPlan.id === 'full-velocity' ? 149 * days : 0;
  const subtotal = selectedCar.pricePerDay * days;
  const total = subtotal + insuranceFee + protectionPlanCost;

  return (
    <div className="booking-layout">
      <div className="booking-main">
        <section className="booking-stage">
          <div className={`booking-stage-visual car-art-${selectedCar.imageStyle}`}>
            <img className="booking-reference-image" src={selectedCar.imageSrc} alt={`${selectedCar.name} booking reference image.`} />
            <div className="booking-stage-overlay" />
            <div className="booking-stage-copy">
              <h2>{selectedCar.name}</h2>
              <p>{selectedCar.tagline}</p>
            </div>
          </div>

          <dl className="stats-grid booking-stage-stats">
            <div className="stat-chip accent-cyan">
              <dt>Acceleration</dt>
              <dd>{selectedCar.performance.acceleration}</dd>
            </div>
            <div className="stat-chip accent-magenta">
              <dt>Horsepower</dt>
              <dd>{selectedCar.performance.horsepower}</dd>
            </div>
            <div className="stat-chip accent-cyan">
              <dt>Top Speed</dt>
              <dd>{selectedCar.performance.topSpeed}</dd>
            </div>
          </dl>
        </section>

        <section className="booking-form-block">
          <LinedHeading>Driver Details</LinedHeading>

          <div className="booking-form-grid">
            <label className="field-group">
              <span>Full Name</span>
              <input value={form.fullName} onChange={(event) => onFieldChange('fullName', event.target.value)} />
            </label>
            <label className="field-group">
              <span>Email Address</span>
              <input type="email" value={form.email} onChange={(event) => onFieldChange('email', event.target.value)} />
            </label>
            <label className="field-group">
              <span>Phone Number</span>
              <input value={form.phone} onChange={(event) => onFieldChange('phone', event.target.value)} />
            </label>
            <label className="field-group">
              <span>Driver License</span>
              <input placeholder="DL-992039-X" />
            </label>
          </div>
        </section>

        <section className="booking-form-block">
          <LinedHeading>Protection Plans</LinedHeading>

          <div className="plan-grid">
            {protectionPlans.map((plan) => {
              const checked = form.planId === plan.id;

              return (
                <button type="button" key={plan.id} className={`plan-card ${checked ? 'is-active' : ''}`} onClick={() => onPlanChange(plan.id)}>
                  <div className="plan-card-header">
                    <strong>{plan.name.toUpperCase()}</strong>
                    <span className={`plan-selector ${checked ? 'is-active' : ''}`} aria-hidden="true" />
                  </div>
                  <p>{plan.description}</p>
                  <div className="plan-card-footer">
                    <span>{plan.coverageLabel}</span>
                    <strong>{plan.priceLabel}</strong>
                  </div>
                  {plan.recommended ? <span className="plan-badge">Recommended</span> : null}
                </button>
              );
            })}
          </div>
        </section>

        <section className="booking-form-block">
          <LinedHeading>Payment Method</LinedHeading>

          <div className="payment-panel">
            <div className="booking-form-grid payment-grid">
              <label className="field-group full">
                <span>Card Number</span>
                <input placeholder="•••• •••• •••• ••••" />
              </label>
              <label className="field-group">
                <span>Expiry Date</span>
                <input placeholder="MM/YY" />
              </label>
              <label className="field-group">
                <span>CVV</span>
                <input placeholder="•••" />
              </label>
            </div>
          </div>
        </section>
      </div>

      <aside className="booking-sidebar">
        <div className="summary-card">
          <h3>Book Summary</h3>

          <div className="summary-route">
            <div>
              <span>Pickup</span>
              <strong>{form.pickupLocation}</strong>
            </div>
            <div>
              <span>Return</span>
              <strong>{form.pickupLocation}</strong>
            </div>
          </div>

          <div className="summary-dates">
            <div>
              <span>Start Date</span>
              <strong>{formatDisplayDate(form.pickupDate)}</strong>
              <small>10:00 AM</small>
            </div>
            <div>
              <span>End Date</span>
              <strong>{formatDisplayDate(form.returnDate)}</strong>
              <small>10:00 AM</small>
            </div>
          </div>

          <div className="summary-lines">
            <div>
              <span>
                Daily Rate ({formatCurrency(selectedCar.pricePerDay)} x {days})
              </span>
              <strong>{formatCurrency(subtotal)}</strong>
            </div>
            <div>
              <span>Insurance & Fees</span>
              <strong>{formatCurrency(insuranceFee)}</strong>
            </div>
            <div>
              <span>{selectedPlan.name}</span>
              <strong>{protectionPlanCost ? formatCurrency(protectionPlanCost) : 'Included'}</strong>
            </div>
          </div>

          <div className="summary-total">
            <div>
              <span>Total Price</span>
              <small>Refundable deposit not included</small>
            </div>
            <strong>{formatCurrency(total)}</strong>
          </div>

          <button type="button" className="primary-button wide" onClick={onSubmit} disabled={submitState.loading}>
            {submitState.loading ? 'Submitting...' : 'Confirm Book'}
          </button>

          {submitState.message ? <p className="form-feedback success">{submitState.message}</p> : null}
          {submitState.error ? <p className="form-feedback error">{submitState.error}</p> : null}

          <p className="summary-secure">Secure Encrypted Checkout</p>

          <div className="sidebar-benefits">
            <div className="sidebar-pill">Verified Fleet</div>
            <div className="sidebar-pill">24/7 Support</div>
          </div>
        </div>
      </aside>
    </div>
  );
}

function SignInModalContent({
  authForm,
  authError,
  onFieldChange,
  onSubmit
}: {
  authForm: { email: string; password: string };
  authError: string | null;
  onFieldChange: (field: 'email' | 'password', value: string) => void;
  onSubmit: () => void;
}) {
  return (
    <div className="auth-layout">
      <div className="auth-visual">
        <div className="auth-kicker">MEMBER ACCESS</div>
        <div className="auth-display">
          <span>WELCOME</span>
          <strong>BACK</strong>
          <span>DRIVER</span>
        </div>
        <p className="auth-copy">Ignite your journey with precision engineering and pick up where your last reservation left off.</p>
        <div className="auth-proof">
          <div className="auth-proof-avatars" aria-hidden="true">
            <span className="auth-avatar auth-avatar-one">JS</span>
            <span className="auth-avatar auth-avatar-two">AM</span>
            <span className="auth-avatar auth-avatar-three">RK</span>
          </div>
          <p>Trusted by members who rent premium performance cars across the city.</p>
        </div>
      </div>

      <div className="auth-panel">
        <p className="eyebrow">Secure Access</p>
        <h2>Welcome Back</h2>
        <p className="auth-panel-copy">Enter your account details to continue your midnight booking flow.</p>

        <div className="modal-form auth-form auth-form-signin">
          <label className="field-group">
            <span>Email Address</span>
            <input type="email" placeholder="admin@gmail.com" value={authForm.email} onChange={(event) => onFieldChange('email', event.target.value)} />
          </label>
          <label className="field-group">
            <span>Password</span>
            <input type="password" placeholder="admin123" value={authForm.password} onChange={(event) => onFieldChange('password', event.target.value)} />
          </label>
          <button type="button" className="primary-button wide" onClick={onSubmit}>
            Enter Garage
          </button>
          {authError ? <p className="form-feedback error auth-feedback">{authError}</p> : null}
        </div>
      </div>
    </div>
  );
}

function SignUpModalContent() {
  return (
    <div className="auth-layout">
      <div className="auth-visual">
        <div className="auth-kicker">PRIORITY ACCESS</div>
        <div className="auth-display">
          <span>JOIN THE</span>
          <strong>VELOCITY</strong>
          <span>CIRCLE</span>
        </div>
        <p className="auth-copy">Create your account to unlock priority availability, faster checkout and curated member-only bookings.</p>
        <div className="auth-proof">
          <div className="auth-proof-avatars" aria-hidden="true">
            <span className="auth-avatar auth-avatar-one">JS</span>
            <span className="auth-avatar auth-avatar-two">AM</span>
            <span className="auth-avatar auth-avatar-three">RK</span>
          </div>
          <p>Trusted by members who rent premium performance cars across the city.</p>
        </div>
      </div>

      <div className="auth-panel">
        <p className="eyebrow">Priority Access</p>
        <h2>Create Account</h2>
        <p className="auth-panel-copy">Create your digital cockpit to start booking.</p>

        <div className="modal-form auth-form auth-form-signup">
          <label className="field-group">
            <span>Full Name</span>
            <input placeholder="John Wick" />
          </label>
          <label className="field-group">
            <span>Email Address</span>
            <input type="email" placeholder="velocity@needforcar.com" />
          </label>
          <div className="auth-password-row">
            <label className="field-group">
              <span>Password</span>
              <input type="password" placeholder="••••••••" />
            </label>
            <label className="field-group">
              <span>Confirm</span>
              <input type="password" placeholder="••••••••" />
            </label>
          </div>
          <label className="auth-agreement">
            <input type="checkbox" />
            <span>I agree to the Terms of Service and Privacy Policy.</span>
          </label>
          <button type="button" className="primary-button wide">
            Start Membership
          </button>
        </div>
      </div>
    </div>
  );
}

function AccountHistoryContent({
  member: _member,
  bookings,
  onSignOut
}: {
  member: MemberSession;
  bookings: BookingRecord[];
  onSignOut: () => void;
}) {
  const bookingHistoryItems = [
    {
      booking: bookings[2] ?? fallbackRecentBookings[2],
      imageSrc: porscheGt3RsImage,
      vehicleLabel: 'Porsche 911 GT3',
      statusLabel: 'Completed',
      durationLabel: 'Oct 12 — Oct 15, 2023',
      daysLabel: '3 Days Total',
      totalLabel: '$2,450.00'
    },
    {
      booking: bookings[1] ?? fallbackRecentBookings[1],
      imageSrc: bmwM4Image,
      vehicleLabel: 'Audi R8 Coupe',
      statusLabel: 'Completed',
      durationLabel: 'Aug 05 — Aug 07, 2023',
      daysLabel: '2 Days Total',
      totalLabel: '$1,180.00'
    },
    {
      booking: bookings[0] ?? fallbackRecentBookings[0],
      imageSrc: lamborghiniAventadorImage,
      vehicleLabel: 'Lamborghini Huracan',
      statusLabel: 'Completed',
      durationLabel: 'Jun 18 — Jun 19, 2023',
      daysLabel: '1 Day Total',
      totalLabel: '$1,900.00'
    }
  ];

  return (
    <div className="history-layout">
      <div className="history-header">
        <div>
          <h2>
            Booking <span>History</span>
          </h2>
          <p>Review your past high-performance journeys and manage your receipts.</p>
        </div>
        <button type="button" className="ghost-button" onClick={onSignOut}>
          Logout
        </button>
      </div>

      <div className="history-list">
        {bookingHistoryItems.map((item) => (
          <article key={item.booking.id} className="history-item-card">
            <div className="history-item-image">
              <img className="car-reference-image" src={item.imageSrc} alt={`${item.vehicleLabel} history entry.`} />
            </div>

            <div className="history-item-details">
              <div className="history-item-column">
                <span>Vehicle</span>
                <strong>{item.vehicleLabel}</strong>
                <p>{item.statusLabel}</p>
              </div>

              <div className="history-item-column">
                <span>Duration</span>
                <strong>{item.durationLabel}</strong>
                <p>{item.daysLabel}</p>
              </div>

              <div className="history-item-column">
                <span>Investment</span>
                <strong>{item.totalLabel}</strong>
              </div>
            </div>

            <div className="history-item-actions">
              <button type="button" className="history-receipt-button">
                Receipt
              </button>
              <button type="button" className="history-book-again-button">
                <span>Book</span>
                <span>Again</span>
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function Modal({
  modalId,
  activeModal,
  title,
  closeModal,
  children,
  size = 'default'
}: {
  modalId: string;
  activeModal: string | null;
  title: string;
  closeModal: () => void;
  children: React.ReactNode;
  size?: 'default' | 'auth' | 'booking';
}) {
  if (activeModal !== modalId) {
    return null;
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby={`${modalId}-title`}>
      <div className={`modal-card modal-card-${size}`}>
        <button type="button" className="modal-close" onClick={closeModal} aria-label="Close modal">
          ×
        </button>
        <h2 className="sr-only" id={`${modalId}-title`}>
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
}

export default function App() {
  const { activeModal, openModal, closeModal } = useModal();
  const [cars, setCars] = useState<Car[]>(fallbackFleet);
  const [faqItems, setFaqItems] = useState<FaqItem[]>(fallbackFaq);
  const [recentBookings, setRecentBookings] = useState<BookingRecord[]>(fallbackRecentBookings);
  const [form, setForm] = useState<InquiryFormState>(initialForm);
  const [memberSession, setMemberSession] = useState<MemberSession | null>(null);
  const [authForm, setAuthForm] = useState({ email: '', password: '' });
  const [authError, setAuthError] = useState<string | null>(null);
  const [activeHref, setActiveHref] = useState(navLinks[0].href);
  const pendingNavHrefRef = useRef<string | null>(null);
  const navLockUntilRef = useRef(0);
  const [submitState, setSubmitState] = useState<{ loading: boolean; message: string | null; error: string | null }>({
    loading: false,
    message: null,
    error: null
  });

  useEffect(() => {
    void fetchFleet().then(setCars).catch(() => setCars(fallbackFleet));
    void fetchFaq().then(setFaqItems).catch(() => setFaqItems(fallbackFaq));
    void fetchRecentBookings().then(setRecentBookings).catch(() => setRecentBookings(fallbackRecentBookings));
  }, []);

  useEffect(() => {
    const navTargets = navLinks
      .map((link) => {
        const target = document.querySelector<HTMLElement>(link.href);

        if (!target) {
          return null;
        }

        return {
          href: link.href,
          target
        };
      })
      .filter((entry): entry is { href: string; target: HTMLElement } => entry !== null);

    if (navTargets.length !== navLinks.length) {
      return;
    }

    const updateActiveSection = () => {
      const scrollTop = window.scrollY;
      const viewportBottom = scrollTop + window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const activationOffset = 160;
      const pendingHref = pendingNavHrefRef.current;

      if (pendingHref && Date.now() < navLockUntilRef.current) {
        setActiveHref(pendingHref);
        return;
      }

      if (pendingHref) {
        pendingNavHrefRef.current = null;
      }

      if (viewportBottom >= documentHeight - 8) {
        setActiveHref(navTargets[navTargets.length - 1].href);
        return;
      }

      let nextActiveHref = navTargets[0].href;

      for (const navTarget of navTargets) {
        if (scrollTop + activationOffset >= navTarget.target.offsetTop) {
          nextActiveHref = navTarget.href;
        }
      }

      setActiveHref(nextActiveHref);
    };

    updateActiveSection();
    window.addEventListener('scroll', updateActiveSection, { passive: true });
    window.addEventListener('resize', updateActiveSection);

    return () => {
      window.removeEventListener('scroll', updateActiveSection);
      window.removeEventListener('resize', updateActiveSection);
    };
  }, []);

  function handleNavClick(href: string, event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();

    const target = document.querySelector<HTMLElement>(href);

    if (!target) {
      return;
    }

    const activationOffset = 160;
    const nextTop = Math.max(target.offsetTop - activationOffset, 0);

    pendingNavHrefRef.current = href;
    navLockUntilRef.current = Date.now() + 900;
    setActiveHref(href);
    window.history.pushState(null, '', href);
    window.scrollTo({
      top: nextTop,
      behavior: 'smooth'
    });
  }

  function handleAuthFieldChange(field: 'email' | 'password', value: string) {
    setAuthForm((current) => ({
      ...current,
      [field]: value
    }));
    setAuthError(null);
  }

  function handleSignIn() {
    const email = authForm.email.trim();
    const password = authForm.password.trim();

    if (!email || !password) {
      setAuthError('Enter the mock account email and password to open the account view.');
      return;
    }

    const session = mockMembers.find((entry) => entry.email.toLowerCase() === email.toLowerCase() && entry.password === password);

    if (!session) {
      setAuthError('Use the mock account: admin@gmail.com / admin123.');
      return;
    }

    setMemberSession(session);
    setAuthError(null);
    openModal('account');
  }

  function handleHistoryOpen() {
    if (memberSession) {
      openModal('account');
      return;
    }

    setAuthError('Sign in with a demo account first to unlock booking history.');
    openModal('sign-in');
  }

  function handleSignOut() {
    setMemberSession(null);
    setAuthForm({ email: '', password: '' });
    closeModal();
  }

  function handleFieldChange(field: keyof InquiryFormState, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value
    }));
  }

  async function handleSubmit() {
    const requiredFields: Array<keyof InquiryFormState> = [
      'fullName',
      'email',
      'phone',
      'pickupLocation',
      'pickupDate',
      'returnDate',
      'carId',
      'planId'
    ];

    const missingField = requiredFields.find((field) => form[field].trim().length === 0);

    if (missingField) {
      setSubmitState({
        loading: false,
        message: null,
        error: 'Complete all booking fields before confirming.'
      });
      return;
    }

    setSubmitState({ loading: true, message: null, error: null });

    try {
      const payload: InquiryPayload = { ...form };
      const result = await submitInquiry(payload);
      setSubmitState({
        loading: false,
        message: `${result.message} Reference: ${result.bookingReference}`,
        error: null
      });
    } catch (error) {
      setSubmitState({
        loading: false,
        message: null,
        error: error instanceof Error ? error.message : 'Unable to submit inquiry.'
      });
    }
  }

  return (
    <>
      <TopNav
        activeHref={activeHref}
        activeModal={activeModal}
        onNavClick={handleNavClick}
        isSignedIn={memberSession !== null}
        memberInitials={memberSession?.initials}
        onOpenModal={openModal}
        onHistoryClick={handleHistoryOpen}
      />
      <main>
        <HeroSection cars={cars} form={form} onFieldChange={handleFieldChange} onPrimaryAction={() => openModal('booking')} />
        <FleetSection cars={cars} onPrimaryAction={() => openModal('booking')} />
        <BenefitsSection />
        <BookingStepsSection />
        <FaqSection faqItems={faqItems} />
      </main>
      <SiteFooter />

      <Modal modalId="sign-in" activeModal={activeModal} title="Member Sign In" closeModal={closeModal} size="auth">
        <SignInModalContent authForm={authForm} authError={authError} onFieldChange={handleAuthFieldChange} onSubmit={handleSignIn} />
      </Modal>

      <Modal modalId="sign-up" activeModal={activeModal} title="Create Account" closeModal={closeModal} size="auth">
        <SignUpModalContent />
      </Modal>

      <Modal modalId="account" activeModal={activeModal} title="Member Account" closeModal={closeModal} size="auth">
        {memberSession ? (
          <AccountHistoryContent member={memberSession} bookings={recentBookings} onSignOut={handleSignOut} />
        ) : (
          <SignInModalContent authForm={authForm} authError={authError} onFieldChange={handleAuthFieldChange} onSubmit={handleSignIn} />
        )}
      </Modal>

      <Modal modalId="booking" activeModal={activeModal} title="Booking Flow" closeModal={closeModal} size="booking">
        <BookingOverlay
          cars={cars}
          form={form}
          submitState={submitState}
          onFieldChange={handleFieldChange}
          onPlanChange={(planId) => handleFieldChange('planId', planId)}
          onSubmit={handleSubmit}
        />
      </Modal>
    </>
  );
}
