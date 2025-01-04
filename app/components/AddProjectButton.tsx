'use client'

import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export default function AddProjectButton() {
  return (
    <Button onClick={() => document.getElementById('add-project-form')?.scrollIntoView({ behavior: 'smooth' })}>
      <Plus className="h-4 w-4 mr-2" />
      Add New Project
    </Button>
  )
} 