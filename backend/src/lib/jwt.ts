import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET!;

export const sign = (payload: any) =>{ 
  return  jwt.sign({payload}, secret, { expiresIn: '7d' }    
    )};

export const verify = (token: string) => jwt.verify(token, secret);
