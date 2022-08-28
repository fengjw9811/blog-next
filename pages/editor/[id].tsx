import { ChangeEvent, useState } from 'react';
import dynamic from 'next/dynamic';
import { Input, Button, message } from 'antd';
import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/router';
import styles from './index.module.scss';
import '@uiw/react-markdown-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import request from 'service/fetch';
import { prepareConnection } from 'db';
import { Article } from 'db/entity';
import { IArticle } from 'pages/api';

interface IProps {
  articleDetail: IArticle;
}

const MDEditor: any = dynamic(
  () => import('@uiw/react-markdown-editor').then((mod) => mod.default),
  { ssr: false }
);

export async function getServerSideProps({ params }: any) {
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

  return {
    props: {
      articleDetail: JSON.parse(JSON.stringify(articleDetail)) || [],
    },
  };
}

function ModifyEditor(props: IProps) {
  const { articleDetail } = props;
  const { push, query } = useRouter();
  const articleId = Number(query.id);
  const [title, setTitle] = useState(articleDetail.title || '');
  const [content, setContent] = useState(articleDetail.content || '');
  const handlePublish = () => {
    if (!title) {
      message.warning('请输入文章标题');
      return;
    }
    request
      .post('/api/article/update', {
        id: articleId,
        title,
        content,
      })
      .then((res: any) => {
        if (res.code === 0) {
          articleId ? push(`/article/${articleId}`) : push('/');
          message.success('更新成功');
        } else {
          message.error(res.msg || '更新失败');
        }
      });
  };
  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };
  const handleContentChange = (content: any) => {
    setContent(content);
  };
  return (
    <div className={styles.container}>
      <div className={styles.operation}>
        <Input
          className={styles.title}
          placeholder="请输入文章标题"
          value={title}
          onChange={handleTitleChange}
        />
        <Button
          className={styles.button}
          type="primary"
          onClick={handlePublish}>
          发布
        </Button>
      </div>
      <MDEditor value={content} height={1080} onChange={handleContentChange} />
    </div>
  );
}

ModifyEditor.layout = null;

export default observer(ModifyEditor);
