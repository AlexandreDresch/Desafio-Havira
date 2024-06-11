import useThemeSwitcher from "@/hooks/useThemeSwitcher";

import logo from "../../assets/logo.jpeg";
import SunIcon from "/svgs/sunny-filled-loop-to-moon-filled-loop-transition.svg";
import MoonIcon from "/svgs/moon-filled-to-sunny-filled-loop-transition.svg";

import { Button } from "../ui/button";

export default function Header() {
  const [mode, setMode] = useThemeSwitcher();

  function toggleTheme() {
    setMode(mode === "dark" ? "light" : "dark");
  }

  return (
    <header className="flex w-full items-center justify-between p-3 px-6 shadow-md">
      <a href="/" className="flex items-center gap-1">
        <img src={logo} alt="Home" className="size-12 rounded-full" />

        <h1 className="text-xl font-medium md:text-2xl">Desafio Hávira</h1>
      </a>

      <Button
        onClick={toggleTheme}
        size="icon"
        className="flex items-center justify-center bg-transparent p-1 text-black hover:scale-105 dark:text-white"
      >
        {mode === "dark" ? (
          <img src={MoonIcon} alt="Light Mode" className="w-6" />
        ) : (
          <img src={SunIcon} alt="Dark Mode" className="w-6" />
        )}
      </Button>
    </header>
  );
}
