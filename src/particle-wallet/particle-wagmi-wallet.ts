// Import necessary modules and types from external libraries
import { getAddress, numberToHex, SwitchChainError, UserRejectedRequestError, type ProviderRpcError } from "viem";
import { type ConnectParam, type EIP1193Provider } from "@particle-network/auth-core";
import type { EVMProvider } from "@particle-network/auth-core-modal/dist/context/evmProvider";
import { ChainNotConfiguredError, createConnector } from "@wagmi/core";

// Define a constant for the wallet type
particleWagmiWallet.type = "particleWallet" as const;

// Custom function to normalize chain ID
function customNormalizeChainId(chainId: string | number): number {
    if (typeof chainId === 'string') {
        return parseInt(chainId, chainId.trim().substring(0, 2) === '0x' ? 16 : 10);
    }
    return chainId;
}

// Define the main function to create the Particle Wallet connector
export function particleWagmiWallet(param?: ConnectParam) {
    type Provider = EIP1193Provider; // Define the provider type
    type Properties = any; // Define the properties type

    // Create the connector using the createConnector function
    return createConnector<Provider, Properties>((config) => ({
        id: "particleWalletSDK", // Define the connector ID
        name: "Particle Wallet", // Define the connector name
        type: particleWagmiWallet.type, // Define the wallet type

        // Define the connect function
        async connect({ chainId }: { chainId: number }) {
            try {
                const provider = await this.getProvider(); // Get the provider instance
                const accounts = (await (provider as EVMProvider).connect(param)).map((x) => getAddress(x)); // Connect and get accounts

                // Set up event listeners
                provider.on("accountsChanged", this.onAccountsChanged);
                provider.on("chainChanged", this.onChainChanged);
                provider.on("disconnect", this.onDisconnect.bind(this));

                // Switch to the specified chain if provided
                let currentChainId = await this.getChainId();
                if (chainId && currentChainId !== chainId) {
                    const chain = await this.switchChain!({ chainId }).catch((error: any) => {
                        if (error.code === UserRejectedRequestError.code) throw error;
                        return { id: currentChainId };
                    });
                    currentChainId = chain?.id ?? currentChainId;
                }

                return { accounts, chainId: currentChainId }; // Return the accounts and chain ID
            } catch (error: any) {
                if (error.code == 4011) throw new UserRejectedRequestError(error as Error);
                throw error;
            }
        },

        // Define the disconnect function
        async disconnect() {
            const provider = await this.getProvider(); // Get the provider instance

            // Remove event listeners
            provider.removeListener("accountsChanged", this.onAccountsChanged);
            provider.removeListener("chainChanged", this.onChainChanged);
            provider.removeListener("disconnect", this.onDisconnect.bind(this));

            await (provider as any)?.disconnect?.(); // Disconnect the provider
        },

        // Define the getAccounts function
        async getAccounts() {
            const provider = await this.getProvider(); // Get the provider instance
            return (
                await provider.request({
                    method: "eth_accounts", // Request accounts
                })
            ).map((x: string) => getAddress(x)); // Normalize account addresses
        },

        // Define the getChainId function
        async getChainId() {
            const provider = await this.getProvider(); // Get the provider instance
            const chainId = await provider.request({ method: "eth_chainId" }); // Request chain ID
            return customNormalizeChainId(chainId); // Normalize chain ID
        },

        // Define the getProvider function
        async getProvider() {
            if (typeof window === "undefined") {
                return;
            }

            // Wait until the Particle Wallet provider is available
            while (!(window as any).particle?.ethereum) {
                await new Promise((resolve) => setTimeout(() => resolve(true), 100));
            }
            return (window as any).particle?.ethereum; // Return the Particle Wallet provider
        },

        // Define the isAuthorized function
        async isAuthorized() {
            try {
                const provider = await this.getProvider(); // Get the provider instance
                return (provider as any).isConnected(); // Check if connected
            } catch {
                return false; // Return false if an error occurs
            }
        },

        // Define the switchChain function
        async switchChain({ chainId }: { chainId: number }) {
            const chain = config.chains.find((chain) => chain.id === chainId);
            if (!chain) throw new SwitchChainError(new ChainNotConfiguredError()); // Throw error if chain is not configured

            const provider = await this.getProvider(); // Get the provider instance
            const chainId_ = numberToHex(chain.id); // Convert chain ID to hexadecimal

            try {
                await provider.request({
                    method: "wallet_switchEthereumChain",
                    params: [{ chainId: chainId_ }], // Switch to the specified chain
                });
                return chain;
            } catch (error) {
                // Handle error if the chain is not added to the provider
                if ((error as ProviderRpcError).code === 4902) {
                    try {
                        await provider.request({
                            method: "wallet_addEthereumChain",
                            params: [
                                {
                                    chainId: chainId_,
                                    chainName: chain.name,
                                    nativeCurrency: chain.nativeCurrency,
                                    rpcUrls: [chain.rpcUrls.default?.http[0] ?? ""],
                                    blockExplorerUrls: [chain.blockExplorers?.default.url],
                                },
                            ],
                        });
                        return chain;
                    } catch (error) {
                        throw new UserRejectedRequestError(error as Error);
                    }
                }

                throw new SwitchChainError(error as Error);
            }
        },

        // Define the onAccountsChanged event handler
        onAccountsChanged(accounts: string[]) {
            if (accounts.length === 0) config.emitter.emit("disconnect");
            else
                config.emitter.emit("change", {
                    accounts: accounts.map((x) => getAddress(x)), // Normalize account addresses
                });
        },

        // Define the onChainChanged event handler
        onChainChanged(chain: string) {
            const chainId = customNormalizeChainId(chain); // Normalize chain ID
            config.emitter.emit("change", { chainId });
        },

        // Define the onDisconnect event handler
        async onDisconnect(_error: any) {
            config.emitter.emit("disconnect"); // Emit disconnect event

            const provider = await this.getProvider(); // Get the provider instance
            provider.removeListener("accountsChanged", this.onAccountsChanged); // Remove event listeners
            provider.removeListener("chainChanged", this.onChainChanged);
            provider.removeListener("disconnect", this.onDisconnect.bind(this));
        },
    }));
}
