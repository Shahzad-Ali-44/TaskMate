export interface Todo {
    _id: string
    title: string
    isComplete: boolean
    status: 'pending' | 'ongoing' | 'completed'
    userId: string
    createdAt: string
    updatedAt: string
  }

export interface User {
    _id: string
    name: string
    email: string
    createdAt: string
    updatedAt: string
  }
  