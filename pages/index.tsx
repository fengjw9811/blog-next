import { Divider } from 'antd';
import { prepareConnection } from 'db';
import { Article } from 'db/entity';
import ListItem from 'components/ListItem';
import { IArticle } from 'pages/api/index';
interface IProps {
  articles: IArticle[];
}

export async function getServerSideProps() {
  const db = await prepareConnection();
  const articles = await db.getRepository(Article).find({
    relations: ['user'],
  });

  return {
    props: {
      articles: JSON.parse(JSON.stringify(articles)) || [],
    },
  };
}

const Home = (props: IProps) => {
  const { articles } = props;
  return (
    <div className="content-layout">
      {articles.map((article: IArticle, index) => (
        <>
          <ListItem article={article} key={index}></ListItem>
          <Divider />
        </>
      ))}
    </div>
  );
};

export default Home;
