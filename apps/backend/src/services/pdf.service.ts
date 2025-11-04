import PDFDocument from "pdfkit";
import { Readable } from "stream";
import type { Order, OrderItem, Payment, Shipment, Product } from "@prisma/client";

interface OrderWithRelations extends Order {
  items: (OrderItem & {
    product: Product;
  })[];
  payment?: Payment | null;
  shipment?: Shipment | null;
}

/**
 * Generate PDF stream for order invoice with proper table formatting
 */
export async function generateOrderPDF(order: OrderWithRelations): Promise<Readable> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        margin: 40,
        bufferPages: true,
      });

      const chunks: Buffer[] = [];
      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => {
        resolve(Readable.from(Buffer.concat(chunks)));
      });
      doc.on("error", reject);

      // Constants
      const pageWidth = doc.page.width;
      const pageHeight = doc.page.height;
      const margin = 40;
      const contentWidth = pageWidth - 2 * margin;

      // Helper functions
      const formatCurrency = (value: number | string | { toNumber(): number }): string => {
        const numValue =
          typeof value === "object" && "toNumber" in value ? value.toNumber() : Number(value);
        return new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 0,
        }).format(numValue);
      };

      const getStatusLabel = (status: string): string => {
        const statusMap: Record<string, string> = {
          DELIVERED: "Terkirim",
          SHIPPED: "Dikirim",
          APPROVED: "Disetujui",
          PENDING: "Menunggu",
          CANCELLED: "Dibatalkan",
        };
        return statusMap[status] || status;
      };

      const getPaymentMethod = (method: string): string => {
        const methodMap: Record<string, string> = {
          COD: "Bayar di Tempat (COD)",
          DEBIT_CARD: "Kartu Debit",
          CREDIT_CARD: "Kartu Kredit",
        };
        return methodMap[method] || method;
      };

      // ===== HEADER =====
      doc.fontSize(20).font("Helvetica-Bold").text("INVOICE", margin, margin);
      doc
        .fontSize(10)
        .font("Helvetica")
        .text("Online Health Store", margin, margin + 25);

      // Order Info Box (Right aligned)
      const infoBoxX = pageWidth - margin - 180;
      const infoBoxY = margin;
      doc
        .fontSize(9)
        .font("Helvetica-Bold")
        .text(`Order #: ${order.orderNumber}`, infoBoxX, infoBoxY);
      doc
        .fontSize(8)
        .font("Helvetica")
        .text(
          `Date: ${new Date(order.createdAt).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}`,
          infoBoxX,
          infoBoxY + 15,
        );
      doc.text(`Status: ${getStatusLabel(order.status)}`, infoBoxX, infoBoxY + 28);

      // Divider line
      doc
        .strokeColor("#cccccc")
        .lineWidth(0.5)
        .moveTo(margin, margin + 55)
        .lineTo(pageWidth - margin, margin + 55)
        .stroke();

      let currentY = margin + 70;

      // ===== CUSTOMER & SHIPPING INFO =====
      // Left column (Customer Info)
      doc.fontSize(9).font("Helvetica-Bold").text("PENGIRIM KE:", margin, currentY);
      doc
        .fontSize(8)
        .font("Helvetica")
        .text(order.shippingName, margin, currentY + 15);
      doc.text(order.shippingCity, margin, currentY + 28);
      doc.text(`${order.shippingState}, ${order.shippingPostalCode}`, margin, currentY + 41);
      doc.text(order.shippingCountry, margin, currentY + 54);

      // Right column (Payment & Shipment Info)
      const rightColX = pageWidth - margin - 180;
      doc.fontSize(9).font("Helvetica-Bold").text("INFORMASI PEMBAYARAN", rightColX, currentY);

      if (order.payment) {
        doc
          .fontSize(8)
          .font("Helvetica")
          .text(`Metode: ${getPaymentMethod(order.payment.method)}`, rightColX, currentY + 15);
        doc.text(
          `Status: ${order.payment.status === "COMPLETED" ? "✓ SELESAI" : "MENUNGGU"}`,
          rightColX,
          currentY + 28,
        );
        doc.text(`Jumlah: ${formatCurrency(order.payment.amount)}`, rightColX, currentY + 41);
      }

      if (order.shipment?.courier) {
        doc
          .fontSize(9)
          .font("Helvetica-Bold")
          .text("PENGIRIMAN", rightColX, currentY + 60);
        doc
          .fontSize(8)
          .font("Helvetica")
          .text(`Kurir: ${order.shipment.courier}`, rightColX, currentY + 75);
        if (order.shipment.trackingNumber) {
          doc.text(`Resi: ${order.shipment.trackingNumber}`, rightColX, currentY + 88);
        }
      }

      currentY += 110;

      // ===== TABLE HEADER =====
      const col1X = margin; // Produk
      const col1W = 200;
      const col2X = col1X + col1W + 10; // Qty
      const col2W = 50;
      const col3X = col2X + col2W + 10; // Harga
      const col3W = 80;
      const col4X = col3X + col3W + 10; // Subtotal
      const col4W = contentWidth - col1W - col2W - col3W - 30;

      // Header text (simple, no background)
      doc.fontSize(9).font("Helvetica-Bold").fillColor("#000000");
      doc.text("PRODUK", col1X, currentY);
      doc.text("QTY", col2X, currentY, { width: col2W, align: "center" });
      doc.text("HARGA", col3X, currentY, { width: col3W, align: "right" });
      doc.text("SUBTOTAL", col4X, currentY, { width: col4W, align: "right" });

      // Top border line
      doc
        .strokeColor("#000000")
        .lineWidth(1)
        .moveTo(margin, currentY + 12)
        .lineTo(pageWidth - margin, currentY + 12)
        .stroke();

      currentY += 20;

      // ===== TABLE ROWS =====
      doc.fontSize(8).font("Helvetica");
      const subtotal = order.items.reduce(
        (sum, item) => sum + Number(item.price) * item.quantity,
        0,
      );

      order.items.forEach((item, index) => {
        const itemSubtotal = Number(item.price) * item.quantity;

        // Content (simple, no background)
        doc.fillColor("#000000");
        doc.text(item.product.name, col1X, currentY, { width: col1W - 5 });
        doc.text(item.quantity.toString(), col2X, currentY, { width: col2W, align: "center" });
        doc.text(formatCurrency(item.price), col3X, currentY, { width: col3W, align: "right" });
        doc.text(formatCurrency(itemSubtotal), col4X, currentY, {
          width: col4W,
          align: "right",
        });

        // Simple divider line between rows
        doc
          .strokeColor("#e0e0e0")
          .lineWidth(0.5)
          .moveTo(margin, currentY + 12)
          .lineTo(pageWidth - margin, currentY + 12)
          .stroke();

        currentY += 15;

        // Check if we need a new page
        if (currentY > pageHeight - 120) {
          doc.addPage();
          currentY = margin;
        }
      });

      // Bottom border of table
      doc
        .strokeColor("#000000")
        .lineWidth(1)
        .moveTo(margin, currentY)
        .lineTo(pageWidth - margin, currentY)
        .stroke();

      currentY += 15;

      // ===== SUMMARY SECTION =====
      // Position summary on right side
      const summaryX = pageWidth - margin - 200;
      const summaryStartY = currentY;

      doc.fontSize(9).font("Helvetica");
      doc.fillColor("#000000");
      doc.text("Subtotal", summaryX, summaryStartY);
      doc.text(formatCurrency(subtotal), summaryX + 110, summaryStartY, {
        align: "right",
        width: 80,
      });

      doc.text("Biaya Pengiriman", summaryX, summaryStartY + 15);
      doc.text(
        formatCurrency(Number(order.totalAmount) - subtotal),
        summaryX + 110,
        summaryStartY + 15,
        {
          align: "right",
          width: 80,
        },
      );

      // Total (simple format, no background)
      doc.fontSize(10).font("Helvetica-Bold");
      doc.text("TOTAL", summaryX, summaryStartY + 35);
      doc.text(formatCurrency(order.totalAmount), summaryX + 110, summaryStartY + 35, {
        align: "right",
        width: 80,
      });

      currentY = summaryStartY + 55;

      // ===== FOOTER =====
      // Add footer text below summary, without creating new page
      doc
        .fontSize(7)
        .font("Helvetica")
        .fillColor("#999999")
        .text(
          "Terima kasih telah berbelanja di Online Health Store. Invoice ini adalah bukti transaksi digital.",
          margin,
          currentY + 15,
          { align: "center", width: contentWidth },
        );

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}
