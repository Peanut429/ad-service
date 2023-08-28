import { Segmented, Spin } from 'antd';
import { useContext, useEffect, useRef, useState } from 'react';
import ReportContext from '../Report.context';
import { Area } from '@antv/g2plot';

const TweetChart = () => {
  const {
    state: { tweetTrendData, chartLoading },
  } = useContext(ReportContext);
  const divRef = useRef<HTMLDivElement | null>(null);
  const [dataType, setDataType] = useState<'frequency' | 'heat'>('heat');

  useEffect(() => {
    if (!tweetTrendData || !divRef.current) return;

    const chart = new Area(divRef.current, {
      data: tweetTrendData[dataType],
      height: 300,
      xField: 'key',
      yField: 'value',
      // seriesField: '',
      smooth: true,
      meta: {
        value: {
          alias: dataType === 'heat' ? '热度' : '数量',
        },
      },
      slider: { start: 0.1, end: 0.9, height: 30 },
    });

    chart.render();

    return () => {
      chart.destroy();
    };
  }, [tweetTrendData, dataType]);

  return (
    <div>
      <Segmented
        value={dataType}
        options={[
          { label: '数量', value: 'frequency' },
          { label: '热度', value: 'heat' },
        ]}
        onChange={(value) => setDataType(value as 'frequency' | 'heat')}
      />
      <Spin spinning={chartLoading}>
        <div ref={divRef} style={{ marginTop: 20 }} />
      </Spin>
    </div>
  );
};

export default TweetChart;
