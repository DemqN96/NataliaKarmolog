"use client";

import { useState } from "react";

interface PhotoCardProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function PhotoCard({ src, alt, className = "", style }: PhotoCardProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={className}
        style={{
          ...style,
          background: "linear-gradient(135deg, #1a1612 0%, #2a2010 50%, #1a1612 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span style={{ color: "#3a3020", fontSize: "3rem" }}>✦</span>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={className}
      style={{ objectFit: "cover", objectPosition: "top", ...style }}
      onError={() => setFailed(true)}
    />
  );
}
