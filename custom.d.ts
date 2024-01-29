declare namespace Express {
  export interface Request {
    user: { role: string; userId: string; name: string };
  }
}
