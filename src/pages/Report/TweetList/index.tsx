import dayjs from 'dayjs';
import { useContext, useEffect, useMemo, useState } from 'react';
import { useRequest } from '@umijs/max';
import { utils, writeFile } from 'xlsx';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import { Dropdown, Tag, Space, Button, message, Spin, Checkbox, Modal, Input, Form } from 'antd';
import {
  CommentOutlined,
  DownOutlined,
  DownloadOutlined,
  LikeOutlined,
  RetweetOutlined,
} from '@ant-design/icons';
import SortComponent, { SortInfo } from '../SortComponent';
import { tweetList } from '@/services/report';
import { Platform } from '../Report.state';
import usePageInfo from '../usePageInfo';
import ReportContext from '../Report.context';
import sentimentBad from './sentiment_bad.png';
import sentimentGood from './sentiment_good.png';
import sentimentNeutral from './sentiment_neutral.png';
import sentimentUnknow from './question.png';
import redbookIcon from './redbook.jpg';
import tiktokIcon from './tiktok.png';
import weiboIcon from './weibo.png';
import styles from './index.module.scss';
import SentimentForm from '../SentimentForm';
import getTweetLink from '@/utils/getTweetLink';
import { GenderElement } from '../CommentList';
import { updateTaskInfo } from '@/services/brands';
import { CheckboxChangeEvent } from 'antd/es/checkbox';

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

const platformString = {
  weibo: '微博',
  redbook: '小红书',
  tiktok: '抖音',
};

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

type TweetListItemProps = {
  data: ReportApi.TweetListItem & {
    platform?: Platform;
    type?: keyof typeof TweetTypeEnum;
    image?: string;
  };
  modifySentiment?: (id: string, sentiment: 1 | 2 | 3) => void;
};

