import { Segmented } from 'antd';
import { useState } from 'react';

const useDataSource = () => {
  const [source, setSource] = useState<'total' | 'tweet' | 'comment'>('tweet');

  return [
    source,
    <Segmented
      key="node"
      value={source}
      options={[
        { label: '全部', value: 'total' },
        { label: '推文', value: 'tweet' },
        { label: '评论', value: 'comment' },
      ]}
      onChange={(value) => setSource(value as 'tweet' | 'comment')}
    />,
  ];
};

export default useDataSource;
