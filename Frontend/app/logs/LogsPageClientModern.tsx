'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { Search, X } from 'lucide-react'

interface LogsPageClientModernProps {
  initialLogs: any[]
  initialError?: string | null
}

export function LogsPageClientModern({ initialLogs, initialError }: LogsPageClientModernProps) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [minRiskScore, setMinRiskScore] = useState(0)
  const [maxRiskScore, setMaxRiskScore] = useState(1)
  const [selectedFlags, setSelectedFlags] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [error, setError] = useState<string | null>(initialError || null)
  const [isRetrying, setIsRetrying] = useState(false)
  const isDev = process.env.NODE_ENV === 'development'
  const pageSize = 10

  const availableFlags = Array.from(
    new Set(
      (initialLogs ?? [])
        .flatMap((log) => (Array.isArray(log?.flags) ? log.flags : []))
        .filter((f): f is string => typeof f === 'string' && f.length > 0)
    )
  ).sort()

  const filteredLogs = initialLogs ? initialLogs.filter(log => {
    if (!log) return false
    const matchesSearch = searchTerm === '' || 
      (log.prompt && typeof log.prompt === 'string' && log.prompt.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (log.response && typeof log.response === 'string' && log.response.toLowerCase().includes(searchTerm.toLowerCase()))

    const riskScore = typeof log.final_risk_score === 'number' ? log.final_risk_score : 0

    const createdAt = log?.created_at ? new Date(log.created_at) : null
    const startOk = !startDate || (createdAt ? createdAt >= new Date(startDate + 'T00:00:00') : true)
    const endOk = !endDate || (createdAt ? createdAt <= new Date(endDate + 'T23:59:59') : true)

    const matchesRiskScore = riskScore >= minRiskScore && riskScore <= maxRiskScore

    const flags = Array.isArray(log?.flags) ? log.flags : []
    const matchesFlags = selectedFlags.length === 0 || selectedFlags.every((f) => flags.includes(f))

    return matchesSearch && startOk && endOk && matchesRiskScore && matchesFlags
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
      if (isDev) console.log('Retry successful, fetched logs:', logs?.length || 0)
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

  const resetFilters = () => {
    setSearchTerm('')
    setStartDate('')
    setEndDate('')
    setMinRiskScore(0)
    setMaxRiskScore(1)
    setSelectedFlags([])
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
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Filters</h3>
              <p className="text-sm text-muted-foreground">Search and segment by decision and risk level.</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={resetFilters}
              disabled={
                searchTerm === '' &&
                startDate === '' &&
                endDate === '' &&
                minRiskScore === 0 &&
                maxRiskScore === 1 &&
                selectedFlags.length === 0
              }
            >
              Reset
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-5">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search prompts or responses..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-9 pr-9"
                />
                {searchTerm !== '' && (
                  <button
                    type="button"
                    aria-label="Clear search"
                    onClick={() => handleSearchChange('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="lg:col-span-3 grid grid-cols-2 gap-2">
              <Input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value)
                  setCurrentPage(1)
                }}
                aria-label="Start date"
              />
              <Input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value)
                  setCurrentPage(1)
                }}
                aria-label="End date"
              />
            </div>

            <div className="lg:col-span-2 grid grid-cols-2 gap-2">
              <Input
                type="number"
                min={0}
                max={1}
                step={0.01}
                value={minRiskScore}
                onChange={(e) => {
                  const v = Number(e.target.value)
                  setMinRiskScore(Number.isFinite(v) ? Math.min(Math.max(v, 0), maxRiskScore) : 0)
                  setCurrentPage(1)
                }}
                aria-label="Min risk score"
              />
              <Input
                type="number"
                min={0}
                max={1}
                step={0.01}
                value={maxRiskScore}
                onChange={(e) => {
                  const v = Number(e.target.value)
                  setMaxRiskScore(Number.isFinite(v) ? Math.max(Math.min(v, 1), minRiskScore) : 1)
                  setCurrentPage(1)
                }}
                aria-label="Max risk score"
              />
            </div>

            <div className="lg:col-span-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    Flags
                    {selectedFlags.length > 0 ? ` (${selectedFlags.length})` : ''}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  {availableFlags.length === 0 && (
                    <div className="px-2 py-1.5 text-sm text-muted-foreground">No flags</div>
                  )}
                  {availableFlags.map((flag) => (
                    <DropdownMenuCheckboxItem
                      key={flag}
                      checked={selectedFlags.includes(flag)}
                      onCheckedChange={(checked) => {
                        setSelectedFlags((prev) => {
                          const next = checked ? Array.from(new Set([...prev, flag])) : prev.filter((f) => f !== flag)
                          return next
                        })
                        setCurrentPage(1)
                      }}
                    >
                      {flag}
                    </DropdownMenuCheckboxItem>
                  ))}
                  {availableFlags.length > 0 && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuCheckboxItem
                        checked={selectedFlags.length === 0}
                        onCheckedChange={() => {
                          setSelectedFlags([])
                          setCurrentPage(1)
                        }}
                      >
                        Clear selection
                      </DropdownMenuCheckboxItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
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
                  <TableHead className="w-[200px]">Timestamp</TableHead>
                  <TableHead>Prompt</TableHead>
                  <TableHead className="w-[120px]">Risk Score</TableHead>
                  <TableHead className="w-[220px]">Flags</TableHead>
                  <TableHead className="w-[100px]">Confidence</TableHead>
                  <TableHead className="w-[100px]">Decision</TableHead>
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
                  const promptSnippet = typeof log?.prompt === 'string' ? log.prompt : ''

                  return (
                    <TableRow
                      key={logId}
                      className={cn(
                        'transition-colors',
                        'cursor-pointer',
                        index % 2 === 0 ? 'bg-muted/20' : 'bg-transparent',
                        'hover:bg-muted/50'
                      )}
                      role="link"
                      tabIndex={0}
                      onClick={() => router.push(`/logs/${logId}`)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') router.push(`/logs/${logId}`)
                      }}
                    >
                      <TableCell className="font-medium">{createdAt.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="max-w-[520px] truncate text-muted-foreground">
                          {promptSnippet.length > 0 ? promptSnippet : '—'}
                        </div>
                      </TableCell>
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
              <Button variant="outline" onClick={resetFilters}>
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
