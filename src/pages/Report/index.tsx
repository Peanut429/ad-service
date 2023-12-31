import { useCallback, useEffect, useState } from 'react';
import { useRequest, useSearchParams } from '@umijs/max';
import { Affix, Button, Card, Collapse, Form, Space, Tabs, Tag, message } from 'antd';
import useCreateReducer from '@/hooks/useCreateReducer';
import ReportContext from './Report.context';
import initialState, { ReportInitialState } from './Report.state';
import Keywords from './Keywords';
import TweetList from './TweetList';
import CommentList from './CommentList';
import Popularity from './Popularity';
import PortraitAnalysis from './PortraitAnalysis';
import TopicAnalysis from './TopicAnalysis';
import FilterForm from './FilterForm';
import { chartData, commentChartData, commentSentiment } from '@/services/report';
import { keywordsInfo, taskList } from '@/services/brands';
import dayjs from 'dayjs';
import { CaretRightOutlined } from '@ant-design/icons';
import styles from './index.module.scss';

const Report = () => {
  const [searchParams] = useSearchParams();
  const contextValue = useCreateReducer<ReportInitialState>({
    initialState: {
      ...initialState,
      projectId: searchParams.get('projectId')!,
    },
  });

  const [keywords, setKeywords] = useState<string[]>([]);
  const [projectTimeRange, setProjectTimeRange] = useState<{ gte: number; lte: number }>({
    gte: 0,
    lte: 0,
  });
  const [brandId, setBrandId] = useState<string>('');

  const {
    state: {
      category,
      projectId,
      platforms,
      tasksId,
      timeLimit,
      includeWords,
      excludeWords,
      userType,
      sentiment,
      gender,
      listTimeLimit,
      listIncludeWords,
      listExcludeWords,
      wordClassHiddenWord,
      wordClassDeleteWord,
      brandBarHiddenWord,
      brandBarDeleteWord,
      wordTrendHiddenWord,
      wordTrendDeleteWord,
      appearTogetherHiddenWord,
      appearTogetherDeleteWord,
      wordCloudHiddenWord,
      wordCloudDeleteWord,
      categoryBarHiddenWord,
      categoryBarDeleteWord,
      specificChartHiddenWord,
      specificChartDeleteWord,
      wordMap,
      excludeNotes,
      excludeUsers,
      wordClassType,
      commentIncludeWords,
    },
    dispatch,
  } = contextValue;

  // 获取项目信息
  useRequest(() => taskList({ projectsId: [projectId] }), {
    onSuccess: (res) => {
      if (res.length) {
        const data = res[0];
        const condition = JSON.parse(data.condition || '{}');
        dispatch({ field: 'tasksId', value: data.wordTasksId });
        setProjectTimeRange(data.dataRetrieverTime);
        setBrandId(data.brandId);
        // 加载保存的筛选条件
        if (condition.includeWords) {
          dispatch({ field: 'includeWords', value: condition.includeWords });
        }
        if (condition.excludeWords) {
          dispatch({ field: 'excludeWords', value: condition.excludeWords });
        }
        if (condition.timeLimit) {
          dispatch({ field: 'timeLimit', value: condition.timeLimit });
          dispatch({ field: 'listTimeLimit', value: condition.timeLimit });
        } else {
          dispatch({ field: 'timeLimit', value: data.dataRetrieverTime });
          dispatch({ field: 'listTimeLimit', value: data.dataRetrieverTime });
        }
        if (condition.sentiment) {
          dispatch({ field: 'sentiment', value: condition.sentiment });
        }
        if (condition.platforms) {
          dispatch({ field: 'platforms', value: condition.platforms });
          dispatch({ field: 'listPlatforms', value: condition.platforms });
        }
        if (condition.wordCloudDeleteWord) {
          dispatch({ field: 'wordCloudDeleteWord', value: condition.wordCloudDeleteWord });
        }
        if (condition.brandBarDeleteWord) {
          dispatch({ field: 'brandBarDeleteWord', value: condition.brandBarDeleteWord });
        }
        if (condition.wordTrendDeleteWord) {
          dispatch({ field: 'wordTrendDeleteWord', value: condition.wordTrendDeleteWord });
        }
        if (condition.appearTogetherDeleteWord) {
          dispatch({
            field: 'appearTogetherDeleteWord',
            value: condition.appearTogetherDeleteWord,
          });
        }
        if (condition.wordClassDeleteWord) {
          dispatch({ field: 'wordClassDeleteWord', value: condition.wordClassDeleteWord });
        }
        if (condition.categoryBarDeleteWord) {
          dispatch({ field: 'categoryBarDeleteWord', value: condition.categoryBarDeleteWord });
        }
        if (condition.specificChartDeleteWord) {
          dispatch({ field: 'specificChartDeleteWord', value: condition.specificChartDeleteWord });
        }
        if (condition.category) {
          dispatch({ field: 'category', value: condition.category });
        }
        if (condition.wordMap) {
          dispatch({ field: 'wordMap', value: condition.wordMap });
        }
        if (condition.gender) {
          dispatch({ field: 'gender', value: condition.gender });
        }
        if (condition.wordClassType) {
          dispatch({ field: 'wordClassType', value: condition.wordClassType });
        }
        if (condition.excludeNotes) {
          dispatch({ field: 'excludeNotes', value: condition.excludeNotes });
        }
      }
    },
  });

  const {
    run: commentSentimentApi,
    cancel: cancelCommentSentimentApi,
    loading: commentSentimentApiLoading,
  } = useRequest(
    () =>
      commentSentiment({
        timeLimit: projectTimeRange,
        platforms,
        tasksId,
        includeWords,
        excludeWords,
        userType,
        sentiment,
        hiddenWord: {
          wordCloud: [...wordCloudHiddenWord, ...wordCloudDeleteWord],
          brandBar: [...brandBarHiddenWord, ...brandBarDeleteWord],
          appearTogether: [...appearTogetherHiddenWord, ...appearTogetherDeleteWord],
          wordClass: [...wordClassHiddenWord, ...wordClassDeleteWord],
          wordTrend: [...wordTrendHiddenWord, ...wordTrendDeleteWord],
          categoryBar: [...categoryBarHiddenWord, ...categoryBarDeleteWord],
        },
        mappingWord: wordMap,
        classification: category,
        excludeNotes,
        excludeUsers,
        wordClassType,
        userGender: gender,
      }),
    {
      manual: true,
      onSuccess: (res) => {
        dispatch({ field: 'commentSentimentData', value: res });
      },
    },
  );

  const { run: commentChartDataApi } = useRequest(
    () =>
      commentChartData({
        timeLimit: projectTimeRange,
        platforms,
        tasksId,
        userGender: gender,
        includeWords,
        excludeWords,
        userType,
        sentiment,
        hiddenWord: {
          wordCloud: [...wordCloudHiddenWord, ...wordCloudDeleteWord],
          brandBar: [...brandBarHiddenWord, ...brandBarDeleteWord],
          appearTogether: [...appearTogetherHiddenWord, ...appearTogetherDeleteWord],
          wordClass: [...wordClassHiddenWord, ...wordClassDeleteWord],
          wordTrend: [...wordTrendHiddenWord, ...wordTrendDeleteWord],
          categoryBar: [...categoryBarHiddenWord, ...categoryBarDeleteWord],
        },
        mappingWord: wordMap,
        classification: category,
        excludeNotes,
        excludeUsers,
        // commentWordCloud: commentData,
        wordClassType,
      }),
    {
      manual: true,
      onSuccess: (res) => {
        dispatch({ field: 'commentWordTrendData', value: res.wordTrend });
        dispatch({ field: 'commentAppearTogetherData', value: res.appearTogether });
      },
    },
  );

  const {
    run: chartDataApi,
    cancel: cancelChartDataApi,
    loading: chartDataApiLoading,
  } = useRequest(chartData, {
    manual: true,
    onSuccess: (res) => {
      commentChartDataApi();

      dispatch({ field: 'wordcloudData', value: res.wordCloud });
      dispatch({ field: 'tweetTrendData', value: res.tweetTrend });
      dispatch({ field: 'adNode', value: res.adNode });
      dispatch({ field: 'tweetWordTrendData', value: res.wordTrend });
      dispatch({ field: 'tweetAppearTogetherData', value: res.appearTogether });
      dispatch({ field: 'userPortraitData', value: res.userPortrait });
      dispatch({ field: 'topicData', value: res.topic });
      dispatch({ field: 'brandBarData', value: res.brandBar });
      dispatch({ field: 'wordClassData', value: res.wordClass });
      dispatch({ field: 'categoryBarData', value: res.categoryBar });
      dispatch({ field: 'tweetSentimentData', value: res.tweetSentiment });

      dispatch({ field: 'chartLoading', value: false });
    },
  });

  // 获取图表数据
  // const fetchChatData = async () => {
  //   dispatch({ field: 'chartLoading', value: true });
  //   try {
  //     commentSentimentApi();
  //     const res = await chartDataApi({
  //       timeLimit,
  //       platforms,
  //       tasksId,
  //       userGender: gender,
  //       includeWords,
  //       excludeWords,
  //       userType,
  //       sentiment,
  //       hiddenWord: {
  //         wordCloud: [...wordCloudHiddenWord, ...wordCloudDeleteWord],
  //         brandBar: [...brandBarHiddenWord, ...brandBarDeleteWord],
  //         appearTogether: [...appearTogetherHiddenWord, ...appearTogetherDeleteWord],
  //         wordClass: [
  //           ...wordClassHiddenWord,
  //           ...wordClassDeleteWord,
  //           ...specificChartHiddenWord,
  //           ...specificChartDeleteWord,
  //         ],
  //         wordTrend: [...wordTrendHiddenWord, ...wordTrendDeleteWord],
  //         categoryBar: [...categoryBarHiddenWord, ...categoryBarDeleteWord],
  //       },
  //       mappingWord: wordMap,
  //       classification: category,
  //       excludeNotes,
  //       excludeUsers,
  //       wordClassType,
  //     });

  //     // commentChartDataApi();

  //     // dispatch({ field: 'wordcloudData', value: res.wordCloud });
  //     // dispatch({ field: 'tweetTrendData', value: res.tweetTrend });
  //     // dispatch({ field: 'adNode', value: res.adNode });
  //     // dispatch({ field: 'tweetWordTrendData', value: res.wordTrend });
  //     // dispatch({ field: 'tweetAppearTogetherData', value: res.appearTogether });
  //     // dispatch({ field: 'userPortraitData', value: res.userPortrait });
  //     // dispatch({ field: 'topicData', value: res.topic });
  //     // dispatch({ field: 'brandBarData', value: res.brandBar });
  //     // dispatch({ field: 'wordClassData', value: res.wordClass });
  //     // dispatch({ field: 'categoryBarData', value: res.categoryBar });
  //     // dispatch({ field: 'tweetSentimentData', value: res.tweetSentiment });
  //   } catch (e) {
  //     console.log(e);
  //   }
  //   dispatch({ field: 'chartLoading', value: false });
  // };

  // 图表操作： 新增关键词
  const addListKeyword = useCallback(
    (keywords: string[], keywordType: 'tweet' | 'comment' = 'tweet') => {
      if (keywordType === 'tweet') {
        const result = keywords.filter((item) => {
          const existInExclude = excludeWords.includes(item);
          const existInHidden = [
            ...wordCloudHiddenWord,
            ...wordCloudDeleteWord,
            ...appearTogetherHiddenWord,
            ...appearTogetherDeleteWord,
            ...wordClassHiddenWord,
            ...wordClassDeleteWord,
            ...wordTrendHiddenWord,
            ...wordTrendDeleteWord,
            ...brandBarHiddenWord,
            ...brandBarDeleteWord,
          ].includes(item);
          return !existInExclude && !existInHidden;
        });

        if (!keywords.length) {
          // 数据如果正常应该是不会出现能进入这个条件的情况
          message.error('添加的关键词已经存在于排除，隐藏，删除的关键词中');
          return;
        }

        dispatch({
          field: 'listIncludeWords',
          value: [...listIncludeWords, result],
        });
      } else {
        if (commentIncludeWords.length) {
          dispatch({
            field: 'commentIncludeWords',
            value: [...commentIncludeWords.map((item) => [...item, ...keywords])],
          });
        } else {
          dispatch({
            field: 'commentIncludeWords',
            value: [keywords],
          });
        }
      }
    },
    [
      listIncludeWords,
      listExcludeWords,
      excludeWords,
      wordCloudHiddenWord,
      wordCloudDeleteWord,
      wordClassHiddenWord,
      wordClassDeleteWord,
      wordTrendHiddenWord,
      wordTrendDeleteWord,
      appearTogetherHiddenWord,
      appearTogetherDeleteWord,
      brandBarHiddenWord,
      brandBarDeleteWord,
      commentIncludeWords,
    ],
  );

  useEffect(() => {
    if (!tasksId.length) return;

    if (chartDataApiLoading) {
      cancelChartDataApi();
    }
    if (commentSentimentApiLoading) {
      cancelCommentSentimentApi();
    }
    dispatch({ field: 'chartLoading', value: true });
    commentSentimentApi();
    chartDataApi({
      timeLimit,
      platforms,
      tasksId,
      userGender: gender,
      includeWords,
      excludeWords,
      userType,
      sentiment,
      hiddenWord: {
        wordCloud: [...wordCloudHiddenWord, ...wordCloudDeleteWord],
        brandBar: [...brandBarHiddenWord, ...brandBarDeleteWord],
        appearTogether: [...appearTogetherHiddenWord, ...appearTogetherDeleteWord],
        wordClass: [
          ...wordClassHiddenWord,
          ...wordClassDeleteWord,
          ...specificChartHiddenWord,
          ...specificChartDeleteWord,
        ],
        wordTrend: [...wordTrendHiddenWord, ...wordTrendDeleteWord],
        categoryBar: [...categoryBarHiddenWord, ...categoryBarDeleteWord],
      },
      mappingWord: wordMap,
      classification: category,
      excludeNotes,
      excludeUsers,
      wordClassType,
    });
  }, [
    timeLimit,
    platforms,
    tasksId,
    includeWords,
    excludeWords,
    userType,
    sentiment,
    category,
    wordCloudHiddenWord,
    wordCloudDeleteWord,
    wordClassHiddenWord,
    wordClassDeleteWord,
    brandBarHiddenWord,
    brandBarDeleteWord,
    wordTrendHiddenWord,
    wordTrendDeleteWord,
    appearTogetherHiddenWord,
    appearTogetherDeleteWord,
    categoryBarHiddenWord,
    categoryBarDeleteWord,
    specificChartHiddenWord,
    specificChartDeleteWord,
    wordMap,
    excludeNotes,
    excludeUsers,
    wordClassType,
    gender,
  ]);

  useEffect(() => {
    if (!tasksId.length) return;

    keywordsInfo({ tasksId }).then((res) => {
      const result = new Set(res.data.map((item) => item.word));
      setKeywords([...result]);
    });
  }, [tasksId]);

  return (
    <ReportContext.Provider value={{ ...contextValue, addListKeyword }}>
      <div>
        <Affix offsetTop={0}>
          <Card bodyStyle={{ paddingTop: 0 }}>
            <h4 style={{ paddingInlineStart: 20 }}>
              任务关键词：
              {keywords.map((item) => (
                <Tag color="#3b5999" key={item} style={{ fontSize: 14 }}>
                  {item}
                </Tag>
              ))}
            </h4>
            <Collapse
              defaultActiveKey={['info']}
              bordered={false}
              expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
            >
              <Collapse.Panel key="info" header="列表筛选条件：">
                <Form size="small" className={styles.form}>
                  <Form.Item label="时间范围">
                    {listTimeLimit?.gte ? (
                      <Space>
                        <Tag>
                          {dayjs(listTimeLimit.gte).format('YYYY-MM-DD')} ~{' '}
                          {dayjs(listTimeLimit.lte).format('YYYY-MM-DD')}
                        </Tag>
                        {listTimeLimit.gte !== timeLimit.gte ||
                        listTimeLimit.lte !== timeLimit.lte ? (
                          <Button
                            onClick={() => dispatch({ field: 'listTimeLimit', value: timeLimit })}
                          >
                            重置
                          </Button>
                        ) : null}
                      </Space>
                    ) : null}
                  </Form.Item>
                  {listIncludeWords.length ? (
                    <Form.Item label="推文关键词">
                      {listIncludeWords.map((item, index) => (
                        <Tag
                          key={item.join(',')}
                          closable
                          onClose={() => {
                            listIncludeWords.splice(index, 1);

                            dispatch({ field: 'listIncludeWords', value: [...listIncludeWords] });
                          }}
                          style={{ fontSize: 14 }}
                        >
                          {item.join(' + ')}
                        </Tag>
                      ))}
                    </Form.Item>
                  ) : null}
                  {commentIncludeWords.length ? (
                    <Form.Item label="评论关键词">
                      {commentIncludeWords.map((item, index) => (
                        <Tag
                          key={item.join(',')}
                          closable
                          onClose={() => {
                            commentIncludeWords.splice(index, 1);
                            dispatch({
                              field: 'commentIncludeWords',
                              value: [...commentIncludeWords],
                            });
                          }}
                          style={{ fontSize: 14 }}
                        >
                          {item.join(' + ')}
                        </Tag>
                      ))}
                    </Form.Item>
                  ) : null}
                  {/* <Form.Item label="平台">
                    {listPlatforms.map((item) => (
                      <Tag
                        key={item}
                        style={{ fontSize: 14 }}
                        closable
                        onClose={() => {
                          listPlatforms.splice(listPlatforms.indexOf(item), 1);
                          console.log(listPlatforms.toString());
                          if (listPlatforms.length === 0) {
                            listPlatforms.push(...platforms);
                          }
                          console.log(listPlatforms.toString());
                          dispatch({ field: 'listPlatforms', value: [...listPlatforms] });
                        }}
                      >
                        {platform[item]}
                      </Tag>
                    ))}
                  </Form.Item>
                  <Form.Item label="情感">
                    {listSentiment.map((item) => (
                      <Tag
                        key={item}
                        style={{ fontSize: 14 }}
                        closable
                        onClose={() => {
                          listSentiment.splice(listSentiment.indexOf(item), 1);
                          dispatch({ field: 'listSentiment', value: [...listSentiment] });
                        }}
                      >
                        {item}
                      </Tag>
                    ))}
                  </Form.Item> */}
                </Form>
              </Collapse.Panel>
            </Collapse>
          </Card>
        </Affix>
        <div className={styles.main}>
          <div className={styles['left-container']}>
            <Tabs
              items={[
                { label: '相关词分析', children: <Keywords brandId={brandId} />, key: 'keyword' },
                { label: '声量分析', children: <Popularity />, key: 'popularity' },
                { label: '画像分析', children: <PortraitAnalysis />, key: 'portrait' },
                { label: '话题分析', children: <TopicAnalysis />, key: 'topic' },
              ]}
            />
          </div>
          <div className={styles['right-container']}>
            <Tabs
              items={[
                { label: '推文列表', children: <TweetList />, key: 'tweet-list' },
                { label: '评论', children: <CommentList />, key: 'comment-list' },
              ]}
            />
          </div>
        </div>
        <FilterForm />
      </div>
    </ReportContext.Provider>
  );
};

export default Report;
