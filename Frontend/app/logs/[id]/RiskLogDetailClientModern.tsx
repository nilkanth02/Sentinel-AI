'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { ArrowLeft, Copy, Download, Shield } from 'lucide-react'

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

  const decisionLabel = String(decision).toLowerCase()
  const decisionClassName =
    decisionLabel === 'allow'
      ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300'
      : decisionLabel === 'warn'
        ? 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300'
        : decisionLabel === 'escalate'
          ? 'border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-900/50 dark:bg-violet-950/30 dark:text-violet-300'
          : decisionLabel === 'block'
            ? 'border-destructive/30 bg-destructive/10 text-destructive'
            : ''

  const riskLevel = riskScore >= 0.8 ? 'Critical' : riskScore >= 0.6 ? 'High' : riskScore >= 0.4 ? 'Medium' : 'Low'
  const riskVariant = riskScore >= 0.8 ? 'destructive' : riskScore >= 0.6 ? 'default' : riskScore >= 0.4 ? 'secondary' : 'outline'
  const isUnsafeResponse = decisionLabel === 'block' || decisionLabel === 'escalate' || riskScore >= 0.8

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      // no-op
    }
  }

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
      <div className="space-y-5">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
              <h1 className="text-2xl font-bold tracking-tight text-foreground">Investigation report</h1>
              <p className="text-sm text-muted-foreground">Audit entry #{logId}</p>
            </div>
          </div>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" onClick={handleExport} disabled={isExporting} aria-label="Export log">
                <Download className="mr-2 h-4 w-4" />
                {isExporting ? 'Exporting...' : 'Export'}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Export log as JSON</TooltipContent>
          </Tooltip>
        </div>

        {/* Decision Summary Section */}
        {/* Design intent: the top summary answers "what happened" in one glance, before details. */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <Card className="p-5 sm:p-6">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-start">
              <div className="space-y-3 lg:col-span-8">
                <div className="text-xs font-medium text-muted-foreground">Decision summary</div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className={cn('capitalize', decisionClassName)}>
                    {decisionLabel}
                  </Badge>
                  <Badge variant={riskVariant as any} className="font-mono">
                    {riskScore.toFixed(2)}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{riskLevel} risk</span>
                </div>

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Confidence</span>{' '}
                    <span className="font-mono">{(confidence * 100).toFixed(0)}%</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Timestamp</span>{' '}
                    <span className="font-mono">{createdAt.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4">
                <div className="text-xs font-medium text-muted-foreground">Model action</div>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <Badge variant="outline" className="capitalize">
                    {String(actionTaken).toLowerCase()}
                  </Badge>
                  <div className="w-full max-w-[160px]">
                    <div className="h-2 rounded-full bg-muted">
                      <div
                        className="h-2 rounded-full bg-primary transition-all duration-300"
                        style={{ width: `${Math.min(Math.max(confidence, 0), 1) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Main investigation layout */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          <div className="space-y-5 lg:col-span-8">
            {/* Prompt Section (no animation) */}
            {typeof log?.prompt === 'string' && (
              <Card className="p-5 sm:p-6">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h2 className="text-lg font-semibold text-foreground">User Prompt</h2>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopy(log.prompt)}
                        aria-label="Copy user prompt"
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        Copy
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Copy prompt to clipboard</TooltipContent>
                  </Tooltip>
                </div>
                <div className="max-h-72 overflow-auto rounded-md border bg-muted/20 p-4">
                  <pre className="text-sm leading-relaxed whitespace-pre-wrap break-words font-mono text-foreground/90">{log.prompt}</pre>
                </div>
              </Card>
            )}

            {/* Response Section (no animation) */}
            {typeof log?.response === 'string' && (
              <Card className="p-5 sm:p-6">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h2 className="text-lg font-semibold text-foreground">AI Response</h2>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopy(log.response)}
                        aria-label="Copy AI response"
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        Copy
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Copy response to clipboard</TooltipContent>
                  </Tooltip>
                </div>
                <div
                  className={cn(
                    'max-h-72 overflow-auto rounded-md border p-4',
                    isUnsafeResponse ? 'border-destructive/30 bg-destructive/5' : 'bg-muted/20'
                  )}
                >
                  <pre className="text-sm leading-relaxed whitespace-pre-wrap break-words font-mono text-foreground/90">{log.response}</pre>
                </div>
                {isUnsafeResponse && (
                  <p className="mt-3 text-xs text-muted-foreground">
                    Highlight indicates content that may require escalation or remediation.
                  </p>
                )}
              </Card>
            )}
          </div>

          <div className="space-y-5 lg:col-span-4 lg:sticky lg:top-24 lg:self-start">
            {/* Risk Signals Breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.05, ease: 'easeOut' }}
            >
              <Card className="p-5 sm:p-6">
                <div className="mb-3">
                  <h2 className="text-lg font-semibold text-foreground">Risk signals</h2>
                  <p className="text-xs text-muted-foreground">
                    Signals and flags that contributed to the final decision.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="text-xs font-medium text-muted-foreground">Flags</div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {flags.length > 0 ? (
                        flags.map((flag: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {flag}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-sm text-muted-foreground">—</span>
                      )}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <div className="text-xs font-medium text-muted-foreground">Signals breakdown</div>
                    <div className="mt-2">{renderSignals()}</div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Decision Explanation */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.1, ease: 'easeOut' }}
            >
              <Card className="p-5 sm:p-6">
                <div className="mb-3">
                  <h2 className="text-lg font-semibold text-foreground">Decision explanation</h2>
                  <p className="text-xs text-muted-foreground">Plain-language rationale for trust and review.</p>
                </div>

                <div className="space-y-3">
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    SentinelAI marked this interaction as{' '}
                    <span className="font-medium text-foreground">{decisionLabel}</span> based on detected signals and policy
                    checks. The final risk score was{' '}
                    <span className="font-mono text-foreground">{riskScore.toFixed(2)}</span> with{' '}
                    <span className="font-mono text-foreground">{(confidence * 100).toFixed(0)}%</span> confidence.
                  </p>

                  <div className="rounded-md border bg-muted/20 p-3">
                    <div className="text-xs font-medium text-muted-foreground">Primary reason</div>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{decisionReason}</p>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Audit Metadata */}
            <Card className="p-5 sm:p-6">
              <h2 className="text-sm font-semibold text-foreground">Audit metadata</h2>
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">Log ID</span>
                  <span className="font-mono text-foreground">#{logId}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
