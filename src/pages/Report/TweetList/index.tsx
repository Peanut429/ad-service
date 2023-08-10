import { tweetList } from '@/services/report';
import { useContext, useEffect, useState } from 'react';
// import { read, utils } from 'xlsx';
import ReportContext from '../Report.context';
import { Dropdown, Pagination, PaginationProps, Tag, Space } from 'antd';
import sentimentBad from './sentiment_bad.png';
import sentimentGood from './sentiment_good.png';
import sentimentNeutral from './sentiment_neutral.png';
import sentimentUnknow from './question.png';
import redbookIcon from './redbook.jpg';
import tiktokIcon from './tiktok.png';
import weiboIcon from './weibo.png';
import {
  // CloudUploadOutlined,
  CommentOutlined,
  LikeOutlined,
  RetweetOutlined,
} from '@ant-design/icons';
import { Platform } from '../Report.state';
import styles from './index.module.scss';

type TweetListItemProps = {
  data: ReportApi.TweetListItem & {
    platform?: Platform;
    type?: keyof typeof TweetTypeEnum;
    image?: string;
  };
};

export enum TweetTypeEnum {
  star = '明星帖',
}

const platformIcon = {
  weibo: weiboIcon,
  redbook: redbookIcon,
  tiktok: tiktokIcon,
};
// const userType = {
//   koc: 'KOC',
//   kol: 'KOL',
//   normal: '普通用户',
//   star: '明星',
//   enterprise: '企业账号',
//   media: '媒体账号',
//   brand: '本品牌官方账号',
// };

// const platform = {
//   weibo: '微博',
//   redbook: '小红书',
//   tiktok: '抖音',
// };

const sentimentIcon = {
  '0': sentimentUnknow,
  '1': sentimentBad,
  '2': sentimentNeutral,
  '3': sentimentGood,
};

const sentimentText = {
  '0': '未知',
  '1': '负面',
  '2': '中性',
  '3': '正面',
};

//时间格式化
const formatDate = (date: number) => {
  const dateObj = new Date(date);
  const year = dateObj.getFullYear();
  const month = dateObj.getMonth() + 1;
  const day = dateObj.getDate();
  const hour = dateObj.getHours();
  const minute = dateObj.getMinutes();
  const second = dateObj.getSeconds();
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
};

