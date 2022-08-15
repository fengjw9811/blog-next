import { NextApiRequest, NextApiResponse } from 'next';
import { format } from 'date-fns';
import md5 from 'md5';
import { encode } from 'js-base64';
import { withIronSessionApiRoute } from 'iron-session/next';
import request from 'service/fetch';
import { ISession } from 'pages/api/index';
import { ironOptions } from 'config/index';

export default withIronSessionApiRoute(sendVerifyCode, ironOptions);

async function sendVerifyCode(req: NextApiRequest, res: NextApiResponse) {
  const session: ISession = req.session;
  const { to = '', templateId = '1' } = req.body;
  const AppId = '8a216da8827c888b0182a2daccf105cd';
  const AccountId = '8a216da8827c888b0182a2dacbed05c6';
  const AuthToken = '485c8cca569344698ff85e4d5ab7a1ad';
  const NowDate = format(new Date(), 'yyyyMMddHHmmss');
  const SigParameter = md5(`${AccountId}${AuthToken}${NowDate}`);
  const Authorization = encode(`${AccountId}:${NowDate}`);
  const verifyCode = Math.floor(Math.random() * (9999 - 1000)) + 1000;
  const expireMinute = '5';
  const url = `https://app.cloopen.com:8883/2013-12-26/Accounts/${AccountId}/SMS/TemplateSMS?sig=${SigParameter}`;
  const response = await request.post(
    url,
    {
      to,
      templateId,
      appId: AppId,
      datas: [verifyCode, expireMinute],
    },
    {
      headers: {
        Authorization,
      },
    }
  );
  console.log(response);
  const { statusCode, statusMsg, templateSMS } = response as any;
  if (statusCode === '000000') {
    session.verifyCode = verifyCode;
    await session.save();
  } else {
    res.status(200).json({
      code: statusCode,
      msg: statusMsg,
      data: {
        templateSMS,
      },
    });
  }
  res.status(200).json({
    code: 0,
    data: 123,
  });
}
