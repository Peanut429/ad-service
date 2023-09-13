import { useEffect, useRef, useState } from 'react';
import { useRequest, useAccess, Access, useModel } from '@umijs/max';
import { Button, Checkbox, Form, Modal, Popconfirm, Space, message } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import {
  ModalForm,
  ProFormInstance,
  ProFormText,
  ProTable,
  ProColumnType,
  ActionType,
} from '@ant-design/pro-components';
import {
  bindBrandWithEditor,
  bindProjectWithViewer,
  createAccount,
  deleteAccount,
  userList,
} from '@/services/account';
import { brandsList, taskList } from '@/services/brands';

const AccountList = () => {
  const { initialState } = useModel('@@initialState');
  const formRef = useRef<ProFormInstance>();
  const actionRef = useRef<ActionType>();
  const [brandFormRef] = Form.useForm<{ brands: string[] }>();
  const [projectFormRef] = Form.useForm<{ projects: string[] }>();

  const access = useAccess();
  const [brandOpen, setBrandOpen] = useState(false);
  const [projectOpen, setProjectOpen] = useState(false);
  const [currentAccount, setCurrentAccount] = useState<Account.UserListRes['data'][number]>();
  const [tasks, setTasks] = useState<BrandsApi.TaskListRes['data']>([]);

  const columns: ProColumnType<Account.UserListRes['data'][number]>[] = [
    { title: 'ID', dataIndex: 'userId', search: false },
    { title: '用户名', dataIndex: 'username' },
    { title: '角色', dataIndex: 'role', search: false },
    {
      title: '操作',
      valueType: 'option',
      render: (_, record) => {
        return (
          <Space>
            <Access accessible={access.canAdmin}>
              <Button
                type="text"
                onClick={() => {
                  setBrandOpen(true);
                  setCurrentAccount(record);
                }}
              >
                品牌管理
              </Button>
            </Access>
            <Access accessible={initialState?.currentUser?.access === 'editor'}>
              <Button
                type="text"
                onClick={() => {
                  setProjectOpen(true);
                  setCurrentAccount(record);
                }}
              >
                项目管理
              </Button>
            </Access>
            <Popconfirm
              title="确认删除该账号?"
              onConfirm={async () => {
                await deleteAccount(
                  { username: record.userId },
                  access.canAdmin ? 'editor' : 'viewer',
                );
                message.success('删除成功');
                actionRef.current?.reload();
              }}
            >
              <Button type="text" danger>
                删除账号
              </Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  const { data: brands, run: brandsListApi } = useRequest(brandsList, { manual: true });

  const { run: taskListApi } = useRequest(taskList, {
    manual: true,
    onSuccess: (data) => {
      setTasks((prev) => [...prev, ...data]);
    },
  });

  useEffect(() => {
    brandsListApi({});
  }, []);

  useEffect(() => {
    if (!brands) return;

    brands.forEach((item) => {
      taskListApi({ brandId: item.brandId });
    });
  }, [brands]);

  useEffect(() => {
    if (!currentAccount) return;
    if (access.canAdmin) {
      brandFormRef.setFieldValue('brands', currentAccount.brandsId || []);
    } else {
      projectFormRef.setFieldValue('projects', currentAccount.projectId || []);
    }
  }, [currentAccount]);

  return (
    <>
      <ProTable
        rowKey="userId"
        columns={columns}
        actionRef={actionRef}
        toolBarRender={() => [
          <ModalForm<{
            username: string;
            password: string;
            role: 'viewer' | 'editor';
            belongToUserId?: string;
          }>
            key="create"
            formRef={formRef}
            title="新建账号"
            size="large"
            width={500}
            trigger={
              <Button type="primary" key="primary">
                新建账号
              </Button>
            }
            initialValues={{ role: 'viewer' }}
            onFinish={async (values) => {
              await createAccount(
                {
                  username: values.username.trim(),
                  password: values.password.trim(),
                },
                access.canAdmin ? 'editor' : 'viewer',
              );
              message.success('创建账号成功');
              formRef.current?.resetFields();
              actionRef.current?.reload();
              return true;
            }}
            onOpenChange={(open) => {
              if (!open) {
                formRef.current?.resetFields();
              }
            }}
          >
            <ProFormText
              label="账号"
              name="username"
              placeholder="请输入账号"
              rules={[{ required: true, message: '请输入账号' }]}
              fieldProps={{
                prefix: <UserOutlined />,
              }}
            ></ProFormText>
            <ProFormText.Password
              label="密码"
              name="password"
              placeholder="请输入密码"
              rules={[{ required: true, message: '请输入密码' }]}
              fieldProps={{
                prefix: <LockOutlined />,
              }}
            ></ProFormText.Password>
          </ModalForm>,
        ]}
        request={async (params) => {
          const res = await userList(access.canAdmin ? 'editor' : 'viewer', params.username);
          return {
            data: res.data,
            total: res.data.length,
          };
        }}
      />

      <Modal
        open={brandOpen}
        title="关联品牌管理"
        onCancel={() => setBrandOpen(false)}
        onOk={async () => {
          const values = await brandFormRef.validateFields();
          const newBrands = values.brands;
          const oldBrands = currentAccount?.brandsId || [];
          const deletedBrands = oldBrands.filter((item) => !newBrands.includes(item));
          const addedBrands = newBrands.filter((item) => !oldBrands.includes(item));
          for (const item of addedBrands) {
            await bindBrandWithEditor({
              username: currentAccount!.userId,
              brandId: item,
              operation: 'add',
            });
          }
          for (const item of deletedBrands) {
            await bindBrandWithEditor({
              username: currentAccount!.userId,
              brandId: item,
              operation: 'delete',
            });
          }
          message.success('操作成功');
          actionRef.current?.reload();
          setBrandOpen(false);
        }}
      >
        <Form form={brandFormRef}>
          <Form.Item label="选择品牌" name="brands">
            <Checkbox.Group
              options={brands?.map((item) => ({ label: item.brandName, value: item.brandId }))}
              style={{ flexWrap: 'wrap' }}
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        open={projectOpen}
        title="项目关联管理"
        onCancel={() => setProjectOpen(false)}
        onOk={async () => {
          const values = await projectFormRef.validateFields();
          const newProjects = values.projects;
          const oldProjects = currentAccount?.projectId || [];
          const deletedProjects = oldProjects.filter((item) => !newProjects.includes(item));
          const addedProjects = newProjects.filter((item) => !oldProjects.includes(item));
          for (const item of addedProjects) {
            const brandId = tasks.find((t) => t.projectId === item)!.brandId;
            await bindProjectWithViewer({
              username: currentAccount!.userId,
              projectId: item,
              operation: 'add',
              brandId,
            });
          }
          for (const item of deletedProjects) {
            const brandId = tasks.find((t) => t.projectId === item)!.brandId;

            await bindProjectWithViewer({
              username: currentAccount!.userId,
              operation: 'delete',
              projectId: item,
              brandId,
            });
          }
          message.success('操作成功');
          actionRef.current?.reload();
          setProjectOpen(false);
        }}
      >
        <Form form={projectFormRef}>
          <Form.Item label="选择项目" name="projects">
            <Checkbox.Group
              options={tasks?.map((item) => ({ label: item.name, value: item.projectId }))}
              style={{ flexWrap: 'wrap' }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AccountList;
