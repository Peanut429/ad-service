import { Segmented, Spin } from 'antd';
import { useContext, useEffect, useRef, useState } from 'react';
import ReportContext from '../Report.context';
import { Area } from '@antv/g2plot';
import dayjs from 'dayjs';

const TweetChart = () => {
  const {
    state: { tweetTrendData, chartLoading },
    dispatch,
  } = useContext(ReportContext);
  const divRef = useRef<HTMLDivElement | null>(null);
  const [dataType, setDataType] = useState<'frequency' | 'heat'>('heat');
  const [chart, setChart] = useState<Area>();
  const [currentDate, setCurrentDate] = useState('');

  const handleChartClick = () => {
    dispatch({
      field: 'listTimeLimit',
      value: {
        gte: dayjs(currentDate).startOf('day').valueOf(),
        lte: dayjs(currentDate).endOf('day').valueOf(),
      },
    });
  };

  const handleTooltipChange = (ev: any) => {
    setCurrentDate(ev.data.title);
  };

  useEffect(() => {
    if (!tweetTrendData || !divRef.current) return;

    const data = tweetTrendData[dataType].sort(
      (a, b) => new Date(a.key).valueOf() - new Date(b.key).valueOf(),
    );

    const chart = new Area(divRef.current, {
      data,
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
    setChart(chart);

    return () => {
      chart.destroy();
    };
  }, [tweetTrendData, dataType]);

  useEffect(() => {
    if (!chart) return;

    chart.on('plot:click', handleChartClick);
    chart.on('tooltip:change', handleTooltipChange);

    return () => {
      chart.off('plot:click', handleChartClick);
      chart.off('tooltip:change', handleTooltipChange);
    };
  }, [chart, currentDate]);

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
