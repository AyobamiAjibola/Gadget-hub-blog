import JWT from 'jsonwebtoken';
import { resolve } from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: resolve(__dirname, "../.env") });

  export const jwtGenerator = (id: string, isAdmin: boolean, role: string ) => {
  const payload = {
    user: id,
    admin: isAdmin,
    role: role
  };
  return JWT.sign(payload, `${process.env.JWT_SECRET}`, { expiresIn: process.env.JWT_EXPIRES_IN });
};