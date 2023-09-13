import { Space } from 'antd';
import ChartCard from '@/components/ChartCard';
import AgeAndGenderChart from './Charts/AgeAndGenderChart';
import IdentityChart from './Charts/IdentityChart';
import FanLevelChart from './Charts/FanLevel';
import UserAreaChart from './Charts/MapChart';

const PortraitAnalysis = () => {
  // const [dataSource, setDataSource] = useState<'tweet' | 'comment'>('tweet');

  return (
    <>
      <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
        {/* <Segmented
          defaultValue="tweet"
          options={[
            { label: '发帖人', value: 'tweet' },
            { label: '受众', value: 'comment' },
          ]}
          onChange={(value) => setDataSource(value as 'tweet' | 'comment')}
        /> */}
        <ChartCard title="年龄与性别分布">
          <AgeAndGenderChart dataSource={'tweet'} />
        </ChartCard>
        <ChartCard title="身份占比">
          <IdentityChart dataSource={'tweet'} />
        </ChartCard>
        <ChartCard title="粉丝量级">
          <FanLevelChart dataSource={'tweet'} />
        </ChartCard>
        <ChartCard title="地域分别">
          <UserAreaChart dataSource={'tweet'} />
        </ChartCard>
      </Space>
    </>
  );
};

export default PortraitAnalysis;
