import { useContext, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { Button, Dropdown, Space, Spin, message } from 'antd';
import { DownloadOutlined, LikeOutlined } from '@ant-design/icons';
import { utils, writeFile } from 'xlsx';
import usePageInfo from '../usePageInfo';
import { Platform } from '../Report.state';
import ReportContext from '../Report.context';
import { commentList } from '@/services/report';
import sentimentBad from '../TweetList/sentiment_bad.png';
import sentimentGood from '../TweetList/sentiment_good.png';
import sentimentNeutral from '../TweetList/sentiment_neutral.png';
import sentimentUnknow from '../TweetList/question.png';

import './index.less';
// import SortComponent from '../SortComponent';

type CommentListItemProps = {
  data: ReportApi.CommentListItem & {
    platform?: Platform;
    tweet_content?: string;
  };
};

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

const CommentListItem: React.FC<CommentListItemProps> = ({ data: data }) => {
  return (
    <Dropdown
      // overlay={<Menu items={[
      //   { label: '查看用户', key: 'user' },
      //   { label: '查看原文', key: 'works' },
      // ]}
      // onClick={({ key }) => {
      //   if (key === 'user') {
      //     if (data.platform === 'weibo') {
      //       window.open(`https://weibo.com/u/${data.id}`);
      //     } else if (data.platform === 'redbook') {
      //       window.open(`https://www.xiaohongshu.com/user/profile/${data.id}`);
      //     }
      //   } else if (key === 'works') {
      //     if (data.platform === 'weibo') {
      //       window.open(`https://weibo.com/${data.id}/${data.id}`);
      //     } else if (data.platform === 'redbook') {
      //       window.open(`https://www.xiaohongshu.com/discovery/item/${data.id}`);
      //     }
      //   }
      // }} />}
      trigger={['contextMenu']}
    >
      <div className="works">
        <div className="works__left">
          <div className="works__avatar">
            <img src={data.avatar} alt="头像" />
          </div>
          {/* <div className="works__sentiment" onClick={() => setVisible(true) */}
          <div className="works__sentiment">
            <img src={sentimentIcon[data.sentiment || 0]} alt="情感" />
            <div>{sentimentText[data.sentiment || 0]}</div>
          </div>
        </div>
        <div className="works__center">
          <Space size={8} className="content__header">
            <div className="nickname">{data.nickname}</div>
            <div className="time">{formatDate(data.createdAtTimestamp)}</div>
          </Space>
          <div className="content">
            <div className="comment-content">{data.content}</div>
            <div className="works-content">
              不知道姐妹们发现没有，现在一瓶洗发水沐浴露护发素这些好贵一瓶，类似一些老牌子现在随便一瓶都要最低五十起步甚至随便都要八九十的！有时候看到这个价格我真不舍得买[暗中观察R]现在一百块人民币能买些啥啊[哭惹R][哭惹R]#洗护推荐#
              #消费观# #洗发水# #沐浴露# #护发素#
            </div>
          </div>
          <Space size={20}>
            <span>
              <LikeOutlined />
              {data.likeNum.toLocaleString()}
            </span>
            {/* <span style={{ color: '#ccc' }}>
                <CommentOutlined style={{ color: '#ccc' }} />
                {data.tweet_comment_num.toLocaleString()}
              </span> */}
            {/* {data.platform === 'weibo' ? (
                <span style={{ color: '#ccc' }}>
                  <ShareAltOutlined style={{ color: '#ccc' }} />
                  {(data.tweet_repost_num || 0).toLocaleString()}
                </span>
              ) : null} */}
            {/* {data.platform === 'redbook' ? (
                <span style={{ color: '#ccc' }}>
                  <StarOutlined style={{ color: '#ccc' }} />
                  {(data.tweet_collect_num || 0).toLocaleString()}
                </span>
              ) : null} */}
          </Space>
        </div>
      </div>
    </Dropdown>
  );
};

const CommentList = () => {
  const {
    state: {
      listTimeLimit,
      listUserType,
      listPlatforms,
      tasksId,
      excludeWords,
      listExcludeWords,
      includeWords,
      listIncludeWords,
      listSentiment,
    },
  } = useContext(ReportContext);
  const [dataList, setDataList] = useState<ReportApi.CommentListItem[]>([]);
  const [sortKey] = useState('heat');
  const [sortOrder] = useState('desc');
  const [total, setTotal] = useState(100);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const { currentPage, pageSize, Pagination } = usePageInfo(total);
  const [sortParams] = useState({
    order_key: 'heat',
    order_direction: 1, // 1降序，0正序
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await commentList({
        timeLimit: listTimeLimit,
        userType: listUserType,
        platforms: listPlatforms,
        tasksId,
        excludeWords: [...excludeWords, ...listExcludeWords],
        includeWords: [...includeWords, ...listIncludeWords],
        sentiment: listSentiment,
        page: currentPage,
        limit: pageSize,
        sortKey: sortParams.order_key,
        sortOrder: sortParams.order_direction === 1 ? 'desc' : 'asc',
      });

      setDataList(res.data.data);
      setTotal(res.data.count);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const downloadExcel = async () => {
    const params = {
      timeLimit: listTimeLimit,
      userType: listUserType,
      platforms: listPlatforms,
      tasksId,
      excludeWords: [...excludeWords, ...listExcludeWords],
      includeWords: [...includeWords, ...listIncludeWords],
      sentiment: listSentiment,
      page: 1,
      limit: 10000,
      sortKey: sortParams.order_key,
      sortOrder: sortParams.order_direction === 1 ? 'desc' : 'asc',
    };
    setDownloadLoading(true);
    try {
      const res = await commentList(params);
      const data = res.data.data.map((item) => ({
        nickname: item.nickname,
        content: item.content,
        likeNum: item.likeNum,
        sentiment: sentimentText[item.sentiment] || '未知',
        createdAtTimestamp: dayjs(item.createdAtTimestamp).format('YYYY-MM-DD HH:mm:ss'),
      }));
      const headers = {
        nickname: '用户昵称',
        content: '评论内容',
        likeNum: '点赞数',
        sentiment: '情感',
        createdAtTimestamp: '发布时间',
      };
      const workbook = utils.book_new();
      const worksheet = utils.json_to_sheet([headers, ...data], { skipHeader: true });
      utils.book_append_sheet(workbook, worksheet, '评论列表');
      writeFile(workbook, '评论.xlsx');
    } catch (error) {
      message.error('导出数据失败');
    }
    setDownloadLoading(false);
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
    includeWords,
    tasksId,
    listTimeLimit,
    listUserType,
    listPlatforms,
    listExcludeWords,
    listIncludeWords,
    listSentiment,
    sortParams,
  ]);

  return (
    <div>
      {/* <SortComponent
        onChange={(value) => {
          setSortParams(value);
        }}
      /> */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
        <Button loading={downloadLoading} icon={<DownloadOutlined />} onClick={downloadExcel}>
          下载为Excel
        </Button>
      </div>
      <div>
        <Spin spinning={loading}>
          {dataList.map((item) => {
            return <CommentListItem key={item.id} data={item} />;
          })}
        </Spin>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', padding: 20 }}>{Pagination}</div>
    </div>
  );
};

export default CommentList;
