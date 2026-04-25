import type { VercelRequest, VercelResponse } from '@vercel/node';
import app from '../server/src/server';

export default async (req: VercelRequest, res: VercelResponse) => {
  return app(req, res);
};
