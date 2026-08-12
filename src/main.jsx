import React from "react";
import { createRoot } from "react-dom/client";
import { MotionConfig } from "framer-motion";
import App from "./App.jsx";
import "./styles.css";

class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error("DB Peace AI render error:", error);
    this.setState({
      message: error instanceof Error ? error.message : String(error),
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: "100vh", padding: "32px", background: "#fff", color: "#1f2328" }}>
          <h1 style={{ color: "#e2001a", fontSize: "40px", fontWeight: 900, margin: 0 }}>
            Die App konnte nicht vollständig geladen werden
          </h1>
          <p style={{ marginTop: "16px", fontSize: "18px", fontWeight: 700 }}>
            React ist geladen, aber beim Rendern ist ein Fehler aufgetreten.
          </p>
          {this.state.message && (
            <div
              style={{
                marginTop: "16px",
                borderRadius: "12px",
                background: "#f5f5f3",
                padding: "16px",
                color: "#b91c1c",
                fontSize: "14px",
                fontWeight: 700,
                whiteSpace: "pre-wrap",
              }}
            >
              <div style={{ marginBottom: "12px" }}>Technische Fehlermeldung:</div>
              <div>{this.state.message}</div>
            </div>
          )}
          <button
            type="button"
            onClick={() => window.location.assign("/")}
            style={{
              marginTop: "24px",
              border: "0",
              borderRadius: "10px",
              background: "#e2001a",
              color: "#fff",
              fontSize: "14px",
              fontWeight: 900,
              padding: "12px 16px",
              cursor: "pointer",
            }}
          >
            Zur Übersicht zurück
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const root = document.getElementById("root");

if (!root) {
  document.body.innerHTML =
    '<div style="padding:32px;font-family:sans-serif;color:#1f2328"><h1 style="color:#e2001a">DB Peace AI</h1><p>Root-Element fehlt. Bitte index.html prüfen.</p></div>';
} else {
  // reducedMotion="user" respektiert die Systemeinstellung. Das CSS in styles.css
  // greift nur bei CSS-Animationen — Framer Motion animiert per JavaScript und
  // muss separat darauf hingewiesen werden.
  createRoot(root).render(
    <React.StrictMode>
      <AppErrorBoundary>
        <MotionConfig reducedMotion="user">
          <App />
        </MotionConfig>
      </AppErrorBoundary>
    </React.StrictMode>
  );
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then((registration) => {
      console.log('DB Peace AI ServiceWorker registered with scope:', registration.scope);
    }).catch((error) => {
      console.log('ServiceWorker registration failed:', error);
    });
  });
}
