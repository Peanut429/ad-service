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
      <ChartCard
        title={
          <Space>
            <span>关键词类别</span>
            <Tooltip placement="right" title="右键关键词可以进行相关操作">
              <QuestionCircleOutlined style={{ fontSize: 14 }} />
            </Tooltip>
          </Space>
        }
      >
        <WordClass />
      </ChartCard>
      <ChartCard
        title={
          <Space>
            <span>高频词热力图</span>
            <Tooltip
              placement="right"
              title="右键 Y轴 的关键词可以进行相关操作，左键点击 X轴 可以筛选时间范围"
            >
              <QuestionCircleOutlined style={{ fontSize: 14 }} />
            </Tooltip>
          </Space>
        }
      >
        <HeatmapChart />
      </ChartCard>
      <ChartCard
        title={
          <Space>
            <span>高频词共现关系图</span>
            <Tooltip
              placement="bottom"
              title="点击单独的词添加该关键词，点击线添加两个词且的关系, 右键关键词可以进行相关操作"
            >
              <QuestionCircleOutlined style={{ fontSize: 14 }} />
            </Tooltip>
          </Space>
        }
      >
        <AppearTogetherChart />
      </ChartCard>
      <ChartCard
        title={
          <Space>
            <span>品牌</span>
            <Tooltip placement="right" title="右键 X轴 的品牌名称可以进行相关操作">
              <QuestionCircleOutlined style={{ fontSize: 14 }} />
            </Tooltip>
          </Space>
        }
      >
        <BrandBarChart />
      </ChartCard>
    </Space>
  );
};

export default Keywords;
