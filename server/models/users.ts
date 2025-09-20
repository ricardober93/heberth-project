import type { User } from "../auth/config"

export interface usersResponse {
  data: User[]
  pagination: Pagination
}
export interface Pagination {
  currentPage: number
  totalPages: number
  totalRecords: number
  pageSize: number
  hasNext: boolean
  hasPrevious: boolean
}
