"use client";

import { useEffect } from "react";

const TRACKIER_SECURITY_TOKEN = "0d40f67224f4852b6480";
const TRACKIER_BASE_URL = "https://marvex.trackier.co/acquisition";

export function getTrackierClickId(): string {
  if (typeof window === "undefined") return "";
  try {
    const params = new URLSearchParams(window.location.search);
    const fromUrl =
      params.get("click_id") ||
      params.get("clickid") ||
      params.get("clickId") ||
      params.get("aff_click_id");
    if (fromUrl && fromUrl.trim()) {
      const cleanId = fromUrl.trim();
      localStorage.setItem("trackier_click_id", cleanId);
      sessionStorage.setItem("trackier_click_id", cleanId);
      return cleanId;
    }
    return (
      localStorage.getItem("trackier_click_id") ||
      sessionStorage.getItem("trackier_click_id") ||
      ""
    );
  } catch {
    return "";
  }
}

export function fireTrackierAcquisitionPixel(customClickId?: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const clickId = customClickId?.trim() || getTrackierClickId();
    if (!clickId) return false;

    const pixelUrl = `${TRACKIER_BASE_URL}?click_id=${encodeURIComponent(clickId)}&security_token=${TRACKIER_SECURITY_TOKEN}`;
    
    // 1. Fire via Image object
    const img = new Image(1, 1);
    img.src = pixelUrl;

    // 2. Fire via fetch (no-cors mode to prevent CORS issues)
    fetch(pixelUrl, { mode: "no-cors", cache: "no-cache" }).catch(() => {});

    console.log("[Trackier] Acquisition tracking pixel fired successfully:", pixelUrl);
    return true;
  } catch (err) {
    console.error("[Trackier] Failed to fire acquisition pixel:", err);
    return false;
  }
}

export default function TrackierTracking() {
  useEffect(() => {
    // Automatically capture click_id on page load
    getTrackierClickId();
  }, []);

  return null;
}
