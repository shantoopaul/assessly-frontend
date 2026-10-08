import apiClient from "@/lib/apiClient";
import type { CheckoutSessionResponse, PaymentResponse } from "@/types/payment";

export const paymentsApi = {
  createCheckoutSession: (attemptId: string) =>
    apiClient<CheckoutSessionResponse>(
      `/payments/attempts/${attemptId}/checkout`,
      { method: "POST" },
    ),

  getByAttempt: (attemptId: string) =>
    apiClient<PaymentResponse>(`/payments/attempts/${attemptId}`, {
      method: "GET",
    }),

  getById: (paymentId: string) =>
    apiClient<PaymentResponse>(`/payments/${paymentId}`, {
      method: "GET",
    }),
};
