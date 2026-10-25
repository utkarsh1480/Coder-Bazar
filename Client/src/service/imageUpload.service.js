import apiClient from "./apiclient.js";

const imageUploadService = {
  uploadImages: async (images) => {
    const uploads = await Promise.all(
      images.map(async ({ file }) => {
        const response = await apiClient.post("/storage/upload", file, {
          headers: {
            "Content-Type": file.type,
          },
        });

        return response.data.data.key;
      })
    );

    return uploads;
  },
};

export default imageUploadService;
