'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCursorInteractions } from '@/hooks/useCursorInteractions'
import { Badge, Button, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, Separator } from '@/components/ui'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { ArrowLeft, Copy, Download, Shield } from 'lucide-react'
import { 
  MotionCard,
  staggerContainer,
  slideUp,
  hoverScaleLift,
  hoverGlow,
  riskLevelAnimations,
  buttonPress
} from '@/components/ui/motion'

interface RiskLogDetailClientModernProps {
  log: {
    final_risk_score?: number
    flags?: string[]
    confidence?: number
    decision?: string
    action_taken?: string
    decision_reason?: string
    created_at?: string
    signals?: any
  }
  logId: string
}

export function RiskLogDetailClientModern({ log, logId }: RiskLogDetailClientModernProps) {
  const { registerInteractiveElement } = useCursorInteractions()
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
      ? 'border-success/30 bg-success/10 text-success'
      : decisionLabel === 'warn'
        ? 'border-warning/30 bg-warning/10 text-warning'
        : decisionLabel === 'escalate'
          ? 'border-electric-violet/30 bg-electric-violet/10 text-electric-violet'
          : decisionLabel === 'block'
            ? 'border-risk-high/30 bg-risk-high/10 text-risk-high'
            : ''

  const riskLevel = riskScore >= 0.8 ? 'Critical' : riskScore >= 0.6 ? 'High' : riskScore >= 0.4 ? 'Medium' : 'Low'
  const riskVariant = riskScore >= 0.8 ? 'critical' : riskScore >= 0.6 ? 'high' : riskScore >= 0.4 ? 'medium' : 'low'
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
        <div className="text-center py-6 text-muted">
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
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
              className="flex items-center gap-2 p-2 rounded-xl border border-white/10 bg-black/20"
              {...hoverScaleLift}
            >
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-electric-blue to-electric-violet" />
              <span className="text-sm text-foreground">{String(signal)}</span>
            </motion.div>
          ))}
        </div>
      )
    }

    // If it's an object/dict, render as sections
    if (typeof raw === 'object' && raw !== null) {
      return (
        <div className="space-y-4">
          {Object.entries(raw).map(([key, value], index) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="space-y-2"
            >
              <h4 className="text-sm font-medium text-foreground capitalize">{key}</h4>
              <div className="p-3 rounded-xl border border-white/10 bg-black/20 text-sm font-mono text-foreground">
                {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
              </div>
            </motion.div>
          ))}
        </div>
      )
    }

    // Fallback: render as string
    return (
      <div className="p-3 rounded-xl border border-white/10 bg-black/20 text-sm font-mono text-foreground">
        {String(raw)}
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-navy">
        {/* Premium animated background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
        </div>
        <div className="relative z-10 space-y-8 p-6">
          {/* Header */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <motion.div variants={slideUp} className="flex items-center gap-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div {...buttonPress}>
                    <Button variant="ghost" size="sm" onClick={() => router.push('/logs')} aria-label="Back to Risk Logs" className="text-muted hover:text-foreground">
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent>Back to Risk Logs</TooltipContent>
              </Tooltip>
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Investigation report</h1>
                <p className="text-sm text-muted">Audit entry #{logId}</p>
              </div>
            </motion.div>
            <motion.div variants={slideUp}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div {...buttonPress}>
                    <Button variant="outline" size="sm" onClick={handleExport} disabled={isExporting} aria-label="Export log" className="btn-premium-outline">
                      <Download className="mr-2 h-4 w-4" />
                      {isExporting ? 'Exporting...' : 'Export'}
                    </Button>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent>Export log as JSON</TooltipContent>
              </Tooltip>
            </motion.div>
          </motion.div>
          {/* Decision Summary Section */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={slideUp}
            {...riskLevelAnimations[riskVariant as keyof typeof riskLevelAnimations]}
          >
            <MotionCard className="card-premium p-5 sm:p-6" {...hoverGlow}>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-start">
                <div className="space-y-3 lg:col-span-8">
                  <div className="text-xs font-medium text-muted">Decision summary</div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className={cn('capitalize', decisionClassName)}>
                      {decisionLabel}
                    </Badge>
                    <Badge className={
                      riskVariant === 'critical' ? 'badge-risk' :
                      riskVariant === 'high' ? 'badge-warning' :
                      'badge-premium'
                    }>
                      {riskScore.toFixed(2)}
                    </Badge>
                    <span className="text-sm text-muted">{riskLevel} risk</span>
                  </div>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <div className="text-sm text-muted">
                      <span className="font-medium text-foreground">Confidence</span>{' '}
                      <span className="font-mono">{(confidence * 100).toFixed(0)}%</span>
                    </div>
                    <div className="text-sm text-muted">
                      <span className="font-medium text-foreground">Timestamp</span>{' '}
                      <span className="font-mono">{createdAt.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-4">
                  <div className="text-xs font-medium text-muted">Model action</div>
                  <div className="mt-2 flex items-center justify-between gap-3">
                    <Badge variant="outline" className="capitalize border-white/20 text-muted">
                      {String(actionTaken).toLowerCase()}
                    </Badge>
                    <div className="w-full max-w-[160px]">
                      <div className="h-2 rounded-full bg-black/30">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-electric-blue to-electric-violet transition-all duration-300"
                          style={{ width: `${Math.min(Math.max(confidence, 0), 1) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </MotionCard>
          </motion.div>

          {/* Main investigation layout */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid grid-cols-1 gap-5 lg:grid-cols-12"
          >
            <div className="space-y-5 lg:col-span-8">
              {/* Prompt Section */}
              {typeof log?.prompt === 'string' && (
                <MotionCard variants={slideUp} className="card-premium p-5 sm:p-6" {...hoverGlow}>
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <h2 className="text-lg font-semibold text-foreground">User Prompt</h2>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <motion.div {...buttonPress}>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleCopy(log.prompt)}
                            aria-label="Copy user prompt"
                            className="btn-premium-outline"
                          >
                            <Copy className="mr-2 h-4 w-4" />
                            Copy
                          </Button>
                        </motion.div>
                      </TooltipTrigger>
                      <TooltipContent>Copy prompt to clipboard</TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="max-h-72 overflow-auto rounded-xl border border-white/10 bg-black/20 p-4">
                    <pre className="text-sm leading-relaxed whitespace-pre-wrap break-words font-mono text-foreground/90">{log.prompt}</pre>
                  </div>
                </MotionCard>
              )}

              {/* Response Section */}
              {typeof log?.response === 'string' && (
                <MotionCard variants={slideUp} className="card-premium p-5 sm:p-6" {...hoverGlow}>
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <h2 className="text-lg font-semibold text-foreground">AI Response</h2>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <motion.div {...buttonPress}>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleCopy(log.response)}
                            aria-label="Copy AI response"
                            className="btn-premium-outline"
                          >
                            <Copy className="mr-2 h-4 w-4" />
                            Copy
                          </Button>
                        </motion.div>
                      </TooltipTrigger>
                      <TooltipContent>Copy response to clipboard</TooltipContent>
                    </Tooltip>
                  </div>
                  <div
                    className={cn(
                      'max-h-72 overflow-auto rounded-xl border p-4',
                      isUnsafeResponse ? 'border-risk-high/30 bg-risk-high/5' : 'border-white/10 bg-black/20'
                    )}
                  >
                    <pre className="text-sm leading-relaxed whitespace-pre-wrap break-words font-mono text-foreground/90">{log.response}</pre>
                  </div>
                  {isUnsafeResponse && (
                    <p className="mt-3 text-xs text-muted">
                      Highlight indicates content that may require escalation or remediation.
                    </p>
                  )}
                </MotionCard>
              )}
            </div>

            <div className="space-y-5 lg:col-span-4 lg:sticky lg:top-24 lg:self-start">
              {/* Risk Signals Breakdown */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={slideUp}
              >
                <MotionCard className="card-premium p-5 sm:p-6" {...hoverGlow}>
                  <div className="mb-3">
                    <h2 className="text-lg font-semibold text-foreground">Risk signals</h2>
                    <p className="text-xs text-muted">
                      Signals and flags that contributed to the final decision.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="text-xs font-medium text-muted">Flags</div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {flags.length > 0 ? (
                          flags.map((flag: string, index: number) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.3, delay: index * 0.1 }}
                            >
                              <Badge variant="outline" className="text-xs border-white/20 text-muted">
                                {flag}
                              </Badge>
                            </motion.div>
                          ))
                        ) : (
                          <span className="text-sm text-muted">—</span>
                        )}
                      </div>
                    </div>

                    <Separator className="bg-white/10" />

                    <div>
                      <div className="text-xs font-medium text-muted">Signals breakdown</div>
                      <div className="mt-2">{renderSignals()}</div>
                    </div>
                  </div>
                </MotionCard>
              </motion.div>

              {/* Decision Explanation */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={slideUp}
              >
                <MotionCard className="card-premium p-5 sm:p-6" {...hoverGlow}>
                  <div className="mb-3">
                    <h2 className="text-lg font-semibold text-foreground">Decision explanation</h2>
                    <p className="text-xs text-muted">Plain-language rationale for trust and review.</p>
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm leading-relaxed text-muted">
                      SentinelAI marked this interaction as{' '}
                      <span className="font-medium text-foreground">{decisionLabel}</span> based on detected signals and policy
                      checks. The final risk score was{' '}
                      <span className="font-mono text-foreground">{riskScore.toFixed(2)}</span> with{' '}
                      <span className="font-mono text-foreground">{(confidence * 100).toFixed(0)}%</span> confidence.
                    </p>

                    <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                      <div className="text-xs font-medium text-muted">Primary reason</div>
                      <p className="mt-1 text-sm leading-relaxed text-muted">{decisionReason}</p>
                    </div>
                  </div>
                </MotionCard>
              </motion.div>

              {/* Audit Metadata */}
              <MotionCard variants={slideUp} className="card-premium p-5 sm:p-6" {...hoverGlow}>
                <h2 className="text-sm font-semibold text-foreground">Audit metadata</h2>
                <div className="mt-3 space-y-2 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-muted">Log ID</span>
                    <span className="font-mono text-foreground">#{logId}</span>
                  </div>
                </div>
              </MotionCard>
            </div>
          </motion.div>
        </div>
      </div>
    </TooltipProvider>
  )
}
