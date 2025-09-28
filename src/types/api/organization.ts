export interface CreateOrganizationRequest {
  name: string;
}

export interface CreateOrganizationResponse {
  id: string;
  name: string;
  slug: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetOrganizationsResponse {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
}
