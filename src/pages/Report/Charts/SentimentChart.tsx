import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Dropdown, Space } from 'antd';
import { SankeyChart } from 'echarts/charts';
import { TooltipComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import type { EChartsOption } from 'echarts/types/dist/shared';
import useSegmented from './useSegmented';
import ReportContext from '../Report.context';

echarts.use([SankeyChart, CanvasRenderer, TooltipComponent]);

enum Sentiment {
  '未知',
  '负面',
  '中性',
  '正面',
}

enum Platform {
  '微博' = 'weibo',
  '小红书' = 'redbook',
  'weibo' = '微博',
  'redbook' = '小红书',
}

const SentimentChart: React.FC = () => {
  const {
    state: { tweetSentimentData, commentSentimentData },
    dispatch,
  } = useContext(ReportContext);
  const divRef = useRef<HTMLDivElement | null>(null);
  const [chart, setChart] = useState<echarts.ECharts>();

  const { source: dataSource, ComponentNode: SourceSegmented } = useSegmented(
    [
      { label: '推文', value: 'tweet' },
      { label: '评论', value: 'comment' },
    ],
    'tweet',
  );

  const chartData = useMemo(() => {
    if (!tweetSentimentData) return [];

    return dataSource === 'tweet' ? tweetSentimentData : commentSentimentData;
  }, [dataSource]);

  const handleChartClick = (e: any) => {
    console.log('click');
    if (e.dataType === 'edge') {
      const [platformName, sentiment] = e.name.split(' > ');
      dispatch({ field: 'listPlatforms', value: [platformName as 'redbook' | 'tiktok'] });
      dispatch({
        field: 'listSentiment',
        value: [Sentiment[sentiment as '负面' | '中性' | '正面' | '未知']],
      });
    } else {
      // const sentiment = e.dataType === 'node' ? e.name : '';
      // setSubCondition((prev) => ({
      //   ...prev,
      //   tweet_sentiment: chartType === 'tweet' ? [Sentiment[sentiment].toString()] : undefined,
      //   comment_sentiment: chartType === 'comment' ? Sentiment[sentiment].toString() : undefined,
      // }));
    }
  };

  useEffect(() => {
    if (!divRef.current) return;

    const links = [
      // {
      //   source: '微博',
      //   target: '正面',
      //   value:
      //     chartData.find((item) => item.key === 3 && item.platform === 'weibo')?.value || 0,
      // },
      // {
      //   source: '微博',
      //   target: '中性',
      //   value:
      //     chartData.find((item) => item.key === '"0"' && item.platform === 'weibo')?.value || 0,
      // },
      // {
      //   source: '微博',
      //   target: '负面',
      //   value:
      //     chartData.find((item) => item.key === '"-1"' && item.platform === 'weibo')?.value || 0,
      // },
      {
        source: '小红书',
        target: '正面',
        value: chartData.find((item) => item.key === 3)?.value || 0,
      },
      {
        source: '小红书',
        target: '中性',
        value: chartData.find((item) => item.key === 2)?.value || 0,
      },
      {
        source: '小红书',
        target: '负面',
        value: chartData.find((item) => item.key === 1)?.value || 0,
      },
      {
        source: '小红书',
        target: '未知',
        value: chartData.find((item) => item.key === 0)?.value || 0,
      },
      // {
      //   source: '抖音',
      //   target: '正面',
      //   value:
      //     chartData.find((item) => item.key === '"1"' && item.platform === 'tiktok')?.value || 0,
      // },
      // {
      //   source: '抖音',
      //   target: '中性',
      //   value:
      //     chartData.find((item) => item.key === '"0"' && item.platform === 'tiktok')?.value || 0,
      // },
      // {
      //   source: '抖音',
      //   target: '负面',
      //   value:
      //     chartData.find((item) => item.key === '"-1"' && item.platform === 'tiktok')?.value || 0,
      // },
    ].filter((item) => item.value);

    const platformNodes: Set<string> = new Set();
    const sentimentNodes: Set<string> = new Set();
    links.forEach((item) => {
      platformNodes.add(item.source);
      sentimentNodes.add(item.target);
    });

    const chart = echarts.init(divRef.current);
    const options: EChartsOption = {
      tooltip: {
        trigger: 'item',
        triggerOn: 'mousemove',
      },
      series: {
        type: 'sankey',
        top: '10%',
        bottom: '5%',
        lineStyle: { color: 'source' },
        data: [
          ...[...platformNodes].map((item) => ({ name: item })),
          ...[...sentimentNodes].map((item) => ({ name: item })),
        ],
        links,
        orient: 'vertical',
        label: { position: 'top' },
        draggable: false,
      },
    };
    chart.setOption(options);

    setChart(chart);

    return () => chart.dispose();
  }, [chartData]);

  // useEffect(() => {
  //   if (!chart) return;

  //   chart.on('click', 'series.sankey', handleChartClick);

  //   // chart.on('contextmenu', (e) => {
  //   //   if (e.dataType === 'node' && sentimentNodes.has(e.name)) {
  //   //     setContextmenuSentiment(e.name);
  //   //   } else {
  //   //     e.event?.stop();
  //   //   }
  //   // });
  //   // chart.getZr().on('contextmenu', (e) => {
  //   //   if (!e.target) {
  //   //     e.event.stopPropagation();
  //   //   }
  //   // });
  //   return () => {
  //     chart.off('click', handleChartClick);
  //   };
  // }, [chart]);

  return (
    <>
      <Space>
        <SourceSegmented />
      </Space>
      {/* <div style={{ lineHeight: '50px' }}>
        {chartType === 'tweet' ? '帖子' : '评论'}总数: {total}
      </div> */}
      <Dropdown trigger={['contextMenu']} menu={{ items: [] }}>
        <div ref={divRef} style={{ height: 330, paddingTop: 20 }} />
      </Dropdown>
    </>
  );
};

export default SentimentChart;
