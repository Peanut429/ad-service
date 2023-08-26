import { useEffect, useState } from 'react';
import { Button, Space, Table, Tag, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import TaskCreator from './Create';
import { Link, useRequest, useSearchParams } from '@umijs/max';
import { keywordsInfo, stopTask, taskList } from '@/services/brands';
import dayjs from 'dayjs';

const Task = () => {
  const [searchParams] = useSearchParams();
  const [open, setOpen] = useState(false);
  const [keywords, setKeywords] = useState<Record<string, BrandsApi.KeywordInfo>>({});
  const { data, run } = useRequest(taskList, { manual: true });
  const { run: stopTaskApi } = useRequest(stopTask, {
    manual: true,
    onSuccess: () => message.success('操作成功'),
  });

  const columns: ColumnsType<BrandsApi.TaskInfo> = [
    { title: '项目名称', dataIndex: 'name', width: 300, ellipsis: true },
    {
      title: '关键词',
      dataIndex: 'word',
      render: (_, record) => {
        const words = new Set<string>();
        for (const item of record.wordTasksId) {
          const keyword = keywords[item];
          if (keyword) {
            words.add(keyword.word);
          }
        }
        return Array.from(words).map((item) => (
          <Tag color="#3b5999" key={item} style={{ fontSize: 14 }}>
            {item}
          </Tag>
        ));
      },
    },
    {
      title: '创建时间',
      width: 300,
      render: (_, record) => dayjs(record.createdAtTimestamp).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      width: 200,
      render: (_, record) => [
        <Button
          key="stop"
          danger
          type="text"
          onClick={() => stopTaskApi({ tasksId: [record.projectId], stop: true })}
        >
          停止任务
        </Button>,
        // <Link key="detail" to={`/report?ids=${record.wordTasksId.join(',')}`}>
        <Link key="detail" to={`/report?projectId=${record.projectId}`}>
          查看详情
        </Link>,
      ],
    },
  ];

  useEffect(() => {
    run({ brandId: searchParams.get('brandId')! });
  }, []);

  useEffect(() => {
    if (!data) return;
    keywordsInfo({ tasksId: data.map((item) => item.wordTasksId).flat() }).then((res) => {
      setKeywords(
        res.data.reduce((result, item) => {
          return {
            ...result,
            [item.taskId]: item,
          };
        }, {}),
      );
    });
  }, [data]);

  return (
    <>
      <Space direction="vertical" size="large">
        <Space>
          <Button type="primary" size="large" onClick={() => setOpen(true)}>
            创建项目
          </Button>
        </Space>

        <Table
          rowKey="projectId"
          dataSource={data || []}
          columns={columns}
          pagination={{ simple: true }}
        />
      </Space>

      <TaskCreator
        open={open}
        onCancel={() => setOpen(false)}
        onCreate={() => run({ brandId: searchParams.get('brandId')! })}
      />
    </>
  );
};

export default Task;
