/**
 * content/dictionaries/get-dictionary.ts — locale → Dictionary (D-022).
 * The single entry point pages will use once they render localized copy
 * (Phase 1b+); today the barrel still exports the English consts
 * directly, so existing consumers are untouched.
 */

import type { Dictionary, Locale } from "./types";
import { enDictionary } from "./en";
import { esDictionary } from "./es";

export function getDictionary(locale: Locale): Dictionary {
  return locale === "es" ? esDictionary : enDictionary;
}
