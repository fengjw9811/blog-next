import { Avatar } from 'antd';
import { observer } from 'mobx-react-lite';
import Link from 'next/link';
import Markdown from 'markdown-to-jsx';
import { format } from 'date-fns';
import { useStore } from 'store';
import { prepareConnection } from 'db';
import { Article } from 'db/entity';
import { IArticle } from 'pages/api/index';
import styles from './index.module.scss';

interface IProps {
  articleDetail: IArticle;
}

export async function getServerSideProps({ params }) {
  const articleId = params.id;
  const db = await prepareConnection();
  const articleRepo = db.getRepository(Article);
  const article = await articleRepo.find({
    where: {
      id: articleId,
    },
    relations: ['user'],
  });
  const articleDetail = article[0];
  //阅读次数+1
  if (articleDetail) {
    articleDetail.views = articleDetail.views + 1;
    await articleRepo.save(article);
  }
  return {
    props: {
      articleDetail: JSON.parse(JSON.stringify(articleDetail)) || [],
    },
  };
}

const ArticleDetail = (props: IProps) => {
  const store = useStore();
  const loginUserInfo = store.user.userInfo;
  const { articleDetail } = props;
  const {
    user: { id, nickname, avatar },
  } = articleDetail;
  return (
    <div className="content-layout">
      <h2 className={styles.title}>{articleDetail.title}</h2>
      <div className={styles.user}>
        <Avatar src={avatar} size={50} />
        <div className={styles.info}>
          <div className={styles.name}>{nickname}</div>
          <div className={styles.date}>
            <div>
              {format(
                new Date(articleDetail.update_time),
                'yyyy-MM-dd hh:mm:ss'
              )}
            </div>
            <div>阅读 {articleDetail.views}</div>
            {Number(loginUserInfo.userId) === Number(id) && (
              <Link href={`/editor/${articleDetail.id}`}>编辑</Link>
            )}
          </div>
        </div>
      </div>
      <Markdown className="">{articleDetail.content}</Markdown>
    </div>
  );
};

export default observer(ArticleDetail);
