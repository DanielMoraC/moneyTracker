import z from 'zod'

const userSchema = z.object({
  userName: z.string({
    invalid_type_error: 'El nombre de usuario debe ser un texto.',
    required_error: 'El nombre de usuario es obligatorio.'
  }),
  password: z.string({
    invalid_type_error: 'La contraseña debe ser un texto.',
    required_error: 'La contraseña es obligatoria.'
  })
})

export function validateUser (input) {
  return userSchema.safeParse(input)
}

export function validatePartialUser (input) {
  return userSchema.partial().safeParse(input)
}
