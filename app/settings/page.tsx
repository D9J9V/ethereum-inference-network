"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Copy, Wallet, DollarSign, RefreshCw, Plus, Loader2, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

interface WalletBalance {
  address: string
  ethBalance: number
  usdcBalance: number
}

export default function SettingsPage() {
  const [walletData, setWalletData] = useState<WalletBalance | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isFunding, setIsFunding] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)
  const [fundingSuccess, setFundingSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchWalletBalance = async () => {
    try {
      setError(null)
      const response = await fetch('/api/wallet-manager')
      if (!response.ok) {
        throw new Error('Failed to fetch wallet balance')
      }
      const data = await response.json()
      setWalletData(data)
    } catch (err) {
      console.error('Error fetching wallet:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch wallet data')
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchWalletBalance()
  }, [])

  const handleRefresh = () => {
    setIsRefreshing(true)
    fetchWalletBalance()
  }

  const handleFundWallet = async () => {
    setIsFunding(true)
    setFundingSuccess(false)
    try {
      const response = await fetch('/api/wallet-manager', {
        method: 'POST'
      })
      if (!response.ok) {
        throw new Error('Failed to fund wallet')
      }
      setFundingSuccess(true)
      // Refresh balance after funding
      setTimeout(() => {
        fetchWalletBalance()
        setFundingSuccess(false)
      }, 2000)
    } catch (err) {
      console.error('Error funding wallet:', err)
      setError(err instanceof Error ? err.message : 'Failed to fund wallet')
    } finally {
      setIsFunding(false)
    }
  }

  const copyAddress = () => {
    if (walletData?.address) {
      navigator.clipboard.writeText(walletData.address)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    }
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Chat
            </Button>
          </Link>
          <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
        </div>

        {/* Wallet Section */}
        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary">
                <Wallet className="w-5 h-5 text-primary-foreground" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">Wallet</h2>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              disabled={isRefreshing || isLoading}
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : walletData ? (
            <>
              {/* Ethereum Address */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-muted-foreground mb-2">Ethereum Address</label>
                <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                  <code className="flex-1 text-sm font-mono text-foreground break-all">
                    {walletData.address}
                  </code>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={copyAddress} 
                    className="flex-shrink-0"
                  >
                    {copySuccess ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Base Sepolia Network</p>
              </div>

              {/* Balances Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* ETH Balance */}
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">ETH Balance</label>
                  <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950/20 dark:to-purple-950/20 rounded-lg border border-violet-200 dark:border-violet-800">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-900">
                      <span className="text-sm font-bold text-violet-600 dark:text-violet-400">Ξ</span>
                    </div>
                    <div>
                      <p className="text-xl font-bold text-violet-700 dark:text-violet-300">
                        {walletData.ethBalance.toFixed(6)}
                      </p>
                      <p className="text-sm text-violet-600 dark:text-violet-400">Ethereum</p>
                    </div>
                  </div>
                </div>

                {/* USDC Balance */}
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">USDC Balance</label>
                  <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-emerald-50 to-cyan-50 dark:from-emerald-950/20 dark:to-cyan-950/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900">
                      <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-emerald-700 dark:text-emerald-300">
                        ${walletData.usdcBalance.toFixed(2)}
                      </p>
                      <p className="text-sm text-emerald-600 dark:text-emerald-400">USD Coin</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fund Wallet Button */}
              <div className="flex justify-center">
                <Button 
                  onClick={handleFundWallet}
                  disabled={isFunding}
                  className="w-full md:w-auto"
                  variant={fundingSuccess ? "outline" : "default"}
                >
                  {isFunding ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Requesting Funds...
                    </>
                  ) : fundingSuccess ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                      Funds Received!
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Fund Wallet (Testnet)
                    </>
                  )}
                </Button>
                <p className="text-xs text-muted-foreground text-center mt-2">
                  Request test ETH from the Base Sepolia faucet
                </p>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No wallet data available</p>
            </div>
          )}
        </Card>

        {/* Additional Settings Placeholder */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Account Settings</h3>
          <p className="text-muted-foreground">Additional settings and preferences will be available here.</p>
        </Card>
      </div>
    </div>
  )
}