const TweetListItem: React.FC<TweetListItemProps> = ({ data: tweet, modifySentiment }) => {
  const {
    state: { listIncludeWords },
  } = useContext(ReportContext);

  const tweetContent = useMemo(() => {
    const keywords = listIncludeWords.flat();

    if (!keywords.length) return tweet.content;
    return tweet.content.replace(new RegExp(`(${keywords.join('|')})`, 'g'), (match) => {
      return `<span class="${styles.highlight}">${match}</span>`;
    });
  }, [tweet.content, listIncludeWords]);

  async function changeTweetSentiment() {}

  return (
    <Dropdown
      menu={{
        items: [],
        onClick: () => {},
      }}
      trigger={['contextMenu']}
    >
      <div className={styles.tweet}>
        <Checkbox
          value={tweet.id}
          onClick={(e) => {
            e.stopPropagation();
          }}
        />
        <div className={styles.tweet__left}>
          {/* <img
            className={styles.avatar}
            src={
              tweet.avatar && tweet.avatar !== 'None'
                ? decodeURIComponent(tweet.avatar)
                : 'https://tvax1.sinaimg.cn/default/images/default_avatar_female_180.gif?KID=imgbed,tva&Expires=1671366461&ssig=7lPflXwnyW'
            }
            alt="头像"
          /> */}
          <SentimentForm
            id={tweet.id}
            type="tweet"
            platform={tweet.platform}
            trigger={
              <div onClick={(e) => e.stopPropagation()}>
                <div className={styles.tweet__sentiment} onClick={() => changeTweetSentiment()}>
                  <img src={sentimentIcon[tweet.sentiment]} width={24} height={24} />
                </div>
                <span>{sentimentText[tweet.sentiment]}</span>
              </div>
            }
            onChange={(value) => {
              modifySentiment?.(tweet.id, value);
            }}
          />
        </div>
        <div
          className={styles.tweet__right}
          onClick={() => {
            if (tweet.platform === 'redbook') {
              window.open(`https://www.xiaohongshu.com/discovery/item/${tweet.id}`);
            } else if (tweet.platform === 'tiktok') {
              window.open(`https://www.douyin.com/video/${tweet.id}`);
            } else if (tweet.platform === 'weibo') {
              window.open(`https://weibo.com/detail/${tweet.id}`);
            }
          }}
        >
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
              {/* <Tag color={genderColor[tweet.gender]}>{tweet.gender}</Tag> */}
              <GenderElement gender={tweet.gender} />
              <Tag>{tweet.userType}</Tag>
              <span className={styles.tweet__time}>
                {dayjs(tweet.createdAtTimestamp).format('YYYY-MM-DD HH:mm:ss')}
              </span>
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
              <div
                className={styles.tweet__text}
                dangerouslySetInnerHTML={{ __html: tweetContent }}
              ></div>
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
      projectId,
      timeLimit,
      platforms,
      sentiment,
      wordCloudDeleteWord,
      wordClassDeleteWord,
      wordTrendDeleteWord,
      appearTogetherDeleteWord,
      brandBarDeleteWord,
      categoryBarDeleteWord,
      specificChartDeleteWord,
      listTimeLimit,
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
      gender,
      wordMap,
      category,
      wordClassType,
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
  const [deletedTweets, setDeletedTweets] = useState<string[]>([]);
  const [totalHeat, setTotalHeat] = useState(0);

  const checkAll = selectedRowKeys.length === dataList.length && dataList.length > 0;
  const indeterminate = selectedRowKeys.length > 0 && selectedRowKeys.length < dataList.length;

  const { currentPage, pageSize, Pagination, reset } = usePageInfo(total);

  const reqIncludeWordsData = useMemo(() => {
    const allListIncludeWords = listIncludeWords.flat();
    return includeWords.length
      ? includeWords.map((item) => {
          return searchValue
            ? [...item, ...allListIncludeWords, searchValue]
            : [...item, ...allListIncludeWords];
        })
      : searchValue
      ? [[...allListIncludeWords, searchValue]]
      : [allListIncludeWords].filter((item) => item.length);
  }, [listIncludeWords, includeWords, searchValue]);

  const { run: updateApi } = useRequest(updateTaskInfo, {
    manual: true,
  });

  const {
    loading,
    run: fetchData,
    cancel,
  } = useRequest(
    () =>
      tweetList({
        timeLimit: listTimeLimit,
        userType: listUserType,
        platforms: listPlatforms,
        tasksId,
        excludeWords: [...excludeWords, ...listExcludeWords],
        includeWords: reqIncludeWordsData,
        sentiment: listSentiment,
        excludeNotes: [...excludeNotes, ...deletedTweets],
        excludeUsers,
        userGender: gender,
        mappingWord: wordMap,
        classification: category,
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
        setTotalHeat(res.heat);
      },
      onError: (err) => {
        console.error(err);
      },
    },
  );

  const downloadExcel = async () => {
    const params = {
      timeLimit: listTimeLimit,
      userType: listUserType,
      platforms: listPlatforms,
      tasksId,
      excludeWords: [...excludeWords, ...listExcludeWords],
      includeWords: reqIncludeWordsData,
      sentiment: listSentiment,
      excludeNotes,
      excludeUsers,
      userGender: gender,
      mappingWord: wordMap,
      classification: category,
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
        platform: platformString[item.platform],
        link: getTweetLink(item.id, item.platform),
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
        platform: '平台',
        link: '原文链接',
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

  // 永久删除推文
  const deleteTweetFover = () => {
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
        updateApi({
          projectId,
          wordTasksId: tasksId,
          condition: JSON.stringify({
            includeWords,
            excludeWords,
            timeLimit,
            platforms,
            sentiment,
            category,
            gender,
            wordCloudDeleteWord,
            wordClassDeleteWord,
            wordTrendDeleteWord,
            appearTogetherDeleteWord,
            brandBarDeleteWord,
            categoryBarDeleteWord,
            specificChartDeleteWord,
            wordMap,
            wordClassType,
            excludeNotes: [...excludeNotes, ...(selectedRowKeys as string[])],
          }),
        });
      },
    });
  };

  const deleteTweet = () => {
    setDeletedTweets((prev) => [...prev, ...(selectedRowKeys as string[])]);
  };

  const modifySentiment = (id: string, sentimentValue: 1 | 2 | 3) => {
    setDataList(
      dataList.map((item) => {
        if (item.id === id) {
          item.sentiment = sentimentValue;
        }
        return item;
      }),
    );
  };

  const onCheckAllChange = (e: CheckboxChangeEvent) => {
    setSelectedRowKeys(e.target.checked ? dataList.map((item) => item.id) : []);
  };

  useEffect(() => {
    reset();
  }, [
    sortKey,
    sortOrder,
    excludeWords,
    reqIncludeWordsData,
    listTimeLimit,
    tasksId,
    listUserType,
    listPlatforms,
    listExcludeWords,
    listSentiment,
    excludeNotes,
    excludeUsers,
    gender,
    wordMap,
    category,
  ]);

  useEffect(() => {
    if (!tasksId.length) return;
    if (loading) {
      cancel();
    }
    fetchData();
  }, [
    pageSize,
    currentPage,
    tasksId,
    sortKey,
    sortOrder,
    excludeWords,
    reqIncludeWordsData,
    listTimeLimit,
    tasksId,
    listUserType,
    listPlatforms,
    listExcludeWords,
    listSentiment,
    excludeNotes,
    excludeUsers,
    gender,
    wordMap,
    category,
    deletedTweets,
  ]);

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ display: 'flex', marginBottom: 20, gap: 10 }}>
        <Form
          layout="inline"
          style={{ flex: 1 }}
          onFinish={(values) => {
            setSearchValue(values.keyword);
          }}
        >
          <Form.Item name="keyword" style={{ width: '100%' }}>
            <Input placeholder="输入关键词搜索" style={{ flex: 1 }} />
          </Form.Item>
        </Form>
        <Dropdown
          disabled={selectedRowKeys.length === 0}
          menu={{
            items: [
              { key: 'delete', label: '临时删除' },
              { key: 'deleteFover', label: '永久删除' },
            ],
            onClick: ({ key }) => {
              if (key === 'delete') {
                deleteTweet();
              } else {
                deleteTweetFover();
              }
            },
          }}
        >
          <Button>
            删除 <DownOutlined />
          </Button>
        </Dropdown>
        <Button loading={downloadLoading} icon={<DownloadOutlined />} onClick={downloadExcel}>
          下载为Excel
        </Button>
      </div>
      <div style={{ display: 'flex', marginBottom: 20, gap: 10, alignItems: 'center' }}>
        <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
          全选
        </Checkbox>
        <SortComponent onChange={handleSortChange} />
      </div>
      <Spin spinning={loading}>
        <Checkbox.Group
          value={selectedRowKeys}
          style={{ display: 'block', width: '100%' }}
          onChange={(e) => setSelectedRowKeys(e)}
        >
          {dataList.map((item) => {
            return <TweetListItem key={item.id} data={item} modifySentiment={modifySentiment} />;
          })}
        </Checkbox.Group>
      </Spin>
      <div style={{ marginTop: 20, textAlign: 'center' }}>总互动量：{totalHeat}</div>
      <div style={{ display: 'flex', justifyContent: 'center', padding: 20 }}>{Pagination}</div>
    </div>
  );
};

export default TweetList;
