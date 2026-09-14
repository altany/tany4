import { useEffect, useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "theme";
const DARK_QUERY = "(prefers-color-scheme: dark)";

// Notified when the stored theme changes in this tab
const listeners = new Set();
// Holds the choice for this page load when localStorage is unavailable
let unsavedTheme = null;

function getSystemTheme() {
  return window.matchMedia(DARK_QUERY).matches ? "dark" : "light";
}

function getStoredTheme() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === "dark" || stored === "light" ? stored : null;
  } catch (e) {
    return null;
  }
}

// A stored choice wins; otherwise follow the system setting
function getTheme() {
  return getStoredTheme() || unsavedTheme || getSystemTheme();
}

// The server can't know the theme, so the toggle renders a placeholder until hydration
function getServerTheme() {
  return null;
}

function subscribe(callback) {
  const mq = window.matchMedia(DARK_QUERY);
  mq.addEventListener("change", callback);
  listeners.add(callback);
  return () => {
    mq.removeEventListener("change", callback);
    listeners.delete(callback);
  };
}

export default function useTheme() {
  const theme = useSyncExternalStore(subscribe, getTheme, getServerTheme);

  useEffect(() => {
    if (theme) document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const setTheme = useCallback((newTheme) => {
    try {
      localStorage.setItem(STORAGE_KEY, newTheme);
    } catch (e) {
      console.warn("Failed to save theme to localStorage:", e);
      unsavedTheme = newTheme;
    }
    listeners.forEach((listener) => listener());
  }, []);

  const toggle = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  return { theme, toggle };
}
