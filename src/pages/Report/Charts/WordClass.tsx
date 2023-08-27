import { useContext, useEffect, useRef } from 'react';
import useSegmented from './useSegmented';
import ReportContext from '../Report.context';
import { Treemap } from '@antv/g2plot';
import { Space, Spin } from 'antd';

const WordClass = () => {
  const { source: dataSource, ComponentNode: SourceSegmented } = useSegmented(
    [
      { label: '推文', value: 'tweet' },
      { label: '评论', value: 'comment' },
    ],
    'tweet',
  );
  const { source: dataType, ComponentNode: DataTypeSegmented } = useSegmented(
    [
      { label: '词频', value: 'frequency' },
      { label: '热度', value: 'heat' },
    ],
    'frequency',
  );
  const {
    state: { wordClassData },
  } = useContext(ReportContext);
  const divRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!wordClassData || !divRef.current) return;

    const chartData = wordClassData[dataSource as 'tweet' | 'comment'].map((item) => {
      return {
        name: item.mainWord,
        children: item.subWords.map((sub) => {
          return {
            name: sub.word,
            value: sub[dataType as 'frequency' | 'heat'],
          };
        }),
      };
    });

    const chart = new Treemap(divRef.current, {
      data: {
        name: 'root',
        children: chartData,
      },
      colorField: 'name',
      legend: { position: 'top-left' },
      height: 300,
      interactions: [{ type: 'treemap-drill-down' }],
      animation: {},
    });

    chart.render();

    return () => chart.destroy();
  }, [wordClassData, dataSource, dataType]);

  return (
    <>
      <Space style={{ marginBottom: 20 }}>
        <SourceSegmented />
        <DataTypeSegmented />
      </Space>
      <Spin spinning={!wordClassData}>
        <div ref={divRef} style={{ height: 300 }} />
      </Spin>
    </>
  );
};

export default WordClass;
