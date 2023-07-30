import { request } from '@umijs/max';

export async function chartData(data: ReportApi.ChartDataReq) {
  return request<ReportApi.ChartDataRes>('/api/core/chart', {
    method: 'POST',
    data,
  });
}

export async function tweetList(data: ReportApi.TweetListReq) {
  return request<ReportApi.TweetListRes>('/api/core/list/tweet', {
    method: 'POST',
    data,
  });
}
