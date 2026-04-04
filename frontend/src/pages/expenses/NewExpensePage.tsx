import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { ArrowLeft } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ExpenseForm, type ExpenseFormData } from '@/components/expenses/ExpenseForm'
import { useCreateExpenseMutation } from '@/hooks'

export function NewExpensePage() {
  const navigate = useNavigate()
  const mutation = useCreateExpenseMutation()

  const handleSubmit = (data: ExpenseFormData) => {
    mutation.mutate(data, {
      onSuccess: () => {
        toast.success('Expense created successfully')
        navigate('/expenses')
      },
      onError: () => {
        toast.error('Failed to create expense')
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
        <div>
          <h1 className="text-2xl font-bold tracking-tight">New Expense</h1>
          <p className="text-muted-foreground">
            Add a new expense to your records
          </p>
        </div>
      </div>

      {/* Form */}
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="text-base">Expense Details</CardTitle>
          <CardDescription>
            Fill in the details of your expense
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ExpenseForm
            onSubmit={handleSubmit}
            isLoading={mutation.isPending}
            submitLabel="Create Expense"
          />
        </CardContent>
      </Card>
    </div>
  )
}
