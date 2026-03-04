"use client";

import { Content } from "@builder.io/sdk-react";

type BuilderContentBlockProps = {
  content: unknown;
  model: string;
  apiKey: string;
  data?: Record<string, unknown>;
};

/** Client wrapper for Builder Content so it can be used from Server Components. */
export default function BuilderContentBlock({
  content,
  model,
  apiKey,
  data,
}: BuilderContentBlockProps) {
  return (
    <Content
      content={content as any}
      model={model}
      apiKey={apiKey}
      data={data}
    />
  );
}
