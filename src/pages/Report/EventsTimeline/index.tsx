import { useContext, useEffect, useState } from 'react';
import { Timeline } from 'antd';
import { FireOutlined, MinusSquareOutlined, PlusSquareOutlined } from '@ant-design/icons';
import ReportContext from '../Report.context';
import { Platform } from '../Report.state';
import redbookIcon from './redbook.jpg';
import tiktokIcon from './tiktok.png';
import weiboIcon from './weibo.png';
import styles from './index.module.scss';

const EventsTimeline: React.FC = () => {
  const {
    state: { adNode },
  } = useContext(ReportContext);

  const [selectedEventId] = useState<string | null>(null);
  const [renderData, setRenderData] = useState<
    (ReportApi.AdNodeItem & {
      hidden: boolean;
      expanded: boolean;
      size: number;
      platform: Platform;
      mergeContent: string;
    })[]
  >([]);

  useEffect(() => {
    if (!adNode?.length) return;
    setRenderData(
      adNode?.map((item) => {
        return {
          ...item,
          hidden: item.type === 'sub',
          expanded: false,
          size: 1,
          platform: 'redbook',
          mergeContent: item.title || '',
        };
      }),
    );
  }, [adNode]);

  function hideNodes(id: string) {
    setRenderData((prev) => {
      return prev.map((item) => {
        if (item.parentId === id) {
          return { ...item, hidden: true };
        } else if (item.id === id) {
          return { ...item, expanded: false };
        } else {
          return { ...item };
        }
      });
    });
  }

  function showNodes(id: string) {
    setRenderData((prev) => {
      return prev.map((item) => {
        if (item.parentId === id) {
          return { ...item, hidden: false };
        } else if (item.id === id) {
          return { ...item, expanded: true };
        } else {
          return { ...item };
        }
      });
    });
  }

  return (
    <Timeline
      mode="left"
      items={renderData
        .filter((item) => !item.hidden)
        .map((item) => {
          const dot = item.expanded ? (
            <MinusSquareOutlined
              onClick={() => {
                console.log('1');
                hideNodes(item.id);
              }}
              style={{ fontSize: 20, cursor: 'pointer', color: '#52c41a' }}
            />
          ) : (
            <PlusSquareOutlined
              onClick={() => {
                console.log('2');
                showNodes(item.id);
              }}
              style={{ fontSize: 20, cursor: 'pointer', color: '#52c41a' }}
            />
          );
          if (item.type === 'main') {
            return {
              dot,
              label: <span className={styles['label']}>{item.time}</span>,
              children: (
                <div className={styles['timeline-main']}>
                  <span>本节点包含话题: </span>
                  <br />
                  <div className={styles['timeline-content']}>{item.topics.join(', ')}</div>
                  <div>
                    相关贴数：{item.tweetNum}， 总热度：{item.heat}
                  </div>
                </div>
              ),
            };
          } else {
            return {
              label: item.time,
              color: selectedEventId === item.id ? 'red' : '#1890ff',
              // className: classNames(styles.dot, styles[`dot-${item.size}`]),
              children: (
                <>
                  <div className={styles['timeline-content']}>
                    <div className={styles['timeline__icon']}>
                      {item.platform === 'weibo' ? (
                        <img src={weiboIcon} alt="微博" />
                      ) : item.platform === 'redbook' ? (
                        <img src={redbookIcon} alt="小红书" />
                      ) : (
                        <img src={tiktokIcon} alt="抖音" />
                      )}
                    </div>
                    <span className={styles['text']}>{item.mergeContent}</span>
                  </div>
                  <span>
                    <FireOutlined style={{ fontSize: 16, color: 'red', margin: '0 5px 0 0px' }} />
                    {item.heat}
                  </span>
                </>
              ),
            };
          }
        })}
    />
  );
};

export default EventsTimeline;
