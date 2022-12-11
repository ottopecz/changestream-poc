export interface DataRepo<T, U> {
  add: (data: T) => Promise<unknown>
  fetch: (query: U) => Promise<T[]>
}
