"use client";

import React, { useMemo } from "react";
import dynamic from "next/dynamic";
// import Quill from "react-quill";
// const DynamicQuill = dynamic(() => import("react-quill-new"), { ssr: false });

import "react-quill/dist/quill.snow.css";

interface Props {
  onChange: (value: string) => void;
  value?: string;
}

export const Editor = ({ onChange, value }: Props) => {
  const DynamicQuill = useMemo(
    () => dynamic(() => import("react-quill-new"), { ssr: false }),
    []
  );

  if (!document) return <textarea id="editor-fallback" />;
  return (
    <div className="bg-white">
      <DynamicQuill theme="snow" value={value} onChange={onChange} />
    </div>
  );
};
