import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { Access, Link, useAccess, useRequest, useSearchParams } from '@umijs/max';
import { Button, Popconfirm, Space, Table, Tag, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import TaskCreator from './Create';
import { keywordsInfo, stopTask, taskList } from '@/services/brands';

const Task = () => {
  const [searchParams] = useSearchParams();
  const [open, setOpen] = useState(false);
  const [keywords, setKeywords] = useState<Record<string, BrandsApi.KeywordInfo>>({});
  const { data, run } = useRequest(taskList, { manual: true });
  const { canEdit } = useAccess();
  const { run: stopTaskApi } = useRequest(stopTask, {
    manual: true,
    onSuccess: () => message.success('操作成功'),
  });

  const columns: ColumnsType<BrandsApi.TaskInfo> = [
    { title: '项目名称', dataIndex: 'name', width: 200, ellipsis: true, fixed: 'left' },
    {
      title: '关键词',
      dataIndex: 'word',
      width: 400,
      render: (_, record) => {
        const words = new Set<string>();
        for (const item of record.wordTasksId) {
          const keyword = keywords[item];
          if (keyword) {
            words.add(keyword.word);
          }
        }
        return Array.from(words).map((item) => (
          <Tag color="#3b5999" key={item} style={{ fontSize: 14, marginBlockEnd: 4 }}>
            {item}
          </Tag>
        ));
      },
    },
    {
      title: '创建时间',
      width: 180,
      render: (_, record) => dayjs(record.createdAtTimestamp).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '项目周期',
      width: 220,
      render: (_, record) => {
        const { gte: startTime, lte: endTime } = record.dataRetrieverTime;
        return `${dayjs(startTime).format('YYYY-MM-DD')} - ${dayjs(endTime).format('YYYY-MM-DD')}`;
      },
    },
    {
      title: '操作',
      width: 200,
      fixed: 'right',
      render: (_, record) => [
        // <Link key="detail" to={`/report?ids=${record.wordTasksId.join(',')}`}>
        <Link key="detail" to={`/report?projectId=${record.projectId}`}>
          查看详情
        </Link>,
        <Access accessible={canEdit} key="stop">
          <Popconfirm
            placement="top"
            title="确认停止任务?"
            onConfirm={() => stopTaskApi({ tasksId: record.wordTasksId, stop: true })}
          >
            <Button
              danger
              type="text"
              // onClick={() => stopTaskApi({ tasksId: record.wordTasksId, stop: true })}
            >
              停止任务
            </Button>
          </Popconfirm>
        </Access>,
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
          <Access accessible={canEdit}>
            <Button type="primary" size="large" onClick={() => setOpen(true)}>
              创建项目
            </Button>
          </Access>
        </Space>

        <Table
          rowKey="projectId"
          dataSource={data || []}
          scroll={{ x: 1200 }}
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
