import { useEffect } from 'react';
import { Tabs } from 'antd';
// import dayjs from 'dayjs';
import useCreateReducer from '@/hooks/useCreateReducer';
import ReportContext from './Report.context';
import initialState, { ReportInitialState } from './Report.state';
import Keywords from './Keywords';
import { chartData } from '@/services/report';
import TweetList from './TweetList';
import CommentList from './CommentList';
import styles from './index.module.scss';
import Popularity from './Popularity';
import PortraitAnalysis from './PortraitAnalysis';

const Report = () => {
  const contextValue = useCreateReducer<ReportInitialState>({
    initialState: {
      ...initialState,
      timeLimit: {
        // gte: dayjs().subtract(30, 'day').startOf('day').valueOf(),
        // lte: dayjs().endOf('day').valueOf(),
        gte: 1685548800000,
        lte: 1690819200000,
      },
    },
  });

  const {
    state: { timeLimit, platforms, tasksId, includeWords, excludeWords, userType, sentiment },
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
  };

  useEffect(() => {
    fetchChatData();
  }, [timeLimit, platforms, tasksId, includeWords, excludeWords, userType, sentiment]);

  return (
    <ReportContext.Provider value={{ ...contextValue }}>
      <div>
        <div className={styles.main}>
          <div className={styles['left-container']}>
            <Tabs
              items={[
                { label: '相关词分析', children: <Keywords />, key: 'keyword' },
                { label: '声量分析', children: <Popularity />, key: 'popularity' },
                { label: '画像分析', children: <PortraitAnalysis />, key: 'portrait' },
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
