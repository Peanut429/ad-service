import { ReactNode } from 'react';
import { Card } from 'antd';

type Props = { children: ReactNode; title: string };

const ChartCard: React.FC<Props> = ({ title, children }) => {
  return <Card title={title}>{children}</Card>;
};

export default ChartCard;
