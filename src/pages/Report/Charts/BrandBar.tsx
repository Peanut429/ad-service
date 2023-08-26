import React, { useContext, useEffect, useRef } from 'react';
import { Column } from '@antv/g2plot';
import ReportContext from '../Report.context';
import useSegmented from './useSegmented';
import { Space, Spin } from 'antd';

const BrandBarChart: React.FC = () => {
  const divRef = useRef<HTMLDivElement | null>(null);
  const {
    state: { brandBarData },
  } = useContext(ReportContext);
  const { source: dataSource, ComponentNode: SourceNode } = useSegmented(
    [
      { label: '推文', value: 'tweet' },
      { label: '评论', value: 'comment' },
    ],
    'tweet',
  );
  const { source: dataType, ComponentNode: DataTypeNode } = useSegmented(
    [
      { label: '词频', value: 'frequency' },
      { label: '热度', value: 'heat' },
    ],
    'frequency',
  );

  useEffect(() => {
    if (!divRef.current || !brandBarData) return;

    const chart = new Column(divRef.current, {
      data: brandBarData[dataSource as 'tweet' | 'comment'],
      height: 300,
      xField: 'word',
      yField: dataType,
      label: {
        position: 'top',
      },
      meta: {
        frequency: { alias: '词频' },
        heat: { alias: '热度' },
      },
      // legend: { position: 'bottom' },
    });

    chart.render();

    return () => chart.destroy();
  }, [brandBarData, dataSource, dataType]);

  return (
    <div>
      <Space style={{ marginBottom: 20 }}>
        <SourceNode key="dataSource" />
        <DataTypeNode key="dataType" />
      </Space>
      <Spin spinning={!brandBarData}>
        <div ref={divRef} style={{ height: 300 }} />
      </Spin>
    </div>
  );
};

export default BrandBarChart;
