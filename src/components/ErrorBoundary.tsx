'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
  onClose?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full text-center shadow-xl border-t-4 border-red-500">
            <h2 className="text-xl font-bold text-red-600 mb-2">Erreur inattendue</h2>
            <p className="text-sm text-slate-600 mb-6">
              L'interface a rencontré un problème d'affichage.
            </p>
            {this.props.onClose && (
              <button 
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  this.props.onClose!();
                }} 
                className="bg-slate-800 text-white font-bold py-2 px-6 rounded-xl w-full"
              >
                Fermer
              </button>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
