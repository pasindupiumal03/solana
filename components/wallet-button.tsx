"use client"
import { Copy, Wallet, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePhantomWallet } from "@/hooks/use-phantom-wallet"
import { useToast } from "@/hooks/use-toast"



export function WalletButton(){
    const {isConnected, walletAddress, isLoading, connect, disconnect} = usePhantomWallet()
    const {toast} = useToast()

    const copyAddress = async () => {
        if (walletAddress){
            await navigator.clipboard.writeText(walletAddress)
            toast({
                title: "Wallet Address Copied",
                description: "Your wallet address has been copied to the clipboard.",
            })
        }
    }
    const formatAddress = (address: string) => {
        return `${address.slice(0, 4)}...${address.slice(-4)}`
    }

    if (isConnected && walletAddress) {
        return (
            <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-2 bg-card rounded-lg border">
                    <Wallet className="h-4 w-4 text-primary"/>
                    <span className="font-mono text-sm">{formatAddress(walletAddress)}</span>
                    <Button variant="ghost" size="icon" onClick={copyAddress} className="h-6 w-6">
                        <Copy className="h-3 w-3 text-primary"/>
                    </Button>
                </div>
                <Button variant="outline" size="icon" onClick={disconnect} disabled={isLoading}>
                    <LogOut className="h-4 w-4"/>
                </Button>
            </div>
        )
    }

    return(
        <Button onClick={connect} disabled={isLoading} className="bg-primary hover:bg-primary/90">
            <Wallet className="h-4 w-4 mr-2"/>
            {isLoading ? "Connecting..." : "Connect Wallet"}
        </Button>
    )
}
