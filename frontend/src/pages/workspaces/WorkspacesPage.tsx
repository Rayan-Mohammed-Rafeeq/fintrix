import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { Building2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useWorkspace } from '@/contexts/WorkspaceContext'
import { useCreateWorkspaceMutation } from '@/hooks/useWorkspaces'

export function WorkspacesPage() {
  const { workspaces, isWorkspacesLoading, activeWorkspaceId, setActiveWorkspaceId } = useWorkspace()
  const [name, setName] = useState('')

  const createMutation = useCreateWorkspaceMutation()

  const canCreate = useMemo(() => !!name.trim() && !createMutation.isPending, [name, createMutation.isPending])

  const onCreate = () => {
    const trimmed = name.trim()
    if (!trimmed) return

    createMutation.mutate(
      { name: trimmed },
      {
        onSuccess: (w) => {
          toast.success('Workspace created')
          setName('')
          setActiveWorkspaceId(w.id)
        },
        onError: (err: any) => {
          const status = err?.response?.status
          const msg =
            err?.response?.data?.message ||
            (typeof err?.response?.data === 'string' ? err.response.data : null) ||
            'Failed to create workspace'
          toast.error(status ? `${msg} (HTTP ${status})` : msg)
        },
      },
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" /> My Workspaces
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isWorkspacesLoading ? (
            <p className="text-sm text-muted-foreground">Loading workspaces…</p>
          ) : workspaces.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No workspaces yet. Create one below — you will be the ADMIN.
            </p>
          ) : (
            <div className="grid gap-2">
              {workspaces.map((w) => {
                const isActive = w.id === activeWorkspaceId
                return (
                  <button
                    key={w.id}
                    type="button"
                    onClick={() => setActiveWorkspaceId(w.id)}
                    className={
                      'flex w-full items-center justify-between rounded-md border px-4 py-3 text-left text-sm transition-colors ' +
                      (isActive ? 'bg-muted' : 'hover:bg-muted/60')
                    }
                  >
                    <div>
                      <div className="font-medium">{w.name}</div>
                      <div className="text-xs text-muted-foreground">Owner ID: {w.ownerId}</div>
                    </div>
                    {isActive ? (
                      <span className="rounded-full bg-primary px-2 py-1 text-xs text-primary-foreground">Active</span>
                    ) : null}
                  </button>
                )
              })}
            </div>
          )}

          <div className="grid gap-2 md:max-w-md">
            <Label>Create workspace</Label>
            <div className="flex gap-2">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rayan's Workspace"
                disabled={createMutation.isPending}
              />
              <Button onClick={onCreate} disabled={!canCreate}>
                {createMutation.isPending ? 'Creating…' : 'Create'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

