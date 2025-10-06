import axios from "axios";

export const httpApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10_000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Interceptor para tratar erros de resposta
httpApi.interceptors.response.use(
  (response) => response,
  (axiosError) => {
    // Se a resposta tem dados de erro estruturados
    if (axiosError.response?.data?.message) {
      const errorMessage = axiosError.response.data.message;
      const customError = new Error(errorMessage);
      (customError as Error & { response?: unknown }).response =
        axiosError.response;
      throw customError;
    }

    // Se é um erro de rede ou timeout
    if (
      axiosError.code === "ECONNABORTED" ||
      axiosError.message === "Network Error"
    ) {
      throw new Error(
        "Erro de conexão. Verifique sua internet e tente novamente."
      );
    }

    // Erro genérico
    throw new Error(axiosError.message || "Erro inesperado. Tente novamente.");
  }
);
