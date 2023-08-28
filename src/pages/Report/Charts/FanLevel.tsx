import { useContext, useEffect, useRef } from 'react';
import ReportContext from '../Report.context';
import { Column } from '@antv/g2plot';
import { Spin } from 'antd';

const FanLevelChart: React.FC<{ dataSource: 'tweet' | 'comment' }> = ({ dataSource }) => {
  const divRef = useRef<HTMLDivElement | null>(null);
  const {
    state: { userPortraitData, chartLoading },
  } = useContext(ReportContext);

  useEffect(() => {
    if (!divRef.current || !userPortraitData) return;

    const data = userPortraitData[dataSource].fanLevel.data;

    const chart = new Column(divRef.current, {
      data,
      height: 300,
      xField: 'key',
      yField: 'value',
      meta: {
        redbook: { alias: '小红书' },
        weibo: { alias: '微博' },
        value: { alias: '人数' },
      },
      legend: { position: 'bottom' },
    });

    chart.render();

    return () => chart.destroy();
  }, [userPortraitData, dataSource]);

  return (
    <Spin spinning={chartLoading}>
      <div ref={divRef} style={{ height: 300 }} />
    </Spin>
  );
};

export default FanLevelChart;
