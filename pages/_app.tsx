import '../styles/globals.css';
import Layout from 'components/Layout';
import { StoreProvider } from 'store';

interface IInitialValue {
  userInfo: {userId: number, nickname: string, avatar: string}
}
interface IProps {
  initialValue: IInitialValue
  Component: any,
  pageProps: any
}

function MyApp({ initialValue, Component, pageProps }: IProps) {
  const renderLayout = () => {
    if(Component.layout === null){
      return <Component {...pageProps}/>
    } else {
      return (<Layout>
        <Component {...pageProps} />
      </Layout>)
    }
  }
  return (
    <StoreProvider initialValue={initialValue}>
      {renderLayout()}
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
