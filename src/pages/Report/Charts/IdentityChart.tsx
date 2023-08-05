import { useContext, useEffect, useMemo, useRef } from 'react';
import { SunburstChart } from 'echarts/charts';
import { TooltipComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import type { EChartsOption } from 'echarts/types/dist/shared';
import ReportContext from '../Report.context';

type IdentityChartProps = {
  dataSource: 'tweet' | 'comment';
};

echarts.use([SunburstChart, CanvasRenderer, TooltipComponent]);

const IdentityChart: React.FC<IdentityChartProps> = ({ dataSource }) => {
  const divRef = useRef<HTMLDivElement | null>(null);
  const {
    state: { userPortraitData },
  } = useContext(ReportContext);

  const chartData = useMemo(() => {
    const data = [
      {
        name: '普通用户',
        value: 0,
        children: [
          { name: '微博', value: 0 },
          { name: '小红书', value: 0 },
          { name: '抖音', value: 0 },
        ],
      },
      {
        name: 'KOC',
        value: 0,
        children: [
          { name: '微博', value: 0 },
          { name: '小红书', value: 0 },
          { name: '抖音', value: 0 },
        ],
      },
      {
        name: '明星',
        value: 0,
        children: [
          { name: '微博', value: 0 },
          { name: '小红书', value: 0 },
          { name: '抖音', value: 0 },
        ],
      },
      {
        name: '企业账号',
        value: 0,
        children: [
          { name: '微博', value: 0 },
          { name: '小红书', value: 0 },
          { name: '抖音', value: 0 },
        ],
      },
      {
        name: '媒体账号',
        value: 0,
        children: [
          { name: '微博', value: 0 },
          { name: '小红书', value: 0 },
          { name: '抖音', value: 0 },
        ],
      },
      {
        name: 'KOL',
        value: 0,
        children: [
          { name: '微博', value: 0 },
          { name: '小红书', value: 0 },
          { name: '抖音', value: 0 },
        ],
      },
    ];
    if (userPortraitData) {
      const typeData = userPortraitData[dataSource].type.data || [];

      typeData.forEach((item) => {
        let index: number = 0;
        let subIndex: number = 0;
        if (item.key === 'normal') {
          index = 0;
        } else if (item.key === 'koc') {
          index = 1;
        } else if (item.key === 'star') {
          index = 2;
        } else if (item.key === 'enterprise') {
          index = 3;
        } else if (item.key === 'media') {
          index = 4;
        } else if (item.key === 'kol') {
          index = 5;
        }
        subIndex = 1;
        // if (item.platform === 'redbook') {
        //   subIndex = 1;
        // } else if (item.platform === 'tiktok') {
        //   subIndex = 2;
        // }
        data[index].value += item.value;
        data[index].children![subIndex].value += item.value;
      });
    }
    return data;
  }, [userPortraitData, dataSource]);

  useEffect(() => {
    if (!divRef.current || !userPortraitData) return;

    const chart = echarts.init(divRef.current);
    const options: EChartsOption = {
      tooltip: {},
      series: [
        {
          type: 'sunburst',
          data: chartData,
          radius: [30, '90%'],
          label: {
            rotate: 'radial',
            fontSize: 10,
          },
        },
      ],
    };
    chart.setOption(options);

    return () => chart.dispose();
  }, [chartData]);

  return <div ref={divRef} style={{ height: 300 }} />;
};

export default IdentityChart;
