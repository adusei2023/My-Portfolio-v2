import { NextResponse } from 'next/server'
import { AppError } from './error'

export function apiResponse(data: any, status = 200) {
  return NextResponse.json(data, { status })
}

export function apiError(error: unknown) {
  if (error instanceof AppError) {
    return NextResponse.json(
      { error: error.message },
      { status: error.status || 500 }
    )
  }
  
  return NextResponse.json(
    { error: 'An unexpected error occurred' },
    { status: 500 }
  )
} 