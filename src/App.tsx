import { useEffect, useState } from 'react';
import { benefits, bookingSteps, faq as fallbackFaq, fleet as fallbackFleet, heroArtwork, navLinks, protectionPlans } from './data/content';
import { fetchFaq, fetchFleet, submitInquiry } from './lib/api';
import { useModal } from './hooks/useModal';
import type { Car, FaqItem, InquiryPayload } from './types';

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

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
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

function TopNav({ onOpenModal }: { onOpenModal: (modalId: string) => void }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <nav className="nav-shell" aria-label="Main navigation">
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
            <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>
              {link.label}
            </a>
          ))}
        </div>

        <div className="nav-actions">
          <button type="button" className="ghost-button" onClick={() => onOpenModal('sign-in')}>
            Sign In
          </button>
          <button type="button" className="primary-button small" onClick={() => onOpenModal('sign-up')}>
            Sign Up
          </button>
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
        <img className="hero-background-image" src={heroArtwork.imageSrc} alt="" />
        <div className="hero-overlay" />
        <div className="hero-radial hero-radial-top" />
        <div className="hero-radial hero-radial-bottom" />
      </div>

      <div className="hero-shell">
        <div className="hero-copy">
          <h1>
            <span>Take The</span>
            <strong>Night</strong>
          </h1>
          <p className="hero-text">
            Premium car rental for the urban elite. Transparent pricing. Fast booking. Experience the midnight velocity in
            its purest form.
          </p>

          <div className="booking-module" id="booking-module">
            <div className="field-group full">
              <label htmlFor="pickupLocation">Pick-up Location</label>
              <input
                id="pickupLocation"
                name="pickupLocation"
                value={form.pickupLocation}
                onChange={(event) => onFieldChange('pickupLocation', event.target.value)}
              />
            </div>

            <div className="field-group">
              <label htmlFor="pickupDate">Pick-up Date</label>
              <input
                id="pickupDate"
                type="date"
                name="pickupDate"
                value={form.pickupDate}
                onChange={(event) => onFieldChange('pickupDate', event.target.value)}
              />
            </div>

            <div className="field-group">
              <label htmlFor="returnDate">Return Date</label>
              <input
                id="returnDate"
                type="date"
                name="returnDate"
                value={form.returnDate}
                onChange={(event) => onFieldChange('returnDate', event.target.value)}
              />
            </div>

            <div className="field-group full">
              <label htmlFor="carId">Car Class</label>
              <select id="carId" name="carId" value={form.carId} onChange={(event) => onFieldChange('carId', event.target.value)}>
                {cars.map((car) => (
                  <option key={car.id} value={car.id}>
                    {car.name}
                  </option>
                ))}
              </select>
            </div>

            <button type="button" className="primary-button wide" onClick={onPrimaryAction}>
              Book Now
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}

