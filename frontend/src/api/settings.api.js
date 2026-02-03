import { http } from "./http";

export const fetchLogo = () => http.get("/api/settings/logo").then((r) => r.data);

export const uploadLogo = (file, role) => {
  const formData = new FormData();
  formData.append("logo", file);
  return http
    .post("/api/settings/logo", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "x-user-role": role
      }
    })
    .then((r) => r.data);
};
