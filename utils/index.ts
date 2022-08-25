import { Cookie } from 'next-cookie';

interface ICookieInfo {
  userId: number;
  nickname: string;
  avatar: string;
}

export const setCookie = (
  cookies: Cookie,
  { userId, nickname, avatar }: ICookieInfo
) => {
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const path = '/';

  cookies.set('userId', userId, {
    path,
    expires,
  });
  cookies.set('nickname', nickname, {
    path,
    expires,
  });
  cookies.set('avatar', avatar, {
    path,
    expires,
  });
};

export const clearCookie = (cookies: Cookie) => {
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const path = '/';

  cookies.set('userId', '', {
    path,
    expires,
  });
  cookies.set('nickname', '', {
    path,
    expires,
  });
  cookies.set('avatar', '', {
    path,
    expires,
  });
};
