declare namespace Account {
  type SearchUserRes = API.ApiResponse<
    {
      userId: string;
      username: string;
      // role: 'admin' | 'editor' | 'viewer';
    }[]
  >;
}
