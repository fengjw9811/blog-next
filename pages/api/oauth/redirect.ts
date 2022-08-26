import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { Cookie } from 'next-cookie';
import { ironOptions } from 'config/index';
import { setCookie } from 'utils';
import request from 'service/fetch';
import { ISession } from 'pages/api';
import { prepareConnection } from 'db';
import { User, UserAuth } from 'db/entity';

export default withIronSessionApiRoute(redirect, ironOptions);

async function redirect(req: NextApiRequest, res: NextApiResponse) {
  const session: ISession = req.session;
  const { code } = req.query || {};
  // 向github发起获取token的请求
  const githubClientId = '4b9083c7863968471184';
  const githubClientSecret = '158872380a69d5aee7182a3a5f5ce451a7efc94f';
  const url = `https://github.com/login/oauth/access_token?client_id=${githubClientId}&client_secret=${githubClientSecret}&code=${code}`;
  const result: any = await request.post(
    url,
    {},
    {
      headers: {
        accept: 'application/json',
      },
    }
  );
  const { access_token } = result;
  // 拿到token以后，向github请求用户信息
  const githubUserInfo: any = await request.get('https://api.github.com/user', {
    headers: {
      accept: 'application/json',
      Authorization: `token ${access_token}`,
    },
  });
  const { id: github_id, login = '', avatar_url = '' } = githubUserInfo;
  const cookies = Cookie.fromApiRoute(req, res);
  // 建立数据库的连接
  const db = await prepareConnection();
  const userAuth = await db.getRepository(UserAuth).findOne(
    {
      identity_type: 'github',
      identifier: github_id,
    },
    {
      relations: ['user'],
    }
  );
  // 如果之前登录过
  if (userAuth) {
    const user = userAuth.user;
    const { id, nickname, avatar } = user;
    userAuth.credential = access_token;
    session.userId = id;
    session.nickname = nickname;
    session.avatar = avatar;
    await session.save();
    setCookie(cookies, { userId: id, nickname, avatar });
    // 重定向至首页
    res.writeHead(302, {
      Location: '/',
    });
  } else {
    // 如果之前没有登录过
    // 新建user信息
    const user = new User();
    user.nickname = login;
    user.avatar = avatar_url;
    user.job = '暂无';
    user.introduce = '暂无';
    // 新建userAuth信息
    const userAuth = new UserAuth();
    userAuth.identity_type = 'github';
    userAuth.identifier = githubClientId;
    userAuth.credential = access_token;
    userAuth.user = user;
    // 将数据插入到数据库中
    const userAuthRepo = db.getRepository(UserAuth);
    const resUserAuth = await userAuthRepo.save(userAuth);
    const { id, nickname, avatar } = resUserAuth.user;
    // 保存session和cookie
    session.userId = id;
    session.nickname = nickname;
    session.avatar = avatar;
    await session.save();
    setCookie(cookies, { userId: id, nickname, avatar });
    res.writeHead(302, {
      Location: '/',
    });
  }
}
