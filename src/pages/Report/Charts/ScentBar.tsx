// 香味数据柱状图
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Column } from '@antv/g2plot';
import ReportContext from '../Report.context';
import useSegmented from './useSegmented';
import { Button, Dropdown, MenuProps, Space, Spin, Tag } from 'antd';
import { utils, writeFile } from 'xlsx';

const ScentBarChart: React.FC = () => {
  const divRef = useRef<HTMLDivElement | null>(null);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const {
    state: {
      projectId,
      wordClassData,
      chartLoading,
      specificChartHiddenWord,
      specificChartDeleteWord,
    },
    dispatch,
    addListKeyword,
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
  const [chart, setChart] = useState<Column>();
  const [currentWord, setCurrentWord] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);

  const keyword = useMemo(() => {
    return projectId === 'project-149015156' ? '风味' : '香味';
  }, [projectId]);

  const handleMenuItemClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'add') {
      addListKeyword([currentWord], dataSource as 'tweet' | 'comment');
    } else if (key === 'hide') {
      if (!specificChartHiddenWord.includes(currentWord)) {
        dispatch({
          field: 'specificChartHiddenWord',
          value: [...specificChartHiddenWord, currentWord],
        });
      }
    } else if (key === 'delete') {
      if (!specificChartDeleteWord.includes(currentWord)) {
        dispatch({
          field: 'specificChartDeleteWord',
          value: [...specificChartDeleteWord, currentWord],
        });
      }
    }
  };

  const handleCloseContextmenu = () => {
    setMenuVisible(false);
  };

  const handleContextmenu = (ev: any) => {
    const delegateObject = ev.target.get('delegateObject');

    if (delegateObject.axis.cfg.position !== 'bottom') return;
    const item = delegateObject.item;
    setCurrentWord(item.name);
    setMenuVisible(true);
  };

  const downloadData = () => {
    if (!wordClassData) return;
    const tweetChartData = wordClassData.tweet.find((item) => item.mainWord === keyword);
    const commentChartData = wordClassData.comment.find((item) => item.mainWord === keyword);
    if (!tweetChartData || !commentChartData) return;
    setDownloadLoading(true);
    const headers = {
      word: '关键词',
      frequency: '词频',
      heat: '热度',
    };
    const tweetData = tweetChartData.subWords;
    const workbook = utils.book_new();
    const tweetWorksheet = utils.json_to_sheet([headers, ...tweetData], { skipHeader: true });
    utils.book_append_sheet(workbook, tweetWorksheet, keyword + '-推文');
    const commentData = commentChartData.subWords;
    const commentWorksheet = utils.json_to_sheet([headers, ...commentData], { skipHeader: true });
    utils.book_append_sheet(workbook, commentWorksheet, keyword + '-评论');
    writeFile(workbook, keyword + '.xlsx');
    setDownloadLoading(false);
  };

  useEffect(() => {
    if (!divRef.current || !wordClassData) return;

    const chartData = wordClassData[dataSource as 'tweet' | 'comment'].find(
      (item) => item.mainWord === keyword,
    );
    if (!chartData) return;

    const chart = new Column(divRef.current, {
      data: chartData.subWords
        .sort((a, b) => b[dataType as 'frequency' | 'heat'] - a[dataType as 'frequency' | 'heat'])
        .slice(0, 15),
      height: 300,
      xField: 'word',
      yField: dataType,
      xAxis: {
        label: {
          rotate: 0.4,
          offset: 10,
        },
      },
      label: {
        position: 'top',
      },
      meta: {
        frequency: { alias: '词频' },
        heat: { alias: '热度' },
      },
    });

    setChart(chart);

    chart.render();

    return () => chart.destroy();
  }, [wordClassData, dataSource, dataType]);

  useEffect(() => {
    if (!chart) return;

    chart.on('axis-label:contextmenu', handleContextmenu);
    document.addEventListener('click', handleCloseContextmenu);

    return () => {
      chart.off('axis-label:contextmenu', handleContextmenu);
      document.removeEventListener('click', handleCloseContextmenu);
    };
  }, [chart, specificChartHiddenWord, specificChartDeleteWord]);

  return (
    <div>
      <div style={{ marginBottom: 20, display: 'flex' }}>
        <Space>
          <SourceNode key="dataSource" />
          <DataTypeNode key="dataType" />
        </Space>
        <div style={{ marginLeft: 'auto' }}>
          <Button loading={downloadLoading} onClick={downloadData}>
            数据下载
          </Button>
        </div>
      </div>
      <Spin spinning={chartLoading}>
        <Dropdown
          open={menuVisible}
          trigger={['contextMenu']}
          menu={{
            items: [
              { label: '添加关键词', key: 'add' },
              { label: '隐藏关键词', key: 'hide' },
              { label: '删除关键词', key: 'delete' },
            ],
            onClick: handleMenuItemClick,
          }}
        >
          <div ref={divRef} style={{ height: 300 }} />
        </Dropdown>
      </Spin>
      {specificChartHiddenWord.length > 0 && (
        <div>
          <span>隐藏的关键词：</span>
          {specificChartHiddenWord.map((item) => (
            <Tag
              key={item}
              closable
              onClose={() => {
                specificChartHiddenWord.splice(specificChartHiddenWord.indexOf(item), 1);
                dispatch({ field: 'specificChartHiddenWord', value: [...specificChartHiddenWord] });
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

export default ScentBarChart;
