import { IronSession } from 'iron-session';

export type ISession = IronSession & Record<string, any>;

export type IUser = {
  avatar: string,
  id: number,
  introduce: string,
  job: string,
  nickname: string,
};

export type IArticle = {
  id: number,
  title: string,
  content: string,
  create_time: Date,
  update_time: Date,
  views: number,
  user: IUser,
};
