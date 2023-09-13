import { message } from 'antd';
import { flushSync } from 'react-dom';
import { history, useModel, Helmet } from '@umijs/max';
import { login } from '@/services/ant-design-pro/api';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { LoginForm, ProFormText } from '@ant-design/pro-components';
import { useEmotionCss } from '@ant-design/use-emotion-css';
import Settings from '../../../../config/defaultSettings';

// const LoginMessage: React.FC<{
//   content: string;
// }> = ({ content }) => {
//   return (
//     <Alert
//       style={{
//         marginBottom: 24,
//       }}
//       message={content}
//       type="error"
//       showIcon
//     />
//   );
// };

const Login: React.FC = () => {
  // const [userLoginState, setUserLoginState] = useState<API.LoginResult>({});
  const { setInitialState } = useModel('@@initialState');

  const containerClassName = useEmotionCss(() => {
    return {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'auto',
      backgroundImage:
        "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
      backgroundSize: '100% 100%',
    };
  });

  // const fetchUserInfo = async () => {
  //   const userInfo = await initialState?.fetchUserInfo?.();
  //   if (userInfo) {
  //     flushSync(() => {
  //       setInitialState((s) => ({
  //         ...s,
  //         currentUser: userInfo,
  //       }));
  //     });
  //   }
  // };

  const handleSubmit = async (values: API.LoginParams) => {
    try {
      // 登录
      const msg = await login({ ...values });
      if (msg.code === 200) {
        message.success('登录成功！');
        // await fetchUserInfo();
        flushSync(() => {
          setInitialState((s) => ({
            ...s,
            currentUser: {
              userid: msg.data.userInfo.userId,
              name: msg.data.userInfo.username,
              access: msg.data.userInfo.role,
              avatar:
                'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
            },
          }));
        });
        localStorage.setItem('token', msg.data.token);
        localStorage.setItem('userId', msg.data.userInfo.userId);
        localStorage.setItem('role', msg.data.userInfo.role);
        localStorage.setItem('name', msg.data.userInfo.username);
        localStorage.setItem(
          'avatar',
          'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
        );
        const urlParams = new URL(window.location.href).searchParams;
        history.push(urlParams.get('redirect') || '/');
        return;
      }
      // 如果失败去设置用户错误信息
      // setUserLoginState(msg);
    } catch (error) {
      console.log(error);
      message.error('登录失败，请重试！');
    }
  };

  return (
    <div className={containerClassName}>
      <Helmet>
        <title>登录页 - {Settings.title}</title>
      </Helmet>
      <div style={{ flex: '1', padding: '10vw 0' }}>
        <LoginForm
          contentStyle={{ minWidth: 280, maxWidth: '75vw' }}
          logo={<img alt="logo" src="/logo.svg" />}
          title="SMI System"
          subTitle="SMI System 数据中心"
          initialValues={{ autoLogin: true }}
          onFinish={async (values) => {
            await handleSubmit({
              username: values.username.trim(),
              password: values.password.trim(),
            });
          }}
        >
          {/* {status === 'error' && (
            <LoginMessage content="账户或密码错误(admin/ant.design)" />
          )} */}
          <ProFormText
            name="username"
            fieldProps={{
              size: 'large',
              prefix: <UserOutlined />,
            }}
            placeholder="用户名: admin or user"
          />
          <ProFormText.Password
            name="password"
            fieldProps={{
              size: 'large',
              prefix: <LockOutlined />,
            }}
            placeholder="密码: ant.design"
          />
        </LoginForm>
      </div>
    </div>
  );
};

export default Login;
