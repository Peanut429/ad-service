declare namespace ReportApi {
  type Response<T> = {
    code: number;
    data: T;
    message: string;
  };

  type ChartDataReq = {
    timeLimit: {
      gte: number;
      lte: number;
    };
    platforms: string[];
    tasksId: string[];
    includeWords?: string[][];
    excludeWords?: string[];
    userType?: string[];
    sentiment?: number[];
  };

  type WordcloudData = {
    comment: {
      heat: { word: string; heat: number; frequency: number }[];
      frequency: { word: string; heat: number; frequency: number }[];
    };
    tweet: {
      heat: { word: string; heat: number; frequency: number }[];
      frequency: { word: string; heat: number; frequency: number }[];
    };
  };

  type TweetTrendData = {
    frequency: [];
    heat: { key: string; value: number }[];
  };

  type AdNodeItem = {
    id: string;
    heat: number;
    tweetNum: number;
    type: string;
    topics: string[];
    parentId?: string;
    time?: string;
    title?: string;
  };

  type ChartDataRes = Response<{
    wordCloud: WordcloudData;
    tweetTrend: TweetTrendData;
    adNode: AdNodeItem[];
  }>;

  type TweetListReq = {
    timeLimit: {
      gte: number;
      lte: number;
    };
    platforms: string[];
    tasksId: string[];
    limit: number;
    page: number;
    sortKey: string;
    sortOrder: string;
    includeWords?: string[][];
    excludeWords?: string[];
    userType?: string[];
    sentiment?: number[];
  };

  type TweetListItem = {
    id: string;
    createdAtTimestamp: number;
    sentiment: 1 | 2 | 3;
    userType: string;
    avatar: string;
    nickname: string;
    title: string;
    content: string;
    commentNum: number;
    likeNum: number;
    repostNum: number;
  };

  type TweetListRes = Response<{
    count: number;
    data: TweetListItem[];
  }>;
}
