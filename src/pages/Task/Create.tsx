import SearchInput from '@/components/SearchInput';
import { brandsList, createTask } from '@/services/brands';
import { useRequest } from '@umijs/max';
import { DatePicker, Form, Input, Modal, Select, message } from 'antd';
import { Dayjs } from 'dayjs';
import { useState } from 'react';

type TaskCreatorProps = {
  open: boolean;
  onCancel?: () => void;
  onCreate?: () => void;
};

const TaskCreator: React.FC<TaskCreatorProps> = ({ open, onCancel, onCreate }) => {
  const [form] = Form.useForm<{
    projectName: string;
    brandId: string;
    dataRetrieverTime: [Dayjs, Dayjs];
    wordTasks: BrandsApi.KeywordInfo[];
  }>();
  const [loading, setLoading] = useState(false);

  const { data: brands } = useRequest(brandsList);

  const handleCancel = () => {
    onCancel?.();
    form.resetFields();
  };

  const handleOk = async () => {
    const data = await form.validateFields();
    setLoading(true);
    try {
      await createTask({
        ...data,
        dataRetrieverTime: {
          gte: data.dataRetrieverTime[0].startOf('day').valueOf(),
          lte: data.dataRetrieverTime[1].endOf('day').valueOf(),
        },
        wordTasks: data.wordTasks.map((item) => ({
          word: item.word,
          pattern: item.pattern as string[][],
          platforms: [item.platform],
        })),
      });
      message.success('创建成功');
    } catch (error) {
      message.error('创建失败');
    }
    setLoading(false);
    handleCancel();
    onCreate?.();
  };

  return (
    <>
      <Modal
        open={open}
        title="创建项目"
        centered
        width={800}
        maskClosable={false}
        okButtonProps={{ loading }}
        onCancel={handleCancel}
        onOk={handleOk}
      >
        <Form form={form} size="large" labelCol={{ flex: '80px' }}>
          <Form.Item
            label="项目名称"
            name="projectName"
            rules={[{ required: true, message: '请输入项目名称' }]}
          >
            <Input autoComplete="off" />
          </Form.Item>
          <Form.Item
            label="所属品牌"
            name="brandId"
            rules={[{ required: true, message: '请选择所属品牌' }]}
          >
            <Select
              options={(brands || []).map((brand) => ({
                label: brand.brandName,
                value: brand.brandId,
              }))}
            />
          </Form.Item>
          <Form.Item
            label="时间周期"
            name="dataRetrieverTime"
            rules={[{ required: true, message: '请设置时间周期' }]}
          >
            <DatePicker.RangePicker />
          </Form.Item>
          <Form.Item
            label="关键词"
            name="wordTasks"
            valuePropName="taskId"
            rules={[{ required: true, message: '请设置关键词' }]}
          >
            <SearchInput />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default TaskCreator;
