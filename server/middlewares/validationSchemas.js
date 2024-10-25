const z = require('zod')

export const signupSchema = z.object({
  username: z.string().min(4, "Username must be at least 4 characters long"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export default { signupSchema, loginSchema };
