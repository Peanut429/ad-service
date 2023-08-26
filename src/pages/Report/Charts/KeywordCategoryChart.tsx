import { useRef } from 'react';
import useSegmented from './useSegmented';

const KeywordCategoryChart = () => {
  const divRef = useRef<HTMLDivElement | null>(null);
  const { ComponentNode } = useSegmented(
    [
      { label: '推文', value: 'tweet' },
      { label: '评论', value: 'comment' },
    ],
    'tweet',
  );

  return (
    <div>
      <ComponentNode />
      <div ref={divRef} style={{ marginTop: 20 }} />
    </div>
  );
};

export default KeywordCategoryChart;
