export type Platform = 'weibo' | 'redbook' | 'tiktok';
export type UserType = 'normal' | 'koc' | 'kol' | 'star' | 'enterprise' | 'media';

export interface ReportInitialState {
  projectId: string;
  chartLoading: boolean;
  category: string[]; // 行业信息
  timeLimit: { gte: number; lte: number };
  platforms: Platform[];
  tasksId: string[];
  includeWords: string[][];
  excludeWords: string[];
  userType: UserType[];
  sentiment: number[];
  gender: string[];
  // listTimeLimit: { gte: number; lte: number };
  listPlatforms: Platform[]; // 推文筛选的平台信息
  listIncludeWords: string[][]; // 推文筛选的关键词信息
  listExcludeWords: string[]; // 推文筛选的关键词信息
  listUserType: UserType[]; // 推文筛选的用户类型
  listSentiment: number[]; // 推文筛选的情感
  commentIncludeWords: string[][]; // 评论筛选的关键词信息
  // commentPlatforms: Platform[]; // 推文筛选的平台信息
  // commentExcludeWords: string[]; // 推文筛选的关键词信息
  // commentUserType: UserType[]; // 推文筛选的用户类型
  // commentSentiment: number[]; // 推文筛选的情感

  wordcloudData?: ReportApi.WordcloudData;
  tweetTrendData?: ReportApi.TweetTrendData; // 推文数量/热度趋势图
  adNode?: ReportApi.AdNodeItem[]; // 营销事件节点
  tweetWordTrendData?: ReportApi.TweetWordTrendData; // 高频词热力图推文数据
  commentWordTrendData?: ReportApi.TweetWordTrendData; // 高频词热力图评论数据
  tweetAppearTogetherData?: ReportApi.TweetAppearTogetherData; // 共现图推文数据
  commentAppearTogetherData?: ReportApi.TweetAppearTogetherData; // 共现图评论数据
  userPortraitData?: {
    comment: ReportApi.PortraitData;
    tweet: ReportApi.PortraitData;
  };
  topicData?: ReportApi.TopicData[];
  brandBarData?: ReportApi.BrandBarData;
  wordClassData?: ReportApi.WordClassData;
  categoryBarData?: ReportApi.CategoryBarData;
  tweetSentimentData?: ReportApi.TweetSentimentData;
  commentSentimentData?: ReportApi.TweetSentimentData;
  wordCloudHiddenWord: string[]; // 词云中隐藏的关键词
  wordCloudDeleteWord: string[]; // 词云中删除的关键词
  brandBarHiddenWord: string[]; // 品牌类别中隐藏的品牌
  brandBarDeleteWord: string[]; // 品牌类别中删除的品牌
  wordClassHiddenWord: string[]; // 关键词类别中隐藏的关键词
  wordClassDeleteWord: string[]; // 关键词类别中删除的关键词
  appearTogetherHiddenWord: string[]; // 共现关系图中隐藏的关键词
  appearTogetherDeleteWord: string[]; // 共现关系图中删除的关键词
  wordTrendHiddenWord: string[]; // 高频词热力图中隐藏的关键词
  wordTrendDeleteWord: string[]; // 高频词热力图中删除的关键词
  categoryBarHiddenWord: string[]; // 品类柱状图中隐藏的关键词
  categoryBarDeleteWord: string[]; // 品类柱状图中删除的关键词
  specificChartHiddenWord: string[]; // 特殊图（客户特别需求）中隐藏的关键词
  specificChartDeleteWord: string[]; // 特殊图（客户特别需求）中删除的关键词
  wordMap: Record<string, string>; // 关键词映射
  excludeNotes: string[]; // 排除的推文
  excludeUsers: string[]; // 排除的用户
  wordClassType: string[]; // 词类筛选
}

const initialState: ReportInitialState = {
  projectId: '',
  chartLoading: false,
  category: [],
  timeLimit: { gte: 0, lte: 0 },
  platforms: ['redbook', 'tiktok'],
  tasksId: [],
  includeWords: [],
  excludeWords: [],
  userType: [],
  sentiment: [],
  gender: [],
  listPlatforms: ['redbook', 'tiktok'],
  listIncludeWords: [],
  listExcludeWords: [],
  listUserType: [],
  listSentiment: [],
  commentIncludeWords: [],
  wordCloudHiddenWord: [],
  wordCloudDeleteWord: [],
  brandBarHiddenWord: [],
  brandBarDeleteWord: [],
  wordClassHiddenWord: [],
  wordClassDeleteWord: [],
  appearTogetherHiddenWord: [],
  appearTogetherDeleteWord: [],
  wordTrendHiddenWord: [],
  wordTrendDeleteWord: [],
  categoryBarHiddenWord: [],
  categoryBarDeleteWord: [],
  specificChartHiddenWord: [],
  specificChartDeleteWord: [],
  wordMap: {},
  excludeNotes: [],
  excludeUsers: [],
  wordClassType: [],
};

export default initialState;
