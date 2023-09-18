import dayjs from 'dayjs';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Button, Dropdown, MenuProps, Space, Spin, Tag } from 'antd';
import { Heatmap } from '@antv/g2plot';
import ReportContext from '../Report.context';
import useSegmented from './useSegmented';
import { utils, writeFile } from 'xlsx';

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
  const [downloadLoading, setDownloadLoading] = useState(false);

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
      addListKeyword([currentWord], dataSource as 'tweet' | 'comment');
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

  const downloadData = () => {
    if (!tweetWordTrendData || !commentWordTrendData) return;
    setDownloadLoading(true);
    const frequencyHeaders = {
      word: '关键词',
      value: '词频',
      date: '日期',
    };
    const heatHeaders = {
      word: '关键词',
      value: '热度',
      date: '日期',
    };
    const tweetFrequencyData = tweetWordTrendData.frequency
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((item) => ({ word: item.word, value: item.value, date: item.date }));
    const tweetHeatData = tweetWordTrendData.heat
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((item) => ({ word: item.word, value: item.value, date: item.date }));
    const workbook = utils.book_new();
    const tweetFrequencyWorksheet = utils.json_to_sheet([frequencyHeaders, ...tweetFrequencyData], {
      skipHeader: true,
    });
    const tweetHeatWorksheet = utils.json_to_sheet([heatHeaders, ...tweetHeatData], {
      skipHeader: true,
    });
    utils.book_append_sheet(workbook, tweetFrequencyWorksheet, '热力图-推文-词频');
    utils.book_append_sheet(workbook, tweetHeatWorksheet, '热力图-推文-热度');
    const commentFrequencyData = commentWordTrendData.frequency
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((item) => ({ word: item.word, value: item.value, date: item.date }));
    const commentHeatData = commentWordTrendData.heat
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((item) => ({ word: item.word, value: item.value, date: item.date }));
    const commentFrequencyWorksheet = utils.json_to_sheet(
      [frequencyHeaders, ...commentFrequencyData],
      {
        skipHeader: true,
      },
    );
    const commentHeatWorksheet = utils.json_to_sheet([heatHeaders, ...commentHeatData], {
      skipHeader: true,
    });
    utils.book_append_sheet(workbook, commentFrequencyWorksheet, '热力图-评论-词频');
    utils.book_append_sheet(workbook, commentHeatWorksheet, '热力图-评论-热度');
    writeFile(workbook, '热力图.xlsx');
    setDownloadLoading(false);
  };

  useEffect(() => {
    if (!divRef.current || !chartData) return;

    const renderData = chartData[dataType as 'frequency' | 'heat'].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    const chart = new Heatmap(divRef.current, {
      data: renderData,
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
      <div style={{ marginBottom: 20, display: 'flex' }}>
        <Space>
          <SourceSegmented />
          <DataTypeSegmented />
        </Space>
        <div style={{ marginLeft: 'auto' }}>
          <Button loading={downloadLoading} onClick={downloadData}>
            数据下载
          </Button>
        </div>
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
