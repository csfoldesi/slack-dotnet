import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/client";
import { AxiosError } from "axios";

export const useUploadImage = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<string, AxiosError, Blob>({
    mutationFn: (file: Blob) => {
      const formData = new FormData();
      formData.append("File", file);
      return client
        .post("/storage", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((res) => res.data.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GetMessages"] });
    },
  });

  return { uploadImage: mutation.mutateAsync, isPending: mutation.isPending };
};
