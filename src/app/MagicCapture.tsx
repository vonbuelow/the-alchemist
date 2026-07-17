"use client";

import { useEffect } from "react";
import { captureMagicFromUrl } from "@/lib/magic";

// adding in comments to trigger a new deploy
export default function MagicCapture() {
  useEffect(() => {
    captureMagicFromUrl();
  }, []);
  return null;
}
