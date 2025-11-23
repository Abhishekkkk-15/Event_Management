// src/types/express/index.d.ts or src/@types/express/index.d.ts
import { User } from './yourUserModel'; // Adjust according to where you have your User type

declare global {
  namespace Express {
    interface Request {
      user?: User; // Add the user property to the request object
    }
  }
}
