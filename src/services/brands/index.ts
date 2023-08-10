import { request } from '@umijs/max';

// export async function brandsList(data) {
//   return request('')
// }

export async function createTask(data: BrandsApi.CreateTaskReq) {
  return request('/api/task/createProject', { method: 'POST', data });
}

export async function keywordsInfo(data: BrandsApi.KeywordsInfoReq) {
  return request<BrandsApi.KeywordsInfoRes>('/api/task/getTask', { method: 'POST', data });
}

export async function brandsList(data: { brandsId?: string[]; brandName?: string }) {
  return request<BrandsApi.BrandsListRes>('/api/task/getBrand', { method: 'POST', data });
}

export async function createBrand(data: { brandName: string; avatar: string }) {
  return request('/api/task/createBrand', { method: 'POST', data });
}

export async function taskList(data: { brandId?: string; projectsId?: string[] }) {
  return request<BrandsApi.TaskListRes>('/api/task/getProject', { method: 'POST', data });
}

export async function stopTask(data: { tasksId: string[]; stop: boolean }) {
  return request('/api/task/stop', { method: 'POST', data });
}
