import { useContext } from 'react';
import { Popover, Space } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import ChartCard from '@/components/ChartCard';
import TweetChart from './Charts/TweetChart';
import ReportContext from './Report.context';
import EventsTimeline from './EventsTimeline';

const Popularity = () => {
  const {
    state: { adNode },
  } = useContext(ReportContext);

  return (
    <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
      <ChartCard title="推文数量/热度趋势">
        <TweetChart />
      </ChartCard>
      <ChartCard
        title={
          <span>
            营销事件节点（共{(adNode || []).filter((item) => item.type === 'main').length}个）
            <Popover
              placement="right"
              content={
                <span>
                  营销事件节点用于快速定位品牌营销事件时间区间与主打话题。
                  <br />
                  营销事件区间内展示部分热度较高的相关贴。
                </span>
              }
            >
              <QuestionCircleOutlined style={{ marginLeft: 10 }} />
            </Popover>
          </span>
        }
      >
        <div
          style={{
            margin: -24,
            padding: '20px 10px 0 ',
            overflowY: 'auto',
            overflowX: 'hidden',
            maxHeight: 600,
          }}
        >
          <EventsTimeline />
        </div>
      </ChartCard>
    </Space>
  );
};

export default Popularity;
