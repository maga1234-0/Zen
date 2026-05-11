import app from '../server/src/server';

// For Vercel serverless functions
export default async (req: any, res: any) => {
  return app(req, res);
};
