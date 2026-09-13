import React from "react";

export default class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    /* Listen and other tools must not take the whole app down. */
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div className="truth-app min-h-screen flex items-center justify-center p-6 bg-[#faf6ef] text-[#2b2620]">
        <div className="max-w-md text-center">
          <h1 className="font-display text-3xl mb-3">The Truth is still here</h1>
          <p className="text-sm text-[#5b5142] mb-4">
            Something on this page stopped. Your notes and stored texts are still on this device.
          </p>
          <button type="button" className="truth-btn-sm h-9 px-4" onClick={() => window.location.reload()}>
            Open the app again
          </button>
        </div>
      </div>
    );
  }
}
