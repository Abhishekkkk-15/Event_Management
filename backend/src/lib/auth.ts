import { verify } from 'jsonwebtoken';

const auth = (req: any, res: any, next: any) => {
  const token = req.cookies.token;
  if (!token) {
    next()
    
   return res.status(404).json({message:" User not authenticated"}) 
  }

  try {
    
    const decoded = verify(token, process.env.JWT_SECRET! );
    req.user = decoded; 
    next();
  } catch (error) {
    console.log(error)
    return res.status(404).json({message:" User not authenticated or Token expired"}) 

  }
};

export default auth