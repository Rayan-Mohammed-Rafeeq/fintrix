import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { ArrowLeft } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ExpenseForm, type ExpenseFormData } from '@/components/expenses/ExpenseForm'
import { useExpensesQuery, useUpdateExpenseMutation } from '@/hooks'

export function EditExpensePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: expenses = [], isLoading } = useExpensesQuery()
  const mutation = useUpdateExpenseMutation()

  const expense = expenses.find((e) => e.id === Number(id))

  const handleSubmit = (data: ExpenseFormData) => {
    mutation.mutate(
      { id: Number(id), payload: data },
      {
        onSuccess: () => {
          toast.success('Expense updated successfully')
          navigate('/expenses')
        },
        onError: () => {
          toast.error('Failed to update expense')
        },
      },
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-md" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <Card className="max-w-2xl">
          <CardHeader>
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!expense) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Go back</span>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Expense Not Found</h1>
            <p className="text-muted-foreground">
              The expense you are looking for does not exist
            </p>
          </div>
        </div>
        <Button onClick={() => navigate('/expenses')}>
          Back to Expenses
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">Go back</span>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit Expense</h1>
          <p className="text-muted-foreground">
            Update your expense details
          </p>
        </div>
      </div>

      {/* Form */}
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="text-base">Expense Details</CardTitle>
          <CardDescription>
            Modify the details of your expense
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ExpenseForm
            defaultValues={{
              amount: expense.amount,
              category: expense.category,
              title: expense.title,
              date: expense.date,
            }}
            onSubmit={handleSubmit}
            isLoading={mutation.isPending}
            submitLabel="Update Expense"
          />
        </CardContent>
      </Card>
    </div>
  )
}
