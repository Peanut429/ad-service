import dayjs from 'dayjs';
import { useContext, useState } from 'react';
import { Button, DatePicker, Drawer, Form, Input, Modal, Select, Space, Tag, message } from 'antd';
import {
  CheckOutlined,
  CloseOutlined,
  DoubleRightOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import SearchInput, { WordInfo } from '@/components/SearchInput';
import ReportContext from '../Report.context';
import styles from './index.module.scss';
import { Access, useAccess, useRequest } from '@umijs/max';
import { industryList, updateTaskInfo } from '@/services/brands';
import { wordClassList } from '@/services/report';

const FilterForm = () => {
  const [open, setOpen] = useState(false);
  const [includeWordsOpen, setIncludeWordsOpen] = useState(false);
  const [selectedWords, setSelectedWords] = useState<WordInfo[]>([]);
  const [showExcludeWordsInput, setShowExcludeWordsInput] = useState(false);
  const [excludeWordValue, setExcludeWordValue] = useState('');
  const [showWordMapInput, setShowWordMapInput] = useState(false);
  const [originWord, setOriginWord] = useState('');
  const [targetWord, setTargetWord] = useState('');

  const {
    state: {
      category,
      projectId,
      tasksId,
      includeWords,
      excludeWords,
      timeLimit,
      sentiment,
      platforms,
      gender,
      wordCloudDeleteWord,
      brandBarDeleteWord,
      wordTrendDeleteWord,
      appearTogetherDeleteWord,
      wordClassDeleteWord,
      categoryBarDeleteWord,
      specificChartDeleteWord,
      wordMap,
      listIncludeWords,
      wordClassType,
      excludeNotes,
    },
    dispatch,
  } = useContext(ReportContext);
  const access = useAccess();

  const { run: updateApi } = useRequest(updateTaskInfo, {
    manual: true,
    onSuccess: () => {
      message.success('保存成功');
    },
  });

  const { data: industryListData } = useRequest(industryList);

  const { data: wordClass } = useRequest(wordClassList);

  const handleUpdateIncludeWords = () => {
    dispatch({
      field: 'includeWords',
      value: [...includeWords, selectedWords.map((item) => item.word)],
    });
    setIncludeWordsOpen(false);
  };

  const handleRemoveIncludeWords = (index: number) => {
    includeWords.splice(index, 1);
    dispatch({ field: 'includeWords', value: [...includeWords].filter((item) => item.length) });
  };

  const handleUpdateExcludeWords = () => {
    const isInIncludeWords = [...includeWords.flat(), ...listIncludeWords.flat()].includes(
      excludeWordValue,
    );
    if (isInIncludeWords) {
      message.error('该词已存在于组合关键词或筛选关键词中');
      return;
    }
    dispatch({ field: 'excludeWords', value: [...excludeWords, excludeWordValue] });
    setShowExcludeWordsInput(false);
  };

  const handleRemoveExcludeWords = (index: number) => {
    excludeWords.splice(index, 1);
    dispatch({ field: 'excludeWords', value: [...excludeWords] });
  };

  const handleAddWordMap = () => {
    if (!originWord.trim || !targetWord.trim()) return;
    dispatch({ field: 'wordMap', value: { ...wordMap, [originWord.trim()]: targetWord.trim() } });
    setOriginWord('');
    setTargetWord('');
    setShowWordMapInput(false);
  };

  const handleRemoveWordMap = (key: string) => {
    dispatch({
      field: 'wordMap',
      value: {
        ...Object.keys(wordMap)
          .filter((item) => item !== key)
          .reduce((pre, cur) => ({ ...pre, [cur]: wordMap[cur] }), {}),
      },
    });
  };

  return (
    <>
      <div className={styles.trigger} onClick={() => setOpen(true)}>
        <SettingOutlined style={{ fontSize: 20, color: '#fff' }} />
      </div>
      <Drawer title="设置" placement="right" open={open} width={500} onClose={() => setOpen(false)}>
        <Form layout="vertical">
          <Form.Item label="组合关键词">
            {includeWords.map((item, index) => (
              <Tag
                key={item.join(' + ')}
                closable
                onClose={() => handleRemoveIncludeWords(index)}
                style={{ fontSize: 14 }}
              >
                {item.join(' + ')}
              </Tag>
            ))}
            <Button size="small" onClick={() => setIncludeWordsOpen(true)}>
              添加
            </Button>
          </Form.Item>
          <Form.Item label="排除关键词">
            {excludeWords.map((item, index) => (
              <Tag
                key={index}
                closable
                style={{ fontSize: 14 }}
                onClose={() => handleRemoveExcludeWords(index)}
              >
                {item}
              </Tag>
            ))}
            {showExcludeWordsInput ? (
              <Space.Compact>
                <Input
                  value={excludeWordValue}
                  onChange={(e) => setExcludeWordValue(e.target.value)}
                />
                <Button
                  icon={<CloseOutlined />}
                  onClick={() => {
                    setExcludeWordValue('');
                    setShowExcludeWordsInput(false);
                  }}
                ></Button>
                <Button
                  type="primary"
                  icon={<CheckOutlined />}
                  onClick={handleUpdateExcludeWords}
                ></Button>
              </Space.Compact>
            ) : (
              <Button size="small" onClick={() => setShowExcludeWordsInput(true)}>
                添加
              </Button>
            )}
          </Form.Item>
          <Form.Item label="关键词映射">
            {Object.entries(wordMap).map(([key, value]) => (
              <Tag key={key} closable onClose={() => handleRemoveWordMap(key)}>
                {key} → {value}
              </Tag>
            ))}
            {showWordMapInput ? (
              <Space>
                <Space>
                  <Input
                    value={originWord}
                    placeholder="原词"
                    onChange={(e) => setOriginWord(e.target.value)}
                  />
                  <DoubleRightOutlined />
                  <Input
                    value={targetWord}
                    placeholder="目标词"
                    onChange={(e) => setTargetWord(e.target.value)}
                  />
                </Space>
                <Button>取消</Button>
                <Button type="primary" onClick={handleAddWordMap}>
                  确定
                </Button>
              </Space>
            ) : (
              <Button size="small" onClick={() => setShowWordMapInput(true)}>
                添加
              </Button>
            )}
          </Form.Item>
          <Form.Item label="时间范围">
            <DatePicker.RangePicker
              allowClear={false}
              value={[dayjs(timeLimit.gte), dayjs(timeLimit.lte)]}
              onChange={(value) => {
                const range = {
                  gte: value![0]!.startOf('day').valueOf(),
                  lte: value![1]!.endOf('day').valueOf(),
                };
                dispatch({ field: 'timeLimit', value: range });
                dispatch({ field: 'listTimeLimit', value: range });
              }}
            />
          </Form.Item>
          <Form.Item label="所属平台">
            <Select
              allowClear={false}
              value={platforms}
              mode="tags"
              options={[
                { label: '微博', value: 'weibo' },
                { label: '小红书', value: 'redbook' },
                { label: '抖音', value: 'tiktok' },
              ]}
              onChange={(value) => {
                dispatch({ field: 'platforms', value });
                dispatch({ field: 'listPlatforms', value });
              }}
            />
          </Form.Item>
          <Form.Item label="推文情感">
            <Select
              value={sentiment}
              mode="multiple"
              options={[
                { label: '负面', value: 1 },
                { label: '中性', value: 2 },
                { label: '正面', value: 3 },
              ]}
              onChange={(value) => {
                dispatch({ field: 'sentiment', value });
                dispatch({ field: 'listSentiment', value });
              }}
            />
          </Form.Item>
          <Form.Item label="行业">
            <Select
              value={category}
              mode="multiple"
              options={(industryListData || []).map((item) => ({
                label: item.classification,
                value: item.classification,
              }))}
              placeholder="选择行业"
              onChange={(value) => {
                dispatch({ field: 'category', value });
              }}
            />
          </Form.Item>
          <Form.Item label="词类">
            <Select
              allowClear
              mode="multiple"
              value={wordClassType}
              options={wordClass?.map((item) => ({ label: item, value: item }))}
              placeholder="选择词类"
              onChange={(value) => {
                dispatch({ field: 'wordClassType', value });
              }}
            />
          </Form.Item>
          <Form.Item label="性别">
            <Select
              mode="multiple"
              options={[
                { label: '男', value: '男' },
                { label: '女', value: '女' },
                { label: '未知', value: '未知' },
              ]}
              value={gender}
              onChange={(value) => {
                dispatch({ field: 'gender', value });
              }}
            />
          </Form.Item>
          <Access accessible={access.canEdit}>
            <Form.Item>
              <Space>
                <Button
                  type="primary"
                  onClick={() =>
                    updateApi({
                      projectId,
                      wordTasksId: tasksId,
                      condition: JSON.stringify({
                        includeWords,
                        excludeWords,
                        timeLimit,
                        platforms,
                        sentiment,
                        category,
                        gender,
                        wordCloudDeleteWord,
                        wordClassDeleteWord,
                        wordTrendDeleteWord,
                        appearTogetherDeleteWord,
                        brandBarDeleteWord,
                        categoryBarDeleteWord,
                        specificChartDeleteWord,
                        wordMap,
                        wordClassType,
                        excludeNotes: [...excludeNotes],
                      }),
                    })
                  }
                >
                  保存当前条件
                </Button>
                <Button
                  onClick={() => {
                    dispatch({ field: 'includeWords', value: [] });
                    dispatch({ field: 'excludeWords', value: [] });
                    dispatch({ field: 'sentiment', value: [] });
                    dispatch({ field: 'platforms', value: ['redbook', 'tiktok'] });
                    dispatch({ field: 'category', value: [] });
                    dispatch({ field: 'wordCloudHiddenWord', value: [] });
                    dispatch({ field: 'wordClassHiddenWord', value: [] });
                    dispatch({ field: 'wordTrendHiddenWord', value: [] });
                    dispatch({ field: 'appearTogetherHiddenWord', value: [] });
                    dispatch({ field: 'brandBarHiddenWord', value: [] });
                    dispatch({ field: 'categoryBarHiddenWord', value: [] });
                    dispatch({ field: 'specificChartHiddenWord', value: [] });
                    dispatch({ field: 'wordClassType', value: [] });
                    dispatch({ field: 'gender', value: [] });
                  }}
                >
                  重置
                </Button>
              </Space>
            </Form.Item>
          </Access>
        </Form>
      </Drawer>

      <Modal
        title="组合关键词"
        width={500}
        destroyOnClose
        open={includeWordsOpen}
        onCancel={() => setIncludeWordsOpen(false)}
        onOk={handleUpdateIncludeWords}
      >
        <SearchInput
          style={{ width: '100%' }}
          onChange={(data) => {
            setSelectedWords(data);
          }}
        />
      </Modal>
    </>
  );
};

export default FilterForm;
