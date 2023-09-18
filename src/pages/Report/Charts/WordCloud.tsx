import { useContext, useEffect, useRef, useState } from 'react';
import ReportContext from '../Report.context';
import { WordCloud } from '@antv/g2plot';
import { Button, Dropdown, Segmented, Space, Spin, Tag } from 'antd';
import { utils, writeFile } from 'xlsx';
import type { MenuProps } from 'antd/es/menu';

// 词云图
const WordCloudChart = () => {
  const divRef = useRef<HTMLDivElement | null>(null);
  const [dataSource, setDataSource] = useState<'tweet' | 'comment'>('tweet');
  const [dataType, setDataType] = useState<'frequency' | 'heat'>('frequency');
  const [currentWord, setCurrentWord] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuItems] = useState<MenuProps['items']>([
    { label: '添加关键词', key: 'add' },
    { label: '隐藏关键词', key: 'hide' },
    { label: '删除关键词', key: 'delete' },
  ]);
  const [chart, setChart] = useState<WordCloud>();
  const [downloadLoading, setDownloadLoading] = useState(false);

  const {
    state: { wordcloudData, wordCloudHiddenWord, wordCloudDeleteWord, chartLoading },
    dispatch,
    addListKeyword,
  } = useContext(ReportContext);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setMenuVisible(false);
    }
  };

  const handleMenuItemClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'add') {
      addListKeyword([currentWord], dataSource);
    } else if (key === 'hide') {
      if (!wordCloudHiddenWord.includes(currentWord)) {
        dispatch({ field: 'wordCloudHiddenWord', value: [...wordCloudHiddenWord, currentWord] });
      }
    } else if (key === 'delete') {
      dispatch({ field: 'wordCloudDeleteWord', value: [...wordCloudDeleteWord, currentWord] });
    }
    setMenuVisible(false);
  };

  const downloadData = () => {
    if (!wordcloudData) return;
    setDownloadLoading(true);
    const headers = {
      word: '关键词',
      frequency: '词频',
      heat: '热度',
    };
    const tweetData = wordcloudData.tweet.filter(
      (item) => !wordCloudHiddenWord.includes(item.word),
    );
    const workbook = utils.book_new();
    const tweetWorksheet = utils.json_to_sheet([headers, ...tweetData], { skipHeader: true });
    utils.book_append_sheet(workbook, tweetWorksheet, '关键词词云-推文');

    const commentData = wordcloudData.comment.filter(
      (item) => !wordCloudHiddenWord.includes(item.word),
    );
    const commentWorksheet = utils.json_to_sheet([headers, ...commentData], { skipHeader: true });
    utils.book_append_sheet(workbook, commentWorksheet, '关键词词云-评论');

    writeFile(workbook, '词云.xlsx');
    setDownloadLoading(false);
  };

  useEffect(() => {
    if (!divRef.current || !wordcloudData) return;

    const chart = new WordCloud(divRef.current, {
      data: wordcloudData[dataSource].filter((item) => !wordCloudHiddenWord.includes(item.word)),
      height: 300,
      wordField: 'word',
      weightField: dataType,
      colorField: 'word',
      random: 0.5,
      wordStyle: { fontFamily: 'Verdana', rotation: 0, fontSize: [18, 60] },
    });

    chart.render();

    setChart(chart);

    return () => chart.destroy();
  }, [wordcloudData, dataSource, dataType]);

  useEffect(() => {
    if (!chart) return;
    function handleContextmenu(ev: any) {
      const element = ev.target.get('element');

      if (element) {
        const data = element.getModel().data;
        setCurrentWord(data.text);
        setMenuVisible(true);
      }
    }
    chart.on('contextmenu', handleContextmenu);

    return () => {
      chart.off('contextmenu', handleContextmenu);
    };
  }, [chart, addListKeyword]);

  return (
    <div>
      <div style={{ display: 'flex', width: '100%' }}>
        <Space>
          <Segmented
            value={dataSource}
            options={[
              // { label: '全部', value: 'total' },
              { label: '推文', value: 'tweet' },
              { label: '评论', value: 'comment' },
            ]}
            onChange={(value) => setDataSource(value as 'tweet' | 'comment')}
          />
          <Segmented
            value={dataType}
            options={[
              { label: '词频', value: 'frequency' },
              { label: '热度', value: 'heat' },
            ]}
            onChange={(value) => setDataType(value as 'frequency' | 'heat')}
          />
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
          menu={{ items: menuItems, onClick: handleMenuItemClick }}
          trigger={['contextMenu']}
          onOpenChange={handleOpenChange}
        >
          <div ref={divRef} style={{ marginTop: 20, height: 300 }} />
        </Dropdown>
      </Spin>
      {wordCloudHiddenWord.length > 0 && (
        <div>
          <span>隐藏的关键词：</span>
          {wordCloudHiddenWord.map((item) => (
            <Tag
              key={item}
              closable
              onClose={() => {
                wordCloudHiddenWord.splice(wordCloudHiddenWord.indexOf(item), 1);
                dispatch({ field: 'wordCloudHiddenWord', value: [...wordCloudHiddenWord] });
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

export default WordCloudChart;
