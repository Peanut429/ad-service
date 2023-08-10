import { useContext, useEffect, useRef, useState } from 'react';
import ReportContext from '../Report.context';
import { WordCloud } from '@antv/g2plot';
import { Segmented, Space, Spin } from 'antd';
// import { WordCloud } from '@antv/g2plot'

const WordCloudChart = () => {
  const divRef = useRef<HTMLDivElement | null>(null);
  const [dataSource, setDataSource] = useState<'tweet' | 'comment'>('tweet');
  const [dataType, setDataType] = useState<'frequency' | 'heat'>('frequency');

  const {
    state: { wordcloudData },
  } = useContext(ReportContext);

  useEffect(() => {
    if (!divRef.current || !wordcloudData) return;

    const chart = new WordCloud(divRef.current, {
      data: wordcloudData[dataSource][dataType],
      height: 400,
      wordField: 'word',
      weightField: dataType,
      colorField: 'word',
      random: 0.5,
      wordStyle: { fontFamily: 'Verdana', rotation: 0, fontSize: [18, 60] },
    });

    chart.render();

    return () => chart.destroy();
  }, [wordcloudData, dataSource, dataType]);

  return (
    <div>
      <Space>
        <Segmented
          value={dataSource}
          options={[
            // { label: '全部', value: 'total' },
            { label: '推文', value: 'tweet' },
            { label: '评论', value: 'comment' },
          ]}
          onChange={(value) => setDataSource(value as 'tweet' | 'comment')}
        />
        <Segmented
          value={dataType}
          options={[
            { label: '词频', value: 'frequency' },
            { label: '热度', value: 'heat' },
          ]}
          onChange={(value) => setDataType(value as 'frequency' | 'heat')}
        />
      </Space>

      <Spin size="large" spinning={!wordcloudData}>
        <div ref={divRef} style={{ marginTop: 20, height: 400 }} />
      </Spin>
    </div>
  );
};

export default WordCloudChart;
