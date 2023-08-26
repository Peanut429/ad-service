import { createAccount, searchUser } from '@/services/account';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import {
  ModalForm,
  ProFormDependency,
  ProFormInstance,
  ProFormSelect,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';
import { useRequest } from '@umijs/max';
import { Button, message } from 'antd';
import { useRef, useState } from 'react';

const AccountList = () => {
  const formRef = useRef<ProFormInstance>();
  const [users, setUsers] = useState<{ label: string; value: string }[]>([]);

  const { run: searchUserApi, cancel } = useRequest(searchUser, {
    manual: true,
    onSuccess: (data) => {
      setUsers(
        data.map((item) => ({ label: item.username, value: item.userId, key: item.userId })),
      );
    },
  });

  return (
    <>
      <ProTable
        search={false}
        columns={[]}
        toolBarRender={() => [
          <ModalForm<{ username: string; password: string; role: 'viewer' | 'editor' }>
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
            onFinish={async (values) => {
              await createAccount({
                ...values,
                belongToUserId: values.role === 'viewer' ? localStorage.getItem('userId')! : null,
              });
              message.success('创建账号成功');
              formRef.current?.resetFields();
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
            <ProFormSelect
              label="权限"
              name="role"
              rules={[{ required: true, message: '请选择权限' }]}
              placeholder="选择需要的权限"
              options={[
                { label: '可编辑', value: 'editor' },
                { label: '仅查看', value: 'viewer' },
              ]}
            ></ProFormSelect>
            <ProFormDependency name={['role']}>
              {({ role }) => {
                return role === 'viewer' ? (
                  <ProFormSelect
                    label="所属账户"
                    name="belongToUserId"
                    rules={[{ required: true, message: '请选择所属账户' }]}
                    placeholder="选择所属账户"
                    options={users}
                    fieldProps={{
                      showSearch: true,
                      onSearch: (value) => {
                        cancel();
                        searchUserApi({ username: value });
                      },
                    }}
                  />
                ) : null;
              }}
            </ProFormDependency>
          </ModalForm>,
        ]}
      />

      {/* <Modal
        centered
        open={open}
        width={500}
        title="新建账号"
        onCancel={() => setOpen(false)}
        footer={null}
      >
        <ProForm size="large">

        </ProForm>
      </Modal> */}
    </>
  );
};

export default AccountList;
