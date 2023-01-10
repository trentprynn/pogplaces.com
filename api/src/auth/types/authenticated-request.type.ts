export type AuthenticatedRequest = Request & { user: { id: string } }
