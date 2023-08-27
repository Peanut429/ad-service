import { useEffect, useState } from 'react';
import { Access, history, useAccess, useRequest } from '@umijs/max';
import { Button, Card, Form, Input, Modal, Space, message } from 'antd';
import { brandsList, createBrand } from '@/services/brands';

const Brands = () => {
  const [form] = Form.useForm<{ brandName: string; avatar: string }>();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { canEdit } = useAccess();

  const { data: brands, run } = useRequest(brandsList, { manual: true });

  const handleCreateBrand = async () => {
    const values = await form.validateFields();
    setLoading(true);
    try {
      await createBrand({ ...values });
      message.success('品牌创建成功');
      setOpen(false);
      run({});
    } catch (error) {
      console.log(error);
      message.error('品牌创建失败');
    }
    setLoading(false);
  };

  useEffect(() => {
    run({});
  }, []);

  return (
    <>
      <Space direction="vertical" size="large">
        <Space>
          <Input.Search size="large" />
          <Access accessible={canEdit}>
            <Button type="primary" size="large" onClick={() => setOpen(true)}>
              创建品牌
            </Button>
          </Access>
        </Space>
        <Space size="large">
          {brands?.map((brand) => {
            return (
              <Card
                key={brand.brandId}
                hoverable
                // cover={<img src={brand.avatar} />}
                cover={<img src="/dsm-firmenich.jpeg" />}
                style={{ width: 220 }}
                onClick={() => {
                  history.push('/task/list?brandId=' + brand.brandId);
                }}
              >
                <Card.Meta title={brand.brandName} />
              </Card>
            );
          })}
        </Space>
      </Space>

      <Modal
        open={open}
        maskClosable={false}
        centered
        title="创建品牌"
        okButtonProps={{ loading }}
        onOk={handleCreateBrand}
        onCancel={() => {
          form.resetFields();
          setOpen(false);
        }}
      >
        <Form form={form}>
          <Form.Item
            name="brandName"
            label="品牌名称"
            rules={[{ required: true, message: '请输入品牌名称' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="avatar"
            label="logo链接"
            rules={[{ required: true, message: '请输入logo链接' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Brands;
