import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { errorOccurred: false };
  }

  static getDerivedStateFromError() {
    return { errorOccurred: true };
  }

  componentDidCatch(error, errorDetails) {
    console.error('Component Error:', error, 'Error Details:', errorDetails);
  }

  renderContent() {
    return this.state.errorOccurred ? (
      <div className="error-fallback">
        <h1>An unexpected error occurred</h1>
        <p>Please try refreshing the page or contact support.</p>
      </div>
    ) : (
      this.props.children
    );
  }

  render() {
    return this.renderContent();
  }
}

export default ErrorBoundary;