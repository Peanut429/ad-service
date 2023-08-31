import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import styles from './index.module.scss';

export type SortInfo = { order_key: string; order_direction: number };
type SortComponentProps = {
  onChange?: (sortInfo: SortInfo) => void;
};

const SortComponent: React.FC<SortComponentProps> = ({ onChange }) => {
  const [params, setParams] = useState<SortInfo>({
    order_key: 'time',
    order_direction: 1, // 1降序，0正序
  });

  useEffect(() => {
    onChange?.(params);
  }, [params]);

  return (
    <div className={styles['sort-wrapper']}>
      <div
        className={styles.sort__item}
        onClick={() => {
          setParams((prev) => ({
            order_key: 'time',
            order_direction: prev.order_key === 'time' ? 1 - prev.order_direction : 1,
          }));
        }}
      >
        <span>发布时间</span>
        <span className={styles['sort-icon-wrapper']}>
          <span
            className={classNames(styles['sort-icon__up'], {
              [styles.active]: params.order_key === 'time' && !params.order_direction,
            })}
          />
          <span
            className={classNames(styles['sort-icon__down'], {
              [styles.active]: params.order_key === 'time' && params.order_direction,
            })}
          />
        </span>
      </div>
      <div
        className={styles.sort__item}
        onClick={() => {
          setParams((prev) => ({
            order_key: 'heat',
            order_direction: prev.order_key === 'heat' ? 1 - prev.order_direction : 1,
          }));
        }}
      >
        <span>互动量</span>
        <span className={styles['sort-icon-wrapper']}>
          <span
            className={classNames(styles['sort-icon__up'], {
              [styles.active]: params.order_key === 'heat' && !params.order_direction,
            })}
          />
          <span
            className={classNames(styles['sort-icon__down'], {
              [styles.active]: params.order_key === 'heat' && params.order_direction,
            })}
          />
        </span>
      </div>
    </div>
  );
};

export default SortComponent;
