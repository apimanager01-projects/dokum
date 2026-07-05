/**
 * MathJax loader for the LaTeX editor (PRD #28, slice 3 — #31).
 *
 * Replaces the standalone editor's CDN <script> + `waitForMathJax` polling
 * (reference file latexEditor/…, lines 6–12 and 987–995) with a bundled
 * dynamic import of `mathjax@3.2.2` (pinned exactly): zero CDN request,
 * CSP-clean (the chunk is served from 'self' and the SVG output with
 * fontCache 'none' makes no follow-up requests).
 *
 * The imported component is tex-svg-FULL, not the reference's tex-svg (#40
 * parity fix): tex-svg contains only the autoload *mapping* for the color
 * macros — the CDN setup lazily fetched [tex]/color when \textcolor/\colorbox
 * was first used. Bundled + CSP-locked, that runtime fetch is impossible, so
 * with tex-svg the color macros stayed undefined and `noundefined` rendered
 * them as literal red text. tex-svg-full ships every TeX extension in the
 * chunk; the `packages` config below activates color at startup, no network.
 *
 * The config MUST be assigned to `window.MathJax` before the component
 * script evaluates — the dynamic import is that ordering guarantee. The
 * import() also gives the bundler a split point, so MathJax lands in an
 * async chunk reachable only from the editor page; user-facing bundles are
 * untouched.
 *
 * Browser-only module — must never be imported from server code.
 */

/** The slice of the MathJax v3 API the editor uses. */
export interface MathJaxApi {
  /** Renders TeX to an <mjx-container> with inline SVG. */
  tex2svgPromise(tex: string, options?: { display?: boolean }): Promise<HTMLElement>
  startup: { promise: Promise<unknown> }
}

/** Reference error text (L991): shown in the German error box on load failure. */
const LOAD_ERROR_MESSAGE = 'MathJax wurde nicht geladen.'

let loading: Promise<MathJaxApi> | null = null

function windowMathJax(): unknown {
  return (window as unknown as { MathJax?: unknown }).MathJax
}

function isMathJaxApi(value: unknown): value is MathJaxApi {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as MathJaxApi).tex2svgPromise === 'function'
  )
}

/**
 * Loads the bundled tex-svg component once and resolves with the MathJax API.
 * Safe to call repeatedly (singleton promise); render paths await this where
 * the standalone editor called `waitForMathJax()`.
 */
export function loadMathJax(): Promise<MathJaxApi> {
  if (!loading) {
    loading = (async () => {
      // Dev HMR / React StrictMode guard: if a previous module instance
      // already initialised MathJax, reuse it — re-assigning the config
      // object below would clobber the live API.
      const existing = windowMathJax()
      if (isMathJaxApi(existing)) return existing

      // 1:1 the standalone editor's config (reference L7–10) plus two
      // documented deviations:
      //   • startup.typeset: false — the reference page-typeset on load
      //     (a no-op there: the page had no math at load time); inside the
      //     admin app we never page-typeset, only tex2svgPromise.
      //   • tex.formatError: throw — by default MathJax renders TeX errors
      //     as an inline <merror> and RESOLVES the promise (verified against
      //     the standalone file). Throwing rejects tex2svgPromise so invalid
      //     LaTeX lands in the German .formula-error box instead, per the
      //     #31 acceptance criteria (deliberate deviation, approved).
      ;(window as unknown as { MathJax: unknown }).MathJax = {
        tex: {
          displayMath: [
            ['$$', '$$'],
            ['\\[', '\\]'],
          ],
          packages: { '[+]': ['color'] },
          formatError: (_jax: unknown, err: unknown) => {
            throw err
          },
        },
        svg: { fontCache: 'none' },
        startup: { typeset: false },
      }

      try {
        await import('mathjax/es5/tex-svg-full.js')
      } catch {
        throw new Error(LOAD_ERROR_MESSAGE)
      }

      const mathJax = windowMathJax()
      if (!isMathJaxApi(mathJax)) throw new Error(LOAD_ERROR_MESSAGE)
      await mathJax.startup.promise
      return mathJax
    })()
  }
  return loading
}
