// wagmi.config.ts or config.ts
import { createConfig, http, injected } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { metaMask, safe } from 'wagmi/connectors'

export const config = createConfig({
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(),
  },
  connectors: [
    metaMask(),
    injected(),
    safe(),
  ]
})