import React from "react";
import { useTheme } from "@heroui/use-theme";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const themeHook = useTheme();
  const theme = Array.isArray(themeHook) ? themeHook[0] : (themeHook as any).theme ?? "light";
  const setTheme = Array.isArray(themeHook) ? themeHook[1] : (themeHook as any).setTheme;


 return (
    <button onClick={() => setTheme?.(theme === "dark" ? "light" : "dark")}>
      {(theme === "dark") ? (<Sun className="size-5 text-dark-400 dark:text-dark-400" aria-hidden="true" />) 
      :
       (<Moon className="size-5 text-indigo-500" aria-hidden="true" />)}
    </button>
  );
}

