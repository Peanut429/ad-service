import { useCallback, useEffect, useState } from 'react';
import { useRequest, useSearchParams } from '@umijs/max';
import { Affix, Card, Form, Tabs, Tag, message } from 'antd';
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
import { chartData, commentChartData } from '@/services/report';
import { keywordsInfo, taskList } from '@/services/brands';
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

  const {
    state: {
      category,
      projectId,
      timeLimit,
      platforms,
      tasksId,
      includeWords,
      excludeWords,
      userType,
      sentiment,
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
      wordMap,
      excludeNotes,
      excludeUsers,
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
        // 加载保存的筛选条件
        if (condition.includeWords) {
          dispatch({ field: 'includeWords', value: condition.includeWords });
        }
        if (condition.excludeWords) {
          dispatch({ field: 'excludeWords', value: condition.excludeWords });
        }
        if (condition.timeLimit) {
          dispatch({ field: 'timeLimit', value: condition.timeLimit });
        } else {
          dispatch({ field: 'timeLimit', value: data.dataRetrieverTime });
        }
        if (condition.sentiment) {
          dispatch({ field: 'sentiment', value: condition.sentiment });
        }
        if (condition.platforms) {
          dispatch({ field: 'platforms', value: condition.platforms });
        }
        if (condition.wordCloudHiddenWord) {
          dispatch({ field: 'wordCloudHiddenWord', value: condition.wordCloudHiddenWord });
        }
        if (condition.wordCloudDeleteWord) {
          dispatch({ field: 'wordCloudDeleteWord', value: condition.wordCloudDeleteWord });
        }
        if (condition.brandBarHiddenWord) {
          dispatch({ field: 'brandBarHiddenWord', value: condition.brandBarHiddenWord });
        }
        if (condition.brandBarDeleteWord) {
          dispatch({ field: 'brandBarDeleteWord', value: condition.brandBarDeleteWord });
        }
        if (condition.wordTrendHiddenWord) {
          dispatch({ field: 'wordTrendHiddenWord', value: condition.wordTrendHiddenWord });
        }
        if (condition.wordTrendDeleteWord) {
          dispatch({ field: 'wordTrendDeleteWord', value: condition.wordTrendDeleteWord });
        }
        if (condition.appearTogetherHiddenWord) {
          dispatch({
            field: 'appearTogetherHiddenWord',
            value: condition.appearTogetherHiddenWord,
          });
        }
        if (condition.appearTogetherDeleteWord) {
          dispatch({
            field: 'appearTogetherDeleteWord',
            value: condition.appearTogetherDeleteWord,
          });
        }
        if (condition.wordClassHiddenWord) {
          dispatch({ field: 'wordClassHiddenWord', value: condition.wordClassHiddenWord });
        }
        if (condition.wordClassDeleteWord) {
          dispatch({ field: 'wordClassDeleteWord', value: condition.wordClassDeleteWord });
        }
        if (condition.categoryBarHiddenWord) {
          dispatch({ field: 'categoryBarHiddenWord', value: condition.categoryBarHiddenWord });
        }
        if (condition.categoryBarDeleteWord) {
          dispatch({ field: 'categoryBarDeleteWord', value: condition.categoryBarDeleteWord });
        }
        if (condition.category) {
          dispatch({ field: 'category', value: condition.category });
        }
        if (condition.wordMap) {
          dispatch({ field: 'wordMap', value: condition.wordMap });
        }
      }
    },
  });

  // 获取图表数据
  const fetchChatData = async () => {
    dispatch({ field: 'chartLoading', value: true });
    try {
      const res = await chartData({
        timeLimit,
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
      });
      const commentData = await commentChartData({
        timeLimit,
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
        commentWordCloud: res.data.wordCloud.comment,
      });

      dispatch({ field: 'wordcloudData', value: res.data.wordCloud });
      dispatch({ field: 'tweetTrendData', value: res.data.tweetTrend });
      dispatch({ field: 'adNode', value: res.data.adNode });
      dispatch({ field: 'tweetWordTrendData', value: res.data.wordTrend });
      dispatch({ field: 'tweetAppearTogetherData', value: res.data.appearTogether });
      dispatch({ field: 'commentAppearTogetherData', value: commentData.data.appearTogether });
      dispatch({ field: 'userPortraitData', value: res.data.userPortrait });
      dispatch({ field: 'topicData', value: res.data.topic });
      dispatch({ field: 'brandBarData', value: res.data.brandBar });
      dispatch({ field: 'wordClassData', value: res.data.wordClass });
      dispatch({ field: 'categoryBarData', value: res.data.categoryBar });
    } catch (e) {
      console.log(e);
    }
    dispatch({ field: 'chartLoading', value: false });
  };

  // 图表操作： 新增关键词
  const addListKeyword = useCallback(
    (keywords: string[]) => {
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
    ],
  );

  useEffect(() => {
    if (!tasksId.length) return;
    fetchChatData();
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
    wordMap,
    excludeNotes,
    excludeUsers,
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
          <Card>
            <h4>
              任务关键词：
              {keywords.map((item) => (
                <Tag color="#3b5999" key={item} style={{ fontSize: 14 }}>
                  {item}
                </Tag>
              ))}
            </h4>
            <h4>列表筛选条件：</h4>
            <Form size="small" layout="inline">
              <Form.Item label="筛选关键词">
                {listIncludeWords.map((item, index) => (
                  <Tag
                    key={item.join(',')}
                    closable
                    onClose={() => {
                      listIncludeWords.splice(index, 1);
                      console.log(listIncludeWords);
                      dispatch({ field: 'listIncludeWords', value: [...listIncludeWords] });
                    }}
                    style={{ fontSize: 14 }}
                  >
                    {item.join(' + ')}
                  </Tag>
                ))}
              </Form.Item>
            </Form>
          </Card>
        </Affix>
        <div className={styles.main}>
          <div className={styles['left-container']}>
            <Tabs
              items={[
                { label: '相关词分析', children: <Keywords />, key: 'keyword' },
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
