"use client"

import { useWeb3 } from "@/providers/web3-provider"
import { DEFAULT_CHAIN } from "@/config/blockchain"
import { Card, CardContent } from "@/components/ui/card"
import { ExternalLink, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"

export function NetworkInfo() {
  const { chainId, isConnected } = useWeb3()

  const isCorrectNetwork = chainId === DEFAULT_CHAIN.id

  const openExplorer = () => {
    window.open(DEFAULT_CHAIN.blockExplorers.default.url, "_blank")
  }

  if (!isConnected) return null

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Globe className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <div className="font-medium">Network</div>
              <div className="flex items-center gap-2">
                <div
                  className={`h-2 w-2 rounded-full ${isCorrectNetwork ? "bg-green-500 animate-pulse" : "bg-red-500"}`}
                />
                <div className="text-sm text-muted-foreground">
                  {isCorrectNetwork ? DEFAULT_CHAIN.name : "Wrong Network"}
                </div>
              </div>
            </div>
          </div>

          <Button variant="outline" size="sm" className="gap-1" onClick={openExplorer}>
            Explorer
            <ExternalLink className="h-3 w-3 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
