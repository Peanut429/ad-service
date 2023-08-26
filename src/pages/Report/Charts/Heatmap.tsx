import { useContext, useEffect, useRef, useState } from 'react';
import ReportContext from '../Report.context';
import { Heatmap } from '@antv/g2plot';
import { Segmented, Spin } from 'antd';
import dayjs from 'dayjs';

const HeatmapChart = () => {
  const divRef = useRef<HTMLDivElement | null>(null);
  const {
    state: { tweetWordTrendData },
    dispatch,
    addListKeyword,
  } = useContext(ReportContext);
  const [dataType, setDataType] = useState<'frequency' | 'heat'>('frequency');

  useEffect(() => {
    if (!divRef.current || !tweetWordTrendData) return;

    const chart = new Heatmap(divRef.current, {
      data: tweetWordTrendData[dataType],
      height: 400,
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

    chart.on('element:click', (ev: any) => {
      const element = ev.target.get('element');
      if (element) {
        const data = element.getModel().data;
        console.log(data);
        addListKeyword([data.word as string]);
        dispatch({
          field: 'listTimeLimit',
          value: {
            gte: dayjs(data.date).startOf('month').valueOf(),
            lte: dayjs(data.date).endOf('month').valueOf(),
          },
        });
      }
    });

    chart.render();

    return () => chart?.destroy();
  }, [tweetWordTrendData, dataType, addListKeyword]);

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
      <Spin size="large" spinning={!tweetWordTrendData}>
        {/* <Dropdown menu={{ items: [] }}> */}
        <div ref={divRef} style={{ height: 400 }} />
        {/* </Dropdown> */}
      </Spin>
    </div>
  );
};

export default HeatmapChart;
