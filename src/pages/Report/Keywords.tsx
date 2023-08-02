import { Space } from 'antd';
import ChartCard from '@/components/ChartCard';
import WordCloudChart from './Charts/WordCloud';
import HeatmapChart from './Charts/Heatmap';
import AppearTogetherChart from './Charts/AppearTogetherChart';
// import KeywordCategoryChart from './Charts/KeywordCategoryChart';

const Keywords = () => {
  return (
    <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
      <ChartCard title="关键词词云">
        <WordCloudChart />
      </ChartCard>
      <ChartCard title="TOP 10 高频词热力图">
        <HeatmapChart />
      </ChartCard>
      <ChartCard title="高频词共现关系图">
        <AppearTogetherChart />
      </ChartCard>
    </Space>
  );
};

export default Keywords;
