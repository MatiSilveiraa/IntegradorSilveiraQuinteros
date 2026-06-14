import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

import "./index.css";
import "leaflet/dist/leaflet.css";

import { GoogleOAuthProvider }
from "@react-oauth/google";

ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  <React.StrictMode>

    <GoogleOAuthProvider
      clientId="1095350293264-4gibd471nh75gtc3tsevrji2so41aeie.apps.googleusercontent.com"
    >
      <App />
    </GoogleOAuthProvider>

  </React.StrictMode>
);