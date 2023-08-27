import { Space, Tooltip } from 'antd';
import ChartCard from '@/components/ChartCard';
import WordCloudChart from './Charts/WordCloud';
import HeatmapChart from './Charts/Heatmap';
import AppearTogetherChart from './Charts/AppearTogetherChart';
import BrandBarChart from './Charts/BrandBar';
import WordClass from './Charts/WordClass';
import { QuestionCircleOutlined } from '@ant-design/icons';
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
      <ChartCard
        title={
          <Space>
            <span>高频词共现关系图</span>
            <Tooltip placement="bottom" title="点击单独的词添加该关键词，点击线添加两个词且的关系">
              <QuestionCircleOutlined style={{ fontSize: 14 }} />
            </Tooltip>
          </Space>
        }
      >
        <AppearTogetherChart />
      </ChartCard>
      <ChartCard title="品牌">
        <BrandBarChart />
      </ChartCard>
    </Space>
  );
};

export default Keywords;
