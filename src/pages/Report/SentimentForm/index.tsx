import { Space, message } from 'antd';
import { ModalForm, ProFormRadio } from '@ant-design/pro-components';
import { fixSentiment } from '@/services/report';
import sentimentBad from '../TweetList/sentiment_bad.png';
import sentimentGood from '../TweetList/sentiment_good.png';
import sentimentNeutral from '../TweetList/sentiment_neutral.png';

type SentimentFormProps = {
  trigger: JSX.Element;
  id: string;
  type: 'comment' | 'tweet';
  platform: 'tiktok' | 'redbook' | 'weibo';
  onChange?: (sentiment: 1 | 2 | 3) => void;
};
const SentimentForm = ({ trigger, id, type, platform, onChange }: SentimentFormProps) => {
  return (
    <ModalForm
      width={400}
      modalProps={{ centered: true, destroyOnClose: true }}
      title="情感修改"
      trigger={trigger}
      onFinish={async (values) => {
        await fixSentiment({
          data: [{ id, sentiment: values.sentiment }],
          platform,
          type,
        });
        message.success('修改成功');
        onChange?.(values.sentiment);
        return true;
      }}
    >
      <ProFormRadio.Group
        name="sentiment"
        options={[
          {
            label: (
              <Space align="center">
                <img src={sentimentGood} alt="正面" style={{ width: 40 }} />
                <span>正面</span>
              </Space>
            ),
            value: 3,
          },
          {
            label: (
              <Space align="center">
                <img src={sentimentBad} alt="负面" style={{ width: 40 }} />
                <span>负面</span>
              </Space>
            ),
            value: 1,
          },
          {
            label: (
              <Space align="center">
                <img src={sentimentNeutral} alt="中性" style={{ width: 40 }} />
                <span>中性</span>
              </Space>
            ),
            value: 2,
          },
        ]}
      />
    </ModalForm>
  );
};

export default SentimentForm;
