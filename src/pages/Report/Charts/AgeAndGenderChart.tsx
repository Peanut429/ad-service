import { useContext, useEffect, useRef } from 'react';
import { SankeyChart } from 'echarts/charts';
import { TooltipComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import type { EChartsOption } from 'echarts/types/dist/shared';
import ReportContext from '../Report.context';

echarts.use([TooltipComponent, SankeyChart, CanvasRenderer]);

const platformLabel = {
  weibo: '微博',
  redbook: '小红书',
  tiktok: '抖音',
};

type AgeAndGenderChartProps = {
  dataSource: 'tweet' | 'comment';
};

const AgeAndGenderChart: React.FC<AgeAndGenderChartProps> = ({ dataSource }) => {
  const divRef = useRef<HTMLDivElement | null>(null);

  const {
    state: { userPortraitData },
  } = useContext(ReportContext);

  // const ageData = useMemo(() => {}, [userPortraitData])

  useEffect(() => {
    if (!divRef.current || !userPortraitData) return;

    const ageData = userPortraitData[dataSource].age.data || [];
    const genderData = userPortraitData[dataSource].gender.data || [];

    const nodes = [...new Set([...ageData, ...genderData].map((item) => item.key))];
    // const platforms = [
    //   ...new Set([...(data?.age.data || []), ...(data?.gender.data || [])].map((item) => item.platform)),
    // ];
    const chart = echarts.init(divRef.current);
    const options: EChartsOption = {
      tooltip: {
        trigger: 'item',
        triggerOn: 'mousemove',
      },
      series: {
        type: 'sankey',
        lineStyle: { color: 'source' },
        data: [
          ...nodes.map((item) => ({ name: item })),
          { name: '小红书' },
          // ...platforms.map((item) => ({ name: platformLabel[item] })),
        ],
        links: [
          ...genderData.map((item) => ({
            source: '小红书',
            target: item.key === '其它' ? '未知' : item.key,
            value: item.value,
          })),
          ...ageData.map((item) => ({
            source: item.key,
            target: '小红书',
            value: item.value,
          })),
        ].filter((item) => item.value),
        label: { position: 'right', width: 100 },
      },
    };

    chart.setOption(options);

    return () => chart.dispose();
  }, [userPortraitData, dataSource]);

  return <div ref={divRef} style={{ height: 300 }} />;
};

export default AgeAndGenderChart;
