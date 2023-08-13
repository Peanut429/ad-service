import { Pagination, PaginationProps } from 'antd';
import { useMemo, useState } from 'react';

const usePageInfo = (total: number) => {
  const [pageInfo, setPageInfo] = useState({ page: 1, limit: 10 });

  const handleChange: PaginationProps['onChange'] = (page, pageSize) => {
    setPageInfo({ page, limit: pageSize });
  };

  const PaginationDOM = (
    <Pagination
      current={pageInfo.page}
      pageSize={pageInfo.limit}
      total={total}
      showTotal={(total) => `共 ${total} 条`}
      onChange={handleChange}
    />
  );

  return useMemo(() => {
    return {
      currentPage: pageInfo.page,
      pageSize: pageInfo.limit,
      Pagination: PaginationDOM,
    };
  }, [pageInfo, total]);
};

export default usePageInfo;
