export interface Todo {
    _id: string
    title: string
    isComplete: boolean
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
  