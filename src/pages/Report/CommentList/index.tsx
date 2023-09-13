import React, { useContext, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { Button, Space, Spin, Tag, message } from 'antd';
import { DownloadOutlined, LikeOutlined, ManOutlined, WomanOutlined } from '@ant-design/icons';
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
import SortComponent from '../SortComponent';
import SentimentForm from '../SentimentForm';
import getTweetLink from '@/utils/getTweetLink';
// import SortComponent from '../SortComponent';

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

const genderColor = {
  男: '#108ee9',
  女: '#cd201f',
  未知: 'default',
};

export const GenderElement: React.FC<{ gender: keyof typeof genderColor }> = ({ gender }) => {
  if (gender === '男') {
    return <ManOutlined style={{ color: '#5B92E1' }} />;
  } else if (gender === '女') {
    return <WomanOutlined style={{ color: '#FF7084' }} />;
  }
  return <Tag>性别未知</Tag>;
};

type CommentListItemProps = {
  data: ReportApi.CommentListItem & {
    platform?: Platform;
    tweet_content?: string;
  };
  modifySentiment?: (id: string, sentiment: 1 | 2 | 3) => void;
};

const CommentListItem: React.FC<CommentListItemProps> = ({ data: data, modifySentiment }) => {
  // const handleMenuItemClick: MenuProps['onClick'] = ({ key }) => {
  //   if (key === 'tweet') {
  //     const link = getTweetLink(data.noteId, data.platform);
  //     window.open(link);
  //   }
  // };

  return (
    // <Dropdown
    //   menu={{
    //     items: [{ label: '查看原文', key: 'tweet' }],
    //     onClick: handleMenuItemClick,
    //   }}
    //   trigger={['contextMenu']}
    // >
    // </Dropdown>
    <div className="works">
      <div className="works__left">
        <div className="works__avatar">
          <img src={data.avatar} alt="头像" />
        </div>
        {/* <div className="works__sentiment" onClick={() => setVisible(true) */}
        <SentimentForm
          id={data.id}
          platform={data.platform}
          type="comment"
          trigger={
            <div className="works__sentiment">
              <img src={sentimentIcon[data.sentiment || 0]} alt="情感" />
              <div>{sentimentText[data.sentiment || 0]}</div>
            </div>
          }
          onChange={(value) => modifySentiment?.(data.id, value)}
        />
      </div>
      <div className="works__center">
        <Space size={8} className="content__header">
          <div className="nickname">{data.nickname}</div>
          <GenderElement gender={data.gender} />
          {/* <Tag color={genderColor[data.gender]}>
          </Tag> */}
          <div className="time">{formatDate(data.createdAtTimestamp)}</div>
        </Space>
        <div className="content">
          <div className="comment-content">{data.content}</div>
          <div className="works-content">{data.noteContent}</div>
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
  );
};

const CommentList = () => {
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
      gender,
    },
  } = useContext(ReportContext);
  const [dataList, setDataList] = useState<ReportApi.CommentListItem[]>([]);
  const [total, setTotal] = useState(100);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const { currentPage, pageSize, Pagination } = usePageInfo(total);
  const [sortParams, setSortParams] = useState({
    order_key: 'time',
    order_direction: 1, // 1降序，0正序
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await commentList({
        timeLimit,
        tasksId,
        userType: listUserType,
        platforms: listPlatforms,
        excludeWords: [...excludeWords, ...listExcludeWords],
        includeWords: [...includeWords, ...listIncludeWords],
        sentiment: listSentiment,
        excludeNotes,
        excludeUsers,
        userGender: gender,
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
      timeLimit,
      tasksId,
      userType: listUserType,
      platforms: listPlatforms,
      excludeWords: [...excludeWords, ...listExcludeWords],
      includeWords: [...includeWords, ...listIncludeWords],
      sentiment: listSentiment,
      excludeNotes,
      excludeUsers,
      userGender: gender,
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
        gender: item.gender,
        noteContent: item.noteContent,
        createdAtTimestamp: dayjs(item.createdAtTimestamp).format('YYYY-MM-DD HH:mm:ss'),
        link: getTweetLink(item.noteId, item.platform),
      }));
      const headers = {
        nickname: '用户昵称',
        content: '评论内容',
        likeNum: '点赞数',
        sentiment: '情感',
        gender: '性别',
        noteContent: '原文内容',
        createdAtTimestamp: '发布时间',
        link: '原文链接',
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
    excludeWords,
    includeWords,
    tasksId,
    timeLimit,
    listUserType,
    listPlatforms,
    listExcludeWords,
    listIncludeWords,
    listSentiment,
    sortParams.order_direction,
    sortParams.order_key,
    excludeNotes,
    excludeUsers,
    gender,
  ]);

  return (
    <div>
      <Space style={{ marginBottom: 20 }}>
        <Button loading={downloadLoading} icon={<DownloadOutlined />} onClick={downloadExcel}>
          下载为Excel
        </Button>
      </Space>
      <div style={{ marginBottom: 20 }}>
        <SortComponent
          onChange={(value) => {
            console.log(value);
            setSortParams(value);
          }}
        />
      </div>
      <div>
        <Spin spinning={loading}>
          {dataList.map((item) => {
            return (
              <CommentListItem
                key={item.id}
                data={item}
                modifySentiment={(id: string, sentiment: 1 | 2 | 3) => {
                  setDataList(
                    dataList.map((data) => (data.id === id ? { ...data, sentiment } : data)),
                  );
                }}
              />
            );
          })}
        </Spin>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', padding: 20 }}>{Pagination}</div>
    </div>
  );
};

export default CommentList;
