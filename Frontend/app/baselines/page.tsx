import { AppLayoutModern } from '../components/layout/AppLayoutModern'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, Settings, TrendingUp, Shield } from 'lucide-react'

export default function BaselinesPageModern() {
  // Mock data for demonstration
  const baselines = [
    { 
      id: 1, 
      name: "Content Safety", 
      threshold: 0.7, 
      status: "Active",
      lastUpdated: "2024-01-14",
      alerts: 12,
      accuracy: 94.5
    },
    { 
      id: 2, 
      name: "Jailbreak Detection", 
      threshold: 0.8, 
      status: "Active",
      lastUpdated: "2024-01-13",
      alerts: 8,
      accuracy: 97.2
    },
    { 
      id: 3, 
      name: "Prompt Anomaly", 
      threshold: 0.6, 
      status: "Inactive",
      lastUpdated: "2024-01-10",
      alerts: 3,
      accuracy: 89.1
    },
    { 
      id: 4, 
      name: "Output Risk", 
      threshold: 0.75, 
      status: "Active",
      lastUpdated: "2024-01-14",
      alerts: 15,
      accuracy: 92.8
    }
  ]

  return (
    <AppLayoutModern>
      <div className="container mx-auto p-6 space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Risk Baselines</h1>
            <p className="text-muted-foreground">Configure and monitor AI safety baselines and thresholds</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Baseline
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Baselines</p>
                <p className="text-2xl font-bold text-foreground">{baselines.filter(b => b.status === 'Active').length}</p>
              </div>
              <Shield className="h-8 w-8 text-muted-foreground" />
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Alerts</p>
                <p className="text-2xl font-bold text-foreground">{baselines.reduce((sum, b) => sum + b.alerts, 0)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Accuracy</p>
                <p className="text-2xl font-bold text-foreground">
                  {(baselines.reduce((sum, b) => sum + b.accuracy, 0) / baselines.length).toFixed(1)}%
                </p>
              </div>
              <Settings className="h-8 w-8 text-muted-foreground" />
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Health Score</p>
                <p className="text-2xl font-bold text-foreground">92.3%</p>
              </div>
              <Shield className="h-8 w-8 text-muted-foreground" />
            </div>
          </Card>
        </div>

        {/* Baselines Table */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Baseline Configurations</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Threshold</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Accuracy</TableHead>
                <TableHead>Alerts (7d)</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {baselines.map((baseline) => (
                <TableRow key={baseline.id}>
                  <TableCell className="font-medium">{baseline.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{baseline.threshold.toFixed(2)}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={baseline.status === 'Active' ? 'default' : 'secondary'}
                      className={baseline.status === 'Active' ? 'bg-green-500' : 'bg-gray-500'}
                    >
                      {baseline.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{baseline.accuracy.toFixed(1)}%</TableCell>
                  <TableCell>{baseline.alerts}</TableCell>
                  <TableCell>{baseline.lastUpdated}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <TrendingUp className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        {/* Performance Chart */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Performance Overview</h2>
          <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
            <p className="text-muted-foreground">Performance chart would be rendered here</p>
          </div>
        </Card>
      </div>
    </AppLayoutModern>
  )
}
