export interface DataRepo<T> {
  add: (data: T) => Promise<unknown>
}
