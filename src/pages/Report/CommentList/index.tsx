import React, { useContext, useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { Button, Space, Spin, Tag, message } from 'antd';
import {
  CommentOutlined,
  DownloadOutlined,
  LikeOutlined,
  ManOutlined,
  WomanOutlined,
} from '@ant-design/icons';
import { utils, writeFile } from 'xlsx';
import usePageInfo from '../usePageInfo';
import { Platform } from '../Report.state';
import ReportContext from '../Report.context';
import { commentList } from '@/services/report';
import sentimentBad from '../TweetList/sentiment_bad.png';
import sentimentGood from '../TweetList/sentiment_good.png';
import sentimentNeutral from '../TweetList/sentiment_neutral.png';
import sentimentUnknow from '../TweetList/question.png';

import SortComponent from '../SortComponent';
import SentimentForm from '../SentimentForm';
import getTweetLink from '@/utils/getTweetLink';
// import SortComponent from '../SortComponent';
import './index.less';
import { useRequest } from '@umijs/max';

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
  const {
    state: { commentIncludeWords },
  } = useContext(ReportContext);

  const commentContent = useMemo(() => {
    const keywords = commentIncludeWords.flat();
    if (!keywords.length) return data.content;
    return data.content.replace(new RegExp(`(${keywords.join('|')})`, 'g'), (match) => {
      return `<span class="highlight">${match}</span>`;
    });
  }, [data.content, commentIncludeWords]);

  return (
    <div className="works">
      <div className="works__left">
        {/* <div className="works__avatar">
          <img src={data.avatar} alt="头像" />
        </div> */}
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
          <div className="nickname">{data.nickname || '匿名'}</div>
          <GenderElement gender={data.gender} />
          <div className="time">{formatDate(data.createdAtTimestamp)}</div>
        </Space>
        <div className="content">
          <div
            className="comment-content"
            dangerouslySetInnerHTML={{ __html: commentContent }}
          ></div>
          <div className="works-content">{data.noteContent}</div>
        </div>
        <Space size={20}>
          <span>
            <LikeOutlined />
            {data.likeNum.toLocaleString()}
          </span>
          <span>
            <CommentOutlined /> {data.subCommentNum.toLocaleString()}
          </span>
        </Space>
      </div>
    </div>
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
      listSentiment,
      excludeNotes,
      excludeUsers,
      gender,
      commentIncludeWords,
      wordMap,
      category,
    },
  } = useContext(ReportContext);

  const [dataList, setDataList] = useState<ReportApi.CommentListItem[]>([]);
  const [total, setTotal] = useState(100);
  const [downloadLoading, setDownloadLoading] = useState(false);

  const { currentPage, pageSize, Pagination, reset } = usePageInfo(total);
  const [sortParams, setSortParams] = useState({
    order_key: 'time',
    order_direction: 1, // 1降序，0正序
  });

  const {
    run: commentListApi,
    loading,
    cancel,
  } = useRequest(
    () =>
      commentList({
        timeLimit: listTimeLimit,
        tasksId,
        userType: listUserType,
        platforms: listPlatforms,
        excludeWords: [...excludeWords, ...listExcludeWords],
        includeWords: includeWords,
        commentIncludeWords: commentIncludeWords,
        sentiment: listSentiment,
        excludeNotes,
        excludeUsers,
        userGender: gender,
        mappingWord: wordMap,
        classification: category,
        page: currentPage,
        limit: pageSize,
        sortKey: sortParams.order_key,
        sortOrder: sortParams.order_direction === 1 ? 'desc' : 'asc',
      }),
    {
      manual: true,
      onSuccess: (data) => {
        setDataList(data.data);
        setTotal(data.count);
      },
      debounceInterval: 500,
    },
  );

  const downloadExcel = async () => {
    const params = {
      timeLimit: listTimeLimit,
      tasksId,
      userType: listUserType,
      platforms: listPlatforms,
      excludeWords: [...excludeWords, ...listExcludeWords],
      includeWords: includeWords,
      commentIncludeWords: commentIncludeWords,
      sentiment: listSentiment,
      excludeNotes,
      excludeUsers,
      userGender: gender,
      mappingWord: wordMap,
      classification: category,
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
    reset();
  }, [
    excludeWords,
    includeWords,
    tasksId,
    // timeLimit,
    listTimeLimit,
    listUserType,
    listPlatforms,
    listExcludeWords,
    listSentiment,
    sortParams.order_direction,
    sortParams.order_key,
    excludeNotes,
    excludeUsers,
    gender,
    commentIncludeWords,
    wordMap,
    category,
  ]);

  useEffect(() => {
    if (!tasksId.length) return;
    if (loading) cancel();
    commentListApi();
  }, [
    pageSize,
    currentPage,
    tasksId,
    excludeWords,
    includeWords,
    tasksId,
    // timeLimit,
    listTimeLimit,
    listUserType,
    listPlatforms,
    listExcludeWords,
    listSentiment,
    sortParams.order_direction,
    sortParams.order_key,
    excludeNotes,
    excludeUsers,
    gender,
    commentIncludeWords,
    wordMap,
    category,
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
