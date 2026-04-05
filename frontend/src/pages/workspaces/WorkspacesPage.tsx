import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { Building2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useWorkspace } from '@/contexts/WorkspaceContext'
import {
  useCreateWorkspaceMutation,
  useDeleteWorkspaceMutation,
  useLeaveWorkspaceMutation,
  useWorkspaceMembersQuery,
} from '@/hooks/useWorkspaces'
import { useAuth } from '@/contexts/AuthContext'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

export function WorkspacesPage() {
  const { workspaces, isWorkspacesLoading, activeWorkspaceId, setActiveWorkspaceId } = useWorkspace()
  const { user } = useAuth()
  const [name, setName] = useState('')
  const [deleteWorkspaceId, setDeleteWorkspaceId] = useState<number | null>(null)
  const [leaveWorkspaceId, setLeaveWorkspaceId] = useState<number | null>(null)

  const createMutation = useCreateWorkspaceMutation()
  const deleteMutation = useDeleteWorkspaceMutation()
  const leaveMutation = useLeaveWorkspaceMutation()

  const deleteMembersQuery = useWorkspaceMembersQuery(deleteWorkspaceId ?? undefined)
  const activeMembersQuery = useWorkspaceMembersQuery(activeWorkspaceId ?? undefined)
  const leaveMembersQuery = useWorkspaceMembersQuery(leaveWorkspaceId ?? undefined)

  const canDeleteActive = useMemo(() => {
    const wsId = activeWorkspaceId
    if (!wsId) return false
    const me = user?.id
    if (!me) return false
    const members = activeMembersQuery.data ?? []
    return members.some((m) => m.user?.id === me && m.role === 'ADMIN')
  }, [activeWorkspaceId, activeMembersQuery.data, user?.id])
  const canDeleteSelected = useMemo(() => {
    if (!deleteWorkspaceId) return false
    const members = deleteMembersQuery.data ?? []
    const me = user?.id
    if (!me) return false
    return members.some((m) => m.user?.id === me && m.role === 'ADMIN')
  }, [deleteWorkspaceId, deleteMembersQuery.data, user?.id])

  const canLeaveSelected = useMemo(() => {
    if (!leaveWorkspaceId) return false
    const members = leaveMembersQuery.data ?? []
    const me = user?.id
    if (!me) return false
    return members.some((m) => m.user?.id === me)
  }, [leaveWorkspaceId, leaveMembersQuery.data, user?.id])

  const canLeaveActive = useMemo(() => {
    const wsId = activeWorkspaceId
    if (!wsId) return false
    const members = activeMembersQuery.data ?? []
    const me = user?.id
    if (!me) return false
    const myRole = members.find((m) => m.user?.id === me)?.role
    // Admins should delete instead; leaving is for others (requested: leave others' workspaces)
    return !!myRole && myRole !== 'ADMIN'
  }, [activeWorkspaceId, activeMembersQuery.data, user?.id])

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
                  <div
                    key={w.id}
                    className={
                      'flex w-full items-center justify-between gap-3 rounded-md border px-4 py-3 text-left text-sm transition-colors ' +
                      (isActive ? 'bg-muted' : 'hover:bg-muted/60')
                    }
                  >
                    <button type="button" onClick={() => setActiveWorkspaceId(w.id)} className="flex min-w-0 flex-1 items-center justify-between">
                      <div className="min-w-0">
                        <div className="truncate font-medium">{w.name}</div>
                      </div>
                      {isActive ? (
                        <span className="rounded-full bg-primary px-2 py-1 text-xs text-primary-foreground">Active</span>
                      ) : null}
                    </button>

                    {isActive && canDeleteActive ? (
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => setDeleteWorkspaceId(w.id)}
                        disabled={deleteMutation.isPending}
                      >
                        Delete
                      </Button>
                    ) : null}

                    {isActive && canLeaveActive ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setLeaveWorkspaceId(w.id)}
                        disabled={leaveMutation.isPending}
                      >
                        Leave
                      </Button>
                    ) : null}
                  </div>
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteWorkspaceId !== null} onOpenChange={() => setDeleteWorkspaceId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete workspace</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this workspace? This will delete all its transactions, expenses, and members. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (!deleteWorkspaceId) return
                if (!canDeleteSelected) {
                  toast.error('Only workspace ADMINs can delete this workspace')
                  return
                }
                deleteMutation.mutate(deleteWorkspaceId, {
                  onSuccess: () => {
                    toast.success('Workspace deleted')
                    if (activeWorkspaceId === deleteWorkspaceId) {
                      setActiveWorkspaceId(null)
                    }
                    setDeleteWorkspaceId(null)
                  },
                  onError: (err: any) => {
                    toast.error(err?.response?.data?.message ?? 'Failed to delete workspace')
                  },
                })
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? 'Deleting…' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Leave Confirmation Dialog */}
      <AlertDialog open={leaveWorkspaceId !== null} onOpenChange={() => setLeaveWorkspaceId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Leave workspace</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to leave this workspace? You will lose access immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={leaveMutation.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (!leaveWorkspaceId) return
                if (!canLeaveSelected) {
                  toast.error('You are not a member of this workspace')
                  return
                }
                leaveMutation.mutate(leaveWorkspaceId, {
                  onSuccess: () => {
                    toast.success('Left workspace')
                    if (activeWorkspaceId === leaveWorkspaceId) {
                      setActiveWorkspaceId(null)
                    }
                    setLeaveWorkspaceId(null)
                  },
                  onError: (err: any) => {
                    toast.error(err?.response?.data?.message ?? 'Failed to leave workspace')
                  },
                })
              }}
            >
              {leaveMutation.isPending ? 'Leaving…' : 'Leave'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