const TweetListItem: React.FC<TweetListItemProps> = ({ data: tweet }) => {
  // const [visible, setVisible] = useState(false);
  async function changeTweetSentiment() {
    // setVisible(true);
  }

  return (
    <Dropdown
      menu={{
        items: [],
        onClick: () => {},
      }}
      trigger={['contextMenu']}
    >
      <div
        className={styles.tweet}
        onClick={() => {
          window.open(`https://www.xiaohongshu.com/discovery/item/${tweet.id}`);
        }}
      >
        <div className={styles.tweet__left}>
          {
            <img
              className={styles.avatar}
              src={
                tweet.avatar && tweet.avatar !== 'None'
                  ? decodeURIComponent(tweet.avatar)
                  : 'https://tvax1.sinaimg.cn/default/images/default_avatar_female_180.gif?KID=imgbed,tva&Expires=1671366461&ssig=7lPflXwnyW'
              }
              alt="头像"
            />
          }
          <div className={styles.tweet__sentiment} onClick={() => changeTweetSentiment()}>
            <img src={sentimentIcon[tweet.sentiment]} width={24} height={24} />
          </div>
          <span>{sentimentText[tweet.sentiment]}</span>
        </div>
        <div className={styles.tweet__right}>
          <div className={styles.tweet__head}>
            <div style={{ display: 'flex', alignItems: 'center', columnGap: 10, marginBottom: 8 }}>
              <span
                className={styles.nickname}
                onClick={() => {
                  // window.open(`https://www.xiaohongshu.com/user/profile/${tweet.id}`);
                  // if (tweet.platform === 'weibo') {
                  //   window.open(`https://weibo.com/u/${tweet.id}`);
                  // } else if (tweet.platform === 'redbook') {
                  //   window.open(`https://www.xiaohongshu.com/user/profile/${tweet.id}`);
                  // } else {
                  //   window.open(`https://www.douyin.com/user/${tweet.id}`);
                  // }
                }}
              >
                {tweet.nickname}
              </span>
              {/* <Tag onClick={() => setUserTypeModalVisible(true)}>{tweet.userType}</Tag> */}
              <Tag>{tweet.userType}</Tag>
              <span className={styles.tweet__time}>{formatDate(tweet.createdAtTimestamp)}</span>
              {tweet.type && TweetTypeEnum[tweet.type] ? (
                <Tag color="cyan">{TweetTypeEnum[tweet.type]}</Tag>
              ) : null}
              <img src={platformIcon[tweet.platform || 'redbook']} style={{ width: 20 }} />
            </div>
            <div>
              {/* <Space size={10}>
              {tweet.kol_tweet_label.map((item) => (
                <span
                  key={item}
                  className={classNames('tweet__label', {
                    origin: tweet.kol_tweet_label.includes(''),
                    'origin-light': tweet.kol_tweet_label.includes(''),
                    gray: tweet.kol_tweet_label.includes(''),
                    lime: tweet.kol_tweet_label.includes(''),
                  })}
                >
                  {item}
                </span>
              ))}
            </Space> */}
            </div>
          </div>
          <div className={styles.tweet__content}>
            <div className={styles['content-left']}>
              {tweet.platform !== 'weibo' ? (
                <span className={styles.tweet__title}>{tweet.title}</span>
              ) : null}
              <div className={styles.tweet__text}>{tweet.content}</div>
              <Space className={styles.tweet__data} size={20}>
                <span>
                  <RetweetOutlined />
                  {tweet.repostNum || 0}
                </span>
                <span>
                  <CommentOutlined /> {tweet.commentNum || 0}
                </span>
                <span>
                  <LikeOutlined /> {tweet.likeNum || 0}
                </span>
                {/* {tweet.platform === 'weibo' ? (
                <span>
                  <BranchesOutlined />
                  {tweet.repost_level || 0}
                </span>
              ) : null} */}
                {/* {tweet.platform === 'redbook' ? (
                <span>
                  <StarOutlined />
                  {tweet.collect_num || 0}
                </span>
              ) : null}
              {tweet.water_rate ? (
                <span>
                  <FrownOutlined />
                  {tweet.water_rate.toLocaleString('zh', { style: 'percent' })}
                </span>
              ) : null} */}
              </Space>
            </div>
            {tweet.image ? (
              <div className={styles.tweet__image}>
                <img src={tweet.image} alt="图片" />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </Dropdown>
  );
};

const TweetList = () => {
  const {
    state: { timeLimit, userType, platforms, tasksId, excludeWords, includeWords, sentiment },
  } = useContext(ReportContext);
  const [dataList, setDataList] = useState<ReportApi.TweetListItem[]>([]);
  const [pageInfo, setPageInfo] = useState({ page: 1, limit: 10 });
  const [sortKey] = useState('heat');
  const [sortOrder] = useState('desc');
  const [total, setTotal] = useState(100);

  const handleChange: PaginationProps['onChange'] = (page, pageSize) => {
    setPageInfo({ page, limit: pageSize });
  };

  const fetchData = async () => {
    const res = await tweetList({
      timeLimit,
      userType,
      platforms,
      tasksId,
      excludeWords,
      includeWords,
      sentiment,
      page: pageInfo.page,
      limit: pageInfo.limit,
      sortKey: sortKey,
      sortOrder: sortOrder,
    });

    setDataList(res.data.data);
    setTotal(res.data.count);
  };

  useEffect(() => {
    fetchData();
  }, [
    pageInfo,
    sortKey,
    sortOrder,
    timeLimit,
    userType,
    platforms,
    tasksId,
    excludeWords,
    includeWords,
    sentiment,
  ]);

  return (
    <div>
      {dataList.map((item) => {
        return <TweetListItem key={item.id} data={item} />;
      })}
      <div style={{ display: 'flex', justifyContent: 'center', padding: 20 }}>
        <Pagination
          current={pageInfo.page}
          pageSize={pageInfo.limit}
          total={total}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default TweetList;
