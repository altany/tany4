import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "theme";

function getSystemTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function getStoredTheme() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === "dark" || stored === "light" ? stored : null;
  } catch (e) {
    console.warn("Failed to read theme from localStorage:", e);
    return null;
  }
}

export default function useTheme() {
  const [theme, setThemeState] = useState(null);

  useEffect(() => {
    const initialTheme = getStoredTheme() || getSystemTheme();
    setThemeState(initialTheme);
    document.documentElement.setAttribute("data-theme", initialTheme);

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e) => {
      if (!getStoredTheme()) {
        const next = e.matches ? "dark" : "light";
        setThemeState(next);
        document.documentElement.setAttribute("data-theme", next);
      }
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const setTheme = useCallback((newTheme) => {
    setThemeState(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    try {
      localStorage.setItem(STORAGE_KEY, newTheme);
    } catch (e) {
      console.warn("Failed to save theme to localStorage:", e);
    }
  }, []);

  const toggle = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  return { theme, toggle };
}
