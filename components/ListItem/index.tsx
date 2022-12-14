import Link from 'next/link';
import { EyeOutlined } from '@ant-design/icons';
import { formatDistanceToNow } from 'date-fns';
import { Avatar } from 'antd';
import { markdownToTxt } from 'markdown-to-txt';
import { IArticle } from 'pages/api/index';
import styles from './index.module.scss';

interface IProps {
  article: IArticle;
}

const ListItem = (props: IProps) => {
  const { article } = props;
  const { user, title, content } = article;
  return (
    <Link href={`/article/${article.id}`}>
      <div className={styles.container}>
        <div className={styles.article}>
          <div className={styles.userInfo}>
            <span className={styles.name}>{user.nickname}</span>
            <span className={styles.date}>
              {formatDistanceToNow(new Date(article.update_time))}
            </span>
          </div>
          <h4 className={styles.title}>{title}</h4>
          <p className={styles.content}>{markdownToTxt(content)}</p>
          <div className={styles.statistics}>
            <EyeOutlined />
            &nbsp;
            <span>{article.views}</span>
          </div>
        </div>
        <Avatar src={user.avatar} size={48}></Avatar>
      </div>
    </Link>
  );
};

export default ListItem;
