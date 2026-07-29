export interface Client {
  id: string
  name: string
  email: string
  phone?: string
  address?: string
  createdAt: string
}

export interface ClientRequest {
  name: string
  email: string
  phone?: string
  address?: string
}
