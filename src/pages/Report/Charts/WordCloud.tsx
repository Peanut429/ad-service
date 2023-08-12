import { useContext, useEffect, useRef, useState } from 'react';
import ReportContext from '../Report.context';
import { WordCloud } from '@antv/g2plot';
import { Dropdown, Segmented, Space, Spin, Tag } from 'antd';
import type { MenuProps } from 'antd/es/menu';

const WordCloudChart = () => {
  const divRef = useRef<HTMLDivElement | null>(null);
  const [dataSource, setDataSource] = useState<'tweet' | 'comment'>('tweet');
  const [dataType, setDataType] = useState<'frequency' | 'heat'>('frequency');
  const [currentWord, setCurrentWord] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const [hiddenWords, setHiddenWords] = useState<string[]>([]);
  const [menuItems] = useState<MenuProps['items']>([
    { label: '添加关键词', key: 'add' },
    { label: '隐藏关键词', key: 'hide' },
    { label: '删除关键词', key: 'delete' },
  ]);

  const {
    state: { wordcloudData, includeWords, excludeWords },
    dispatch,
  } = useContext(ReportContext);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setMenuVisible(false);
    }
  };

  const handleMenuItemClick: MenuProps['onClick'] = ({ key }) => {
    const existWord = includeWords.findIndex((item) => {
      return item.length === 1 && item[0] === currentWord;
    });
    if (key === 'add') {
      if (existWord === -1) {
        dispatch({ field: 'includeWords', value: [...includeWords, [currentWord]] });
      }
    } else if (key === 'hide') {
      if (!hiddenWords.includes(currentWord)) {
        setHiddenWords([...hiddenWords, currentWord]);
      }
    } else if (key === 'delete') {
      if (existWord > -1) {
        includeWords.splice(existWord, 1);
        dispatch({ field: 'includeWords', value: [...includeWords] });
      }
      if (!excludeWords.includes(currentWord)) {
        dispatch({ field: 'excludeWords', value: [...excludeWords, currentWord] });
      }
    }
    setMenuVisible(false);
  };

  useEffect(() => {
    if (!divRef.current || !wordcloudData) return;

    const chart = new WordCloud(divRef.current, {
      data: wordcloudData[dataSource][dataType].filter((item) => !hiddenWords.includes(item.word)),
      height: 400,
      wordField: 'word',
      weightField: dataType,
      colorField: 'word',
      random: 0.5,
      wordStyle: { fontFamily: 'Verdana', rotation: 0, fontSize: [18, 60] },
    });

    chart.render();

    chart.on('contextmenu', (ev: any) => {
      const element = ev.target.get('element');

      if (element) {
        const data = element.getModel().data;
        setCurrentWord(data.text);
        setMenuVisible(true);
      }
    });

    return () => chart.destroy();
  }, [wordcloudData, dataSource, dataType, hiddenWords]);

  return (
    <div>
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

      <Spin size="large" spinning={!wordcloudData}>
        <Dropdown
          open={menuVisible}
          menu={{ items: menuItems, onClick: handleMenuItemClick }}
          trigger={['contextMenu']}
          onOpenChange={handleOpenChange}
        >
          <div ref={divRef} style={{ marginTop: 20, height: 400 }} />
        </Dropdown>
      </Spin>
      {hiddenWords.length > 0 && (
        <div>
          隐藏的关键词：
          {hiddenWords.map((item) => (
            <Tag
              key={item}
              closable
              onClose={() => setHiddenWords(hiddenWords.filter((i) => i !== item))}
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
