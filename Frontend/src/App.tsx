import { Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/index";
import Pools from "@/pages/Pools";
import { WagmiProvider, useAccount } from "wagmi";
import { config } from "./config/config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Admin from "@/pages/Admin";
import Vault from "@/pages/Vault";
import { ThirdwebProvider } from "thirdweb/react";
import ContactPage from "./pages/contact";
import { Toaster } from "sonner";
import { ThemeProvider, useTheme } from "@/context/ThemeContext"; // ensure this matches your ThemeContext export
import ThemeSync from "./components/ThemeSync";
import About from "./pages/about";
import SystemFlow from "./aiWorkingFlow";
import DepositFlow from "./DepositFlow";


const queryClient = new QueryClient();

function AppRoutes() {
  return (
    <Routes>
      <Route element={<IndexPage />} path="/" />
      <Route element={<Admin />} path="/admin" />
      <Route element={<Pools />} path="/pools" />
      <Route element={<Vault />} path="/vault" />
      <Route element={<About />} path="/about" />
      <Route element={<SystemFlow />} path="/flow" />
      <Route element={<DepositFlow />} path="/depositFlow" />
      <Route element={<ContactPage />} path="/contact" />
    </Routes>
  );
}

export function App() {
  return (
    <WagmiProvider config={config}>
      <ThirdwebProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <ThemeSync />
            <AppRoutes />
            <ThemeAwareToaster />
          </ThemeProvider>
        </QueryClientProvider>
      </ThirdwebProvider>
    </WagmiProvider>
  );
}

function ThemeAwareToaster() {
  // make hook usage resilient: if useTheme throws (no provider) fall back to localStorage / prefers-color-scheme
  let theme = "light";
  try {
    const themeHook = useTheme();
    theme = Array.isArray(themeHook) ? themeHook[0] : themeHook?.theme ?? themeHook ?? "light";
  } catch (e) {
    try {
      const stored = typeof window !== "undefined" && localStorage.getItem("theme");
      if (stored) theme = stored;
      else if (typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) theme = "dark";
    } catch {}
  }
  return <Toaster position="bottom-right" theme={theme === "dark" ? "dark" : "light"} />;
}