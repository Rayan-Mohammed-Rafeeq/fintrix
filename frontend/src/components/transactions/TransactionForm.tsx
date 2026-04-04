import * as React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useWorkspace } from '@/contexts/WorkspaceContext'
import { useAuth } from '@/contexts/AuthContext'
import { useInviteMemberMutation, useWorkspaceMembersQuery } from '@/hooks'
import type { Role } from '@/types'
import { MemberAutocomplete } from '@/components/workspaces/MemberAutocomplete'

const transactionSchema = z.object({
  counterpartyEmail: z.string().trim().email('Valid email is required'),
  amount: z.coerce.number().positive('Amount must be greater than 0'),
  description: z.preprocess(
    (val) => (typeof val === 'string' ? val.trim() : ''),
    z.string().min(1, 'Description is required'),
  ),
})

export type TransactionFormData = z.infer<typeof transactionSchema>

interface TransactionFormProps {
  type: 'BORROW' | 'LEND'
  onSubmit: (data: TransactionFormData) => void
  isLoading?: boolean
}

export function TransactionForm({ type, onSubmit, isLoading = false }: TransactionFormProps) {
  const { activeWorkspaceId } = useWorkspace()
  const { user } = useAuth()

  const workspaceId = activeWorkspaceId ?? 0
  const membersQuery = useWorkspaceMembersQuery(workspaceId > 0 ? workspaceId : undefined)
  const inviteMutation = useInviteMemberMutation(workspaceId)

  const members = membersQuery.data ?? []
  const myMemberRole = members.find((m) => (m.user?.id ?? 0) === (user?.id ?? -1))?.role
  const canInvite = myMemberRole === 'ADMIN'

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      counterpartyEmail: '',
      amount: 0,
      description: '',
    },
  })

  const isBorrow = type === 'BORROW'

  const selectableMembers = members
    .map((m) => ({
      id: m.user?.id ?? 0,
      name: m.user?.name ?? 'User',
      email: m.user?.email ?? '',
    }))
    .filter((m) => m.id > 0 && !!m.email)
    // Can't transact with yourself
    .filter((m) => m.id !== (user?.id ?? -1))

  // Invite dialog state
  const [inviteOpen, setInviteOpen] = React.useState(false)
  const [inviteEmail, setInviteEmail] = React.useState('')
  const [inviteRole, setInviteRole] = React.useState<Role>('VIEWER')

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit, (err) => {
        // Helps debug cases where the submit "does nothing" because validation blocks it.
        // eslint-disable-next-line no-console
        console.log('TransactionForm validation errors', err)
      })}
      className="space-y-6"
    >
      {Object.keys(errors).length > 0 && (
        <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          Please fix the highlighted fields to continue.
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="counterpartyEmail">
            {isBorrow ? 'Lender Email' : 'Borrower Email'}
          </Label>
          <Controller
            name="counterpartyEmail"
            control={control}
            render={({ field }) => (
              <div className="space-y-2">
                <MemberAutocomplete
                  items={selectableMembers}
                  value={field.value ?? ''}
                  onChange={(email) => field.onChange(email)}
                  placeholder={
                    membersQuery.isLoading
                      ? 'Loading members…'
                      : selectableMembers.length === 0
                        ? 'No other members in this workspace'
                        : 'Select a workspace member'
                  }
                  disabled={membersQuery.isLoading || workspaceId <= 0}
                />

                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-xs text-muted-foreground">
                    Only workspace members can be selected.
                  </p>

                  <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
                    <DialogTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={!canInvite || workspaceId <= 0}
                      >
                        Invite member
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Invite member</DialogTitle>
                        <DialogDescription>
                          Invite a user to this workspace so they can be selected in transactions.
                        </DialogDescription>
                      </DialogHeader>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Email</Label>
                          <Input
                            value={inviteEmail}
                            onChange={(e) => setInviteEmail(e.target.value)}
                            placeholder="user@email.com"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Role</Label>
                          <select
                            className="h-11 w-full rounded-md border bg-background px-3 text-sm"
                            value={inviteRole}
                            onChange={(e) => setInviteRole(e.target.value as Role)}
                          >
                            <option value="VIEWER">VIEWER</option>
                            <option value="ANALYST">ANALYST</option>
                            <option value="ADMIN">ADMIN</option>
                          </select>
                          <p className="text-xs text-muted-foreground">
                            Only workspace ADMINs can invite members.
                          </p>
                        </div>
                      </div>

                      <DialogFooter>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setInviteOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="button"
                          disabled={!canInvite || inviteMutation.isPending || !inviteEmail.trim()}
                          onClick={() => {
                            if (!workspaceId) return
                            inviteMutation.mutate(
                              { email: inviteEmail.trim(), role: inviteRole },
                              {
                                onSuccess: () => {
                                  toast.success('Member invited')
                                  const email = inviteEmail.trim()
                                  setInviteEmail('')
                                  setInviteRole('VIEWER')
                                  setInviteOpen(false)
                                  // Auto-select so user can submit immediately.
                                  setValue('counterpartyEmail', email, { shouldValidate: true })
                                },
                                onError: (err: any) => {
                                  toast.error(err?.response?.data?.message ?? 'Failed to invite member')
                                },
                              },
                            )
                          }}
                        >
                          {inviteMutation.isPending ? 'Inviting…' : 'Invite'}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            )}
          />
          {errors.counterpartyEmail && (
            <p className="text-sm text-destructive">{errors.counterpartyEmail.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
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
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <Textarea
              id="description"
              placeholder={isBorrow ? 'Why did you borrow this amount?' : 'Why are you lending this amount?'}
              rows={3}
              value={field.value ?? ''}
              onChange={field.onChange}
              onBlur={field.onBlur}
              name={field.name}
              ref={field.ref}
            />
          )}
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
