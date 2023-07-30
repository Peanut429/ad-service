import { useRef } from 'react';
import useDataSource from './useDataSource';

const KeywordCategoryChart = () => {
  const divRef = useRef<HTMLDivElement | null>(null);
  const [source, contextHolder] = useDataSource();

  return (
    <div>
      {contextHolder}
      <div ref={divRef} style={{ marginTop: 20 }} />
    </div>
  );
};

export default KeywordCategoryChart;
