// React Native's fetch uploads a file from a { uri, name, type } object, which
// the DOM FormData types don't model — hence the Blob cast, kept to this one place.
export const appendPhotos = (
  formData: FormData,
  fieldName: string,
  photos: { uri: string }[],
  namePrefix: string,
) => {
  const timestamp = Date.now();
  photos.forEach((photo, index) => {
    const extension = photo.uri.split(".").pop() ?? "jpg";
    formData.append(fieldName, {
      uri: photo.uri,
      name: `${namePrefix}-${timestamp}-${index}.${extension}`,
      type: extension === "png" ? "image/png" : "image/jpeg",
    } as unknown as Blob);
  });
};
