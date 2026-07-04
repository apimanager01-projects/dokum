/**
 * Ambient declaration for the bundled MathJax tex-svg component (PRD #28,
 * slice 3 — #31).
 *
 * `mathjax@3.2.2` ships the exact es5 build the standalone editor loaded from
 * the CDN. The component is a side-effect-only script: it reads the config
 * object stored in `window.MathJax` and replaces it with the MathJax API.
 * There are no module exports, hence the shorthand declaration; the typed
 * access happens in mathjax-loader.ts.
 */
declare module 'mathjax/es5/tex-svg.js'
