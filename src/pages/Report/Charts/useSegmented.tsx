import { Segmented } from 'antd';
import { useState } from 'react';

type Option = {
  label: string;
  value: string;
};

const useSegmented = (options: Option[], defaultValue: Option['value']) => {
  const [source, setSource] = useState<Option['value']>(defaultValue);

  return {
    source,
    ComponentNode: () => (
      <Segmented
        key="node"
        value={source}
        options={options}
        onChange={(value) => setSource(value as Option['value'])}
      />
    ),
  };
};

export default useSegmented;
