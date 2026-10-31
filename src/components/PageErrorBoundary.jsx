import React from "react";
import { Link } from "react-router-dom";

/** Catches a single route crash so the header and other pages stay usable. */
export default class PageErrorBoundary extends React.Component {
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
    console.error("The Truth page error:", error);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.failed) {
      this.setState({ failed: false, message: "" });
    }
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div className="rounded-2xl border border-[#e8ddc7] bg-white/80 p-8 text-center">
        <h1 className="font-display text-3xl text-[#2b2620] mb-3">The Truth is still here</h1>
        <p className="text-sm text-[#5b5142] mb-4">
          Something on this page stopped. Your notes and stored texts are still on this device.
        </p>
        {this.state.message ? (
          <p className="text-xs text-[#8a7f6f] mb-4 break-words" role="status">
            {this.state.message}
          </p>
        ) : null}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center justify-center h-10 px-5 rounded-full text-sm font-medium bg-[#7a2e2e] text-[#f3e9c8]"
            onClick={() => this.setState({ failed: false, message: "" })}
          >
            Open the app again
          </Link>
          <button
            type="button"
            className="inline-flex items-center justify-center h-10 px-5 rounded-full text-sm border border-[#e8ddc7] bg-white text-[#2b2620]"
            onClick={() => this.setState({ failed: false, message: "" })}
          >
            Try this page again
          </button>
        </div>
      </div>
    );
  }
}
