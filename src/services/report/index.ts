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

export async function commentList(data: ReportApi.TweetListReq) {
  return request<ReportApi.CommentListRes>('/api/core/list/comment', {
    method: 'POST',
    data,
  });
}

// tweetTrend, appearTogether图表的评论数据
export async function commentChartData(data: ReportApi.ChartDataReq) {
  return request<ReportApi.ChartDataRes>('/api/core/chart/comment', { method: 'POST', data });
}

export async function wordClassList() {
  return request<ReportApi.WordClassListRes>('/api/functional/wordClassType', { method: 'POST' });
}

export async function fixSentiment(data: ReportApi.FixTweetSentimentReq) {
  return request('/api/functional/fix/sentiment', { method: 'POST', data });
}

export async function commentSentiment(data: ReportApi.ChartDataReq) {
  return request<ReportApi.CommentSentimentRes>('/api/core/sentiment/comment', {
    method: 'POST',
    data,
  });
}
