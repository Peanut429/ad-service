import { Space } from 'antd';
import ChartCard from '@/components/ChartCard';
import WordCloudChart from './Charts/WordCloud';
import HeatmapChart from './Charts/Heatmap';
import AppearTogetherChart from './Charts/AppearTogetherChart';
import BrandBarChart from './Charts/BrandBar';
import WordClass from './Charts/WordClass';
// import KeywordCategoryChart from './Charts/KeywordCategoryChart';

const Keywords = () => {
  return (
    <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
      <ChartCard title="关键词词云">
        <WordCloudChart />
      </ChartCard>
      <ChartCard title="关键词类别">
        <WordClass />
      </ChartCard>
      <ChartCard title="TOP 10 高频词热力图">
        <HeatmapChart />
      </ChartCard>
      <ChartCard title="高频词共现关系图">
        <AppearTogetherChart />
      </ChartCard>
      <ChartCard title="品牌">
        <BrandBarChart />
      </ChartCard>
    </Space>
  );
};

export default Keywords;
