
import { v4 as uuidv4 } from 'uuid';

export const idempotencyMiddleware = (store) => (next) => (action) => {
  // Only intercept administrative mutation commands (POST/PUT/PATCH)
  const isMutation = action.type?.endsWith('/executeMutation') || action.meta?.requiresIdempotency;

  if (isMutation) {
    const idempotencyToken = uuidv4();
    
    // Inject token into the action payload/headers for Axios to consume
    const enhancedAction = {
      ...action,
      payload: {
        ...action.payload,
        headers: {
          ...action.payload?.headers,
          'X-Idempotency-Key': idempotencyToken,
        }
      }
    };
    
    // Log the append-only transition attempt to the console/audit stream
    console.debug(`[Idempotency Guard] Action: ${action.type} | Token: ${idempotencyToken}`);
    return next(enhancedAction);
  }

  return next(action);
};