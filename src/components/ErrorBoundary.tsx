import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

/**
 * Catches render errors anywhere below it and shows a calm recovery screen
 * instead of a blank white page.
 *
 * Must be a class component ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â React only exposes error boundaries as classes.
 * The buttons are plain <a> tags on purpose: if the router itself failed,
 * router <Link>s would not work here.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Keep the details in the browser console for debugging.
    // Nothing is sent anywhere ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â there is no error-reporting service yet.
    console.error('StudyX crashed while rendering:', error, info.componentStack)
  }

  private handleReload = () => {
    this.setState({ hasError: false })
    window.location.reload()
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div className="flex min-h-dvh flex-col items-center justify-center bg-ink px-5 py-16 text-center">
        <span className="mb-6 grid size-14 place-items-center rounded-2xl border border-sky/30 bg-sky-wash text-sky">
          <AlertTriangle className="size-6" aria-hidden="true" />
        </span>

        <h1 className="font-display text-2xl font-semibold tracking-tight text-paper sm:text-3xl">
          Something went wrong
        </h1>
        <p className="mt-3 max-w-md text-sm leading-6 text-paper-dim">
          This page ran into an unexpected problem. Reloading usually fixes it ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â your saved items are
          kept in your browser.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={this.handleReload}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-control bg-sky px-5 text-sm font-semibold text-ink transition-colors hover:bg-sky-bright focus-visible:outline-2 focus-visible:outline-sky focus-visible:outline-offset-2"
          >
            <RefreshCw className="size-4" aria-hidden="true" />
            Reload the page
          </button>
          <a
            href="/"
            className="inline-flex h-11 items-center justify-center rounded-control border border-white/12 bg-white/6 px-5 text-sm text-paper transition-colors hover:border-white/20 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-sky focus-visible:outline-offset-2"
          >
            Back to home
          </a>
        </div>
      </div>
    )
  }
}
