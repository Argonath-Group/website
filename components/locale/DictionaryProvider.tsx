"use client";

import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import type { Dictionary } from "@/content/site";

/**
 * components/locale/DictionaryProvider.tsx — client provider for the
 * active dictionary (D-021).
 *
 * WHY A CLIENT COMPONENT: the App Router does not allow SERVER
 * components to render React context providers (context is a
 * client-only API — rendering `<SomeContext.Provider>` from a server
 * component throws "Element type is invalid"). The standard pattern is
 * therefore a thin CLIENT provider that receives the dictionary (a
 * prop, resolved by the server layout from the locale cookie) and
 * renders server-built children through — children are passed as the
 * `children` slot and never re-rendered client-side.
 *
 * The root layout resolves locale → dictionary and mounts this provider
 * around the page tree. Pages are intentionally NOT refactored to
 * consume this context — they keep importing copy from the
 * `@/content/site` barrel (English consts); the provider exists so
 * future CLIENT components can read locale-aware copy without
 * prop-drilling.
 */

export const DictionaryContext = createContext<Dictionary | null>(null);

export function DictionaryProvider({
  dictionary,
  children,
}: {
  dictionary: Dictionary;
  children: ReactNode;
}) {
  return (
    <DictionaryContext.Provider value={dictionary}>
      {children}
    </DictionaryContext.Provider>
  );
}

/**
 * useDictionary — the hook future client components use to read the
 * active locale's copy at runtime. Throws if used outside the provider
 * so misuse fails loudly at development time.
 */
export function useDictionary(): Dictionary {
  const dictionary = useContext(DictionaryContext);
  if (!dictionary) {
    throw new Error("useDictionary must be used within <DictionaryProvider>");
  }
  return dictionary;
}
