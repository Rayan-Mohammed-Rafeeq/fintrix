import { apiClient } from '@/api/client'
import type { Role } from '@/types'

export interface WorkspaceSummary {
  id: number
  name: string
  ownerId: number
}

export interface CreateWorkspacePayload {
  name: string
}

export interface MembershipUser {
  id: number
  name: string
  email: string
}

export interface MembershipDto {
  id: number
  role: Role
  user: MembershipUser
}

export interface InviteMemberPayload {
  email: string
  role?: Role
}

export interface UpdateMemberRolePayload {
  role: Role
}

export const workspaceApi = {
  async getMyWorkspaces(): Promise<WorkspaceSummary[]> {
    const res = await apiClient.get<WorkspaceSummary[]>('/api/v1/workspaces')
    return res.data
  },

  async createWorkspace(payload: CreateWorkspacePayload): Promise<WorkspaceSummary> {
    const res = await apiClient.post<WorkspaceSummary>('/api/v1/workspaces', payload)
    return res.data
  },

  async getMembers(workspaceId: number): Promise<MembershipDto[]> {
    const res = await apiClient.get<MembershipDto[]>(`/api/v1/workspaces/${workspaceId}/members`)
    return res.data
  },

  async inviteMember(workspaceId: number, payload: InviteMemberPayload): Promise<MembershipDto> {
    const res = await apiClient.post<MembershipDto>(`/api/v1/workspaces/${workspaceId}/members`, payload)
    return res.data
  },

  async updateMemberRole(
    workspaceId: number,
    userId: number,
    payload: UpdateMemberRolePayload,
  ): Promise<MembershipDto> {
    const res = await apiClient.put<MembershipDto>(
      `/api/v1/workspaces/${workspaceId}/members/${userId}/role`,
      payload,
    )
    return res.data
  },

  async removeMember(workspaceId: number, userId: number): Promise<void> {
    await apiClient.delete(`/api/v1/workspaces/${workspaceId}/members/user/${userId}`)
  },

  async leaveWorkspace(workspaceId: number): Promise<void> {
    await apiClient.delete(`/api/v1/workspaces/${workspaceId}/members/me`)
  },

  async deleteWorkspace(workspaceId: number): Promise<void> {
    await apiClient.delete(`/api/v1/workspaces/${workspaceId}`)
  },
}

