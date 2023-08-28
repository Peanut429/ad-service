import { useContext, useEffect, useRef } from 'react';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import type { EChartsOption } from 'echarts/types/dist/shared';
import { MapChart } from 'echarts/charts';
import {
  GeoComponent,
  LegendComponent,
  TooltipComponent,
  VisualMapComponent,
} from 'echarts/components';
import ReportContext from '../Report.context';
import mapJsonData from './100000_full.json';
import { Spin } from 'antd';

echarts.use([
  GeoComponent,
  LegendComponent,
  TooltipComponent,
  VisualMapComponent,
  MapChart,
  CanvasRenderer,
]);

type UserAreaChartProps = {
  dataSource: 'tweet' | 'comment';
};

const locationMap = {
  内蒙古: '内蒙古自治区',
  新疆: '新疆维吾尔自治区',
  西藏: '西藏自治区',
  广西: '广西壮族自治区',
  宁夏: '宁夏回族自治区',
  北京: '北京市',
  重庆: '重庆市',
  上海: '上海市',
  天津: '天津市',
};

const UserAreaChart: React.FC<UserAreaChartProps> = ({ dataSource }) => {
  const mapDivRef = useRef<HTMLDivElement | null>(null);
  const {
    state: { userPortraitData, chartLoading },
  } = useContext(ReportContext);

  useEffect(() => {
    if (!mapDivRef.current || !userPortraitData) return;

    const mapChart = echarts.init(mapDivRef.current);
    // fetch('https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json')
    //   .then((res) => res.json())
    //   .then((res) => {
    //   });
    echarts.registerMap('china', mapJsonData as any);

    const chartData = Object.entries(
      userPortraitData[dataSource].region.data.reduce((total, item) => {
        if (total[item.key]) {
          total[item.key] = {
            value: total[item.key].value + item.value,
            // detail: { ...total[item.key].detail, [item.platform]: item.value },
            detail: { ...total[item.key].detail, redbook: item.value },
          };
        } else {
          total[item.key] = {
            value: item.value,
            // detail: { [item.platform]: item.value },
            detail: { redbook: item.value },
          };
        }
        return total;
      }, {} as Record<string, { detail: Record<string, number>; value: number }>),
    ).map(([key, value]) => ({ ...value, key }));

    const min = Math.min(
      ...chartData
        .filter((item) => !['其他', '海外', 'null', '未知'].includes(item.key))
        .map((item) => item.value),
    );
    const max = Math.max(
      ...chartData
        .filter((item) => !['其他', '海外', 'null', '未知'].includes(item.key))
        .map((item) => item.value),
    );

    const option: EChartsOption = {
      tooltip: { trigger: 'item' },
      visualMap: {
        min: min === Infinity ? 0 : min,
        max: max === -Infinity ? 1 : max,
        text: ['High', 'Low'],
        realtime: false,
        calculable: true,
        inRange: {
          color: ['lightskyblue', 'yellow', 'orangered'],
        },
      },
      series: [
        {
          type: 'map',
          roam: true,
          zoom: 1.2,
          map: 'china',
          data: chartData.map(({ key, value }) => ({
            name: locationMap[key as keyof typeof locationMap] || key + '省',
            value,
          })),
        },
      ],
    };

    mapChart!.setOption(option);

    return () => mapChart.dispose();
  }, [userPortraitData, dataSource]);

  return (
    <Spin spinning={chartLoading}>
      <div ref={mapDivRef} style={{ height: 400 }} />
    </Spin>
  );
};

export default UserAreaChart;
