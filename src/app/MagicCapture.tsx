"use client";

import { useEffect } from "react";
import { captureMagicFromUrl } from "@/lib/magic";

export default function MagicCapture() {
  useEffect(() => {
    captureMagicFromUrl();
  }, []);
  return null;
}
