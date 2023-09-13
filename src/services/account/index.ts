import { request } from '@umijs/max';

export async function createAccount(
  data: {
    username: string;
    password: string;
  },
  role: 'editor' | 'viewer',
) {
  const url = role === 'editor' ? '/api/auth/editor/create' : '/api/auth/viewer/create';
  return request(url, { method: 'POST', data });
}

export async function searchUser(data: { username: string }) {
  return request<Account.SearchUserRes>('/api/auth/getEditorUser', {
    method: 'POST',
    data,
  });
}

export async function userList(role: 'editor' | 'viewer', username?: string) {
  const url = role === 'editor' ? '/api/auth/editor/get' : '/api/auth/viewer/get';
  return request<Account.UserListRes>(url, {
    method: 'POST',
    data: { username },
  });
}

export async function bindBrandWithEditor(data: {
  username: string;
  brandId: string;
  operation: 'add' | 'delete';
}) {
  return request('/api/auth/editor/toggle', { method: 'POST', data });
}

export async function deleteAccount(data: { username: string }, role: 'editor' | 'viewer') {
  const url = role === 'editor' ? '/api/auth/editor/delete' : '/api/auth/viewer/delete';
  return request(url, { method: 'POST', data });
}

export async function bindProjectWithViewer(data: {
  username: string;
  projectId: string;
  operation: 'add' | 'delete';
  brandId: string;
}) {
  return request('/api/auth/viewer/toggle', { method: 'POST', data });
}
