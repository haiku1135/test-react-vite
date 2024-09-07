export const queryKeys = {
  user: ['user'] as const,
  books: (offset:number) => ['books', offset],
}