import { Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useContext, useState } from 'react';
import ReportContext from './Report.context';

const TopicAnalysis = () => {
  // const [tableData, setTableData] = useState<ReportApi.TopicData[]>([])
  const columns: ColumnsType<ReportApi.TopicData> = [
    {
      dataIndex: 'name',
      title: '话题名称',
    },
    // {
    //   dataIndex: 'name',
    //   title: '相关贴数',
    // },
    {
      dataIndex: 'heat',
      title: '热度',
    },
    // {
    //   dataIndex: 'name',
    //   title: '讨论数',
    // },
    // {
    //   dataIndex: 'name',
    //   title: '阅读量',
    // },
    // {
    //   dataIndex: 'name',
    //   title: '原创人数',
    // },
    {
      dataIndex: 'name',
      title: '平台',
      render: (_, record) => (
        <a
          href={`https://www.xiaohongshu.com/page/topics/${record.id}`}
          target="_blank"
          rel="noreferrer"
        >
          小红书
        </a>
      ),
    },
  ];

  const {
    state: { topicData },
  } = useContext(ReportContext);

  return (
    <>
      <Table<ReportApi.TopicData>
        bordered
        size="small"
        rowKey="id"
        columns={columns}
        dataSource={topicData}
        pagination={false}
      />
    </>
  );
};

export default TopicAnalysis;
