import React, { useEffect, useState } from 'react';
import { Button, Select, Space, Table } from 'antd';
import { keywordsInfo } from '@/services/brands';
import { useRequest } from '@umijs/max';
import { ColumnsType } from 'antd/es/table';

type SearchInputProps = {
  placeholder?: string;
  style?: React.CSSProperties;
  value?: string;
  onChange?: (value: BrandsApi.KeywordInfo[]) => void;
};

const SearchInput: React.FC<SearchInputProps> = (props) => {
  // const inputRef = useRef<InputRef>(null);
  const [data, setData] = useState<BrandsApi.KeywordInfo[]>([]);
  const [selectedValue, setSelectedValue] = useState<string>();
  const [value, setValue] = useState<BrandsApi.KeywordInfo[]>([]);
  // const [visible, setVisible] = useState(false);
  // const [editValue, setEditValue] = useState<BrandsApi.KeywordInfo>();

  const columns: ColumnsType<any> = [
    { title: '关键词', dataIndex: 'word', width: 150, ellipsis: true },
    { title: '分词', dataIndex: 'pattern', render: (_, record) => record.pattern?.join(', ') },
    {
      title: '操作',
      width: 200,
      align: 'center',
      render: (_, record) => [
        // <Button
        //   type="text"
        //   key="edit"
        //   size="small"
        //   onClick={() => {
        //     setVisible(true);
        //     setEditValue(record);
        //   }}
        // >
        //   拆分设置
        // </Button>,
        <Button
          type="text"
          danger
          size="small"
          key="delete"
          onClick={() => {
            setValue((prev) => prev.filter((item) => item.taskId !== record.taskId));
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
      setValue((prev) => [...prev, target]);
      setSelectedValue(undefined);
    }
  };

  // const handleSplitWord = () => {
  //   if (!inputRef.current?.input?.value) return;
  //   const value = inputRef.current?.input?.value?.trim();
  //   if (value) {
  //     setKeywords((prev) => {
  //       const target = prev.find((item) => item.taskId === editValue?.taskId);
  //       if (target) {
  //         target.pattern = value.split(/,|，/g);
  //       }
  //       return [...prev];
  //     });
  //   }
  //   setVisible(false);
  // };

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
        />

        <Table size="small" columns={columns} dataSource={value} rowKey="taskId" />
      </Space>

      {/* <Modal
        centered
        destroyOnClose
        open={visible}
        title="拆分设置"
        onCancel={() => setVisible(false)}
        // onOk={handleSplitWord}
      >
        <Input
          ref={inputRef}
          defaultValue={editValue?.word}
          placeholder="多个词之间用逗号分割，逗号不区分全半角"
        />
      </Modal> */}
    </>
  );
};

export default SearchInput;
