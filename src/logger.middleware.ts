import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now();

    res.on('finish', () => {
      const endTime = Date.now();
      const timeTaken = endTime - startTime;
      console.log(`Request URL: ${req.url}`);
      console.log(`Request Method: ${req.method}`);
      console.log(`Time Taken: ${timeTaken}ms`);
    });

    next();
  }
}
