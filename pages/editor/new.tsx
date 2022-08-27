import { ChangeEvent, useState } from 'react';
import dynamic from 'next/dynamic';
import { Input, Button, message } from 'antd';
import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/router';
import { useStore } from 'store';
import styles from './index.module.scss';
import '@uiw/react-markdown-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import request from 'service/fetch';

const MDEditor = dynamic(
  () => import('@uiw/react-markdown-editor').then((mod) => mod.default),
  { ssr: false }
);

function NewEditor() {
  const store = useStore();
  const { userId } = store.user.userInfo;
  const { push } = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const handlePublish = () => {
    if (!title) {
      message.warning('请输入文章标题');
      return;
    }
    request
      .post('/api/article/publish', {
        title,
        content,
      })
      .then((res: any) => {
        if (res.code === 0) {
          userId ? push(`/user/${userId}`) : push('/');
          message.success('发布成功');
        } else {
          message.error(res.msg || '发布失败');
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

NewEditor.layout = null;

export default observer(NewEditor);
