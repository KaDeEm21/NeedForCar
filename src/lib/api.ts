import type { BookingRecord, Car, FaqItem, InquiryPayload } from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001';

async function readJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function fetchFleet(): Promise<Car[]> {
  return readJson<Car[]>('/api/fleet');
}

export async function fetchFaq(): Promise<FaqItem[]> {
  return readJson<FaqItem[]>('/api/faq');
}

export async function fetchRecentBookings(): Promise<BookingRecord[]> {
  return readJson<BookingRecord[]>('/api/recent-bookings');
}

export async function submitInquiry(payload: InquiryPayload): Promise<{ message: string; bookingReference: string }> {
  const response = await fetch(`${API_BASE}/api/inquiries`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const result = (await response.json()) as { message: string; bookingReference?: string };

  if (!response.ok || !result.bookingReference) {
    throw new Error(result.message || 'Unable to save booking inquiry.');
  }

  return { message: result.message, bookingReference: result.bookingReference };
}
