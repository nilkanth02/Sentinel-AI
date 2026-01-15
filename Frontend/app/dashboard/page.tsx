'use client'

import { AppLayoutModern } from '../components/layout/AppLayoutModern'
import Link from 'next/link'
import { AnimatedCard, Badge, Button, Skeleton } from '@/components/ui'
import { ShieldAlert, AlertTriangle, Activity, CheckCircle2, TrendingUp } from 'lucide-react'
import { useMemo } from 'react'
import { useRiskLogs } from '@/hooks/useRiskLogs'
import { 
  LineChart,
  Line,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

export default function DashboardPageModern() {
  const {
    data: logs = [],
    isLoading,
    isError,
    error,
  } = useRiskLogs({ limit: 200 })

  const { kpis, trendData, topFlags, recentLogs } = useMemo(() => {
    const safeLogs = Array.isArray(logs) ? logs : []

    const parsed = safeLogs
      .map((log: any) => {
        const created = log?.created_at ? new Date(log.created_at) : null
        const risk = typeof log?.final_risk_score === 'number' ? log.final_risk_score : 0
        const flags = Array.isArray(log?.flags) ? log.flags : []
        return { ...log, _created: created, _risk: risk, _flags: flags }
      })
      .filter((log: any) => log._created instanceof Date && !Number.isNaN(log._created.getTime()))

    const totalEvents = parsed.length
    const criticalAlerts = parsed.filter((l: any) => l._risk >= 0.8).length
    const avgRisk = totalEvents
      ? parsed.reduce((sum: number, l: any) => sum + l._risk, 0) / totalEvents
      : 0

    const now = new Date()
    const isSameDay = (a: Date, b: Date) =>
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    const eventsToday = parsed.filter((l: any) => isSameDay(l._created, now)).length

    const recent = [...parsed]
      .sort((a: any, b: any) => b._created.getTime() - a._created.getTime())
      .slice(0, 5)

    const dayKey = (d: Date) => d.toISOString().slice(0, 10)
    const byDay = new Map<string, { sumRisk: number; count: number }>()
    for (const l of parsed) {
      const key = dayKey(l._created)
      const prev = byDay.get(key) || { sumRisk: 0, count: 0 }
      byDay.set(key, { sumRisk: prev.sumRisk + l._risk, count: prev.count + 1 })
    }

    const last7: { date: string; riskScore: number; logs: number }[] = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now)
      d.setDate(now.getDate() - i)
      const key = dayKey(d)
      const entry = byDay.get(key)
      last7.push({
        date: key,
        riskScore: entry && entry.count ? entry.sumRisk / entry.count : 0,
        logs: entry?.count || 0,
      })
    }

    const flagCounts = new Map<string, number>()
    for (const l of parsed) {
      for (const f of l._flags) {
        flagCounts.set(String(f), (flagCounts.get(String(f)) || 0) + 1)
      }
    }

    const flagsSorted = Array.from(flagCounts.entries())
      .map(([flag, count]) => ({ flag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    return {
      kpis: {
        totalEvents,
        criticalAlerts,
        avgRisk,
        eventsToday,
      },
      trendData: last7,
      topFlags: flagsSorted,
      recentLogs: recent,
    }
  }, [logs])

  return (
    <AppLayoutModern>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">Monitor AI safety and compliance metrics</p>
          </div>
        </div>

        {isError && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            {error instanceof Error ? error.message : 'Failed to load dashboard data'}
          </div>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatedCard delay={0} className="p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-transparent to-transparent" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Risks</p>
                {isLoading ? (
                  <Skeleton className="mt-2 h-7 w-16" />
                ) : (
                  <p className="text-2xl font-bold text-foreground">{kpis.totalEvents}</p>
                )}
                <p className="text-xs text-muted-foreground">+12% from last week</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center">
                <ShieldAlert className="h-5 w-5" />
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard delay={0.1} className="p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-transparent" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Critical Alerts</p>
                {isLoading ? (
                  <Skeleton className="mt-2 h-7 w-12" />
                ) : (
                  <p className="text-2xl font-bold text-foreground">{kpis.criticalAlerts}</p>
                )}
                <p className="text-xs text-muted-foreground">-5% from last week</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5" />
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard delay={0.2} className="p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-transparent" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Risk Score</p>
                {isLoading ? (
                  <Skeleton className="mt-2 h-7 w-14" />
                ) : (
                  <p className="text-2xl font-bold text-foreground">{kpis.avgRisk.toFixed(2)}</p>
                )}
                <p className="text-xs text-muted-foreground">-0.08 from last week</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-violet-500/10 text-violet-700 dark:text-violet-300 flex items-center justify-center">
                <Activity className="h-5 w-5" />
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard delay={0.3} className="p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Events Today</p>
                {isLoading ? (
                  <Skeleton className="mt-2 h-7 w-14" />
                ) : (
                  <p className="text-2xl font-bold text-foreground">{kpis.eventsToday}</p>
                )}
                <p className="text-xs text-muted-foreground">+23% from yesterday</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            </div>
          </AnimatedCard>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Risk Trend Chart */}
          <AnimatedCard delay={0.4} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Risk Score Trend</h3>
                <p className="text-xs text-muted-foreground">Daily average risk score</p>
              </div>
              <Badge variant="secondary" className="font-mono">7d</Badge>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  stroke="#888888"
                />
                <Tooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-popover p-2 rounded shadow-lg border">
                          <p className="font-semibold">{`${label}: ${(payload[0] as any).value}`}</p>
                          <p className="text-sm text-muted-foreground">{`${(payload[0] as any).payload?.logs || 0} events`}</p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="riskScore" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </AnimatedCard>

          {/* Flag Frequency Chart */}
          <AnimatedCard delay={0.5} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Flag Frequency</h3>
                <p className="text-xs text-muted-foreground">Most common flags in the last week</p>
              </div>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="space-y-4">
              {isLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : topFlags.length > 0 ? (
                topFlags.map((flag) => (
                  <div key={flag.flag} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 rounded-full bg-primary/60" />
                      <span className="text-sm font-medium text-foreground">{flag.flag}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-foreground">{flag.count}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No flags available yet.</p>
              )}
            </div>
          </AnimatedCard>
        </div>

        {/* Recent Logs Table */}
        <AnimatedCard delay={0.6} className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Recent Risk Events</h3>
          <div className="space-y-2">
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-14 w-full" />
              </div>
            ) : recentLogs.length > 0 ? (
              recentLogs.map((log: any) => {
                const id = log?.id
                const risk = typeof log?._risk === 'number' ? log._risk : 0
                const decision = log?.decision || 'unknown'
                const flags = Array.isArray(log?._flags) ? log._flags : []
                const created = log?._created instanceof Date ? log._created : null
                return (
                  <div key={String(id)} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                        {id}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm text-muted-foreground">
                          {created ? created.toLocaleString() : '—'}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant={risk >= 0.7 ? 'destructive' : risk >= 0.4 ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {decision}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{flags.join(', ')}</span>
                        </div>
                      </div>
                    </div>
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/logs/${id}`}>View</Link>
                    </Button>
                  </div>
                )
              })
            ) : (
              <p className="text-sm text-muted-foreground">No events yet.</p>
            )}
          </div>
        </AnimatedCard>
      </div>
    </AppLayoutModern>
  )
}
