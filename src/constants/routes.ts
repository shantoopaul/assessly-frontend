export const ROUTES = {
  home: "/",
  about: "/about-us",
  contact: "/contact-us",
  login: "/login",
  register: "/register",

  candidate: "/candidate",
  reviewer: "/reviewer",
  admin: "/admin",

  paymentSuccess: "/payment/success",
  paymentCancel: "/payment/cancel",
} as const;

export const ROLE_HOME: Record<"CANDIDATE" | "REVIEWER" | "ADMIN", string> = {
  CANDIDATE: ROUTES.candidate,
  REVIEWER: ROUTES.reviewer,
  ADMIN: ROUTES.admin,
};
