import type { Request, Response, NextFunction } from 'express';

declare module '@converge-exercise/middleware' {
  export function openApiErrorHandler(err: any, req: Request, res: Response, next: NextFunction): void
}
