/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Project {
  id: string;
  title: string;
  category: 'Residential' | 'Commercial';
  description: string;
  image: string;
  beforeImage?: string; // Optional before image for before/after comparison
  location: string;
  scope: string;
  materials: string[];
}

export interface ConsultationType {
  id: string;
  name: string;
  price: number;
  duration: string;
  description: string;
  features: string[];
  highlight?: boolean;
}

export interface AppointmentBooking {
  id: string;
  consultationId: string;
  date: string;
  timeSlot: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  spaceType: 'Residential' | 'Commercial';
  projectNotes: string;
  status: 'pending' | 'paid' | 'completed';
  paidAmount: number;
}

export interface Testimonial {
  id: string;
  author: string;
  role: string;
  project: string;
  quote: string;
  rating: number;
}

export interface DesignQuizQuestion {
  id: number;
  question: string;
  options: {
    id: string;
    text: string;
    image: string;
    style: string; // 'Aesthetic Minimalist', 'Modern Classic', 'Warm Contemporary', 'Biophilic Luxe'
  }[];
}
