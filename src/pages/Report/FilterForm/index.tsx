import dayjs from 'dayjs';
import { useContext, useState } from 'react';
import { Button, DatePicker, Drawer, Form, Input, Modal, Select, Space, Tag } from 'antd';
import { CheckOutlined, CloseOutlined, SettingOutlined } from '@ant-design/icons';
import SearchInput, { WordInfo } from '@/components/SearchInput';
import ReportContext from '../Report.context';
import styles from './index.module.scss';

const FilterForm = () => {
  const [open, setOpen] = useState(false);
  const [includeWordsOpen, setIncludeWordsOpen] = useState(false);
  const [selectedWords, setSelectedWords] = useState<WordInfo[]>([]);
  const [showExcludeWordsInput, setShowExcludeWordsInput] = useState(false);
  const [excludeWordValue, setExcludeWordValue] = useState('');

  const {
    state: { includeWords, excludeWords, timeLimit, sentiment, platforms },
    dispatch,
  } = useContext(ReportContext);

  const handleUpdateIncludeWords = () => {
    dispatch({
      field: 'includeWords',
      value: [...includeWords, selectedWords.map((item) => item.word)],
    });
  };

  const handleRemoveIncludeWords = (index: number) => {
    includeWords.splice(index, 1);
    dispatch({ field: 'includeWords', value: [...includeWords] });
  };

  const handleUpdateExcludeWords = () => {
    dispatch({ field: 'excludeWords', value: [...excludeWords, excludeWordValue] });
    setShowExcludeWordsInput(false);
  };

  const handleRemoveExcludeWords = (index: number) => {
    excludeWords.splice(index, 1);
    dispatch({ field: 'excludeWords', value: [...excludeWords] });
  };

  return (
    <>
      <div className={styles.trigger} onClick={() => setOpen(true)}>
        <SettingOutlined style={{ fontSize: 20, color: '#fff' }} />
      </div>
      <Drawer title="设置" placement="right" open={open} onClose={() => setOpen(false)}>
        <Form layout="vertical">
          <Form.Item label="组合关键词">
            {includeWords.map((item, index) => (
              <Tag
                key={index}
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
              options={[{ label: '小红书', value: 'redbook' }]}
              onChange={(value) => {
                dispatch({ field: 'platforms', value });
                dispatch({ field: 'listPlatforms', value });
              }}
            />
          </Form.Item>
          {/* <Form.Item label="账号类型"></Form.Item> */}
          <Form.Item label="推文情感">
            <Select
              value={sentiment}
              mode="tags"
              options={[
                { label: '未知', value: 0 },
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
          {/* <Form.Item label="帖子类型"></Form.Item> */}
        </Form>
      </Drawer>

      <Modal
        title="组合关键词"
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
