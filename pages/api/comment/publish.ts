import { NextApiRequest, NextApiResponse } from 'next';
import { ironOptions } from 'config/index';
import { withIronSessionApiRoute } from 'iron-session/next';
import { ISession } from 'pages/api';
import { prepareConnection } from 'db/index';
import { User, Article, Comment } from 'db/entity';
import { EXCEPTION_COMMENT } from '../config/codes';

export default withIronSessionApiRoute(publish, ironOptions);

async function publish(req: NextApiRequest, res: NextApiResponse) {
  const session: ISession = req.session;
  const { articleId = 0, content = '' } = req.body;
  const db = await prepareConnection();
  const commentRepo = db.getRepository(Comment);

  const comment = new Comment();
  comment.content = content;
  comment.create_time = new Date();
  comment.update_time = new Date();

  const user = await db.getRepository(User).findOne({
    id: session.userId,
  });
  const article = await db.getRepository(Article).findOne({
    id: articleId,
  });

  if (user) {
    comment.user = user;
  }
  if (article) {
    comment.article = article;
  }

  const resComment = await commentRepo.save(comment);
  if (resComment) {
    res.status(200).json({
      code: 0,
      msg: '发表成功',
      data: resComment,
    });
  } else {
    res.status(200).json({ ...EXCEPTION_COMMENT.PUBLISH_FAILED });
  }
}
