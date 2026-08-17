/*
 * PROTOTYPE — #124. THROWAWAY. DO NOT MERGE TO A FEATURE BRANCH.
 *
 * The variant keys, in a module with NO `'use client'` directive so the server
 * page can normalise the search param and the client switcher can share the
 * type. (The first cut put `normaliseVariant` in the switcher and the page
 * blew up on the boundary.)
 */

export const PROTO_VARIANTS = ['A', 'B', 'C'] as const
export type ProtoVariant = (typeof PROTO_VARIANTS)[number]

export function normaliseVariant(raw: string | string[] | undefined): ProtoVariant {
  const value = Array.isArray(raw) ? raw[0] : raw
  return PROTO_VARIANTS.includes(value as ProtoVariant) ? (value as ProtoVariant) : 'A'
}
