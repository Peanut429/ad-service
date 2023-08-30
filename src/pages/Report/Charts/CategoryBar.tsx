import React, { useContext, useEffect, useRef, useState } from 'react';
import { Column } from '@antv/g2plot';
import ReportContext from '../Report.context';
import useSegmented from './useSegmented';
import { Dropdown, MenuProps, Space, Spin, Tag } from 'antd';

const CategoryChart: React.FC = () => {
  const divRef = useRef<HTMLDivElement | null>(null);
  const {
    state: {
      categoryBarData,
      chartLoading,
      categoryBarHiddenWord: cateogryBarHiddenWord,
      cateogryBarDeleteWord,
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

  const handleMenuItemClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'add') {
      addListKeyword([currentWord]);
    } else if (key === 'hide') {
      if (!cateogryBarHiddenWord.includes(currentWord)) {
        dispatch({
          field: 'categoryBarDeleteWord',
          value: [...cateogryBarHiddenWord, currentWord],
        });
      }
    } else if (key === 'delete') {
      if (!cateogryBarDeleteWord.includes(currentWord)) {
        dispatch({
          field: 'categoryBarDeleteWord',
          value: [...cateogryBarDeleteWord, currentWord],
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

  useEffect(() => {
    if (!divRef.current || !categoryBarData) return;

    const chart = new Column(divRef.current, {
      data: categoryBarData[dataSource as 'tweet' | 'comment'],
      height: 300,
      xField: 'word',
      yField: dataType,
      label: {
        position: 'top',
      },
      meta: {
        frequency: { alias: '词频' },
        heat: { alias: '热度' },
      },
      // legend: { position: 'bottom' },
    });

    setChart(chart);

    chart.render();

    return () => chart.destroy();
  }, [categoryBarData, dataSource, dataType]);

  useEffect(() => {
    if (!chart) return;

    chart.on('axis-label:contextmenu', handleContextmenu);
    document.addEventListener('click', handleCloseContextmenu);

    return () => {
      chart.off('axis-label:contextmenu', handleContextmenu);
      document.removeEventListener('click', handleCloseContextmenu);
    };
  }, [chart, cateogryBarHiddenWord, cateogryBarDeleteWord]);

  return (
    <div>
      <Space style={{ marginBottom: 20 }}>
        <SourceNode key="dataSource" />
        <DataTypeNode key="dataType" />
      </Space>
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
      {cateogryBarHiddenWord.length > 0 && (
        <div>
          <span>隐藏的关键词：</span>
          {cateogryBarHiddenWord.map((item) => (
            <Tag
              key={item}
              closable
              onClose={() => {
                cateogryBarHiddenWord.splice(cateogryBarHiddenWord.indexOf(item), 1);
                dispatch({ field: 'cateogryBarHiddenWord', value: [...cateogryBarHiddenWord] });
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

export default CategoryChart;
