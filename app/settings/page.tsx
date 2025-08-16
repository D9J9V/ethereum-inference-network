"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Copy, Wallet, DollarSign } from "lucide-react"
import Link from "next/link"

export default function SettingsPage() {
  const ethereumAddress = "0x742d35Cc6634C0532925a3b8D4C9db96590e4CAF"
  const usdcBalance = "1,247.83"

  const copyAddress = () => {
    navigator.clipboard.writeText(ethereumAddress)
    // In a real app, you'd show a toast notification here
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
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary">
              <Wallet className="w-5 h-5 text-primary-foreground" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">Wallet</h2>
          </div>

          {/* Ethereum Address */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-muted-foreground mb-2">Ethereum Address</label>
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <code className="flex-1 text-sm font-mono text-foreground break-all">{ethereumAddress}</code>
              <Button variant="ghost" size="sm" onClick={copyAddress} className="flex-shrink-0">
                <Copy className="w-4 h-4" />
              </Button>
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
                <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">${usdcBalance}</p>
                <p className="text-sm text-emerald-600 dark:text-emerald-400">USD Coin</p>
              </div>
            </div>
          </div>
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
