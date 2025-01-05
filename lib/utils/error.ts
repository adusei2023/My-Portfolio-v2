export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public status?: number
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export function handleError(error: unknown) {
  console.error('Error:', error)
  if (error instanceof AppError) {
    return {
      error: error.message,
      code: error.code,
      status: error.status || 500
    }
  }
  return {
    error: 'An unexpected error occurred',
    status: 500
  }
} 