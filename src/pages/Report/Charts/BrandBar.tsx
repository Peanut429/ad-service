import React, { useContext, useEffect, useRef, useState } from 'react';
import { Column } from '@antv/g2plot';
import ReportContext from '../Report.context';
import useSegmented from './useSegmented';
import { Button, Dropdown, MenuProps, Space, Spin, Tag } from 'antd';
import { utils, writeFile } from 'xlsx';

const BrandBarChart: React.FC = () => {
  const divRef = useRef<HTMLDivElement | null>(null);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const {
    state: { brandBarData, brandBarHiddenWord, brandBarDeleteWord, chartLoading },
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

  const handleMenuItemClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'add') {
      addListKeyword([currentWord], dataSource as 'tweet' | 'comment');
    } else if (key === 'hide') {
      if (!brandBarHiddenWord.includes(currentWord)) {
        dispatch({ field: 'brandBarHiddenWord', value: [...brandBarHiddenWord, currentWord] });
      }
    } else if (key === 'delete') {
      if (!brandBarDeleteWord.includes(currentWord)) {
        dispatch({ field: 'brandBarDeleteWord', value: [...brandBarDeleteWord, currentWord] });
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
    if (!brandBarData) return;
    setDownloadLoading(true);
    const headers = {
      word: '关键词',
      frequency: '词频',
      heat: '热度',
    };
    const tweetData = brandBarData.tweet;
    const workbook = utils.book_new();
    const tweetWorksheet = utils.json_to_sheet([headers, ...tweetData], { skipHeader: true });
    utils.book_append_sheet(workbook, tweetWorksheet, '品牌词-推文');
    const commentData = brandBarData.comment;
    const commentWorksheet = utils.json_to_sheet([headers, ...commentData], { skipHeader: true });
    utils.book_append_sheet(workbook, commentWorksheet, '品牌词-评论');
    writeFile(workbook, '品牌词.xlsx');
    setDownloadLoading(false);
  };

  useEffect(() => {
    if (!divRef.current || !brandBarData) return;

    const chart = new Column(divRef.current, {
      data: brandBarData[dataSource as 'tweet' | 'comment'],
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
  }, [brandBarData, dataSource, dataType]);

  useEffect(() => {
    if (!chart) return;

    chart.on('axis-label:contextmenu', handleContextmenu);
    document.addEventListener('click', handleCloseContextmenu);

    return () => {
      chart.off('axis-label:contextmenu', handleContextmenu);
      document.removeEventListener('click', handleCloseContextmenu);
    };
  }, [chart, brandBarHiddenWord, brandBarDeleteWord]);

  return (
    <div>
      <div style={{ display: 'flex', marginBottom: 20 }}>
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
      {brandBarHiddenWord.length > 0 && (
        <div>
          <span>隐藏的关键词：</span>
          {brandBarHiddenWord.map((item) => (
            <Tag
              key={item}
              closable
              onClose={() => {
                brandBarHiddenWord.splice(brandBarHiddenWord.indexOf(item), 1);
                dispatch({ field: 'brandBarHiddenWord', value: [...brandBarHiddenWord] });
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

export default BrandBarChart;
