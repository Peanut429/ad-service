import dayjs from 'dayjs';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Dropdown, MenuProps, Space, Spin, Tag } from 'antd';
import { Heatmap } from '@antv/g2plot';
import ReportContext from '../Report.context';
import useSegmented from './useSegmented';

const HeatmapChart = () => {
  const divRef = useRef<HTMLDivElement | null>(null);
  const {
    state: {
      tweetWordTrendData,
      wordTrendHiddenWord,
      wordTrendDeleteWord,
      chartLoading,
      commentWordTrendData,
    },
    dispatch,
    addListKeyword,
  } = useContext(ReportContext);
  // const [dataType, setDataType] = useState<'frequency' | 'heat'>('frequency');
  const [chart, setChart] = useState<Heatmap>();
  const [menuVisible, setMenuVisible] = useState(false);
  const [currentWord, setCurrentWord] = useState('');

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

  const chartData = useMemo(() => {
    return dataSource === 'tweet' ? tweetWordTrendData : commentWordTrendData;
  }, [tweetWordTrendData, commentWordTrendData, dataSource]);

  const handleAxisClick = (ev: any) => {
    if (ev.gEvent.delegateObject.axis.cfg.position !== 'bottom') return;
    const dateStr = ev.target.attrs.text;
    dispatch({
      field: 'timeLimit',
      value: {
        gte: dayjs(dateStr).startOf('month').valueOf(),
        lte: dayjs(dateStr).endOf('month').valueOf(),
      },
    });
  };

  const handleContextmenu = (ev: any) => {
    if (ev.gEvent.delegateObject.axis.cfg.position !== 'left') return;
    const label = ev.target.attrs.text;
    setMenuVisible(true);
    setCurrentWord(label);
  };

  const handleCloseContextmenu = () => {
    setMenuVisible(false);
  };

  const handleContextmenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'add') {
      addListKeyword([currentWord]);
    }
    if (key === 'delete') {
      dispatch({ field: 'wordTrendHiddenWord', value: [...wordTrendDeleteWord, currentWord] });
    } else if (key === 'hide') {
      dispatch({
        field: 'wordTrendHiddenWord',
        value: [...wordTrendHiddenWord, currentWord],
      });
    }
  };

  useEffect(() => {
    if (!divRef.current || !chartData) return;

    const chart = new Heatmap(divRef.current, {
      data: chartData[dataType as 'frequency' | 'heat'],
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

    setChart(chart);

    chart.render();

    return () => chart?.destroy();
  }, [chartData, dataType, addListKeyword]);

  useEffect(() => {
    if (!chart) return;

    // chart.on('element:click', handleElementClick);
    chart.on('axis-label:click', handleAxisClick);
    chart.on('axis-label:contextmenu', handleContextmenu);
    document.addEventListener('click', handleCloseContextmenu);

    return () => {
      // chart.off('element:click', handleElementClick);
      chart.off('axis-label:click', handleAxisClick);
      chart.off('axis-label:contentmenu', handleContextmenu);
      document.removeEventListener('click', handleCloseContextmenu);
    };
  }, [chart, wordTrendDeleteWord, wordTrendHiddenWord]);

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <Space>
          <SourceSegmented />
          <DataTypeSegmented />
          {/* <Segmented
            value={dataType}
            options={[
              { label: '词频', value: 'frequency' },
              { label: '热度', value: 'heat' },
            ]}
            onChange={(value) => setDataType(value as 'frequency' | 'heat')}
          /> */}
        </Space>
      </div>
      <Spin size="large" spinning={chartLoading}>
        <Dropdown
          open={menuVisible}
          trigger={['contextMenu']}
          menu={{
            items: [
              { label: '添加关键词', key: 'add' },
              { label: '隐藏关键词', key: 'hide' },
              { label: '删除关键词', key: 'delete' },
            ],
            onClick: handleContextmenuClick,
          }}
        >
          <div ref={divRef} style={{ height: 400 }} />
        </Dropdown>
      </Spin>
      {wordTrendHiddenWord.length > 0 && (
        <div>
          <span>隐藏的关键词：</span>
          {wordTrendHiddenWord.map((item) => (
            <Tag
              key={item}
              closable
              onClose={() => {
                wordTrendHiddenWord.splice(wordTrendHiddenWord.indexOf(item), 1);
                dispatch({ field: 'wordTrendHiddenWord', value: [...wordTrendHiddenWord] });
              }}
            >
              {item}
            </Tag>
          ))}
        </div>
      )}
    </div>
  );
};

export default HeatmapChart;
