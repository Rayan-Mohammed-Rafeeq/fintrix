import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { ArrowLeft, ArrowDownLeft } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TransactionForm, type TransactionFormData } from '@/components/transactions/TransactionForm'
import { useBorrowMutation } from '@/hooks'

export function BorrowPage() {
  const navigate = useNavigate()
  const mutation = useBorrowMutation()

  const handleSubmit = (data: TransactionFormData) => {
    mutation.mutate(data, {
      onSuccess: () => {
        toast.success('Borrow transaction recorded')
        navigate('/transactions')
      },
      onError: () => {
        toast.error('Failed to record transaction')
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
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
            <ArrowDownLeft className="h-5 w-5 text-warning" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Record Borrow</h1>
            <p className="text-muted-foreground">
              Record money you borrowed from someone
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="text-base">Borrow Details</CardTitle>
          <CardDescription>
            Fill in the details of your borrow transaction
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TransactionForm
            type="BORROW"
            onSubmit={handleSubmit}
            isLoading={mutation.isPending}
          />
        </CardContent>
      </Card>
    </div>
  )
}
