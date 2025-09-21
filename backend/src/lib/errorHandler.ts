import { Request, Response, NextFunction } from 'express';

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error('Error:', error);

  // Default error response
  let status = 500;
  let message = 'Internal server error';

  // Handle specific error types
  if (error.message.includes('not found')) {
    status = 404;
    message = error.message;
  } else if (error.message.includes('Invalid') || error.message.includes('required')) {
    status = 400;
    message = error.message;
  } else if (error.message.includes('Unauthorized') || error.message.includes('token')) {
    status = 401;
    message = error.message;
  }

  res.status(status).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
}