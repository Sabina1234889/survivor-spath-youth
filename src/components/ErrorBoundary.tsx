import React, { ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  declare props: Props;

  state: State = {
    hasError: false,
    error: null,
  };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  handleClearAndReload = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {
      console.error('Failed to clear storage:', e);
    }
    // Clean reload to origin without repeating search params or loop triggers
    window.location.href = window.location.origin + window.location.pathname;
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6 text-center font-sans">
          <div className="max-w-md w-full bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-xl space-y-4">
            <div className="w-12 h-12 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
              !
            </div>
            <h1 className="text-xl font-bold">Something went wrong</h1>
            <p className="text-slate-300 text-sm">
              An unexpected error occurred while loading Survivor's Path Youth.
            </p>
            {this.state.error && (
              <pre className="text-xs bg-slate-900/80 p-3 rounded-lg text-red-300 text-left overflow-auto max-h-32 border border-slate-700">
                {this.state.error?.message || this.state.error?.toString() || 'Unknown error'}
              </pre>
            )}
            <button
              onClick={this.handleClearAndReload}
              className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-sm transition-colors cursor-pointer"
            >
              Clear Cache & Reload
            </button>
          </div>
        </div>
      );
    }

    return this.props?.children || null;
  }
}
