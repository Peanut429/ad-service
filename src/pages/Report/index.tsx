import { useEffect } from 'react';
import { useSearchParams } from '@umijs/max';
import { DatePicker, Form, Tabs } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { RangePickerDateProps } from 'antd/es/date-picker/generatePicker';
import useCreateReducer from '@/hooks/useCreateReducer';
import ReportContext from './Report.context';
import initialState, { ReportInitialState } from './Report.state';
import Keywords from './Keywords';
import { chartData } from '@/services/report';
import TweetList from './TweetList';
import CommentList from './CommentList';
import Popularity from './Popularity';
import PortraitAnalysis from './PortraitAnalysis';
import TopicAnalysis from './TopicAnalysis';
import styles from './index.module.scss';

const Report = () => {
  const [searchParams] = useSearchParams();
  const tasksIdInQuery = searchParams.get('ids')!.split(',');
  const contextValue = useCreateReducer<ReportInitialState>({
    initialState: {
      ...initialState,
      tasksId: tasksIdInQuery,
      timeLimit: {
        gte: dayjs('2022-07-01').subtract(30, 'day').startOf('day').valueOf(),
        lte: dayjs('2023-07-31').endOf('day').valueOf(),
      },
      listTimeLimit: {
        gte: dayjs('2022-07-01').subtract(30, 'day').startOf('day').valueOf(),
        lte: dayjs('2023-07-31').endOf('day').valueOf(),
      },
    },
  });

  const {
    state: {
      timeLimit,
      platforms,
      tasksId,
      includeWords,
      excludeWords,
      userType,
      sentiment,
      listIncludeWords,
      listExcludeWords,
    },
    dispatch,
  } = contextValue;

  const fetchChatData = async () => {
    const res = await chartData({
      timeLimit,
      platforms,
      tasksId,
      includeWords,
      excludeWords,
      userType,
      sentiment,
    });

    dispatch({ field: 'wordcloudData', value: res.data.wordCloud });
    dispatch({ field: 'tweetTrendData', value: res.data.tweetTrend });
    dispatch({ field: 'adNode', value: res.data.adNode });
    dispatch({ field: 'tweetWordTrendData', value: res.data.tweetWordTrend });
    dispatch({ field: 'tweetAppearTogetherData', value: res.data.tweetAppearTogether });
    dispatch({ field: 'userPortraitData', value: res.data.userPortrait });
    dispatch({ field: 'topicData', value: res.data.topic });
  };

  const handleDateRangeChange: RangePickerDateProps<Dayjs>['onChange'] = (value) => {
    if (!value) return;
    dispatch({
      field: 'timeLimit',
      value: {
        gte: value[0]!.startOf('day').valueOf(),
        lte: value[1]!.endOf('day').valueOf(),
      },
    });
  };

  const addListKeyword = (keywords: string[]) => {
    const existIncludeWord = listIncludeWords.findIndex((item) => {
      return item.sort().toString() === keywords.sort().toString();
    });
    // const existExcludeWord = listExcludeWords.includes(keywords);
    if (existIncludeWord === -1) {
      dispatch({ field: 'listIncludeWords', value: [...listIncludeWords, [...keywords]] });
    }
    dispatch({
      field: 'listExcludeWords',
      value: listExcludeWords.filter((item) => !keywords.includes(item)),
    });
  };

  const addListExcludeWords = (keyword: string) => {
    const existIncludeWord = listIncludeWords.findIndex((item) => {
      return item.length === 1 && item[0] === keyword;
    });
    const existExcludeWord = listExcludeWords.includes(keyword);
    if (existIncludeWord > -1) {
      listIncludeWords.splice(existIncludeWord, 1);
      dispatch({ field: 'listIncludeWords', value: [...listIncludeWords] });
    }
    if (!existExcludeWord) {
      dispatch({ field: 'listExcludeWords', value: [...listExcludeWords, keyword] });
    }
  };

  useEffect(() => {
    fetchChatData();
  }, [timeLimit, platforms, tasksId, includeWords, excludeWords, userType, sentiment]);

  return (
    <ReportContext.Provider value={{ ...contextValue, addListKeyword, addListExcludeWords }}>
      <div>
        <Form>
          <Form.Item label="时间范围">
            <DatePicker.RangePicker
              defaultValue={[dayjs('2022-07-01'), dayjs('2023-07-31')]}
              onChange={handleDateRangeChange}
            />
          </Form.Item>
        </Form>
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
      </div>
    </ReportContext.Provider>
  );
};

export default Report;
