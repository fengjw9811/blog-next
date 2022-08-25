import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { Cookie } from 'next-cookie';
import { ironOptions } from 'config/index';
import { clearCookie } from 'utils';

export default withIronSessionApiRoute(logout, ironOptions);

async function logout(req: NextApiRequest, res: NextApiResponse) {
  const session = req.session;
  const cookies = Cookie.fromApiRoute(req, res);

  await session.destroy();
  clearCookie(cookies);

  res.status(200).json({
    code: 0,
    msg: '退出成功',
    data: {},
  });
}
