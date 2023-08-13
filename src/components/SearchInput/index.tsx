import React, { useEffect, useRef, useState } from 'react';
import { Button, Input, InputRef, Modal, Select, Space, Table } from 'antd';
import { keywordsInfo } from '@/services/brands';
import { useRequest } from '@umijs/max';
import { ColumnsType } from 'antd/es/table';

type SearchInputProps = {
  placeholder?: string;
  style?: React.CSSProperties;
  value?: string;
  onChange?: (value: WordInfo[]) => void;
};

type WordInfo = {
  taskId?: string;
  word: string;
  pattern: string[][];
  platforms: string[];
};

const SearchInput: React.FC<SearchInputProps> = (props) => {
  const inputRef = useRef<InputRef>(null);
  const [data, setData] = useState<BrandsApi.KeywordInfo[]>([]);
  const [selectedValue, setSelectedValue] = useState<string>();
  const [value, setValue] = useState<WordInfo[]>([]);
  const [visible, setVisible] = useState(false);
  const [editValue, setEditValue] = useState<WordInfo>();

  const columns: ColumnsType<WordInfo> = [
    { title: '关键词', dataIndex: 'word', width: 150, ellipsis: true },
    { title: '分词', dataIndex: 'pattern', render: (_, record) => record.pattern?.join(', ') },
    {
      title: '操作',
      width: 200,
      align: 'center',
      render: (_, record) => [
        <Button
          type="text"
          key="edit"
          size="small"
          disabled={!!record.taskId}
          onClick={() => {
            setVisible(true);
            setEditValue(record);
          }}
        >
          拆分设置
        </Button>,
        <Button
          type="text"
          danger
          size="small"
          key="delete"
          onClick={() => {
            setValue((prev) => prev.filter((item) => item.word !== record.word));
          }}
        >
          删除
        </Button>,
      ],
    },
  ];

  const { run, cancel } = useRequest(keywordsInfo, {
    manual: true,
    onSuccess: (res) => {
      setData(res);
    },
  });

  const handleSearch = (newValue: string) => {
    if (!newValue) return;
    cancel();
    run({ word: newValue });
  };

  const handleChange = (newValue: string) => {
    setSelectedValue(newValue);
    const target = data.find((item) => item.taskId === newValue);
    if (target) {
      const existWord = value.find((item) => item.word === target.word);
      if (existWord) return;
      setValue((prev) => [
        ...prev,
        {
          taskId: target.taskId,
          word: target.word,
          pattern: [],
          platforms: ['redbook'],
        },
      ]);
      setSelectedValue(undefined);
    }
  };

  const handleSplitWord = () => {
    if (!inputRef.current?.input?.value) return;
    const value = inputRef.current?.input?.value?.trim();
    if (value) {
      setValue((prev) => {
        const target = prev.find((item) => item.word === editValue?.word);
        if (target) {
          const groupRegExp = /\(.*?\)/g;
          const groups = value.match(groupRegExp);
          let groupsData: string[][] = [];
          if (groups) {
            groupsData = groups.map((item) =>
              item
                .replace(/\(|\)/g, '')
                .split(',')
                .map((s) => s.trim()),
            );
          }
          const restText = value.replace(groupRegExp, '');
          target.pattern = [
            restText
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean),
            ...groupsData,
          ];
        }
        return [...prev];
      });
    }
    setVisible(false);
  };

  useEffect(() => {
    props.onChange?.(value);
  }, [value]);

  return (
    <>
      <Space direction="vertical" size="large">
        <Select
          showSearch
          value={selectedValue}
          placeholder={props.placeholder}
          style={props.style}
          defaultActiveFirstOption={false}
          suffixIcon={null}
          filterOption={false}
          onSearch={handleSearch}
          onChange={handleChange}
          notFoundContent={null}
          options={(data || []).map((d) => ({
            value: d.taskId,
            label: d.word,
          }))}
          onInputKeyDown={(e) => {
            if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
              const word = e.currentTarget.value;
              setValue((prev) => [
                ...prev,
                {
                  word,
                  pattern: [],
                  platforms: ['redbook'],
                },
              ]);
            }
          }}
        />

        <Table size="small" columns={columns} dataSource={value} rowKey="word" />
      </Space>

      <Modal
        centered
        destroyOnClose
        open={visible}
        title="拆分设置"
        onCancel={() => setVisible(false)}
        onOk={handleSplitWord}
      >
        <Input
          ref={inputRef}
          defaultValue={editValue?.word}
          placeholder="一组词用()包裹，多个词/组之间用英文逗号分割"
        />
      </Modal>
    </>
  );
};

export default SearchInput;