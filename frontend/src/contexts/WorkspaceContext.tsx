import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useMyWorkspacesQuery } from '@/hooks/useWorkspaces'
import type { WorkspaceSummary } from '@/api/workspaceApi'
import { onAuthStateChange } from '@/store/authStore'

const KEY = 'fintrix_active_workspace_id'

interface WorkspaceContextType {
  activeWorkspaceId: number | null
  setActiveWorkspaceId: (id: number | null) => void
  workspaces: WorkspaceSummary[]
  isWorkspacesLoading: boolean
  activeWorkspace: WorkspaceSummary | null
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined)

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [activeWorkspaceId, setActiveWorkspaceIdState] = useState<number | null>(null)

  const { data: workspaces = [], isLoading: isWorkspacesLoading } = useMyWorkspacesQuery()

  useEffect(() => {
    const raw = localStorage.getItem(KEY)
    const parsed = raw ? Number(raw) : NaN
    if (!Number.isNaN(parsed) && parsed > 0) {
      setActiveWorkspaceIdState(parsed)
    }
  }, [])

  // Prevent leaking workspace selection across users on shared devices.
  // When auth changes (login/logout), clear the stored active workspace so the
  // next user starts from their own workspace list.
  useEffect(() => {
    return onAuthStateChange(() => {
      localStorage.removeItem(KEY)
      setActiveWorkspaceIdState(null)
    })
  }, [])

  const setActiveWorkspaceId = (id: number | null) => {
    setActiveWorkspaceIdState(id)
    if (id && id > 0) {
      localStorage.setItem(KEY, String(id))
    } else {
      localStorage.removeItem(KEY)
    }
  }

  // Validate stored selection vs fetched workspaces.
  // If invalid/missing, fall back to the newest workspace.
  useEffect(() => {
    if (isWorkspacesLoading) return
    if (workspaces.length === 0) {
      if (activeWorkspaceId !== null) {
        setActiveWorkspaceId(null)
      }
      return
    }

    const isValid =
      typeof activeWorkspaceId === 'number' &&
      activeWorkspaceId > 0 &&
      workspaces.some((w) => w.id === activeWorkspaceId)

    if (!isValid) {
      setActiveWorkspaceId(workspaces[0].id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isWorkspacesLoading, workspaces.length])

  const activeWorkspace = useMemo(() => {
    if (!activeWorkspaceId) return null
    return workspaces.find((w) => w.id === activeWorkspaceId) ?? null
  }, [activeWorkspaceId, workspaces])

  const value = useMemo(
    () => ({
      activeWorkspaceId,
      setActiveWorkspaceId,
      workspaces,
      isWorkspacesLoading,
      activeWorkspace,
    }),
    [activeWorkspaceId, workspaces, isWorkspacesLoading, activeWorkspace],
  )

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>
}

export function useWorkspace() {
  const ctx = useContext(WorkspaceContext)
  if (!ctx) throw new Error('useWorkspace must be used within a WorkspaceProvider')
  return ctx
}

