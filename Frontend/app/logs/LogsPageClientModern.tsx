'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

interface LogsPageClientModernProps {
  initialLogs: any[]
  initialError?: string | null
}

export function LogsPageClientModern({ initialLogs, initialError }: LogsPageClientModernProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [decisionFilter, setDecisionFilter] = useState('all')
  const [riskLevelFilter, setRiskLevelFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [error, setError] = useState<string | null>(initialError || null)
  const [isRetrying, setIsRetrying] = useState(false)
  const pageSize = 10

  const getMinRiskScore = (level: string) => {
    switch (level) {
      case 'critical': return 0.8
      case 'high': return 0.6
      case 'medium': return 0.4
      case 'low': return 0.2
      default: return undefined
    }
  }

  const filteredLogs = initialLogs ? initialLogs.filter(log => {
    if (!log) return false
    const matchesSearch = searchTerm === '' || 
      (log.prompt && typeof log.prompt === 'string' && log.prompt.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (log.response && typeof log.response === 'string' && log.response.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesDecision = decisionFilter === 'all' || (log.decision && log.decision === decisionFilter)
    const riskScore = typeof log.final_risk_score === 'number' ? log.final_risk_score : 0
    const minScore = getMinRiskScore(riskLevelFilter)
    const matchesRiskScore = minScore === undefined || riskScore >= minScore
    return matchesSearch && matchesDecision && matchesRiskScore
  }) : []

  const totalPages = Math.ceil(filteredLogs.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const paginatedLogs = filteredLogs.slice(startIndex, startIndex + pageSize)

  const handleRetry = async () => {
    setIsRetrying(true)
    setError(null)
    try {
      const response = await fetch('/api/logs?limit=50', { cache: 'no-store' })
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      const logs = await response.json()
      console.log('Retry successful, fetched logs:', logs?.length || 0)
      setError(null)
      window.location.reload()
    } catch (err) {
      console.error('Retry failed:', err)
      setError(err instanceof Error ? err.message : 'Failed to retry fetching logs')
    } finally {
      setIsRetrying(false)
    }
  }

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  const handleDecisionChange = (value: string) => {
    setDecisionFilter(value)
    setCurrentPage(1)
  }

  const handleRiskLevelChange = (value: string) => {
    setRiskLevelFilter(value)
    setCurrentPage(1)
  }

  const handleFilterChange = () => {
    setCurrentPage(1)
  }

  return (
    <>
      {/* Error State */}
      {error && (
        <Card className="p-6">
          <div className="text-center space-y-4">
            <h3 className="text-lg font-medium text-destructive">Unable to load risk logs</h3>
            <p className="text-muted-foreground">{error}</p>
            <Button variant="outline" onClick={handleRetry} disabled={isRetrying}>
              {isRetrying ? 'Retrying...' : 'Retry'}
            </Button>
          </div>
        </Card>
      )}

      {/* Filters Bar */}
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Filters</h3>
            <p className="text-sm text-muted-foreground">Filter risk logs by decision type, risk level, or search content</p>
          </div>
          <div className="flex flex-col gap-4">
            <Input
              placeholder="Search prompts or responses..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="max-w-md"
            />
            <div className="flex gap-4">
              <Select value={decisionFilter} onValueChange={handleDecisionChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Decision" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Decisions</SelectItem>
                  <SelectItem value="allow">Allow</SelectItem>
                  <SelectItem value="warn">Warn</SelectItem>
                  <SelectItem value="block">Block</SelectItem>
                  <SelectItem value="escalate">Escalate</SelectItem>
                </SelectContent>
              </Select>
              <Select value={riskLevelFilter} onValueChange={handleRiskLevelChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Risk Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="low">Low (≥0.2)</SelectItem>
                  <SelectItem value="medium">Medium (≥0.4)</SelectItem>
                  <SelectItem value="high">High (≥0.6)</SelectItem>
                  <SelectItem value="critical">Critical (≥0.8)</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleFilterChange}>Apply Filters</Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Logs Table */}
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Risk Events ({filteredLogs.length} results, Page {currentPage} of {totalPages || 1})
            </h3>
            <p className="text-sm text-muted-foreground">
              Each risk log represents an AI interaction that was analyzed for safety and compliance
            </p>
          </div>

          {paginatedLogs.length > 0 && !error && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">ID</TableHead>
                  <TableHead className="w-[160px]">Time</TableHead>
                  <TableHead className="w-[120px]">Risk Score</TableHead>
                  <TableHead className="w-[220px]">Flags</TableHead>
                  <TableHead className="w-[100px]">Confidence</TableHead>
                  <TableHead className="w-[100px]">Decision</TableHead>
                  <TableHead className="w-[100px]">Action</TableHead>
                  <TableHead className="w-[80px]">View</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedLogs.map((log, index) => {
                  const logId = log?.id || 'Unknown'
                  const createdAt = log?.created_at ? new Date(log.created_at) : new Date()
                  const riskScore = typeof log?.final_risk_score === 'number' ? log.final_risk_score : 0
                  const flags = Array.isArray(log?.flags) ? log.flags : []
                  const confidence = typeof log?.confidence === 'number' ? log.confidence : 0
                  const decision = log?.decision || 'Unknown'
                  const actionTaken = log?.action_taken || 'Unknown'

                  return (
                    <TableRow key={logId} className="hover:bg-muted/50">
                      <TableCell className="font-medium">#{logId}</TableCell>
                      <TableCell>{createdAt.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge
                          variant={riskScore >= 0.8 ? 'destructive' : riskScore >= 0.6 ? 'default' : 'secondary'}
                          className="font-mono"
                        >
                          {riskScore.toFixed(2)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[200px] truncate">
                          {flags.length > 0 ? flags.join(', ') : 'None'}
                        </div>
                      </TableCell>
                      <TableCell>{(confidence * 100).toFixed(0)}%</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            decision === 'block' ? 'destructive' :
                            decision === 'escalate' ? 'default' :
                            decision === 'warn' ? 'secondary' :
                            'outline'
                          }
                        >
                          {decision}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            actionTaken === 'escalate' ? 'default' :
                            actionTaken === 'block' ? 'destructive' :
                            actionTaken === 'warn' ? 'secondary' :
                            'outline'
                          }
                        >
                          {actionTaken}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}

          {!error && paginatedLogs.length === 0 && filteredLogs.length === 0 && (
            <Card className="p-8 text-center">
              <h3 className="text-lg font-medium text-muted-foreground mb-2">No AI interactions recorded yet.</h3>
              <p className="text-sm text-muted-foreground">
                Risk logs will appear here once AI interactions are analyzed. These logs help track and monitor AI safety decisions.
              </p>
            </Card>
          )}

          {!error && paginatedLogs.length === 0 && filteredLogs.length > 0 && (
            <Card className="p-8 text-center">
              <h3 className="text-lg font-medium text-muted-foreground mb-2">No logs match the selected filters.</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Try adjusting your search terms or filter criteria to find the logs you're looking for.
              </p>
              <Button variant="outline" onClick={() => {
                setSearchTerm('')
                setDecisionFilter('all')
                setRiskLevelFilter('all')
                setCurrentPage(1)
              }}>
                Clear All Filters
              </Button>
            </Card>
          )}
        </div>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-center space-x-2">
        <Button
          variant="outline"
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages || 1}
        </span>
        <Button
          variant="outline"
          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
          disabled={currentPage === totalPages || totalPages === 0}
        >
          Next
        </Button>
      </div>
    </>
  )
}
