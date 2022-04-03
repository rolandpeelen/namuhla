import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";

import { createBrowserHistory } from "history";
import Auth0ProviderWithHistory from "./components/Auth/auth0-provider-with-history";

import Root from "./components/Root";

export const history = createBrowserHistory();

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <Auth0ProviderWithHistory>
        <Root />
      </Auth0ProviderWithHistory>
    </Router>
  </React.StrictMode>
);
