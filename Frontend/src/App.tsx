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
import { Toaster } from "react-hot-toast";


const queryClient = new QueryClient();

function AppRoutes() {
  return (
    <Routes>
      <Route element={<IndexPage />} path="/" />
      <Route element={<Admin />} path="/admin" />
      <Route element={<Pools />} path="/pools" />
      <Route element={<Vault />} path="/vault" />
      <Route element={<ContactPage />} path="/contact" />
    </Routes>
  );
}

function App() {
  return (
    <WagmiProvider config={config}>
      <ThirdwebProvider>
        <QueryClientProvider client={queryClient}>
          <AppRoutes />
          <Toaster
            position="top-center"
            reverseOrder={false}
            gutter={8}
            containerClassName=""
            containerStyle={{}}
            toasterId="default"
            toastOptions={{
              // Define default options
              className: '',
              duration: 5000,
              removeDelay: 1000,
              style: {
                background: '#363636',
                color: '#fff',
              },

              // Default options for specific types
              success: {
                duration: 3000,
                iconTheme: {
                  primary: "green",
                  secondary: "black",
                },
              },
            }}
          />

        </QueryClientProvider>
      </ThirdwebProvider>
    </WagmiProvider>
  );
}

export default App;
