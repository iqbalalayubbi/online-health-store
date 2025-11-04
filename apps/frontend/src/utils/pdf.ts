import type { Order } from "../types/api";
import { apiClient } from "../services/apiClient";

/**
 * Download order PDF from backend
 * Backend handles PDF generation server-side
 */
export async function downloadOrderPDF(order: Order): Promise<void> {
  try {
    const response = await apiClient.get(`/customer/orders/${order.id}/export-pdf`, {
      responseType: "blob",
    });

    const url = URL.createObjectURL(response.data as Blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Invoice-${order.orderNumber}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading PDF:", error);
    throw new Error("Gagal mengunduh laporan PDF");
  }
}

/**
 * Export order as CSV
 */
export function downloadOrderCSV(order: Order): void {
  try {
    let csv = "Online Health Store - Order Export\n";
    csv += `Order Number,${order.orderNumber}\n`;
    csv += `Status,${order.status}\n\n`;
    csv += "Product Name,Quantity,Price,Subtotal\n";

    order.items.forEach((item) => {
      const subtotal = Number(item.price) * item.quantity;
      csv += `"${item.product.name}",${item.quantity},${item.price},${subtotal}\n`;
    });

    csv += `\nTotal Amount,${order.totalAmount}\n`;

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Order-${order.orderNumber}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading CSV:", error);
    throw new Error("Gagal mengunduh file CSV");
  }
}
