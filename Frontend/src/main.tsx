
import ReactDOM from "react-dom/client";

import App from "./App";

import "./index.css";
import "leaflet/dist/leaflet.css";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  

    <GoogleOAuthProvider
      clientId="1095350293264-4gibd471nh75gtc3tsevrji2so41aeie.apps.googleusercontent.com"
    >
      <App />

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#1a211d",
            color: "#ffffff",
            border: "1px solid #2d463b",
          },
        }}
      />

    </GoogleOAuthProvider>


);