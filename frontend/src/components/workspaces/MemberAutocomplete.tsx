import { useMemo, useState } from 'react'
import { Check, ChevronsUpDown, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export type MemberAutocompleteItem = {
  id: number
  name: string
  email: string
}

export function MemberAutocomplete(props: {
  items: MemberAutocompleteItem[]
  value: string
  onChange: (email: string) => void
  placeholder?: string
  disabled?: boolean
}) {
  const { items, value, onChange, placeholder = 'Select a member…', disabled } = props
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')

  const selected = useMemo(
    () => items.find((m) => m.email.toLowerCase() === value.toLowerCase()),
    [items, value],
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return items
    return items.filter((m) =>
      `${m.name} ${m.email}`.toLowerCase().includes(q),
    )
  }, [items, query])

  return (
    <div className="relative">
      <Button
        type="button"
        variant="outline"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        className="h-11 w-full justify-between"
        aria-expanded={open}
      >
        <span className={cn('truncate text-left', !selected && 'text-muted-foreground')}>
          {selected ? `${selected.name} (${selected.email})` : placeholder}
        </span>
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>

      {open && (
        <div className="absolute z-50 mt-2 w-full rounded-md border bg-background p-2 shadow-md">
          <div className="flex items-center gap-2 pb-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or email…"
              className="h-9"
            />
          </div>
          <div className="max-h-56 overflow-auto">
            {filtered.length === 0 ? (
              <p className="px-2 py-2 text-sm text-muted-foreground">No matches.</p>
            ) : (
              filtered.map((m) => {
                const isSelected = selected?.email.toLowerCase() === m.email.toLowerCase()
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      onChange(m.email)
                      setOpen(false)
                      setQuery('')
                    }}
                    className={cn(
                      'flex w-full items-center justify-between rounded-md px-2 py-2 text-left text-sm hover:bg-accent',
                      isSelected && 'bg-accent',
                    )}
                  >
                    <span className="truncate">
                      <span className="font-medium">{m.name}</span>
                      <span className="text-muted-foreground"> — {m.email}</span>
                    </span>
                    {isSelected ? <Check className="h-4 w-4" /> : null}
                  </button>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}

