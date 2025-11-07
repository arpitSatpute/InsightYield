import { useHref, useNavigate, type NavigateOptions } from "react-router-dom";

import { HeroUIProvider } from "@heroui/react";
import { ThirdwebProvider } from "thirdweb/react";

declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NavigateOptions;
  }
}

export function Provider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  return (
    <HeroUIProvider navigate={navigate} useHref={useHref}>
      {children}
    </HeroUIProvider>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      <ThirdwebProvider>{children}</ThirdwebProvider>
    </HeroUIProvider>
  );
}
