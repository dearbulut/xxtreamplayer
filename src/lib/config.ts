import { z } from 'zod';

const envSchema = z.object({
  // JWT Configuration
  JWT_SECRET: z.string().min(1, 'JWT_SECRET must be at least 32 characters long'),

  // Database Configuration (if needed)
  DATABASE_URL: z.string().optional(),

  // Node Environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

export type Env = z.infer<typeof envSchema>;

function getConfig() {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const issues = error.issues.map(issue => `${issue.path.join('.')}: ${issue.message}`).join('\n');
      throw new Error(`Invalid environment variables:\n${issues}`);
    }
    throw error;
  }
}

export const config = getConfig();
