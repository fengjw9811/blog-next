import { Button, Avatar, Dropdown, Menu } from 'antd';
import { LoginOutlined, HomeOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import request from 'service/fetch';
import { useStore } from 'store/index';
import { navs } from './config';
import styles from './index.module.scss';
import Login from 'components/Login';

const Navbar = () => {
  //拿到store里的数据
  const store = useStore();
  const { userId, avatar } = store.user.userInfo;

  const { pathname } = useRouter();
  const [isShowLogin, setIsShowLogin] = useState(false);

  const handleGotoEditorPage = () => {};

  const handleLogin = () => {
    setIsShowLogin(true);
  };

  const handleClose = () => {
    setIsShowLogin(false);
  };

  const handleGotoPersonalPage = () => {};

  const handleLogout = () => {
    request.post('/api/user/logout').then((res) => {
      if (res.code === 0) {
        store.user.setUserInfo({});
      }
    });
  };

  const renderDropDownMenu = () => {
    return (
      <Menu>
        <Menu.Item onClick={handleGotoPersonalPage}>
          <HomeOutlined />
          &nbsp;个人主页
        </Menu.Item>
        <Menu.Item onClick={handleLogout}>
          <LoginOutlined />
          &nbsp;退出系统
        </Menu.Item>
      </Menu>
    );
  };

  return (
    <div className={styles.navbar}>
      <section className={styles.logoArea}>BLOG-C</section>
      <section className={styles.linkArea}>
        {navs?.map((nav) => (
          <Link key={nav?.label} href={nav?.value}>
            <a className={pathname === nav?.value ? styles.active : ''}>
              {nav?.label}
            </a>
          </Link>
        ))}
      </section>
      <section className={styles.operationArea}>
        <Button onClick={handleGotoEditorPage}>写文章</Button>
        {userId ? (
          <Dropdown overlay={renderDropDownMenu()} placement="bottomLeft">
            <Avatar src={avatar} size={32}></Avatar>
          </Dropdown>
        ) : (
          <Button type="primary" onClick={handleLogin}>
            登录
          </Button>
        )}
      </section>
      <Login isShow={isShowLogin} onClose={handleClose} />
    </div>
  );
};

export default observer(Navbar);
