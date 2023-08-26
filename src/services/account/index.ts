import { request } from '@umijs/max';

export async function createAccount(data: {
  username: string;
  password: string;
  role: 'viewer' | 'editor';
  belongToUserId: string | null;
}) {
  return request('/api//auth/createUser', {
    method: 'POST',
    data,
  });
}

export async function searchUser(data: { username: string }) {
  return request<Account.SearchUserRes>('/api/auth/getEditorUser', {
    method: 'POST',
    data,
  });
}
