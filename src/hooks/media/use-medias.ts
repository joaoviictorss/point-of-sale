import { useOrganization } from "@/contexts/organization-context";
import { uploadMedia } from "@/services/media";

export const useUploadMedia = () => {
  const { slug: organizationSlug } = useOrganization();

  const upload = (file: File, alt?: string) =>
    uploadMedia(file, organizationSlug, alt);

  return { upload };
};
