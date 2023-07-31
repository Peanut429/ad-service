import { WordCloud } from '@antv/g2plot';
import { useEffect, useRef } from 'react';

const WordcloudChart: React.FC<{
  data: any;
  dataType: string;
}> = ({ data, dataType }) => {
  const divRef = useRef(null);
  useEffect(() => {
    if (!divRef.current) return;
    const chart = new WordCloud(divRef.current, {
      data: data || [],
      height: 300,
      wordField: 'word',
      colorField: 'word',
      weightField: dataType,
      wordStyle: { fontFamily: 'Verdana', rotation: 0, fontSize: [12, 60] },
      random: 0.5,
    });

    chart.render();

    return () => chart.destroy();
  }, [data, dataType]);

  return <div ref={divRef} />;
};

export default WordcloudChart;
