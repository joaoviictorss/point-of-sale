import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createMedia,
  deleteMedia,
  getMedia,
  getMedias,
  updateMedia,
} from "@/services/media";
import type {
  CreateMediaRequest,
  GetMediaResponse,
  MediaListResponse,
  UpdateMediaRequest,
} from "@/types/api/media";
import type { ApiSuccessResponse } from "@/types/http";
import { usePagination } from "../common/use-pagination";
import { useQueryWithSearch } from "../common/use-query";

interface UseMediasParams {
  organizationSlug: string;
  // Parâmetros para lista de medias
  searchTerm?: string;
  page?: number;
  limit?: number;
  order?: "asc" | "desc";
  mimeType?: string;
  productId?: string;
  enabled?: boolean;
  // Parâmetros para media individual
  mediaId?: string;
}

export function useMedias({
  organizationSlug,
  searchTerm = "",
  page = 1,
  limit = 20,
  order = "desc",
  mimeType,
  productId,
  enabled = true,
  mediaId,
}: UseMediasParams) {
  const queryClient = useQueryClient();
  const pagination = usePagination({ initialPage: page, initialLimit: limit });

  // Query para lista de medias
  const mediasQuery = useQueryWithSearch<MediaListResponse>({
    queryKey: [
      "medias",
      organizationSlug,
      pagination.page,
      pagination.limit,
      order,
      mimeType,
      productId,
    ],
    queryFn: async () => {
      const response = await getMedias(organizationSlug, {
        page: pagination.page,
        limit: pagination.limit,
        order,
        mimeType,
        search: searchTerm,
        productId,
      });
      return response.data;
    },
    searchTerm,
    enabled: enabled && !!organizationSlug,
  });

  // Query para media individual
  const mediaQuery = useQuery({
    queryKey: ["media", organizationSlug, mediaId],
    queryFn: () => getMedia(organizationSlug, mediaId as string),
    enabled: enabled && !!organizationSlug && !!mediaId,
  });

  // Mutations
  const createMediaMutation = useMutation({
    mutationFn: (data: CreateMediaRequest) =>
      createMedia(organizationSlug, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["medias", organizationSlug],
      });
      toast.success("Media criada com sucesso");
    },
    onError: (error) => {
      const errorMessage = error.message ?? "Erro ao criar media";
      toast.error(errorMessage);
      throw error;
    },
  });

  const updateMediaMutation = useMutation({
    mutationFn: ({
      mediaId: id,
      data,
    }: {
      mediaId: string;
      data: UpdateMediaRequest;
    }) => updateMedia(organizationSlug, id, data),
    onSuccess: (_, { mediaId: id }) => {
      queryClient.invalidateQueries({
        queryKey: ["medias", organizationSlug],
      });
      queryClient.invalidateQueries({
        queryKey: ["media", organizationSlug, id],
      });
      toast.success("Media atualizada com sucesso");
    },
    onError: (error) => {
      const errorMessage = error.message || "Erro ao atualizar media";
      toast.error(errorMessage);
      throw error;
    },
  });

  const deleteMediaMutation = useMutation({
    mutationFn: (id: string) => deleteMedia(organizationSlug, id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["medias", organizationSlug],
      });
      toast.success("Media deletada com sucesso");
    },
    onError: (error) => {
      const errorMessage = error.message || "Erro ao deletar media";
      toast.error(errorMessage);
      throw error;
    },
  });

  // Estados da paginação baseados na resposta
  const mediasData = mediasQuery.data;
  const paginationInfo = mediasData?.pagination;
  const hasNextPage = paginationInfo?.hasNextPage ?? false;
  const hasPrevPage = paginationInfo?.hasPrevPage ?? false;
  const totalPages = paginationInfo?.totalPages ?? 0;
  const totalDocs = paginationInfo?.totalDocs ?? 0;
  const currentCount = paginationInfo?.count ?? 0;

  return {
    // Dados da lista de medias
    ...mediasQuery,
    data: mediasData,
    medias: mediasData?.docs ?? [],

    // Dados da media individual
    media: mediaQuery.data,
    mediaData: mediaQuery.data as
      | ApiSuccessResponse<GetMediaResponse>
      | undefined,
    isFetchingMedia: mediaQuery.isFetching,
    mediaError: mediaQuery.error,

    // Estados da paginação
    currentPage: pagination.page,
    currentLimit: pagination.limit,
    totalPages,
    hasNextPage,
    hasPrevPage,
    totalDocs,
    currentCount,

    // Handlers da paginação
    goToPage: pagination.goToPage,
    nextPage: pagination.nextPage,
    prevPage: pagination.prevPage,
    changeLimit: pagination.changeLimit,
    resetPagination: pagination.reset,

    // Mutations
    createMedia: createMediaMutation,
    updateMedia: updateMediaMutation,
    deleteMedia: deleteMediaMutation,

    // Estados de loading
    isLoading: mediasQuery.isLoading,
    isError: mediasQuery.isError,
    error: mediasQuery.error,
  };
}
