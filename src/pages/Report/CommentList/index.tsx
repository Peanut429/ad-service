import { commentList } from '@/services/report';
import { useContext, useEffect, useState } from 'react';
import ReportContext from '../Report.context';
import usePageInfo from '../usePageInfo';
import classNames from 'classnames';
import { Dropdown, Space } from 'antd';
import { LikeOutlined } from '@ant-design/icons';
import sentimentBad from '../TweetList/sentiment_bad.png';
import sentimentGood from '../TweetList/sentiment_good.png';
import sentimentNeutral from '../TweetList/sentiment_neutral.png';
import { Platform } from '../Report.state';
import './index.less';
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
  '1': sentimentBad,
  '2': sentimentNeutral,
  '3': sentimentGood,
};

const sentimentText = {
  '1': '负面',
  '0': '中性',
  '2': '正面',
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
            <img src={data.sentiment && sentimentIcon[data.sentiment]} alt="情感" />
            <div>{data.sentiment && sentimentText[data.sentiment]}</div>
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
    state: { timeLimit, userType, platforms, tasksId, excludeWords, includeWords, sentiment },
  } = useContext(ReportContext);
  const [dataList, setDataList] = useState<ReportApi.CommentListItem[]>([]);
  // const [pageInfo, setPageInfo] = useState({ page: 1, limit: 10 });
  const [sortKey] = useState('heat');
  const [sortOrder] = useState('desc');
  const [total, setTotal] = useState(100);

  const { currentPage, pageSize, Pagination } = usePageInfo(total);
  const [params, setParams] = useState({
    order_key: 'createdAtTimestamp',
    order_direction: 1, // 1降序，0正序
    page: 1,
    limit: 10,
  });
  const fetchData = async () => {
    const res = await commentList({
      timeLimit,
      userType,
      platforms,
      tasksId,
      excludeWords,
      includeWords,
      sentiment,
      page: currentPage,
      limit: pageSize,
      sortKey: sortKey,
      sortOrder: sortOrder,
    });

    setDataList(res.data.data);
    setTotal(res.data.count);
  };

  useEffect(() => {
    fetchData();
  }, [
    //   pageInfo,
    pageSize,
    currentPage,
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
      <div className="sort-wrapper">
        <div
          className="sort__item"
          onClick={() => {
            setParams((prev) => ({
              ...prev,
              order_key: 'created_at_timestamp',
              order_direction:
                prev.order_key === 'created_at_timestamp' ? 1 - prev.order_direction : 1,
            }));
          }}
        >
          <span>发布时间</span>
          <span className="sort-icon-wrapper">
            <span
              className={classNames('sort-icon__up', {
                active: params.order_key === 'created_at_timestamp' && !params.order_direction,
              })}
            />
            <span
              className={classNames('sort-icon__down', {
                active: params.order_key === 'created_at_timestamp' && params.order_direction,
              })}
            />
          </span>
        </div>
        <div
          className="sort__item"
          onClick={() => {
            setParams((prev) => ({
              ...prev,
              order_key: 'heat',
              order_direction: prev.order_key === 'heat' ? 1 - prev.order_direction : 1,
            }));
          }}
        >
          <span>互动量</span>
          <span className="sort-icon-wrapper">
            <span
              className={classNames('sort-icon__up', {
                active: params.order_key === 'heat' && !params.order_direction,
              })}
            />
            <span
              className={classNames('sort-icon__down', {
                active: params.order_key === 'heat' && params.order_direction,
              })}
            />
          </span>
        </div>
      </div>
      <div>
        {dataList.map((item) => {
          return <CommentListItem key={item.id} data={item} />;
        })}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', padding: 20 }}>
        {/* <Pagination
            current={pageInfo.page}
            pageSize={pageInfo.limit}
            total={total}
            onChange={handleChange}
          /> */}
        {Pagination}
      </div>
    </div>
  );
};

export default CommentList;
