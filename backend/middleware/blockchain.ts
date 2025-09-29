import { Request, Response, NextFunction } from 'express';

export const validateBlockchainConnection = (req: Request, res: Response, next: NextFunction) => {
  const { provider } = req.app.locals;
  
  if (!provider) {
    return res.status(503).json({ 
      error: 'Blockchain service unavailable',
      message: 'No blockchain provider configured'
    });
  }
  
  next();
};
