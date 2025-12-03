export interface CreateMediaRequest {
  file: File;
  alt?: string;
  productId?: string;
}

export interface UpdateMediaRequest {
  alt?: string;
  productId?: string | null;
}

export interface Media {
  id: string;
  url: string;
  publicId: string;
  alt?: string;
  mimeType: string;
  fileSize: number;
  organizationId: string;
  uploadedById?: string;
  productId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MediaListResponse {
  docs: Media[];
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
    totalDocs: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    count: number;
  };
}

export interface CreateMediaServiceResponse {
  id: string;
  url: string;
  publicId: string;
  alt?: string;
  mimeType: string;
  fileSize: number;
  organizationId: string;
  uploadedById?: string;
  productId?: string;
  createdAt: string;
  updatedAt: string;
}

export type GetMediaResponse = Media;
export type UpdateMediaResponse = Media;

export interface DeleteMediaServiceResponse {
  message: string;
}
