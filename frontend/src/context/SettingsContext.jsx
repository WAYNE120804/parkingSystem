import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { fetchLogo, uploadLogo } from "../api/settings.api";

const SettingsContext = createContext({
  logoUrl: "",
  updateLogoUrl: () => {},
  uploadLogoFile: async () => {}
});

const FALLBACK_LOGO = "http://localhost:3001/uploads/logo.png";

const normalizeLogoUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `http://localhost:3001${url}`;
};

export function SettingsProvider({ children }) {
  const [logoUrl, setLogoUrl] = useState(FALLBACK_LOGO);

  useEffect(() => {
    const loadLogo = async () => {
      try {
        const data = await fetchLogo();
        if (data?.logoUrl) {
          setLogoUrl(normalizeLogoUrl(data.logoUrl));
        }
      } catch (error) {
        console.error("Error al cargar logo", error);
      }
    };
    loadLogo();
  }, []);

  useEffect(() => {
    if (!logoUrl) return;
    const link =
      document.querySelector("link[rel~='icon']") ||
      (() => {
        const created = document.createElement("link");
        created.rel = "icon";
        document.head.appendChild(created);
        return created;
      })();
    link.href = logoUrl;
  }, [logoUrl]);

  const updateLogoUrl = (newUrl) => {
    if (newUrl) {
      setLogoUrl(normalizeLogoUrl(newUrl));
    }
  };

  const uploadLogoFile = async (file, role) => {
    const data = await uploadLogo(file, role);
    if (data?.logoUrl) {
      setLogoUrl(normalizeLogoUrl(data.logoUrl));
    }
    return data;
  };

  const value = useMemo(
    () => ({
      logoUrl,
      updateLogoUrl,
      uploadLogoFile
    }),
    [logoUrl]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export const useSettings = () => useContext(SettingsContext);
