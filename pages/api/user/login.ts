import { NextApiRequest, NextApiResponse } from 'next';
import { ironOptions } from 'config/index';
import { withIronSessionApiRoute } from 'iron-session/next';
import { Cookie } from 'next-cookie';
import { ISession } from 'pages/api';
import { setCookie } from 'utils';
import { prepareConnection } from 'db/index';
import { User, UserAuth } from 'db/entity';

export default withIronSessionApiRoute(login, ironOptions);

async function login(req: NextApiRequest, res: NextApiResponse) {
  const session: ISession = req.session;
  const cookies = Cookie.fromApiRoute(req, res);
  const { phone = '', verify = '', identity_type = 'phone' } = req.body;
  const db = await prepareConnection();
  const userAuthRepo = db.getRepository(UserAuth);

  //如果验证码正确
  if (String(session.verifyCode) === String(verify)) {
    //先查询 user_auth 表里是否有该用户（登录类型、手机号，并关联user表）
    const userAuth = await userAuthRepo.findOne(
      {
        identity_type,
        identifier: phone,
      },
      {
        relations: ['user'],
      }
    );
    if (userAuth) {
      const user = userAuth.user;
      const { id: userId, nickname, avatar } = user;

      session.userId = userId;
      session.nickname = nickname;
      session.avatar = avatar;

      await session.save();
      setCookie(cookies, { userId, nickname, avatar });
      res?.status(200).json({
        code: 0,
        msg: '登录成功',
        data: {
          userId,
          nickname,
          avatar,
        },
      });
    } else {
      const user = new User();
      user.nickname = `用户_${Math.floor(Math.random() * 10000)}`;
      user.avatar = '/images/avatar.jpg';
      user.job = '暂无';
      user.introduce = '暂无';

      const userAuth = new UserAuth();
      userAuth.identifier = phone;
      userAuth.identity_type = identity_type;
      userAuth.credential = session.verifyCode;
      userAuth.user = user;

      const resUserAuth = await userAuthRepo.save(userAuth);
      const {
        user: { id, nickname, avatar },
      } = resUserAuth;
      session.userId = id;
      session.nickname = nickname;
      session.avatar = avatar;
      await session.save();
      res?.status(200).json({
        code: 0,
        msg: '登录成功',
        data: {
          userId: id,
          nickname,
          avatar,
        },
      });
    }
  } else {
    // 验证码错误
    res?.status(200).json({ code: -1, msg: '验证码错误' });
  }
}
