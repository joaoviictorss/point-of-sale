import { httpApi } from "@/infra/http/httpApi";

interface IExampleService {
  exampleAtribute: string;
}

export const exampleService = async ({ exampleAtribute }: IExampleService) => {
  try {
    const { data } = await httpApi.post(`/request/example`, {
      exampleAtribute,
    });

    return Promise.resolve({ data });
  } catch (err) {
    return Promise.reject(err);
  }
};
