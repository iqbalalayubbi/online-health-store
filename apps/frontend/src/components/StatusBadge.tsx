import React from "react";

export type OrderStatus = "PENDING" | "APPROVED" | "SHIPPED" | "DELIVERED" | "CANCELLED" | string;

function colorFor(status: OrderStatus) {
  switch (status) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-700";
    case "APPROVED":
      return "bg-cyan-100 text-cyan-700";
    case "SHIPPED":
      return "bg-blue-100 text-blue-700";
    case "DELIVERED":
      return "bg-green-100 text-green-700";
    case "CANCELLED":
      return "bg-red-100 text-red-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

function labelFor(status: OrderStatus) {
  switch (status) {
    case "PENDING":
      return "Menunggu";
    case "APPROVED":
      return "Disetujui";
    case "SHIPPED":
      return "Dikirim";
    case "DELIVERED":
      return "Terkirim";
    case "CANCELLED":
      return "Dibatalkan";
    default:
      return status;
  }
}

export const StatusBadge: React.FC<{ status: OrderStatus; className?: string }> = ({
  status,
  className,
}) => {
  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${colorFor(status)} ${className ?? ""}`}
    >
      {labelFor(status)}
    </span>
  );
};
