import React from "react";
import { createRoot } from "react-dom/client";
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
      const showTechnicalDetails = import.meta.env.DEV && this.state.message;
      return (
        <div style={{ minHeight: "100vh", padding: "32px", background: "#fff", color: "#1f2328" }} role="alert">
          <h1 style={{ color: "#e2001a", fontSize: "40px", fontWeight: 900, margin: 0 }}>
            Die App konnte nicht vollständig geladen werden
          </h1>
          <p style={{ marginTop: "16px", fontSize: "18px", fontWeight: 700 }}>
            Beim Anzeigen der Oberfläche ist ein Fehler aufgetreten. Es wurde dadurch keine Meldung automatisch versendet.
          </p>
          {showTechnicalDetails && (
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
              <div style={{ marginBottom: "12px" }}>Technische Fehlermeldung nur im Entwicklungsmodus:</div>
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
            App neu laden
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
    '<div style="padding:32px;font-family:sans-serif;color:#1f2328"><h1 style="color:#e2001a">DB Peace AI</h1><p>Die Anwendung konnte nicht gestartet werden.</p></div>';
} else {
  createRoot(root).render(
    <React.StrictMode>
      <AppErrorBoundary>
        <App />
      </AppErrorBoundary>
    </React.StrictMode>,
  );
}

if ("serviceWorker" in navigator) {
  if (import.meta.env.PROD) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js").then((registration) => {
        console.info("DB Peace AI Service Worker registriert:", registration.scope);
      }).catch((error) => {
        console.warn("Service-Worker-Registrierung fehlgeschlagen:", error);
      });
    });
  } else {
    // Alte Produktionsregistrierungen dürfen die lokale Vite-Entwicklung nicht mit veralteten Dateien überlagern.
    void navigator.serviceWorker.getRegistrations()
      .then((registrations) => Promise.all(registrations.map((registration) => registration.unregister())))
      .catch(() => undefined);

    if ("caches" in window) {
      void caches.keys()
        .then((names) => Promise.all(names.filter((name) => name.startsWith("db-peace-ai-")).map((name) => caches.delete(name))))
        .catch(() => undefined);
    }
  }
}
