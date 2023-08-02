import { useContext, useEffect, useRef, useState } from 'react';
import ReportContext from '../Report.context';
import { Heatmap } from '@antv/g2plot';
import { Segmented } from 'antd';

const HeatmapChart = () => {
  const divRef = useRef<HTMLDivElement | null>(null);
  const {
    state: { tweetWordTrendData },
  } = useContext(ReportContext);
  const [dataType, setDataType] = useState<'frequency' | 'heat'>('frequency');

  useEffect(() => {
    if (!divRef.current || !tweetWordTrendData) return;

    const chart = new Heatmap(divRef.current, {
      data: tweetWordTrendData[dataType],
      height: 300,
      xField: 'date',
      yField: 'word',
      colorField: 'colorValue',
      color: [
        '#BBE4F6',
        '#A8D9F7',
        '#83C7F8',
        '#6EBCFA',
        '#4AABFC',
        '#41A5FD',
        '#2A9AFE',
        '#1890FF',
      ],
      meta: {
        key: { type: 'cat' },
        value: { alias: dataType === 'frequency' ? '词频' : '热度' },
      },
      tooltip: {
        customContent: (title, data) => {
          if (!title) return '';
          const target = data[0];
          return `<div style="padding: 5px;line-height: 2">
              <div>${target.data.date}</div>
              <div><span style="display: inline-block;width: 40px;">${target.data.word}</span> ${target.data.value}</div>
              <!--<div><span style="display: inline-block;width: 40px;">微博</span> ${target.data.weibo}</div>
              <div><span style="display: inline-block;width: 40px;">小红书</span> ${target.data.redbook}</div>
              <div><span style="display: inline-block;width: 40px;">抖音</span> ${target.data.tiktok}</div>-->
            </div>`;
        },
      },
    });

    chart.render();

    return () => chart?.destroy();
  }, [tweetWordTrendData, dataType]);

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <Segmented
          value={dataType}
          options={[
            { label: '词频', value: 'frequency' },
            { label: '热度', value: 'heat' },
          ]}
          onChange={(value) => setDataType(value as 'frequency' | 'heat')}
        />
      </div>
      <div ref={divRef} />
    </div>
  );
};

export default HeatmapChart;
