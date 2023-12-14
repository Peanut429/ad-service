export default function getTweetLink(id: string, platform: 'tiktok' | 'redbook' | 'weibo') {
  if (platform === 'tiktok') {
    return `https://www.douyin.com/video/${id}`;
  } else if (platform === 'redbook') {
    return `https://www.xiaohongshu.com/discovery/item/${id}`;
  } else {
    return `https://weibo.com/detail/${id}`;
  }
}
