export const AplicationApiPrefix = "/api/v1";
export const ApplicationApiPrefixRoutesNotFound = `*`;

// Routes privates
export const PrivateRoutes = {
  USER: {
    BASE: "/user",
    PROFILE: "/profile",
    USE_CASES: {
      CREATE: "/",
      UPDATE: "/:id",
      DELETE: "/:id",
      GET_BY_ID: "/:id",
      GET_BY_EMAIL: "/:id",
      LIST: "/list",
    },
  },
};

// Routes publics
export const PublicRoutes = {
  AUTH: {
    BASE: "/auth",
    LOGIN: "/login",
    REGISTER: "/register",
    CHANGE_PASSWORD: "/change-password",
    RESET_PASSWORD: "/reset-password",
    VERIFY_EMAIL: "/verify-email",
  },
};
