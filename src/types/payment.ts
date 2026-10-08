export type PaymentStatus =
  | "PENDING"
  | "REQUIRES_ACTION"
  | "SUCCEEDED"
  | "FAILED"
  | "CANCELLED";

export type Payment = {
  id: string;
  attemptId: string;
  userId: string;
  stripePaymentIntentId: string | null;
  stripeCheckoutSessionId: string | null;
  amountCents: number;
  currency: string;
  status: PaymentStatus;
  failureReason: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CheckoutSession = {
  paymentId: string;
  sessionId: string;
  checkoutUrl: string;
};

export type CheckoutSessionResponse = {
  success: true;
  message: string;
  data: CheckoutSession;
};

export type PaymentResponse = {
  success: true;
  message: string;
  data: Payment;
};
