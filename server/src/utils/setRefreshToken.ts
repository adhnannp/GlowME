import { Response } from 'express';

export const setRefreshTokens = (res: Response, refreshToken: string) => {
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        sameSite:'lax',
        secure: false,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
};
