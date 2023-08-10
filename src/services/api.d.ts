declare namespace Api {
  type Response<T> = {
    code: number;
    data: T;
    message: string;
  };
}
