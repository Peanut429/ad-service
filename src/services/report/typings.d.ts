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
    userGender: string[];
    platforms: string[];
    tasksId: string[];
    includeWords?: string[][];
    excludeWords?: string[];
    userType?: string[];
    sentiment?: number[];
    hiddenWord?: Partial<{
      wordCloud: string[];
      brandBar: string[];
      appearTogether: string[];
      wordClass: string[];
      wordTrend: string[];
      categoryBar: string[];
    }>;
    mappingWord?: Record<string, string>;
    classification?: string[];
    excludeNotes?: string[];
    excludeUsers?: string[];
    wordClassType: string[];
  };

  type WordcloudData = {
    comment: { word: string; heat: number; frequency: number }[];
    tweet: { word: string; heat: number; frequency: number }[];
    // comment: {
    //   heat: { word: string; heat: number; frequency: number }[];
    //   frequency: { word: string; heat: number; frequency: number }[];
    // };
    // tweet: {
    //   heat: { word: string; heat: number; frequency: number }[];
    //   frequency: { word: string; heat: number; frequency: number }[];
    // };
  };

  type TweetTrendData = {
    frequency: [];
    heat: { key: string; value: number }[];
  };

  type TweetWordTrendData = {
    frequency: {
      date: string;
      value: number;
      word: string;
      colorValue: number;
    }[];
    heat: {
      date: string;
      value: number;
      word: string;
      colorValue: number;
    }[];
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

  type Edge = {
    source: string;
    target: string;
    sentiment: {
      key: number;
      value: number;
    }[];
    times: number;
  };
  type TweetAppearTogetherData = {
    edges: Edge[];
    nodes: { id: string; size: number }[];
  };

  type PortraitData = {
    age: {
      count: number;
      data: { key: string; value: number }[];
    };
    fanLevel: {
      count: number;
      data: { key: string; value: number }[];
    };
    gender: {
      count: number;
      data: { key: string; value: number }[];
    };
    region: {
      count: number;
      data: { key: string; value: number }[];
    };
    type: {
      count: number;
      data: { key: string; value: number }[];
    };
  };

  type TopicData = {
    id: string;
    name: string;
    heat: number;
    frequency: number;
  };

  type BrandBarData = {
    comment: { word: string; heat: number; frequency: number }[];
    tweet: { word: string; heat: number; frequency: number }[];
  };

  type WordClassData = {
    tweet: {
      mainWord: string;
      frequency: number;
      subWords: {
        heat: number;
        word: string;
        frequency: number;
      }[];
    }[];
    comment: {
      mainWord: string;
      frequency: number;
      subWords: {
        heat: number;
        word: string;
        frequency: number;
      }[];
    }[];
  };

  type CategoryBarData = {
    comment: { heat: number; frequency: number; word: string }[];
    tweet: { heat: number; frequency: number; word: string }[];
  };

  type TweetSentimentData = {
    key: 0 | 1 | 2 | 3;
    value: number;
  }[];

  type ChartDataRes = Response<{
    wordCloud: WordcloudData;
    tweetTrend: TweetTrendData;
    adNode: AdNodeItem[];
    wordTrend: TweetWordTrendData;
    appearTogether: TweetAppearTogetherData;
    userPortrait: {
      comment: PortraitData;
      tweet: PortraitData;
    };
    topic: TopicData[];
    brandBar: BrandBarData;
    wordClass: WordClassData;
    categoryBar: CategoryBarData;
    tweetSentiment: TweetSentimentData;
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
    excludeNotes?: string[];
    excludeUsers?: string[];
    userGender?: string[];
    commentIncludeWords?: string[][];
    mappingWord?: Record<string, string>;
    classification?: string[];
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
    platform: 'redbook' | 'tiktok';
    gender: '男' | '女' | '未知';
  };

  type TweetListRes = Response<{
    count: number;
    data: TweetListItem[];
  }>;

  type CommentListReq = {
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

  type CommentListRes = Response<{
    count: number;
    data: CommentListItem[];
  }>;

  type CommentListItem = {
    id: string;
    createdAtTimestamp: number;
    sentiment: 0 | 1 | 2 | 3;
    userType: string;
    avatar: string;
    nickname: string;
    content: string;
    likeNum: number;
    platform: 'redbook' | 'tiktok';
    gender: '男' | '女' | '未知';
    noteContent: string;
    noteId: string;
    subCommentNum: number;
  };

  type WordClassListRes = Response<string[]>;

  type FixTweetSentimentReq = {
    data: {
      id: string;
      sentiment: 1 | 2 | 3;
    }[];
    platform: 'redbook' | 'tiktok';
    type: 'tweet' | 'comment';
  };

  type CommentSentimentRes = Response<TweetSentimentData>;
}
