export type Platform = 'weibo' | 'redbook' | 'tiktok';
export type UserType = 'normal' | 'koc' | 'kol' | 'star' | 'enterprise' | 'media';

export interface ReportInitialState {
  projectId: string;
  category: string[]; // 行业信息
  timeLimit: { gte: number; lte: number };
  platforms: Platform[];
  tasksId: string[];
  includeWords: string[][];
  excludeWords: string[];
  userType: UserType[];
  sentiment: number[];
  listTimeLimit: { gte: number; lte: number };
  listPlatforms: Platform[];
  listIncludeWords: string[][];
  listExcludeWords: string[];
  listUserType: UserType[];
  listSentiment: number[];
  wordcloudData?: ReportApi.WordcloudData;
  tweetTrendData?: ReportApi.TweetTrendData;
  adNode?: ReportApi.AdNodeItem[];
  tweetWordTrendData?: ReportApi.TweetWordTrendData;
  tweetAppearTogetherData?: ReportApi.TweetAppearTogetherData;
  userPortraitData?: {
    comment: ReportApi.PortraitData;
    tweet: ReportApi.PortraitData;
  };
  topicData?: ReportApi.TopicData[];
  brandBarData?: ReportApi.BrandBarData;
  wordClassData?: ReportApi.WordClassData;
  wordCloudHiddenWord: string[];
  brandBarHiddenWord: string[];
  wordClassHiddenWord: string[];
  appearTogetherHiddenWord: string[];
  wordTrendHiddenWord: string[]; // 高频词热力图中隐藏的关键词
  wordTrendDeleteWord: string[]; // 高频词热力图中删除的关键词
  wordCloudDeleteWord: string[]; // 词云中删除的关键词
  appearTogetherDeleteWord: string[]; // 共现关系图中删除的关键词
  wordMap: Record<string, string>; // 关键词映射
}

const initialState: ReportInitialState = {
  projectId: '',
  category: [],
  timeLimit: { gte: 0, lte: 0 },
  platforms: ['redbook'],
  tasksId: [],
  includeWords: [],
  excludeWords: [],
  userType: [],
  sentiment: [],
  listTimeLimit: { gte: 0, lte: 0 },
  listPlatforms: ['redbook', 'tiktok'],
  listIncludeWords: [],
  listExcludeWords: [],
  listUserType: [],
  listSentiment: [],
  wordCloudHiddenWord: [],
  brandBarHiddenWord: [],
  wordClassHiddenWord: [],
  appearTogetherHiddenWord: [],
  wordTrendHiddenWord: [],
  wordTrendDeleteWord: [],
  wordCloudDeleteWord: [],
  appearTogetherDeleteWord: [],
  wordMap: {},
};

export default initialState;
