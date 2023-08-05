import ChartCard from '@/components/ChartCard';
import { Segmented, Space } from 'antd';
import AgeAndGenderChart from './Charts/AgeAndGenderChart';
import { useState } from 'react';
import IdentityChart from './Charts/IdentityChart';

const PortraitAnalysis = () => {
  const [dataSource, setDataSource] = useState<'tweet' | 'comment'>('tweet');

  return (
    <>
      <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
        <Segmented
          defaultValue="tweet"
          options={[
            { label: '全部', value: 'all' },
            { label: '发帖人', value: 'tweet' },
            { label: '受众', value: 'comment' },
          ]}
          onChange={(value) => setDataSource(value as 'tweet' | 'comment')}
        />
        <ChartCard title="年龄与性别分布">
          <AgeAndGenderChart dataSource={dataSource} />
        </ChartCard>
        <ChartCard title="身份占比">
          <IdentityChart dataSource={dataSource} />
        </ChartCard>
      </Space>
    </>
  );
};

export default PortraitAnalysis;
