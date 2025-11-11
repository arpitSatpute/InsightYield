import { useEffect } from "react";
import { useTheme } from "@heroui/use-theme";

export default function ThemeSync() {
  const themeHook = useTheme();
  const theme =
    Array.isArray(themeHook) && typeof themeHook[0] === "string"
      ? themeHook[0]
      : (themeHook as any).theme ?? themeHook ?? "light";

  useEffect(() => {
    if (theme === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    try { localStorage.setItem("theme", theme); } catch {}
  }, [theme]);

  return null;
}