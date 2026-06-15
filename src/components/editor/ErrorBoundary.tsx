import React, { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary] Editor crash:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // COMPONENTE: ErrorBoundary — fallback por defecto
      return (
        <div className="flex flex-col items-center justify-center h-full min-h-[200px] p-8 text-center">
          <i className="ri-error-warning-line text-4xl text-red-400 mb-4"></i>
          <h2 className="text-lg font-semibold text-[rgb(var(--color),0.85)] mb-2">
            Algo salió mal
          </h2>
          <p className="text-sm text-[rgb(var(--color),0.55)] mb-4 max-w-xs">
            El editor encontró un error inesperado. Recarga la página para
            continuar.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-md bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors"
          >
            Recargar página
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
