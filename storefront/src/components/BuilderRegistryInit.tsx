"use client";

import { useEffect } from "react";
import { registerBuilderComponents } from "@/builder-registry";

/**
 * Runs once on client to register Builder.io custom components.
 * Import this in the root layout so the visual editor can use them.
 */
export default function BuilderRegistryInit() {
  useEffect(() => {
    registerBuilderComponents();
  }, []);
  return null;
}
