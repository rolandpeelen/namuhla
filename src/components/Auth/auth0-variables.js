const genConfig = () => {
  const defaults = {
    domain: "namuhla.eu.auth0.com",
    clientId: "r2KFpw9TAx1bawPfa9YRHuFDHaZKSgWF",
    callbackUrl: "http://localhost:3000/callback",
    afterLogout: "http://localhost:3000",
    audience: "http://localhost:3000",
    scope: "openid profile email",
  };

  if (!process.env) return defaults;

  return {
    domain: process.env.REACT_APP_DOMAIN || defaults.domain,
    clientId: process.env.REACT_APP_CLIENT_ID || defaults.clientId,
    callbackUrl: process.env.REACT_APP_CALLBACK_URL || defaults.callbackUrl,
    afterLogout: process.env.REACT_APP_AFTER_LOGOUT || defaults.afterLogout,
    audience: process.env.REACT_APP_AUDIENCE || defaults.audience,
    scope: process.env.REACT_APP_SCOPE || defaults.scope,
  };
};

export const AUTH_CONFIG = genConfig();
