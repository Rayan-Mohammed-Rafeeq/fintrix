import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

const transactionSchema = z.object({
  counterpartyUserId: z.coerce.number().int().positive('Counterparty user ID is required'),
  amount: z.coerce.number().positive('Amount must be greater than 0'),
  description: z.string().min(1, 'Description is required'),
})

export type TransactionFormData = z.infer<typeof transactionSchema>

interface TransactionFormProps {
  type: 'BORROW' | 'LEND'
  onSubmit: (data: TransactionFormData) => void
  isLoading?: boolean
}

export function TransactionForm({ type, onSubmit, isLoading = false }: TransactionFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      counterpartyUserId: 0,
      amount: 0,
      description: '',
    },
  })

  const isBorrow = type === 'BORROW'

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="counterpartyUserId">
            {isBorrow ? 'Lender User ID' : 'Borrower User ID'}
          </Label>
          <Input
            id="counterpartyUserId"
            type="number"
            min="1"
            placeholder="Enter user ID"
            {...register('counterpartyUserId')}
          />
          {errors.counterpartyUserId && (
            <p className="text-sm text-destructive">{errors.counterpartyUserId.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              className="pl-7"
              {...register('amount')}
            />
          </div>
          {errors.amount && (
            <p className="text-sm text-destructive">{errors.amount.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder={isBorrow ? 'Why did you borrow this amount?' : 'Why are you lending this amount?'}
          rows={3}
          {...register('description')}
        />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isBorrow ? 'Record Borrow' : 'Record Lend'}
        </Button>
      </div>
    </form>
  )
}
