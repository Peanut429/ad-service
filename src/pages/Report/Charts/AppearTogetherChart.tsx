import { useContext, useEffect, useRef, useState } from 'react';
import { Edge, Graph, Tooltip } from '@antv/g6';
import ReportContext from '../Report.context';
import bad from './bad.png';
import normal from './normal.png';
import smile from './smile.png';
import { Spin } from 'antd';

const SentimentEnum = {
  1: '负面',
  2: '中性',
  3: '正面',
};

const SentimentImgEnum = {
  3: smile,
  2: normal,
  1: bad,
};

function getNodeSize(value: number, max: number, min: number) {
  // max与min的差值分平均15档，返回value属于第几档
  const range = max - min;
  const step = range / 15;
  const index = Math.floor((value - min) / step);
  return index * 5 + 50;
}

const AppearTogetherChart = () => {
  const {
    state: { tweetAppearTogetherData },
    addListKeyword,
  } = useContext(ReportContext);
  const divRef = useRef<HTMLDivElement | null>(null);
  const [chart, setChart] = useState<Graph | null>(null);

  const handleMouseenter = (ev: any) => {
    const edge = ev.item! as Edge;
    chart!.setItemState(edge, 'highlight', true);
    chart!.setItemState(edge.getSource(), 'highlight', true);
    chart!.setItemState(edge.getTarget(), 'highlight', true);
  };

  const handleMouseleave = (ev: any) => {
    const edge = ev.item! as Edge;
    chart!.setItemState(edge, 'highlight', false);
    chart!.setItemState(edge.getSource(), 'highlight', false);
    chart!.setItemState(edge.getTarget(), 'highlight', false);
  };

  const handleNodeClick = (ev: any) => {
    const { id } = ev.item.getModel();
    addListKeyword([id]);
  };

  const handleEdgeClick = (ev: any) => {
    const { source, target } = ev.item.getModel();
    addListKeyword([source, target]);
  };

  useEffect(() => {
    if (!divRef.current || !tweetAppearTogetherData) return;

    const maxValue = Math.max(...tweetAppearTogetherData.nodes.map((item) => item.size));
    const minValue = Math.min(...tweetAppearTogetherData.nodes.map((item) => item.size));

    const tooltip = new Tooltip({
      offsetX: 10,
      offsetY: 10,
      fixToNode: [1, 0.5],
      itemTypes: ['node', 'edge'],
      getContent: (e) => {
        let content = '';
        const item = e?.item;
        const model = item?.getModel();
        // console.log(item?.getType(), item.getModel());
        if (item?.getType() === 'node') {
          content = `
            <div class="title">词频 - ${model?.id}</div>
            <div class="text">小红书: ${model?.size}</div>
            <!--<div class="text">微博: ${model?.weibo}</div>
            <div class="text">抖音: ${model?.tiktok}</div>-->
          `;
        } else {
          // console.log(model);
          // content = `
          //   <div class="title">${(item as Edge).getSource().getModel().label} - ${
          //   (item as Edge).getTarget().getModel().label
          // }</div>
          //   <div class="title--small">共现次数: ${model?.times}</div>
          //   <!--<div class="text">微博: ${(model?.times as any).weibo}</div>
          //   <div class="text">小红书: ${(model?.times as any).redbook}</div>
          //   <div class="text">抖音: ${(model?.times as any).tiktok}</div>-->
          // `;
          const sentimentInfo = (model?.sentiment as any).map(
            (el: { key: 1 | 2 | 3; value: number }) => {
              return `<div class="text">
              <img class="icon" src="${SentimentImgEnum[el.key]}" />
              ${SentimentEnum[el.key]}: ${el.value.toLocaleString('zh', { style: 'percent' })}
            </div>`;
            },
          );
          content =
            `
            <div class="title">${(item as Edge).getSource().getModel().label} - ${
              (item as Edge).getTarget().getModel().label
            }</div>
            <div class="title--small">共现次数: ${model?.times}</div>
            <div class="text">小红书: ${model?.times}</div>
            <!--<div class="text">微博: ${(model?.times as any).weibo}</div>
            <div class="text">抖音: ${(model?.times as any).tiktok}</div>-->
            <div class="title--small">共线词组对应的帖子情感</div>
          ` + sentimentInfo.join('');
        }
        const tooltipBox = `<div class="tooltip"> ${content} </div>`;
        return tooltipBox;
      },
    });

    const chart = new Graph({
      container: divRef.current,
      width: divRef.current.clientWidth,
      height: 500,
      plugins: [tooltip],
      layout: {
        type: 'force',
        preventOverlap: true,
        linkDistance: 200,
      },
      defaultNode: {
        color: '#5B8FF9',
        labelCfg: {
          position: 'center',
          style: { fill: '#000' },
        },
      },
      modes: {
        default: ['drag-canvas', 'drag-node', 'activate-relations'],
      },
    });

    chart.data({
      nodes: tweetAppearTogetherData.nodes.map((item) => ({
        ...item,
        label: item.id,
        size: getNodeSize(item.size, maxValue, minValue),
      })),
      edges: tweetAppearTogetherData.edges.map((item) => ({
        ...item,
        type: 'cubic',
        lineWidth: 2,
      })),
    });

    chart.render();
    setChart(chart);

    return () => {
      chart?.destroy();
    };
  }, [tweetAppearTogetherData]);

  useEffect(() => {
    if (!chart) return;
    chart.on('edge:mouseenter', handleMouseenter);
    chart.on('edge:mouseleave', handleMouseleave);
    chart.on('edge:click', handleEdgeClick);
    chart.on('node:click', handleNodeClick);

    return () => {
      chart.off('edge:mouseenter', handleMouseenter);
      chart.off('edge:mouseleave', handleMouseleave);
      chart.off('edge:click', handleEdgeClick);
      chart.off('node:click', handleNodeClick);
    };
  }, [chart, addListKeyword]);

  return (
    <div>
      <Spin size="large" spinning={!tweetAppearTogetherData}>
        <div ref={divRef} style={{ height: 500 }} />
      </Spin>
    </div>
  );
};

export default AppearTogetherChart;
