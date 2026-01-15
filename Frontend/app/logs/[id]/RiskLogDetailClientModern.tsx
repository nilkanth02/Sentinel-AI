'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, Download, Shield } from 'lucide-react'

interface RiskLogDetailClientModernProps {
  log: any
  logId: string
}

export function RiskLogDetailClientModern({ log, logId }: RiskLogDetailClientModernProps) {
  if (!log) {
    return (
      <Card className="p-8">
        <div className="text-center">
          <h3 className="text-lg font-medium text-muted-foreground">Risk log not found</h3>
        </div>
      </Card>
    )
  }

  const router = useRouter()
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = () => {
    setIsExporting(true)
    try {
      const payload = {
        id: logId,
        exported_at: new Date().toISOString(),
        log,
      }
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `risk-log-${logId}.json`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch {
      // no-op
    } finally {
      setIsExporting(false)
    }
  }

  const riskScore = typeof log?.final_risk_score === 'number' ? log.final_risk_score : 0
  const flags = Array.isArray(log?.flags) ? log.flags : []
  const confidence = typeof log?.confidence === 'number' ? log.confidence : 0
  const decision = log?.decision || 'Unknown'
  const actionTaken = log?.action_taken || 'Unknown'
  const decisionReason = log?.decision_reason || 'No reason provided'
  const createdAt = log?.created_at ? new Date(log.created_at) : new Date()

  const renderSignals = () => {
    const raw = log?.signals
    if (!raw || (Array.isArray(raw) && raw.length === 0)) {
      return (
        <div className="text-center py-6 text-muted-foreground">
          <Shield className="mx-auto h-12 w-12 opacity-20 mb-2" />
          <p>No signals available</p>
        </div>
      )
    }

    // If it's an array, render as a simple list
    if (Array.isArray(raw)) {
      return (
        <div className="space-y-2">
          {raw.map((signal, i) => (
            <div key={i} className="flex items-center gap-2 p-2 rounded-md bg-muted/30">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-sm text-foreground">{String(signal)}</span>
            </div>
          ))}
        </div>
      )
    }

    // If it's an object/dict, render as sections
    if (typeof raw === 'object' && raw !== null) {
      return (
        <div className="space-y-4">
          {Object.entries(raw).map(([key, value]) => (
            <div key={key} className="space-y-2">
              <h4 className="text-sm font-medium text-foreground capitalize">{key}</h4>
              <div className="p-3 rounded-md bg-muted/30 text-sm font-mono text-foreground">
                {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
              </div>
            </div>
          ))}
        </div>
      )
    }

    // Fallback: render as string
    return (
      <div className="p-3 rounded-md bg-muted/30 text-sm font-mono text-foreground">
        {String(raw)}
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" onClick={() => router.push('/logs')} aria-label="Back to Risk Logs">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Back to Risk Logs</TooltipContent>
          </Tooltip>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Risk Log Details</h1>
            <p className="text-muted-foreground">ID: {log.id}</p>
          </div>
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm" onClick={handleExport} disabled={isExporting} aria-label="Export log">
              <Download className="h-4 w-4 mr-2" />
              {isExporting ? 'Exporting...' : 'Export'}
            </Button>
          </TooltipTrigger>
          <TooltipContent>Export log as JSON</TooltipContent>
        </Tooltip>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Risk Score & Decision */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Risk Assessment</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Risk Score</p>
                <div className="flex items-center space-x-2">
                  <Badge
                    variant={riskScore >= 0.8 ? 'destructive' : riskScore >= 0.6 ? 'default' : 'secondary'}
                    className="text-lg"
                  >
                    {riskScore.toFixed(2)}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {riskScore >= 0.8 ? 'Critical' : riskScore >= 0.6 ? 'High' : riskScore >= 0.4 ? 'Medium' : 'Low'}
                  </span>
                </div>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">Decision</p>
                <Badge
                  variant={
                    decision === 'block' ? 'destructive' :
                    decision === 'escalate' ? 'default' :
                    decision === 'warn' ? 'secondary' :
                    'outline'
                  }
                  className="mt-1"
                >
                  {decision}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Action Taken</p>
                <Badge
                  variant={
                    actionTaken === 'escalate' ? 'default' :
                    actionTaken === 'block' ? 'destructive' :
                    actionTaken === 'warn' ? 'secondary' :
                    'outline'
                  }
                  className="mt-1"
                >
                  {actionTaken}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Confidence</p>
                <div className="mt-1">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${confidence * 100}%` }}
                      />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{(confidence * 100).toFixed(0)}%</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Middle Column - Flags & Metadata */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Detected Flags</h3>
            <div className="space-y-2">
              {flags.length > 0 ? (
                flags.map((flag: string, index: number) => (
                  <Badge key={index} variant="secondary" className="mr-2">
                    {flag}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No flags detected</p>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Metadata</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Timestamp</p>
                <p className="font-medium">{createdAt.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Log ID</p>
                <p className="font-medium">#{logId}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column - Decision Reason */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Decision Reason</h3>
            <div className="max-h-56 overflow-auto rounded-md border bg-muted/20 p-3">
              <p className="text-muted-foreground leading-relaxed">{decisionReason}</p>
            </div>
          </Card>
        </div>
      </div>

      {(typeof log?.prompt === 'string' || typeof log?.response === 'string') && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {typeof log?.prompt === 'string' && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Prompt</h3>
              <div className="max-h-72 overflow-auto rounded-md border bg-muted/20 p-3">
                <pre className="text-sm whitespace-pre-wrap break-words text-foreground/90">{log.prompt}</pre>
              </div>
            </Card>
          )}
          {typeof log?.response === 'string' && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Response</h3>
              <div className="max-h-72 overflow-auto rounded-md border bg-muted/20 p-3">
                <pre className="text-sm whitespace-pre-wrap break-words text-foreground/90">{log.response}</pre>
              </div>
            </Card>
          )}
        </div>
      )}

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Signals Breakdown</h3>
        {renderSignals()}
      </Card>

      {/* Additional Details Section */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Additional Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-foreground mb-2">System Information</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Processing Time:</span>
                <span>{createdAt.toLocaleTimeString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date:</span>
                <span>{createdAt.toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-foreground mb-2">Risk Analysis</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Risk Level:</span>
                <Badge variant={riskScore >= 0.7 ? 'destructive' : 'secondary'}>
                  {riskScore >= 0.8 ? 'Critical' : riskScore >= 0.6 ? 'High' : riskScore >= 0.4 ? 'Medium' : 'Low'}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Flags Count:</span>
                <span>{flags.length}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
      </div>
    </TooltipProvider>
  )
}
