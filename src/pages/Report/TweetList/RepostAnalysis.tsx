import { createRepostLevelTask, repostLevelData } from '@/services/ant-design-pro/repost';
import { Button, message, Spin, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SankeyChart } from 'echarts/charts';
import { TooltipComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import type { EChartsOption } from 'echarts/types/dist/shared';
import { useEffect, useRef, useState } from 'react';

import './repost-analysis.less';

interface IRepostAnalysisProps {
  id: string;
}

echarts.use([SankeyChart, CanvasRenderer, TooltipComponent]);

const RepostAnalysis: React.FC<IRepostAnalysisProps> = ({ id }) => {
  const divRef = useRef<HTMLDivElement | null>(null);
  const [chartData, setChartData] = useState<API.RepostLevelDataRes['data']['repost_tree']>();
  const [tableData, setTableData] = useState<
    API.RepostLevelDataRes['data']['repost_layer'][number][]
  >([]);
  const [taskLoading, setTaskLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const columns: ColumnsType<API.RepostLevelDataRes['data']['repost_layer'][number]> = [
    { title: '层级', width: 120, render: (_, record, index) => `第${index + 1}层级` },
    { title: '互动总量', width: 150, render: (_, record) => record.total_heat.toLocaleString() },
    {
      title: '层级中的爆点',
      render: (_, record) =>
        record.hot_tweets.map((item) => (
          <div
            key={item.tweet_bid}
            className="repost-user"
            onClick={() => {
              window.open(`https://www.weibo.com/${item.user_id}/${item.tweet_bid}`);
            }}
          >
            <div className="name">{item.nick_name}</div>
            <div className="heat">互动量{item.heat.toLocaleString()}</div>
          </div>
        )),
    },
  ];

  useEffect(() => {
    async function getData() {
      setLoading(true);
      const res = await repostLevelData({ tweet_bid: id });
      // const res = await repostLevelData({ tweet_bid: 'MeG0QsK6P' })
      if (Array.isArray(res.data.repost_tree)) {
        setChartData(res.data.repost_tree);
        setTableData(Object.values(res.data.repost_layer));
      } else {
        setChartData(undefined);
      }
      setLoading(false);
    }

    getData();
  }, [id]);

  useEffect(() => {
    if (!divRef.current || !chartData) return;

    const chart = echarts.init(divRef.current);
    const options: EChartsOption = {
      tooltip: { trigger: 'item' },
      series: [
        {
          type: 'sankey',
          label: {
            color: 'rgba(0,0,0,0.7)',
            fontFamily: 'Arial',
            fontSize: 12,
            formatter: (params) => {
              return (params.data as any).nick_name as string;
            },
          },
          layoutIterations: 0,
          nodeAlign: 'left',
          nodeGap: 10,
          data: chartData[0],
          links: chartData[1].sort((a, b) => Number(a.source > b.source)),
        },
      ],
    };
    chart.setOption(options);

    return () => chart.dispose();
  }, [chartData]);

  async function createTask() {
    setTaskLoading(true);
    try {
      await createRepostLevelTask({ tweet_bid: id });
      message.success('数据正在计算中，请稍后查看');
    } catch {}
    setTaskLoading(false);
  }

  return (
    <>
      {/* <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
      </div> */}
      <Spin spinning={loading}>
        <div
          ref={divRef}
          style={{
            height: 400,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
          }}
        >
          <span>暂无数据</span>
          {!chartData ? (
            <Button loading={taskLoading} onClick={() => createTask()}>
              获取转发层级数据
            </Button>
          ) : null}
        </div>
        <Table columns={columns} dataSource={tableData} pagination={{ pageSize: 10 }} />
      </Spin>
    </>
  );
};

export default RepostAnalysis;
