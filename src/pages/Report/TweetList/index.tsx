import dayjs from 'dayjs';
import { useContext, useEffect, useMemo, useState } from 'react';
import ReportContext from '../Report.context';
import { Dropdown, Tag, Space, Button, message, Spin, Checkbox, Modal, Input } from 'antd';
import {
  CommentOutlined,
  DownloadOutlined,
  LikeOutlined,
  RetweetOutlined,
} from '@ant-design/icons';
import { utils, writeFile } from 'xlsx';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import { tweetList } from '@/services/report';
import { Platform } from '../Report.state';
import usePageInfo from '../usePageInfo';
import sentimentBad from './sentiment_bad.png';
import sentimentGood from './sentiment_good.png';
import sentimentNeutral from './sentiment_neutral.png';
import sentimentUnknow from './question.png';
import redbookIcon from './redbook.jpg';
import tiktokIcon from './tiktok.png';
import weiboIcon from './weibo.png';
import styles from './index.module.scss';
import SortComponent, { SortInfo } from '../SortComponent';
import { useRequest } from '@umijs/max';

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

const genderColor = {
  男: '#108ee9',
  女: '#cd201f',
  未知: 'default',
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
          if (tweet.platform === 'redbook') {
            window.open(`https://www.xiaohongshu.com/discovery/item/${tweet.id}`);
          } else if (tweet.platform === 'tiktok') {
            window.open(`https://www.douyin.com/video/${tweet.id}`);
          }
        }}
      >
        <Checkbox
          value={tweet.id}
          onClick={(e) => {
            e.stopPropagation();
          }}
        />
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
              <Tag color={genderColor[tweet.gender]}>{tweet.gender}</Tag>
              <Tag>{tweet.userType}</Tag>
              <span className={styles.tweet__time}>{formatDate(tweet.createdAtTimestamp)}</span>
              {tweet.type && TweetTypeEnum[tweet.type] ? (
                <Tag color="cyan">{TweetTypeEnum[tweet.type]}</Tag>
              ) : null}
              <img src={platformIcon[tweet.platform]} style={{ width: 20 }} />
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
              {/* {tweet.platform !== 'weibo' ? (
                <span className={styles.tweet__title}>{tweet.title}</span>
              ) : null} */}
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
    state: {
      timeLimit,
      listUserType,
      listPlatforms,
      tasksId,
      excludeWords,
      listExcludeWords,
      includeWords,
      listIncludeWords,
      listSentiment,
      excludeNotes,
      excludeUsers,
    },
    dispatch,
  } = useContext(ReportContext);
  const [dataList, setDataList] = useState<ReportApi.TweetListItem[]>([]);
  const [sortKey, setSortKey] = useState('heat');
  const [sortOrder, setSortOrder] = useState('desc');
  const [total, setTotal] = useState(100);
  const [downloadLoading, setDownloadLoading] = useState(false);
  // const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<CheckboxValueType[]>([]);
  const [searchValue, setSearchValue] = useState('');

  const { currentPage, pageSize, Pagination } = usePageInfo(total);

  const reqIncludeWordsData = useMemo(() => {
    if (!includeWords.length && !listIncludeWords.length) {
      return [];
    }
    const allListIncludeWords = listIncludeWords.flat();
    return includeWords.length
      ? includeWords.map((item) => {
          return searchValue
            ? [...item, ...allListIncludeWords, searchValue]
            : [...item, ...allListIncludeWords];
        })
      : [allListIncludeWords];
  }, [listIncludeWords, includeWords, searchValue]);

  const { loading, run: fetchData } = useRequest(
    () =>
      tweetList({
        timeLimit,
        userType: listUserType,
        platforms: listPlatforms,
        tasksId,
        excludeWords: [...excludeWords, ...listExcludeWords],
        includeWords: reqIncludeWordsData,
        sentiment: listSentiment,
        excludeNotes,
        excludeUsers,
        page: currentPage,
        limit: pageSize,
        sortKey: sortKey,
        sortOrder: sortOrder,
      }),
    {
      debounceInterval: 500,
      manual: true,
      onSuccess: (res) => {
        setDataList(res.data);
        setTotal(res.count);
        // setLoading(false);
      },
      onError: (err) => {
        console.error(err);
        // setLoading(false);
      },
    },
  );

  // const fetchData = async () => {
  //   setLoading(true);
  //   setSelectedRowKeys([]);
  //   try {
  //     const res = await tweetList({
  //       timeLimit,
  //       userType: listUserType,
  //       platforms: listPlatforms,
  //       tasksId,
  //       excludeWords: [...excludeWords, ...listExcludeWords],
  //       includeWords: reqIncludeWordsData,
  //       sentiment: listSentiment,
  //       excludeNotes,
  //       excludeUsers,
  //       page: currentPage,
  //       limit: pageSize,
  //       sortKey: sortKey,
  //       sortOrder: sortOrder,
  //     });

  //     setDataList(res.data.data);
  //     setTotal(res.data.count);
  //   } catch (e) {
  //     console.error(e);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const downloadExcel = async () => {
    const params = {
      timeLimit,
      userType: listUserType,
      platforms: listPlatforms,
      tasksId,
      excludeWords: [...excludeWords, ...listExcludeWords],
      includeWords: reqIncludeWordsData,
      sentiment: listSentiment,
      page: 1,
      limit: 10000,
      sortKey: sortKey,
      sortOrder: sortOrder,
    };
    setDownloadLoading(true);
    try {
      const res = await tweetList(params);
      const data = res.data.data.map((item) => ({
        id: item.id,
        nickname: item.nickname,
        title: item.title,
        likeNum: item.likeNum,
        repostNum: item.repostNum,
        commentNum: item.commentNum,
        content: item.content,
        userType: item.userType,
        gender: item.gender,
        sentiment: sentimentText[item.sentiment] || '未知',
        createdAtTimestamp: dayjs(item.createdAtTimestamp).format('YYYY-MM-DD HH:mm:ss'),
      }));
      const headers = {
        id: '笔记ID',
        nickname: '用户昵称',
        title: '标题',
        likeNum: '点赞数',
        repostNum: '转发数',
        commentNum: '评论数',
        content: '笔记内容',
        userType: '用户类型',
        gender: '性别',
        sentiment: '情感',
        createdAtTimestamp: '发布时间',
      };
      const workbook = utils.book_new();
      const worksheet = utils.json_to_sheet([headers, ...data], { skipHeader: true });
      utils.book_append_sheet(workbook, worksheet, '推文列表');
      writeFile(workbook, '推文.xlsx');
    } catch (error) {
      message.error('导出数据失败');
    }
    setDownloadLoading(false);
  };

  const handleSortChange = (data: SortInfo) => {
    setSortKey(data.order_key);
    setSortOrder(data.order_direction === 0 ? 'asc' : 'desc');
  };

  const deleteTweet = () => {
    Modal.confirm({
      title: '确认删除所选推文?',
      okText: '确认',
      cancelText: '取消',
      centered: true,
      onOk: async () => {
        dispatch({
          field: 'excludeNotes',
          value: [...excludeNotes, ...(selectedRowKeys as string[])],
        });
        setSelectedRowKeys([]);
      },
    });
  };

  useEffect(() => {
    if (!tasksId.length) return;
    fetchData();
  }, [
    pageSize,
    currentPage,
    sortKey,
    sortOrder,
    excludeWords,
    reqIncludeWordsData,
    timeLimit,
    tasksId,
    listUserType,
    listPlatforms,
    listExcludeWords,
    listSentiment,
    excludeNotes,
    excludeUsers,
  ]);

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ display: 'flex', marginBottom: 20, gap: 10 }}>
        <Input
          placeholder="输入关键词搜索"
          style={{ flex: 1 }}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <Button type="primary" danger disabled={selectedRowKeys.length === 0} onClick={deleteTweet}>
          批量删除
        </Button>
        <Button loading={downloadLoading} icon={<DownloadOutlined />} onClick={downloadExcel}>
          下载为Excel
        </Button>
      </div>
      <div style={{ marginBottom: 20 }}>
        <SortComponent onChange={handleSortChange} />
      </div>
      <Spin spinning={loading}>
        <Checkbox.Group
          value={selectedRowKeys}
          style={{ display: 'block', width: '100%' }}
          onChange={(e) => setSelectedRowKeys(e)}
        >
          {dataList.map((item) => {
            return <TweetListItem key={item.id} data={item} />;
          })}
        </Checkbox.Group>
      </Spin>
      <div style={{ display: 'flex', justifyContent: 'center', padding: 20 }}>{Pagination}</div>
    </div>
  );
};

export default TweetList;
