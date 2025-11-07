import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import { ensureAdminSeed } from "../src/services/auth.service";
import { hashPassword } from "../src/utils/password";
import { OrderStatus, PaymentMethod, PaymentStatus, Prisma } from "@prisma/client";

async function clearDatabase() {
  // Delete in dependency-safe order
  await prisma.authToken.deleteMany();
  await prisma.guestBookEntry.deleteMany();
  await prisma.feedback.deleteMany();
  await prisma.shipment.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.shop.deleteMany();
  await prisma.shopCreationRequest.deleteMany();
  await prisma.sellerProfile.deleteMany();
  await prisma.customerProfile.deleteMany();
  await prisma.adminProfile.deleteMany();
  await prisma.user.deleteMany();
}

async function seed() {
  // 1) Admin
  const admin = await ensureAdminSeed({
    email: "admin@onlinehealth.local",
    password: "Admin123!",
    fullName: "Default Admin",
  });

  // 2) Sellers + Shops
  const sellerPlainPassword = "Seller123!";
  const sellerHashed = await hashPassword(sellerPlainPassword);

  const seller1User = await prisma.user.create({
    data: {
      email: "seller1@onlinehealth.local",
      passwordHash: sellerHashed,
      role: "SELLER",
      sellerProfile: { create: { fullName: "Seller One", phoneNumber: "081234567890" } },
    },
    include: { sellerProfile: true },
  });

  const seller2User = await prisma.user.create({
    data: {
      email: "seller2@onlinehealth.local",
      passwordHash: sellerHashed, // same password for convenience
      role: "SELLER",
      sellerProfile: { create: { fullName: "Seller Two", phoneNumber: "089876543210" } },
    },
    include: { sellerProfile: true },
  });

  const shopA = await prisma.shop.create({
    data: {
      name: "Healthy Life Store",
      description: "Toko perlengkapan kesehatan terpercaya",
      ownerId: seller1User.sellerProfile!.id,
      managerId: seller1User.id,
      isActive: true,
    },
  });

  const shopB = await prisma.shop.create({
    data: {
      name: "Wellness Mart",
      description: "Produk kesehatan dan kebugaran",
      ownerId: seller2User.sellerProfile!.id,
      managerId: seller2User.id,
      isActive: true,
    },
  });

  // 3) Categories
  const [catSupp, catDevice] = await Promise.all([
    prisma.category.create({
      data: { name: "Suplemen", description: "Vitamin & suplemen", shopId: shopA.id },
    }),
    prisma.category.create({
      data: { name: "Perangkat Medis", description: "Alat cek & terapi", shopId: shopA.id },
    }),
  ]);

  const [catFitness, catCare] = await Promise.all([
    prisma.category.create({
      data: { name: "Fitness", description: "Olahraga & kebugaran", shopId: shopB.id },
    }),
    prisma.category.create({
      data: { name: "Perawatan", description: "Perawatan diri & kesehatan", shopId: shopB.id },
    }),
  ]);

  // 4) Products
  const products = await prisma.$transaction([
    prisma.product.create({
      data: {
        name: "Vitamin C 1000mg",
        description: "Meningkatkan daya tahan tubuh",
        price: 75000,
        stock: 120,
        categoryId: catSupp.id,
        sellerId: seller1User.sellerProfile!.id,
        shopId: shopA.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Termometer Digital",
        description: "Akurasi tinggi, mudah digunakan",
        price: 55000,
        stock: 80,
        categoryId: catDevice.id,
        sellerId: seller1User.sellerProfile!.id,
        shopId: shopA.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Matras Yoga Premium",
        description: "Anti slip, nyaman",
        price: 120000,
        stock: 60,
        categoryId: catFitness.id,
        sellerId: seller2User.sellerProfile!.id,
        shopId: shopB.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Alat Pijat Leher",
        description: "Meredakan pegal & stres",
        price: 185000,
        stock: 40,
        categoryId: catCare.id,
        sellerId: seller2User.sellerProfile!.id,
        shopId: shopB.id,
      },
    }),
  ]);

  // 5) Customers
  const customerPlainPassword = "Customer123!";
  const customerHashed = await hashPassword(customerPlainPassword);

  const customer1 = await prisma.user.create({
    data: {
      email: "customer1@onlinehealth.local",
      passwordHash: customerHashed,
      role: "CUSTOMER",
      customerProfile: {
        create: { fullName: "Customer One", phoneNumber: "0811111111", defaultCity: "Jakarta" },
      },
    },
    include: { customerProfile: true },
  });

  const customer2 = await prisma.user.create({
    data: {
      email: "customer2@onlinehealth.local",
      passwordHash: customerHashed,
      role: "CUSTOMER",
      customerProfile: {
        create: { fullName: "Customer Two", phoneNumber: "0822222222", defaultCity: "Bandung" },
      },
    },
    include: { customerProfile: true },
  });

  // 6) Orders (varied statuses)
  const [p1, p2, p3, p4] = products;

  // Order A: PENDING
  await prisma.order.create({
    data: {
      orderNumber: "ORD-0001",
      customerId: customer1.customerProfile!.id,
      status: OrderStatus.PENDING,
      totalAmount: new Prisma.Decimal(75000 + 55000),
      shippingName: "Customer One",
      shippingPhone: "0811111111",
      shippingAddress: "Jl. Mawar No. 1",
      shippingCity: "Jakarta",
      shippingState: "DKI Jakarta",
      shippingPostalCode: "10110",
      shippingCountry: "ID",
      items: {
        create: [
          { productId: p1.id, quantity: 1, price: p1.price },
          { productId: p2.id, quantity: 1, price: p2.price },
        ],
      },
      payment: {
        create: {
          method: PaymentMethod.COD,
          status: PaymentStatus.PENDING,
          amount: new Prisma.Decimal(75000 + 55000),
        },
      },
    },
  });

  // Order B: SHIPPED + shipment
  await prisma.order.create({
    data: {
      orderNumber: "ORD-0002",
      customerId: customer1.customerProfile!.id,
      status: OrderStatus.SHIPPED,
      totalAmount: new Prisma.Decimal(120000),
      shippingName: "Customer One",
      shippingPhone: "0811111111",
      shippingAddress: "Jl. Melati No. 2",
      shippingCity: "Jakarta",
      shippingState: "DKI Jakarta",
      shippingPostalCode: "10120",
      shippingCountry: "ID",
      items: { create: [{ productId: p3.id, quantity: 1, price: p3.price }] },
      payment: {
        create: {
          method: PaymentMethod.CREDIT_CARD,
          status: PaymentStatus.COMPLETED,
          amount: new Prisma.Decimal(120000),
        },
      },
      shipment: {
        create: {
          courier: "JNE",
          trackingNumber: "TRK-0002",
          shippedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          address: "Jl. Melati No. 2",
          city: "Jakarta",
          state: "DKI Jakarta",
          postalCode: "10120",
          country: "ID",
        },
      },
    },
  });

  // Order C: DELIVERED + feedback
  const orderC = await prisma.order.create({
    data: {
      orderNumber: "ORD-0003",
      customerId: customer2.customerProfile!.id,
      status: OrderStatus.DELIVERED,
      totalAmount: new Prisma.Decimal(185000 + 55000),
      shippingName: "Customer Two",
      shippingPhone: "0822222222",
      shippingAddress: "Jl. Kenanga No. 3",
      shippingCity: "Bandung",
      shippingState: "Jawa Barat",
      shippingPostalCode: "40111",
      shippingCountry: "ID",
      items: {
        create: [
          { productId: p4.id, quantity: 1, price: p4.price },
          { productId: p2.id, quantity: 1, price: p2.price },
        ],
      },
      payment: {
        create: {
          method: PaymentMethod.DEBIT_CARD,
          status: PaymentStatus.COMPLETED,
          amount: new Prisma.Decimal(185000 + 55000),
        },
      },
      shipment: {
        create: {
          courier: "SiCepat",
          trackingNumber: "TRK-0003",
          shippedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
          deliveredAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          address: "Jl. Kenanga No. 3",
          city: "Bandung",
          state: "Jawa Barat",
          postalCode: "40111",
          country: "ID",
        },
      },
    },
  });

  // Feedback for delivered order items by customer2 (now linked per order) using raw insert (orderId column not in TS client yet)
  await prisma.$executeRawUnsafe(
    `INSERT INTO Feedback (id, userId, productId, orderId, rating, comment, createdAt, updatedAt)
     VALUES (UUID(), ?, ?, ?, ?, ?, NOW(), NOW()),
            (UUID(), ?, ?, ?, ?, ?, NOW(), NOW())`,
    customer2.id,
    p4.id,
    orderC.id,
    5,
    "Mantap, pijatannya enak",
    customer2.id,
    p2.id,
    orderC.id,
    4,
    "Termometer bagus",
  );

  // Guestbook entries
  await prisma.guestBookEntry.createMany({
    data: [
      { name: "Budi", email: "budi@example.com", message: "Situsnya keren!" },
      { name: "Sari", message: "Belanjanya mudah dan cepat" },
    ],
  });

  return {
    admin,
    sellers: [seller1User, seller2User],
    customers: [customer1, customer2],
    products,
  };
}

async function main() {
  console.log("⚠️  Clearing existing data...");
  await clearDatabase();
  console.log("🧪 Seeding demo data...");
  await seed();
  console.log("✅ Seed completed");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
