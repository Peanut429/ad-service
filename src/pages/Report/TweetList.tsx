import { tweetList } from '@/services/report';
import { useContext, useEffect, useState } from 'react';
import ReportContext from './Report.context';
import { Pagination, PaginationProps } from 'antd';

type TweetListItemProps = {
  data: ReportApi.TweetListItem;
};

const TweetListItem: React.FC<TweetListItemProps> = () => {
  return <div>tweet list item</div>;
};

const TweetList = () => {
  const {
    state: { timeLimit, userType, platforms, tasksId, excludeWords, includeWords, sentiment },
  } = useContext(ReportContext);
  const [dataList, setDataList] = useState<ReportApi.TweetListItem[]>([]);
  const [pageInfo, setPageInfo] = useState({ page: 1, limit: 10 });
  const [sortKey, setSortKey] = useState('heat');
  const [sortOrder, setSortOrder] = useState('desc');
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
