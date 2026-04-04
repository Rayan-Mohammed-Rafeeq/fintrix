import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { workspaceApi } from '@/api'
import type {
  CreateWorkspacePayload,
  InviteMemberPayload,
  UpdateMemberRolePayload,
} from '@/api/workspaceApi'

export function useMyWorkspacesQuery() {
  return useQuery({
    queryKey: ['workspaces', 'mine'],
    queryFn: workspaceApi.getMyWorkspaces,
  })
}

export function useCreateWorkspaceMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateWorkspacePayload) => workspaceApi.createWorkspace(payload),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['workspaces', 'mine'] })
    },
  })
}

export function useWorkspaceMembersQuery(workspaceId?: number) {
  return useQuery({
    queryKey: ['workspaces', workspaceId, 'members'],
    queryFn: () => workspaceApi.getMembers(workspaceId as number),
    enabled: typeof workspaceId === 'number' && workspaceId > 0,
  })
}

export function useInviteMemberMutation(workspaceId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: InviteMemberPayload) => workspaceApi.inviteMember(workspaceId, payload),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['workspaces', workspaceId, 'members'] })
    },
  })
}

export function useUpdateMemberRoleMutation(workspaceId: number, userId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: UpdateMemberRolePayload) =>
      workspaceApi.updateMemberRole(workspaceId, userId, payload),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['workspaces', workspaceId, 'members'] })
    },
  })
}

export function useRemoveMemberMutation(workspaceId: number, userId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => workspaceApi.removeMember(workspaceId, userId),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['workspaces', workspaceId, 'members'] })
    },
  })
}

