import React, { Component } from "react";

type Props = { children?: React.ReactNode };
type State = { hasError: boolean };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  render() {
    return this.props.children as React.ReactElement;
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("React error caught:", error, info);
    // Keep this minimal — app shows an alert for now
    // In future, we could render a fallback UI using state.hasError
    // eslint-disable-next-line no-alert
    alert("Errore React: " + (error?.message ?? String(error)));
  }
}
