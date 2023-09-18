import { useContext, useEffect, useRef, useState } from 'react';
import { Treemap } from '@antv/g2plot';
import { Button, Dropdown, MenuProps, Space, Spin, Tag } from 'antd';
import { utils, writeFile } from 'xlsx';
import useSegmented from './useSegmented';
import ReportContext from '../Report.context';

// 关键词类别图
const WordClass = () => {
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
  const {
    state: { wordClassData, wordClassHiddenWord, wordClassDeleteWord, chartLoading },
    dispatch,
    addListKeyword,
  } = useContext(ReportContext);
  const divRef = useRef<HTMLDivElement | null>(null);
  const [chart, setChart] = useState<Treemap>();
  const [menuVisible, setMenuVisible] = useState(false);
  const [currentWord, setCurrentWord] = useState('');
  const [downloadLoading, setDownloadLoading] = useState(false);

  const handleContextmenu = (ev: any) => {
    const origin = ev.target.get('origin');
    if (origin.data.childNodeCount === 0) {
      setCurrentWord(origin.data.data.name);
      setMenuVisible(true);
    }
  };

  const handleCloseContextmenu = () => {
    setMenuVisible(false);
  };

  const handleMenuItemClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'add') {
      addListKeyword([currentWord], dataSource as 'tweet' | 'comment');
    }
    if (key === 'hide') {
      if (!wordClassHiddenWord.includes(currentWord)) {
        dispatch({ field: 'wordClassHiddenWord', value: [...wordClassHiddenWord, currentWord] });
      }
    } else if (key === 'delete') {
      if (!wordClassDeleteWord.includes(currentWord)) {
        dispatch({ field: 'wordClassDeleteWord', value: [...wordClassDeleteWord, currentWord] });
      }
    }
    setMenuVisible(false);
  };

  const downloadData = () => {
    if (!wordClassData) return;
    setDownloadLoading(true);
    const headers = {
      word: '关键词',
      type: '词类',
      frequency: '词频',
      heat: '热度',
    };
    const tweetData = wordClassData.tweet
      .map((item) => {
        return item.subWords.map((sub) => ({
          word: sub.word,
          type: item.mainWord,
          frequency: sub.frequency,
          heat: sub.heat,
        }));
      })
      .flat();
    const workbook = utils.book_new();
    const tweetWorksheet = utils.json_to_sheet([headers, ...tweetData], { skipHeader: true });
    utils.book_append_sheet(workbook, tweetWorksheet, '关键词类别-推文');

    const commentData = wordClassData.comment
      .map((item) => {
        return item.subWords.map((sub) => ({
          word: sub.word,
          type: item.mainWord,
          frequency: sub.frequency,
          heat: sub.heat,
        }));
      })
      .flat();
    const commentWorksheet = utils.json_to_sheet([headers, ...commentData], { skipHeader: true });
    utils.book_append_sheet(workbook, commentWorksheet, '关键词类别-评论');
    writeFile(workbook, '词类.xlsx');
    setDownloadLoading(false);
  };

  useEffect(() => {
    if (!wordClassData || !divRef.current) return;

    const chartData = wordClassData[dataSource as 'tweet' | 'comment'].map((item) => {
      return {
        name: item.mainWord,
        children: item.subWords.map((sub) => {
          return {
            name: sub.word,
            value: sub[dataType as 'frequency' | 'heat'],
          };
        }),
      };
    });

    const chart = new Treemap(divRef.current, {
      data: {
        name: 'root',
        children: chartData,
      },
      colorField: 'name',
      legend: { position: 'top-left' },
      height: 300,
      interactions: [{ type: 'treemap-drill-down' }],
      animation: {},
    });

    setChart(chart);

    chart.render();

    return () => chart.destroy();
  }, [wordClassData, dataSource, dataType]);

  useEffect(() => {
    if (!chart) return;

    chart.on('element:contextmenu', handleContextmenu);
    document.body.addEventListener('click', handleCloseContextmenu);

    return () => {
      chart.off('element:contextmenu', handleContextmenu);
      document.body.removeEventListener('click', handleCloseContextmenu);
    };
  }, [chart]);

  return (
    <>
      <div style={{ display: 'flex', marginBottom: 20 }}>
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
      <Spin spinning={chartLoading}>
        <Dropdown
          trigger={['contextMenu']}
          open={menuVisible}
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
      {wordClassHiddenWord.length > 0 && (
        <div>
          <span>隐藏的关键词：</span>
          {wordClassHiddenWord.map((item) => (
            <Tag
              key={item}
              closable
              onClose={() => {
                wordClassHiddenWord.splice(wordClassHiddenWord.indexOf(item), 1);
                dispatch({ field: 'wordClassHiddenWord', value: [...wordClassHiddenWord] });
              }}
            >
              {item}
            </Tag>
          ))}
        </div>
      )}
    </>
  );
};

export default WordClass;
