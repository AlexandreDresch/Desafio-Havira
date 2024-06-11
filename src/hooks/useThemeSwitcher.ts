import { useEffect, useState } from "react";

export default function useThemeSwitcher() {
  const preferDarkQuery = "(prefers-color-scheme: dark)";
  const [mode, setMode] = useState<string>(() => {
    const userPref = window.localStorage.getItem("theme");
    if (userPref) {
      return userPref;
    }

    const mediaQuery = window.matchMedia(preferDarkQuery);
    return mediaQuery.matches ? "dark" : "light";
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia(preferDarkQuery);

    function handleChange() {
      const userPref = window.localStorage.getItem("theme");
      if (userPref) {
        const check = userPref === "dark" ? "dark" : "light";
        setMode(check);
        if (check === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      } else {
        const check = mediaQuery.matches ? "dark" : "light";
        setMode(check);
      }
    }

    mediaQuery.addEventListener("change", handleChange);

    handleChange();

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    if (mode === "dark") {
      window.localStorage.setItem("theme", "dark");
      document.documentElement.classList.add("dark");
    } else if (mode === "light") {
      window.localStorage.setItem("theme", "light");
      document.documentElement.classList.remove("dark");
    }
  }, [mode]);

  return [mode, setMode] as const;
}
