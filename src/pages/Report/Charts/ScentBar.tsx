// 香味数据柱状图
import React, { useContext, useEffect, useRef } from 'react';
import { Column } from '@antv/g2plot';
import ReportContext from '../Report.context';
import useSegmented from './useSegmented';
import { Dropdown, Space, Spin } from 'antd';

const ScentBarChart: React.FC = () => {
  const divRef = useRef<HTMLDivElement | null>(null);
  const {
    state: { wordClassData, chartLoading },
    // dispatch,
    // addListKeyword,
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
  // const [chart, setChart] = useState<Column>();
  // const [currentWord, setCurrentWord] = useState('');
  // const [menuVisible, setMenuVisible] = useState(false);

  // const handleMenuItemClick: MenuProps['onClick'] = ({ key }) => {
  //   if (key === 'add') {
  //     addListKeyword([currentWord]);
  //   } else if (key === 'hide') {
  //     if (!brandBarHiddenWord.includes(currentWord)) {
  //       dispatch({ field: 'brandBarHiddenWord', value: [...brandBarHiddenWord, currentWord] });
  //     }
  //   } else if (key === 'delete') {
  //     if (!brandBarDeleteWord.includes(currentWord)) {
  //       dispatch({ field: 'brandBarDeleteWord', value: [...brandBarDeleteWord, currentWord] });
  //     }
  //   }
  // };

  // const handleCloseContextmenu = () => {
  //   setMenuVisible(false);
  // };

  // const handleContextmenu = (ev: any) => {
  //   const delegateObject = ev.target.get('delegateObject');
  //   console.log(delegateObject.axis.cfg.position);
  //   if (delegateObject.axis.cfg.position !== 'bottom') return;
  //   const item = delegateObject.item;
  //   setCurrentWord(item.name);
  //   setMenuVisible(true);
  // };

  useEffect(() => {
    if (!divRef.current || !wordClassData) return;

    const chartData = wordClassData[dataSource as 'tweet' | 'comment'].find(
      (item) => item.mainWord === '香味',
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
      // legend: { position: 'bottom' },
    });

    // setChart(chart);

    chart.render();

    return () => chart.destroy();
  }, [wordClassData, dataSource, dataType]);

  // useEffect(() => {
  //   if (!chart) return;

  //   chart.on('axis-label:contextmenu', handleContextmenu);
  //   document.addEventListener('click', handleCloseContextmenu);

  //   return () => {
  //     chart.off('axis-label:contextmenu', handleContextmenu);
  //     document.removeEventListener('click', handleCloseContextmenu);
  //   };
  // }, [chart, brandBarHiddenWord, brandBarDeleteWord]);

  return (
    <div>
      <Space style={{ marginBottom: 20 }}>
        <SourceNode key="dataSource" />
        <DataTypeNode key="dataType" />
      </Space>
      <Spin spinning={chartLoading}>
        <Dropdown
          trigger={['contextMenu']}
          menu={{
            items: [
              { label: '添加关键词', key: 'add' },
              { label: '隐藏关键词', key: 'hide' },
              { label: '删除关键词', key: 'delete' },
            ],
            // onClick: handleMenuItemClick,
          }}
        >
          <div ref={divRef} style={{ height: 300 }} />
        </Dropdown>
      </Spin>
      {/* {brandBarHiddenWord.length > 0 && (
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
      )} */}
    </div>
  );
};

export default ScentBarChart;
