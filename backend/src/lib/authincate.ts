import { verify } from 'jsonwebtoken';

const authenticate = (req: any, res: any, next: any) => {
  const token = req.cookies.token;
  if (!token) {
    next()

   return 
  }

  try {
    
    const decoded = verify(token, process.env.JWT_SECRET! );
    req.user = decoded; 
    next();
  } catch (error) {
    console.log(error)
    throw new Error('Invalid or expired token');
  }
};

export default authenticate