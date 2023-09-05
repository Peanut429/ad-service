export default function getTweetLink(id: string, platform: 'tiktok' | 'redbook') {
  if (platform === 'tiktok') {
    return `https://www.douyin.com/video/${id}`;
  }
  return `https://www.xiaohongshu.com/discovery/item/${id}`;
}
