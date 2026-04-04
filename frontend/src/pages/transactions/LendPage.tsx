import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TransactionForm, type TransactionFormData } from '@/components/transactions/TransactionForm'
import { useLendMutation, useMyWorkspacesQuery } from '@/hooks'
import { useWorkspace } from '@/contexts/WorkspaceContext'
import { useEffect } from 'react'

export function LendPage() {
  const navigate = useNavigate()
  const mutation = useLendMutation()
  const { activeWorkspaceId, setActiveWorkspaceId } = useWorkspace()
  const { data: workspaces = [], isLoading: isWorkspacesLoading } = useMyWorkspacesQuery()

  useEffect(() => {
    if (!activeWorkspaceId && workspaces.length > 0) {
      setActiveWorkspaceId(workspaces[0].id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeWorkspaceId, workspaces.length])

  const handleSubmit = (data: TransactionFormData) => {
    mutation.mutate(data, {
      onSuccess: () => {
        toast.success('Lend transaction recorded')
        navigate('/transactions')
      },
      onError: (err: any) => {
        const status = err?.response?.status
        if (status === 403) {
          toast.error('You don’t have permission to record transactions in this workspace. Ask an admin to change your role from VIEWER to ANALYST or ADMIN.')
          return
        }

        toast.error(err?.response?.data?.message ?? 'Failed to record transaction')
      },
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">Go back</span>
        </Button>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
            <ArrowUpRight className="h-5 w-5 text-success" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Record Lend</h1>
            <p className="text-muted-foreground">
              Record money you lent to someone
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="text-base">Lend Details</CardTitle>
          <CardDescription>
            Fill in the details of your lend transaction
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isWorkspacesLoading ? (
            <p className="text-sm text-muted-foreground">Loading workspaces…</p>
          ) : workspaces.length === 0 ? (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">You don’t have any workspaces yet.</p>
              <Button type="button" variant="outline" onClick={() => navigate('/workspaces')}>Create a workspace</Button>
            </div>
          ) : !activeWorkspaceId ? (
            <p className="text-sm text-muted-foreground">Selecting workspace…</p>
          ) : (
            <TransactionForm
              type="LEND"
              onSubmit={handleSubmit}
              isLoading={mutation.isPending}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
