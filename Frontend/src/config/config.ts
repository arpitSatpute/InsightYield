// wagmi.config.ts or config.ts
import { createConfig, http, injected } from 'wagmi'
import { Chain } from 'wagmi/chains'
import { metaMask, safe } from 'wagmi/connectors'



const ogGalileo: Chain = {
  id: 16602,
  name: '0G-Galileo-Testnet',
  nativeCurrency: {
    decimals: 18,
    name: '0G',
    symbol: '0G',
  },
  rpcUrls: {
    default: { http: ['https://evmrpc-testnet.0g.ai'] },
    public: { http: ['https://evmrpc-testnet.0g.ai'] },
  },
  blockExplorers: {
    default: {
      name: '0G Explorer',
      url: 'https://chainscan-galileo.0g.ai',
    },
  },
  testnet: true,
}

export const config = createConfig({
  chains: [ogGalileo],
  transports: {
    [ogGalileo.id]: http(),
  },
  connectors: [
    metaMask(),
    injected(),
    safe(),
  ]
})