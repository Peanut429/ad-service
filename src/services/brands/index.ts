import { request } from '@umijs/max';

// export async function brandsList(data) {
//   return request('')
// }

export async function createTask(data) {
  return request('/api/task/createProject', { method: 'POST', data });
}
