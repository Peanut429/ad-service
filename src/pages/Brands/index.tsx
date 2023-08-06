import { Link } from '@umijs/max';
import { Button, Input, Space } from 'antd';
// import { useEffect } from 'react';

const Brands = () => {
  // useEffect(() => {}, []);

  return (
    <Space>
      <Space>
        <Input.Search />
        <Link to="/task/create">
          <Button type="primary">创建品牌</Button>
        </Link>
      </Space>
    </Space>
  );
};

export default Brands;
