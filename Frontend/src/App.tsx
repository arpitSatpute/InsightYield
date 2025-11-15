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
            <AppRoutes />
        </QueryClientProvider>
      </ThirdwebProvider>
    </WagmiProvider>
  );
}

