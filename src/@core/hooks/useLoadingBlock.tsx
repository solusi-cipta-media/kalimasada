"use client";
import { useEffect, useState } from "react";

export default function useLoadingBlock(initialState = false) {
  const [loading, setLoading] = useState(initialState);

  const startLoading = () => {
    setLoading(true);
  };

  const stopLoading = () => {
    setLoading(false);
  };

  useEffect(() => {
    const wrapperLoader = document.createElement("div");

    wrapperLoader.id = "wrapper-loader";
    wrapperLoader.style.position = "fixed";
    wrapperLoader.style.top = "0";
    wrapperLoader.style.left = "0";
    wrapperLoader.style.width = "100%";
    wrapperLoader.style.height = "100%";

    wrapperLoader.style.backgroundColor = "rgba(255, 255, 255, 0.7)";

    wrapperLoader.style.display = "flex";
    wrapperLoader.style.justifyContent = "center";
    wrapperLoader.style.alignItems = "center";
    wrapperLoader.style.zIndex = "9999";
    const spinner = document.createElement("div");

    spinner.style.width = "50px";
    spinner.style.height = "50px";
    spinner.style.border = "5px solid #333";
    spinner.style.borderTopColor = "#3498db";
    spinner.style.borderRadius = "50%";
    spinner.style.animation = "spin 1s linear infinite";

    spinner.style.position = "relative";
    spinner.style.margin = "auto";

    wrapperLoader.append(spinner);

    if (loading) {
      document.body.style.overflow = "hidden";
      document.body.append(wrapperLoader);
    } else {
      document.body.style.overflow = "auto";
      const loader = document.getElementById("wrapper-loader");

      if (loader) {
        loader.remove();
      }
    }
  }, [loading]);

  return { loading, startLoading, stopLoading };
}
