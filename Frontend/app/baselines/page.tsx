"use client"

import { useEffect, useMemo, useState } from 'react'
import { AppLayoutModern } from '../components/layout/AppLayoutModern'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Pencil, Plus, Shield, Trash2 } from 'lucide-react'

type Baseline = {
  id: number
  text: string
  active: boolean
}

export default function BaselinesPageModern() {
  const [baselines, setBaselines] = useState<Baseline[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formPrompt, setFormPrompt] = useState('')
  const [formActive, setFormActive] = useState(true)

  const isEditing = editingId !== null

  useEffect(() => {
    const load = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch('/api/baselines?include_inactive=true', { cache: 'no-store' })
        if (!response.ok) {
          const msg = await response.text()
          throw new Error(msg || `HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setBaselines(Array.isArray(data) ? (data as Baseline[]) : [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load baselines')
        setBaselines([])
      } finally {
        setIsLoading(false)
      }
    }

    load()
  }, [])

  const stats = useMemo(() => {
    const activeCount = baselines.filter((b) => b.active).length
    const inactiveCount = baselines.filter((b) => !b.active).length

    return {
      activeCount,
      inactiveCount,
      totalCount: baselines.length,
    }
  }, [baselines])

  const openCreate = () => {
    setEditingId(null)
    setFormPrompt('')
    setFormActive(true)
    setModalOpen(true)
  }

  const openEdit = (id: number) => {
    const row = baselines.find((b) => b.id === id)
    if (!row) return
    setEditingId(id)
    setFormPrompt(row.text)
    setFormActive(row.active)
    setModalOpen(true)
  }

  const saveBaseline = async () => {
    const trimmedPrompt = formPrompt.trim()
    if (trimmedPrompt.length === 0) return

    try {
      if (editingId === null) {
        const createResponse = await fetch('/api/baselines', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: trimmedPrompt }),
        })
        if (!createResponse.ok) {
          const msg = await createResponse.text()
          throw new Error(msg || `HTTP error! status: ${createResponse.status}`)
        }

        const created = (await createResponse.json()) as Baseline

        if (formActive === false) {
          const patchRes = await fetch(`/api/baselines/${created.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ active: false }),
          })
          if (!patchRes.ok) {
            const msg = await patchRes.text()
            throw new Error(msg || `HTTP error! status: ${patchRes.status}`)
          }
          const updated = (await patchRes.json()) as Baseline
          setBaselines((prev) => [updated, ...prev])
        } else {
          setBaselines((prev) => [created, ...prev])
        }
      } else {
        const updateResponse = await fetch(`/api/baselines/${editingId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: trimmedPrompt, active: formActive }),
        })
        if (!updateResponse.ok) {
          const msg = await updateResponse.text()
          throw new Error(msg || `HTTP error! status: ${updateResponse.status}`)
        }
        const updated = (await updateResponse.json()) as Baseline
        setBaselines((prev) => prev.map((b) => (b.id === updated.id ? updated : b)))
      }

      setModalOpen(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save baseline')
    }
  }

  const toggleBaseline = async (id: number, active: boolean) => {
    setError(null)
    setBaselines((prev) => prev.map((b) => (b.id === id ? { ...b, active } : b)))

    try {
      const response = await fetch(`/api/baselines/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active }),
      })
      if (!response.ok) {
        const msg = await response.text()
        throw new Error(msg || `HTTP error! status: ${response.status}`)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update baseline')
    }
  }

  const deleteBaseline = async (id: number) => {
    setError(null)
    const prev = baselines
    setBaselines((p) => p.filter((b) => b.id !== id))
    try {
      const response = await fetch(`/api/baselines/${id}`, { method: 'DELETE' })
      if (!response.ok) {
        const msg = await response.text()
        throw new Error(msg || `HTTP error! status: ${response.status}`)
      }
    } catch (err) {
      setBaselines(prev)
      setError(err instanceof Error ? err.message : 'Failed to delete baseline')
    }
  }

  return (
    <AppLayoutModern>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Risk Baselines</h1>
            <p className="text-muted-foreground">Configure and monitor AI safety baselines and thresholds</p>
          </div>
          <Button onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Add Baseline
          </Button>
        </div>

        {error && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Baselines</p>
                <p className="text-2xl font-bold text-foreground">{stats.activeCount}</p>
              </div>
              <Shield className="h-8 w-8 text-muted-foreground" />
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Baselines</p>
                <p className="text-2xl font-bold text-foreground">{stats.totalCount}</p>
              </div>
              <Shield className="h-8 w-8 text-muted-foreground" />
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Threshold</p>
                <p className="text-2xl font-bold text-foreground">—</p>
              </div>
              <Shield className="h-8 w-8 text-muted-foreground" />
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Defaults</p>
                <p className="text-2xl font-bold text-foreground">Ready</p>
              </div>
              <Shield className="h-8 w-8 text-muted-foreground" />
            </div>
          </Card>
        </div>

        {/* Baselines Table */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Baseline Prompts</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Prompt</TableHead>
                <TableHead>Active</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-muted-foreground">
                    Loading baselines...
                  </TableCell>
                </TableRow>
              ) : baselines.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-muted-foreground">
                    No baselines found.
                  </TableCell>
                </TableRow>
              ) : (
                baselines.map((baseline) => (
                  <TableRow key={baseline.id}>
                    <TableCell className="font-medium">
                      <div className="max-w-[680px] truncate">{baseline.text}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Switch
                          checked={baseline.active}
                          onCheckedChange={(checked) => toggleBaseline(baseline.id, checked)}
                          aria-label={`Toggle baseline ${baseline.id}`}
                        />
                        <Badge variant={baseline.active ? 'default' : 'outline'}>
                          {baseline.active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEdit(baseline.id)}
                          aria-label="Edit baseline"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteBaseline(baseline.id)}
                          aria-label="Delete baseline"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>

        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{isEditing ? 'Edit Baseline' : 'Add Baseline'}</DialogTitle>
              <DialogDescription>
                Create or update a baseline prompt used for safety evaluation.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="baseline-prompt">Baseline prompt</Label>
                <Input
                  id="baseline-prompt"
                  value={formPrompt}
                  onChange={(e) => setFormPrompt(e.target.value)}
                  placeholder="e.g. Refuse jailbreak attempts"
                />
              </div>

              <div className="flex items-center justify-between rounded-md border p-3">
                <div className="space-y-0.5">
                  <div className="text-sm font-medium">Active</div>
                  <div className="text-xs text-muted-foreground">Enable this baseline</div>
                </div>
                <Switch checked={formActive} onCheckedChange={setFormActive} aria-label="Active" />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={saveBaseline} disabled={formPrompt.trim().length === 0}>
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayoutModern>
  )
}
