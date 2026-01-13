'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { 
  LineChart,
  Line,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const mockData = [
  { date: '2024-01-14', riskScore: 0.2, logs: 12 },
  { date: '2024-01-15', riskScore: 0.4, logs: 8 },
  { date: '2024-01-16', riskScore: 0.6, logs: 15 },
  { date: '2024-01-17', riskScore: 0.3, logs: 6 },
  { date: '2024-01-18', riskScore: 0.8, logs: 22 },
  { date: '2024-01-19', riskScore: 0.5, logs: 18 },
  { date: '2024-01-20', riskScore: 0.7, logs: 14 },
]

const flagData = [
  { flag: 'prompt_anomaly', count: 45, trend: 'up' },
  { flag: 'harmful_instructions', count: 32, trend: 'down' },
  { flag: 'unsafe_output', count: 28, trend: 'stable' },
  { flag: 'malicious_intent', count: 15, trend: 'up' },
  { flag: 'policy_violation', count: 8, trend: 'down' },
]

export default function DashboardPageModern() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Monitor AI safety and compliance metrics</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Risk Events</p>
                <p className="text-2xl font-bold text-foreground">1,247</p>
              </div>
              <Badge variant="secondary" className="text-xs">
                +12.5% from last month
              </Badge>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">High Risk Events</p>
                <p className="text-2xl font-bold text-destructive">23</p>
              </div>
              <Badge variant="destructive" className="text-xs">
                +8 this week
              </Badge>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Risk Score</p>
                <p className="text-2xl font-bold text-foreground">0.42</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-xs text-muted-foreground">Low</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Policies</p>
                <p className="text-2xl font-bold text-foreground">8</p>
              </div>
              <Badge variant="secondary" className="text-xs">
                2 new this month
              </Badge>
            </div>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Risk Trend Chart */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Risk Score Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockData}>
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
                          <p className="font-semibold">{`${label}: ${payload[0].riskScore}`}</p>
                          <p className="text-sm text-muted-foreground">{`${payload[0].logs} events`}</p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="riskScore" 
                  stroke="#8884d" 
                  strokeWidth={2}
                  dot={{ fill: "#8884d", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Flag Frequency Chart */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Flag Frequency</h3>
            <div className="space-y-4">
              {flagData.map((flag, index) => (
                <div key={flag.flag} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${
                      flag.trend === 'up' ? 'bg-green-500' : 
                      flag.trend === 'down' ? 'bg-red-500' : 'bg-yellow-500'
                    }`}></div>
                    <span className="text-sm font-medium text-foreground">{flag.flag}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-foreground">{flag.count}</p>
                    <Badge 
                      variant={flag.trend === 'up' ? 'default' : 'destructive'}
                      className="ml-2 text-xs"
                    >
                      {flag.trend === 'up' ? '↑' : '↓'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Recent Logs Table */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Recent Risk Events</h3>
          <div className="space-y-2">
            {[
              { id: 1, time: '2 hours ago', risk: 0.8, decision: 'block', flags: ['prompt_anomaly'] },
              { id: 2, time: '5 hours ago', risk: 0.3, decision: 'warn', flags: ['harmful_instructions'] },
              { id: 3, time: '1 day ago', risk: 0.6, decision: 'escalate', flags: ['unsafe_output', 'malicious_intent'] },
              { id: 4, time: '2 days ago', risk: 0.2, decision: 'allow', flags: [] },
              { id: 5, time: '3 days ago', risk: 0.4, decision: 'warn', flags: ['policy_violation'] },
            ].map((log) => (
              <div key={log.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                    {log.id}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-muted-foreground">{log.time}</div>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant={log.risk >= 0.7 ? 'destructive' : log.risk >= 0.4 ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {log.decision}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{log.flags.join(', ')}</span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  View
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
