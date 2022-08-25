import '../styles/globals.css';
import Layout from 'components/Layout';
import { StoreProvider } from 'store';
import { NextPage } from 'next';

interface IInitialValue {
  userInfo: {userId: number, nickname: string, avatar: string}
}
interface IProps {
  initialValue: IInitialValue
  Component: NextPage,
  pageProps: any
}

function MyApp({ initialValue, Component, pageProps }: IProps) {
  return (
    <StoreProvider initialValue={initialValue}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </StoreProvider>
  );
}

MyApp.getInitialProps = async ({ ctx }) => {
  const cookies = ctx.req?.cookies
  if(!cookies){
    return {}
  }
  const {userId, nickname, avatar} = cookies
    return {
      initialValue: {
        user: {
          userInfo: {
            userId,
            nickname,
            avatar,
          },
        },
      },
    };
};

export default MyApp;
