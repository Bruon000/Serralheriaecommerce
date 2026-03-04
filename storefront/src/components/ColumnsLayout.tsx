import React from "react";

type Props = {
  className?: string;
  gap?: string;           // ex: "gap-6"
  columnsLg?: string;     // ex: "lg:grid-cols-2"
  columnsXl?: string;     // ex: "xl:grid-cols-3"
  children: React.ReactNode;
};

export default function ColumnsLayout({
  className = "",
  gap = "gap-4",
  columnsLg = "lg:grid-cols-2",
  columnsXl = "xl:grid-cols-2",
  children,
}: Props) {
  return (
    <div className={`grid ${gap} ${columnsLg} ${columnsXl} ${className}`.trim()}>
      {children}
    </div>
  );
}

