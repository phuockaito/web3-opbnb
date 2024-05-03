import { useAccount, useBalance, useSignMessage, useSwitchChain } from 'wagmi'

export function Profile() {
    const { signMessage } = useSignMessage()

    const account = useAccount()
    const balance = useBalance({
        address: account.address,
    })
    const { chains, switchChain } = useSwitchChain()

    if (!account.address) return;
    return (
        <div>
            <h1>Address: {account.address}</h1>
            <h1>Balance: {balance.data?.formatted}</h1>
            <button onClick={() => signMessage({ message: 'hello world' })}>
                Sign message
            </button>
            <br />
            <div>
                {chains.map((chain) => (
                    <button key={chain.id} onClick={() => switchChain({ chainId: chain.id })}>
                        {chain.name}
                    </button>
                ))}
            </div>
        </div>
    )
}