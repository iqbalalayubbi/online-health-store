import React from "react";

export const formatIDR = (value: number) =>
  `Rp${Number(value || 0).toLocaleString("id-ID", { minimumFractionDigits: 0 })}`;

export const Money: React.FC<{ value: number; className?: string }> = ({ value, className }) => (
  <span className={className}>{formatIDR(value)}</span>
);
