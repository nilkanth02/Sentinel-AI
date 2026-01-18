'use client'

import { useState } from 'react'
import { AppLayoutModern } from '../components/layout/AppLayoutModern'
import { Button, Badge } from '@/components/ui'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import {
  MotionCard,
  staggerContainer,
  slideUp,
  hoverGlow,
  buttonPress,
} from '@/components/ui/motion'

type AnalyzeResponse = {
  final_risk_score: number
  flags: string[]
  confidence?: number
  decision?: string
  action_taken?: string
  decision_reason?: string
  settings_version?: number
  thresholds_applied?: any
}

export default function AnalyzePage() {
  const [prompt, setPrompt] = useState('')
  const [response, setResponse] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [result, setResult] = useState<AnalyzeResponse | null>(null)

  const runAnalysis = async () => {
    setIsRunning(true)
    setResult(null)

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, response }),
      })

      if (!res.ok) {
        const msg = await res.text()
        throw new Error(msg || `HTTP error! status: ${res.status}`)
      }

      const data = (await res.json()) as AnalyzeResponse
      setResult(data)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to analyze'
      toast.error(msg)
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <AppLayoutModern>
      <div className="min-h-screen bg-gradient-navy">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
        </div>

        <div className="relative z-10 space-y-8 p-6">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="space-y-2"
          >
            <motion.h1 variants={slideUp} className="text-3xl font-bold tracking-tight text-foreground">
              Analyze
            </motion.h1>
            <motion.p variants={slideUp} className="text-muted">
              Submit a prompt and model response to SentinelAI and view the risk assessment.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid grid-cols-1 gap-6 lg:grid-cols-2"
          >
            <MotionCard variants={slideUp} className="card-premium p-6" {...hoverGlow}>
              <div className="space-y-3">
                <div className="text-sm font-semibold text-foreground">Prompt</div>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="input-premium min-h-[160px] w-full resize-y"
                  placeholder="Paste the user prompt here"
                />
              </div>
            </MotionCard>

            <MotionCard variants={slideUp} className="card-premium p-6" {...hoverGlow}>
              <div className="space-y-3">
                <div className="text-sm font-semibold text-foreground">Response</div>
                <textarea
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  className="input-premium min-h-[160px] w-full resize-y"
                  placeholder="Paste the model response here"
                />
              </div>
            </MotionCard>
          </motion.div>

          <motion.div variants={slideUp} className="flex items-center justify-end">
            <motion.div {...buttonPress}>
              <Button className="btn-premium" onClick={runAnalysis} disabled={isRunning}>
                {isRunning ? 'Analyzing…' : 'Run analysis'}
              </Button>
            </motion.div>
          </motion.div>

          {result && (
            <MotionCard variants={slideUp} className="card-premium p-6" {...hoverGlow}>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
                <div className="lg:col-span-8 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className="badge-premium">{(result.final_risk_score ?? 0).toFixed(2)}</Badge>
                    <Badge className="badge-premium">{String(result.decision || 'unknown')}</Badge>
                    {typeof result.settings_version === 'number' && (
                      <Badge className="badge-premium">settings v{result.settings_version}</Badge>
                    )}
                  </div>
                  <div className="text-sm text-muted">{result.decision_reason || '—'}</div>
                  <div className="flex flex-wrap gap-1">
                    {(Array.isArray(result.flags) ? result.flags : []).length ? (
                      result.flags.map((f, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs border-white/20 text-muted">
                          {f}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-muted">No flags</span>
                    )}
                  </div>
                </div>

                <div className="lg:col-span-4 space-y-2">
                  <div className="text-xs font-medium text-muted">Thresholds applied</div>
                  <div className="rounded-xl border border-white/10 bg-black/20 p-3 text-xs font-mono text-foreground/90 whitespace-pre-wrap">
                    {result.thresholds_applied ? JSON.stringify(result.thresholds_applied, null, 2) : '—'}
                  </div>
                </div>
              </div>
            </MotionCard>
          )}
        </div>
      </div>
    </AppLayoutModern>
  )
}
