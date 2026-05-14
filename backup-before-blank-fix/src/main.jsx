import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./styles.css";

class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error(error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-db-soft px-4 py-10 text-db-dark">
          <div className="mx-auto max-w-2xl rounded-lg border border-db-dark/10 bg-white p-6 shadow-panel">
            <p className="text-sm font-black uppercase tracking-wider text-db-red">DB Peace AI</p>
            <h1 className="mt-3 text-3xl font-black">Die Anwendung konnte nicht geladen werden.</h1>
            <p className="mt-3 font-semibold leading-7 text-db-rail">
              Bitte die Seite neu laden. Wenn der Fehler bleibt, liegt ein Laufzeitproblem in der lokalen Demo vor.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const root = document.getElementById("root");

createRoot(root).render(
  <React.StrictMode>
    <AppErrorBoundary>
      <App />
    </AppErrorBoundary>
  </React.StrictMode>
);
