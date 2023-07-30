import { Space } from 'antd';
import ChartCard from '@/components/ChartCard';
import WordCloudChart from './Charts/WordCloud';
// import KeywordCategoryChart from './Charts/KeywordCategoryChart';

const Keywords = () => {
  return (
    <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
      <ChartCard title="关键词词云">
        <WordCloudChart />
      </ChartCard>
      {/* <ChartCard title="关键词词云">
        <KeywordCategoryChart />
      </ChartCard> */}
    </Space>
  );
};

export default Keywords;
