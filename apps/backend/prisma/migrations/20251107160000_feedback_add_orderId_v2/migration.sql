-- Add nullable orderId to Feedback to support per-order reviews
ALTER TABLE `Feedback`
  ADD COLUMN `orderId` VARCHAR(191) NULL;

-- Foreign key to Order(id)
ALTER TABLE `Feedback`
  ADD CONSTRAINT `Feedback_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- Unique per user/product/order (NULL orderId values are treated as distinct in MySQL)
CREATE UNIQUE INDEX `Feedback_userId_productId_orderId_key` ON `Feedback`(`userId`, `productId`, `orderId`);
