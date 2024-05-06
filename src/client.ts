import { createPublicClient, http } from 'viem'
import { opBNBTestnet } from 'viem/chains'

export const publicClient = createPublicClient({
    chain: opBNBTestnet,
    transport: http()
})