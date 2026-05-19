import z from 'zod'

const accountsSchema = z.object({
  name: z.string({
    invalid_type_error: 'El nombre de la cuenta debe ser un texto.',
    required_error: 'El nombre de la cuenta es obligatorio.'
  }),
  amount: z.string({
    invalid_type_error: 'El saldo de la cuenta debe ser un texto.',
    required_error: 'El saldo de la cuenta es obligatorio.'
  }),
  color: z.string({
    invalid_type_error: 'El color de la cuenta debe ser un texto.',
    required_error: 'El color de la cuenta es obligatorio.'
  }),
  idUsers: z.array(z.string({
    invalid_type_error: 'El ID del usuario debe ser un texto.',
    required_error: 'El ID del usuario es obligatorio.'
  }))
})

export function validateAccount (input) {
  return accountsSchema.safeParse(input)
}

export function validatePartialAccount (input) {
  return accountsSchema.partial().safeParse(input)
}
