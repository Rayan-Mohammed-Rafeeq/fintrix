import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { Users } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useWorkspace } from '@/contexts/WorkspaceContext'
import {
  useMyWorkspacesQuery,
  useWorkspaceMembersQuery,
  useInviteMemberMutation,
  useUpdateMemberRoleMutation,
  useRemoveMemberMutation,
} from '@/hooks'
import type { Role } from '@/types'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const roles: Role[] = ['VIEWER', 'ANALYST', 'ADMIN']

export function WorkspaceMembersPage() {
  const { user } = useAuth()
  const { activeWorkspaceId, setActiveWorkspaceId } = useWorkspace()
  const {
    data: workspaces = [],
    isLoading: isWorkspacesLoading,
    isError: isWorkspacesError,
  } = useMyWorkspacesQuery()
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<Role>('VIEWER')

  const workspaceId = activeWorkspaceId ?? workspaces[0]?.id ?? null

  // Ensure we pick a default workspace once we learn it.
  useEffect(() => {
    if (!activeWorkspaceId && workspaces.length > 0) {
      setActiveWorkspaceId(workspaces[0].id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeWorkspaceId, workspaces.length])

  const onWorkspaceSelected = (raw: string) => {
    const parsed = Number(raw)
    if (!Number.isFinite(parsed) || parsed <= 0) return
    setActiveWorkspaceId(parsed)
  }

  const {
    data: members = [],
    isLoading: isMembersLoading,
    isError: isMembersError,
  } = useWorkspaceMembersQuery(workspaceId ?? undefined)

  const myMemberRole = members.find((m) => (m.user?.id ?? 0) === (user?.id ?? -1))?.role
  const canManage = myMemberRole === 'ADMIN'
  const inviteMutation = useInviteMemberMutation(workspaceId ?? 0)

  const canInvite = canManage && !!workspaceId && !!email

  const onInvite = () => {
    if (!workspaceId) return
    if (!email.trim()) return
    inviteMutation.mutate(
      { email: email.trim(), role },
      {
        onSuccess: () => {
          toast.success('Member invited')
          setEmail('')
          setRole('VIEWER')
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.message ?? 'Failed to invite member')
        },
      },
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" /> Workspace Members
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isWorkspacesLoading ? (
            <p className="text-sm text-muted-foreground">Loading workspaces…</p>
          ) : isWorkspacesError ? (
            <p className="text-sm text-destructive">Failed to load workspaces.</p>
          ) : workspaces.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              You don’t have any workspaces yet.
            </p>
          ) : null}

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Workspace</Label>
              <select
                className="h-11 w-full rounded-md border bg-background px-3 text-sm"
                value={workspaceId ?? ''}
                onChange={(e) => onWorkspaceSelected(e.target.value)}
                disabled={isWorkspacesLoading || workspaces.length === 0}
              >
                {workspaces.length === 0 ? <option value="">No workspaces</option> : null}
                {workspaces.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@email.com"
                disabled={!canManage || !workspaceId}
              />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <select
                className="h-11 w-full rounded-md border bg-background px-3 text-sm"
                value={role}
                onChange={(e) => setRole(e.target.value as Role)}
                disabled={!canManage || !workspaceId}
              >
                {roles.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {canManage ? (
            <Button onClick={onInvite} disabled={!canInvite || inviteMutation.isPending}>
              {inviteMutation.isPending ? 'Inviting...' : 'Invite member'}
            </Button>
          ) : (
            <p className="text-sm text-muted-foreground">You can view members. Only workspace admins can invite/manage roles.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Members</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isWorkspacesLoading ? (
                <TableRow>
                  <TableCell colSpan={4}>Loading…</TableCell>
                </TableRow>
              ) : workspaces.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4}>No workspaces found</TableCell>
                </TableRow>
              ) : isMembersError ? (
                <TableRow>
                  <TableCell colSpan={4}>Failed to load members</TableCell>
                </TableRow>
              ) : isMembersLoading ? (
                <TableRow>
                  <TableCell colSpan={4}>Loading members…</TableCell>
                </TableRow>
              ) : members.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4}>No members found</TableCell>
                </TableRow>
              ) : (
                members.map((m) => (
                  <MemberRow
                    key={m.id}
                    membershipId={m.id}
                    role={m.role}
                    userId={m.user?.id ?? 0}
                    userName={m.user?.name ?? 'User'}
                    userEmail={m.user?.email ?? '-'}
                    workspaceId={workspaceId ?? 0}
                    canManage={canManage}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

function MemberRow(props: {
  membershipId: number
  role: Role
  userId: number
  userName: string
  userEmail: string
  workspaceId: number
  canManage: boolean
}) {
  const { membershipId, role, userId, userName, userEmail, workspaceId, canManage } = props
  const [nextRole, setNextRole] = useState<Role>(role)

  const updateRoleMutation = useUpdateMemberRoleMutation(workspaceId, userId)
  const removeMutation = useRemoveMemberMutation(workspaceId, userId)

  const onSaveRole = () => {
    updateRoleMutation.mutate(
      { role: nextRole },
      {
        onSuccess: () => toast.success('Role updated'),
        onError: (err: any) => toast.error(err?.response?.data?.message ?? 'Failed to update role'),
      },
    )
  }

  const onRemove = () => {
    if (!confirm(`Remove ${userName} from this workspace?`)) return
    removeMutation.mutate(undefined, {
      onSuccess: () => toast.success('Member removed'),
      onError: (err: any) => toast.error(err?.response?.data?.message ?? 'Failed to remove member'),
    })
  }

  return (
    <TableRow key={membershipId}>
      <TableCell>{userName}</TableCell>
      <TableCell>{userEmail}</TableCell>
      <TableCell>
        {canManage ? (
          <select
            className="h-9 rounded-md border bg-background px-2 text-sm"
            value={nextRole}
            onChange={(e) => setNextRole(e.target.value as Role)}
          >
            {roles.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        ) : (
          <Badge variant={role === 'ADMIN' ? 'secondary' : 'outline'}>{role}</Badge>
        )}
      </TableCell>
      <TableCell className="text-right">
        {canManage ? (
          <div className="inline-flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={onSaveRole}
              disabled={updateRoleMutation.isPending || nextRole === role}
            >
              Save
            </Button>
            <Button size="sm" variant="destructive" onClick={onRemove} disabled={removeMutation.isPending}>
              Remove
            </Button>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
        )}
      </TableCell>
    </TableRow>
  )
}

