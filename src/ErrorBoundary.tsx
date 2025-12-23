import React from "react";

type Props = { children: React.ReactNode };
type State = { hasError: boolean };

export class ErrorBoundary extends React.Component<Props, State> {
    state: State = { hasError: false };

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("UI Crash:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex h-screen items-center justify-center bg-brand-50">
                    <div className="max-w-md w-full p-6 bg-white rounded shadow text-center">
                        <h1 className="text-2xl font-bold text-brand-700 mb-4">
                            Oops, something went wrong!
                        </h1>
                        <p className="text-gray-600 mb-6">
                            The application encountered an unexpected error.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-brand-600 text-white rounded hover:bg-brand-700"
                        >
                            Reload App
                        </button>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}
