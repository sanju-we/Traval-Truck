'use client';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { ReactNode } from 'react';

const stripePromise = loadStripe('pk_test_51SSFBh7BVQx8CIYqvrmt1rLhPoEkIrVJKmiFalYcDsUpN68mquaizfaPp8SwNK3egSYiSbOVx6uWGI78zC8EjzZ400GawmuS63');

export default function StripeProvider({ children }: { children: ReactNode }) {
  return <Elements stripe={stripePromise}>{children}</Elements>;
}
