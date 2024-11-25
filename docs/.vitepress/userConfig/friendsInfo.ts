export interface Friend {
  avatar?: string // 头像链接
  name: string // 用户 id
  link: string // 博客链接
  title?: string // 用户头衔
  tag?: string // 用户标签
  color?: string // 标签颜色
  isMe?: boolean // 是否是自己
}

export const friendsInfo: Friend[] = [
  {
    avatar: 'https://avatars.githubusercontent.com/u/142326902?v=4',
    name: '戴森球',
    title: '永远相信美好的事情即将发生',
    tag: '前端开发者',
    link: '欢迎交换友链！',
    color: 'sky',
    isMe: true
  },
  {
    avatar: 'https://avatars.githubusercontent.com/u/49082837?v=4',
    name: 'zbwer',
    title: '字节，腾讯佬，来自电子科技大学',
    link: 'https://blog.zbwer.work/',
    tag: '前端开发工程师',
    color: 'orange'
  },
  {
    avatar: 'https://www.kaiven666.online/images/icon.jpg',
    name: 'Kaiven',
    title: '医学生转码，全栈佬',
    link: 'https://www.kaiven666.online/',
    tag: '全栈开发',
    color: 'indigo'
  },

]
