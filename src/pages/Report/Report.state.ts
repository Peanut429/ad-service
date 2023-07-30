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
  wordcloudData?: ReportApi.WordcloudData;
}

const initialState: ReportInitialState = {
  timeLimit: { gte: 0, lte: 0 },
  platforms: ['redbook'],
  tasksId: ['avbfsdf'],
  includeWords: [['威露士', '洗衣液'], ['洗衣液']],
  excludeWords: ['好闻'],
  userType: [],
  sentiment: [],
};

export default initialState;
