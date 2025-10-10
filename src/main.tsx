import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

// Vite React App のエントリーポイント
// id="root" のDOMに対してReactをマウントする
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <div className="w-full h-full">
        <App />
      </div>
    </GoogleOAuthProvider>
  </StrictMode>
);
