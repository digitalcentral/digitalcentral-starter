// Subscription types
export type BillingPeriod = "monthly" | "yearly";
export const billingPeriods = ["monthly", "yearly"] as const;

export type SubscriptionStatus = "active" | "inactive" | "trial" | "cancelled" | "expired";
export const subscriptionStatuses = ["active", "inactive", "trial", "cancelled", "expired"] as const;

// Payment types
export type PaymentStatus = "waiting" | "confirming" | "confirmed" | "sending" | "partially_paid" | "finished" | "failed" | "refunded" | "expired";

export const paymentStatuses = ["waiting", "confirming", "confirmed", "sending", "partially_paid", "finished", "failed", "refunded", "expired"] as const;
