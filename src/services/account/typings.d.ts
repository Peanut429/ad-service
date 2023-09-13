declare namespace Account {
  type SearchUserRes = API.ApiResponse<
    {
      userId: string;
      username: string;
      // role: 'admin' | 'editor' | 'viewer';
    }[]
  >;

  type UserListRes = API.ApiResponse<
    {
      userId: string;
      username: string;
      role: 'editor' | 'viewer';
      brandsId: string[];
      projectId: string[];
    }[]
  >;
}
