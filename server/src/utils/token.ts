import jwt from 'jsonwebtoken';

type expires='7d'|'1h'|'1s'

export const signJWT = (payload: object): string => {
  const expiresIn = process.env.JWT_EXPIRES_IN as expires;
  if (!expiresIn) throw new Error('JWT_EXPIRES_IN is not defined in environment variables');

  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn:expiresIn });
};

export const signRefreshToken = (payload: object): string => {
  const expiresIn = process.env.REFRESH_TOKEN_EXPIRES_IN as expires;
  if (!expiresIn) throw new Error('REFRESH_TOKEN_EXPIRES_IN is not defined in environment variables');

  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET!, { expiresIn });
};

export const verifyRefreshToken = (token: string): { userId: string } | null => {
  try {
    const payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!) as { userId: string };
    return payload;
  } catch (error) {
    return null;
  }
};

export const verifyAccessToken = (token: string): { userId: string } | null => {
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    return payload;
  } catch (error) {
    return null;
  }
};