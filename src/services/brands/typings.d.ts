declare namespace BrandsApi {
  type KeywordsInfoReq = {
    word?: string;
    tasksId?: string[];
  };

  type KeywordInfo = {
    taskId: string;
    word: string;
    pattern: (string | null)[][];
    dataRetrieverTime: {
      gte: number;
      lte: number;
    };
    platform: string;
    stop: boolean;
  };

  type KeywordsInfoRes = Api.Response<KeywordInfo[]>;

  type BrandInfo = {
    brandId: string;
    brandName: string;
    avatar: string;
  };
  type BrandsListRes = Api.Response<BrandInfo[]>;

  type TaskInfo = {
    projectId: string;
    dataRetrieverTime: {
      gte: number;
      lte: number;
    };
    dataShowTime: {
      gte: number;
      lte: number;
    };
    name: string;
    wordTasksId: string[];
    createdAtTimestamp: number;
    updatedAtTimestamp: number;
    brandId: string;
    condition: string; // json string
  };

  type TaskListRes = Api.Response<TaskInfo[]>;

  type CreateTaskReq = {
    wordTasks: {
      word: string;
      pattern: string[][];
      platforms: string[];
    }[];
    dataRetrieverTime: {
      gte: number;
      lte: number;
    };
    projectName: string;
    brandId: string;
  };

  type IndustryListRes = Api.Response<
    {
      classification: string;
    }[]
  >;
}