function FleetSection({ cars, onPrimaryAction }: { cars: Car[]; onPrimaryAction: () => void }) {
  return (
    <section className="section-shell" id="fleet">
      <div className="section-heading split fleet-heading">
        <div className="heading-block">
          <p className="eyebrow">Garage</p>
          <h2>The Lineup</h2>
        </div>
        <div className="heading-line" aria-hidden="true" />
        <div className="carousel-actions" aria-hidden="true">
          <button type="button" className="icon-button icon-button-muted">
            ←
          </button>
          <button type="button" className="icon-button icon-button-active">
            →
          </button>
        </div>
      </div>

      <div className="fleet-grid">
        {cars.map((car) => (
          <article key={car.id} className="fleet-card">
            <div className={`car-visual car-art-${car.imageStyle}`} aria-label={car.imageLabel}>
              <img className="car-reference-image" src={car.imageSrc} alt="" />
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
                  <dt>0-100km</dt>
                  <dd>{car.performance.acceleration}</dd>
                </div>
                <div className="stat-chip accent-magenta">
                  <dt>HP</dt>
                  <dd>{car.performance.horsepower}</dd>
                </div>
                <div className={`stat-chip accent-${car.accent}`}>
                  <dt>Top Spd</dt>
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
            <div className={`benefit-icon accent-${benefit.accent}`} aria-hidden="true" />
            <h3>{benefit.title}</h3>
            <p>{benefit.description}</p>
          </article>
        ))}
      </div>
    </section>
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
            <img className="booking-reference-image" src={selectedCar.imageSrc} alt="" />
            <div className="booking-stage-overlay" />
            <div>
              <h2>{selectedCar.name}</h2>
              <p>{selectedCar.tagline}</p>
            </div>
          </div>

          <dl className="stats-grid booking-stage-stats">
            <div className="stat-chip accent-magenta">
              <dt>Acceleration</dt>
              <dd>{selectedCar.performance.acceleration}</dd>
            </div>
            <div className="stat-chip accent-magenta">
              <dt>Horsepower</dt>
              <dd>{selectedCar.performance.horsepower}</dd>
            </div>
            <div className="stat-chip accent-magenta">
              <dt>Top Speed</dt>
              <dd>{selectedCar.performance.topSpeed}</dd>
            </div>
          </dl>
        </section>

        <section className="booking-form-block">
          <div className="lined-heading">
            <span />
            <h3>Driver Details</h3>
            <span />
          </div>

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
              <span>Vehicle</span>
              <select value={form.carId} onChange={(event) => onFieldChange('carId', event.target.value)}>
                {cars.map((car) => (
                  <option key={car.id} value={car.id}>
                    {car.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </section>

        <section className="booking-form-block">
          <div className="lined-heading">
            <span />
            <h3>Protection Plans</h3>
            <span />
          </div>

          <div className="plan-grid">
            {protectionPlans.map((plan) => {
              const checked = form.planId === plan.id;

              return (
                <button type="button" key={plan.id} className={`plan-card ${checked ? 'is-active' : ''}`} onClick={() => onPlanChange(plan.id)}>
                  <div className="plan-card-header">
                    <strong>{plan.name}</strong>
                    {plan.recommended ? <span className="plan-badge">Recommended</span> : null}
                  </div>
                  <p>{plan.description}</p>
                  <div className="plan-card-footer">
                    <span>{plan.coverageLabel}</span>
                    <strong>{plan.priceLabel}</strong>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <section className="booking-form-block">
          <div className="lined-heading">
            <span />
            <h3>Payment Method</h3>
            <span />
          </div>

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
              <strong>{form.pickupDate}</strong>
            </div>
            <div>
              <span>End Date</span>
              <strong>{form.returnDate}</strong>
            </div>
          </div>

          <div className="summary-lines">
            <div>
              <span>
                Daily Rate ({formatCurrency(selectedCar.pricePerDay)} × {days})
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
            <span>Total Price</span>
            <strong>{formatCurrency(total)}</strong>
          </div>

          <button type="button" className="primary-button wide" onClick={onSubmit} disabled={submitState.loading}>
            {submitState.loading ? 'Submitting...' : 'Confirm Book'}
          </button>

          {submitState.message ? <p className="form-feedback success">{submitState.message}</p> : null}
          {submitState.error ? <p className="form-feedback error">{submitState.error}</p> : null}

          <div className="sidebar-benefits">
            <div className="sidebar-pill">Verified Fleet</div>
            <div className="sidebar-pill">24/7 Support</div>
          </div>
        </div>
      </aside>
    </div>
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
          <p className="eyebrow">FAQ</p>
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

function Modal({
  modalId,
  activeModal,
  title,
  description,
  closeModal,
  children
}: {
  modalId: string;
  activeModal: string | null;
  title: string;
  description: string;
  closeModal: () => void;
  children: React.ReactNode;
}) {
  if (activeModal !== modalId) {
    return null;
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby={`${modalId}-title`}>
      <div className="modal-card">
        <button type="button" className="modal-close" onClick={closeModal} aria-label="Close modal">
          ×
        </button>
        <p className="eyebrow">{description}</p>
        <h2 id={`${modalId}-title`}>{title}</h2>
        {children}
      </div>
    </div>
  );
}

export default function App() {
  const { activeModal, openModal, closeModal } = useModal();
  const [cars, setCars] = useState<Car[]>(fallbackFleet);
  const [faqItems, setFaqItems] = useState<FaqItem[]>(fallbackFaq);
  const [form, setForm] = useState<InquiryFormState>(initialForm);
  const [submitState, setSubmitState] = useState<{ loading: boolean; message: string | null; error: string | null }>({
    loading: false,
    message: null,
    error: null
  });

  useEffect(() => {
    void fetchFleet().then(setCars).catch(() => setCars(fallbackFleet));
    void fetchFaq().then(setFaqItems).catch(() => setFaqItems(fallbackFaq));
  }, []);

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
      <TopNav onOpenModal={openModal} />
      <main>
        <HeroSection
          cars={cars}
          form={form}
          onFieldChange={handleFieldChange}
          onPrimaryAction={() => openModal('booking')}
        />
        <FleetSection cars={cars} onPrimaryAction={() => openModal('booking')} />
        <BenefitsSection />
        <BookingStepsSection />
        <FaqSection faqItems={faqItems} />
      </main>
      <SiteFooter />

      <Modal modalId="sign-in" activeModal={activeModal} title="Member Sign In" description="Secure Access" closeModal={closeModal}>
        <div className="modal-form">
          <label className="field-group">
            <span>Email Address</span>
            <input type="email" placeholder="driver@needforcar.com" />
          </label>
          <label className="field-group">
            <span>Password</span>
            <input type="password" placeholder="••••••••" />
          </label>
          <button type="button" className="primary-button wide" onClick={closeModal}>
            Enter Garage
          </button>
        </div>
      </Modal>

      <Modal modalId="sign-up" activeModal={activeModal} title="Create Account" description="Priority Access" closeModal={closeModal}>
        <div className="modal-form two-column">
          <label className="field-group">
            <span>Full Name</span>
            <input placeholder="Johnathan Doe" />
          </label>
          <label className="field-group">
            <span>Email Address</span>
            <input type="email" placeholder="johnathan@needforcar.com" />
          </label>
          <label className="field-group">
            <span>Phone</span>
            <input placeholder="+1 (555) 000-0000" />
          </label>
          <label className="field-group">
            <span>Password</span>
            <input type="password" placeholder="••••••••" />
          </label>
          <button type="button" className="primary-button wide full" onClick={closeModal}>
            Start Membership
          </button>
        </div>
      </Modal>

      <Modal modalId="booking" activeModal={activeModal} title="Booking Flow" description="Single-Page Flow" closeModal={closeModal}>
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
