export type Platform = 'weibo' | 'redbook' | 'tiktok';
export type UserType = 'normal' | 'koc' | 'kol' | 'star' | 'enterprise' | 'media';

export interface ReportInitialState {
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
}

const initialState: ReportInitialState = {
  timeLimit: { gte: 0, lte: 0 },
  platforms: ['redbook'],
  tasksId: [],
  includeWords: [],
  excludeWords: [],
  userType: [],
  sentiment: [],
  listTimeLimit: { gte: 0, lte: 0 },
  listPlatforms: ['redbook'],
  listIncludeWords: [],
  listExcludeWords: [],
  listUserType: [],
  listSentiment: [],
};

export default initialState;
