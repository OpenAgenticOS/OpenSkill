import { useState, useEffect, useCallback } from "react";
import type { Locale } from "../types";

function detectLocale(): Locale {
  const stored = localStorage.getItem("openskill-locale");
  if (stored === "zh" || stored === "en") return stored;
  const hash = location.hash.replace("#/", "");
  if (hash === "zh" || hash === "en") return hash;
  return navigator.language.startsWith("zh") ? "zh" : "en";
}

export function useLocale() {
  const [locale, setLocaleState] = useState<Locale>(detectLocale);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    localStorage.setItem("openskill-locale", l);
    location.hash = `#/${l}`;
  }, []);

  useEffect(() => {
    if (!location.hash) location.hash = `#/${locale}`;
  }, [locale]);

  useEffect(() => {
    const onHash = () => {
      const h = location.hash.replace("#/", "");
      if (h === "zh" || h === "en") setLocale(h);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [setLocale]);

  return { locale, setLocale };
}
