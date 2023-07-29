import WordGroup from '@/components/WordGroup';
import { Form } from 'antd';

const DataFilterForm = () => {
  return (
    <Form>
      <Form.Item label="组合关键词">
        <WordGroup />
      </Form.Item>
    </Form>
  );
};

export default DataFilterForm;
