import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const userId = req.headers['x-user-id'];
    
    if (!userId || userId === '') {
      throw new UnauthorizedException('x-user-id header is required');
    }
    
    next();
  }
}

