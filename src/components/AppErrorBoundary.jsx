import React from "react";

function homeUrl() {
  const base = typeof import.meta !== "undefined" ? import.meta.env?.BASE_URL || "/" : "/";
  try {
    return new URL(base, window.location.origin).href;
  } catch {
    return "/";
  }
}

export default class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { failed: false, message: "" };
  }

  static getDerivedStateFromError(error) {
    return {
      failed: true,
      message: error?.message ? String(error.message) : "",
    };
  }

  componentDidCatch(error) {
    /* One page must not take the whole app down permanently. */
    console.error("The Truth page error:", error);
  }

  openAppAgain = () => {
    // Reload of the same broken route just shows this screen again.
    // Always return to the app home so the user can keep working.
    window.location.assign(homeUrl());
  };

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div
        className="min-h-screen flex items-center justify-center p-6"
        style={{ background: "#faf6ef", color: "#2b2620" }}
      >
        <div className="max-w-md text-center">
          <h1 className="font-display text-3xl mb-3" style={{ color: "#2b2620" }}>
            The Truth is still here
          </h1>
          <p className="text-sm mb-4" style={{ color: "#5b5142" }}>
            Something on this page stopped. Your notes and stored texts are still on this device.
          </p>
          {this.state.message ? (
            <p className="text-xs mb-4 break-words" style={{ color: "#8a7f6f" }} role="status">
              {this.state.message}
            </p>
          ) : null}
          <button
            type="button"
            className="inline-flex items-center justify-center h-10 px-5 rounded-full text-sm font-medium"
            style={{ background: "#7a2e2e", color: "#f3e9c8" }}
            onClick={this.openAppAgain}
          >
            Open the app again
          </button>
        </div>
      </div>
    );
  }
}
