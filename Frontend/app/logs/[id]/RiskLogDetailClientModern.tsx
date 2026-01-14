'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RiskLogDetailClientModernProps {
  log: any
  logId: string
}

export function RiskLogDetailClientModern({ log, logId }: RiskLogDetailClientModernProps) {
  console.log('RiskLogDetailClientModern rendering with log:', log)

  if (!log) {
    return (
      <Card className="p-8">
        <div className="text-center">
          <h3 className="text-lg font-medium text-muted-foreground">Risk log not found</h3>
        </div>
      </Card>
    )
  }

  const riskScore = typeof log?.final_risk_score === 'number' ? log.final_risk_score : 0
  const flags = Array.isArray(log?.flags) ? log.flags : []
  const confidence = typeof log?.confidence === 'number' ? log.confidence : 0
  const decision = log?.decision || 'Unknown'
  const actionTaken = log?.action_taken || 'Unknown'
  const decisionReason = log?.decision_reason || 'No reason provided'
  const createdAt = log?.created_at ? new Date(log.created_at) : new Date()

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Risk Log Details</h1>
          <p className="text-muted-foreground">Log ID: #{logId}</p>
        </div>
        <Button variant="outline" onClick={() => window.history.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Logs
        </Button>
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
                    className="text-lg font-mono px-3 py-1"
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
            <p className="text-muted-foreground leading-relaxed">{decisionReason}</p>
          </Card>
        </div>
      </div>

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
  )
}
