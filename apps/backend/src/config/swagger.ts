import { Express, Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc, { Options } from "swagger-jsdoc";

export function setupSwagger(app: Express) {
  const options: Options = {
    definition: {
      openapi: "3.1.0",
      info: {
        title: "Online Health Store API",
        version: "1.0.0",
        description:
          "REST API documentation for Online Health Store. Authentication uses JWT Bearer tokens.",
      },
      servers: [{ url: "/api" }],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
        schemas: {
          LoginRequest: {
            type: "object",
            properties: { email: { type: "string" }, password: { type: "string" } },
            required: ["email", "password"],
          },
          AuthResponse: {
            type: "object",
            properties: {
              token: { type: "string" },
              user: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  email: { type: "string" },
                  role: { type: "string", enum: ["ADMIN", "SELLER", "CUSTOMER"] },
                },
              },
            },
          },
          Product: {
            type: "object",
            properties: {
              id: { type: "string" },
              name: { type: "string" },
              description: { type: "string", nullable: true },
              price: { type: "number" },
              stock: { type: "integer" },
            },
          },
          OrderItem: {
            type: "object",
            properties: {
              id: { type: "string" },
              product: { $ref: "#/components/schemas/Product" },
              quantity: { type: "integer" },
              price: { type: "number" },
            },
          },
          Order: {
            type: "object",
            properties: {
              id: { type: "string" },
              orderNumber: { type: "string" },
              status: {
                type: "string",
                enum: ["PENDING", "APPROVED", "SHIPPED", "DELIVERED", "CANCELLED"],
              },
              totalAmount: { type: "number" },
              items: { type: "array", items: { $ref: "#/components/schemas/OrderItem" } },
            },
          },
          CheckoutRequest: {
            type: "object",
            properties: {
              paymentMethod: {
                type: "string",
                enum: ["CREDIT_CARD", "DEBIT_CARD", "COD"],
              },
              shippingName: { type: "string" },
              shippingPhone: { type: "string" },
              shippingAddress: { type: "string" },
              shippingCity: { type: "string" },
              shippingState: { type: "string" },
              shippingPostalCode: { type: "string" },
              shippingCountry: { type: "string" },
            },
            required: [
              "paymentMethod",
              "shippingName",
              "shippingAddress",
              "shippingCity",
              "shippingState",
              "shippingPostalCode",
              "shippingCountry",
            ],
          },
          FeedbackRequest: {
            type: "object",
            properties: {
              productId: { type: "string" },
              orderId: { type: "string" },
              rating: { type: "integer", minimum: 1, maximum: 5 },
              comment: { type: "string" },
            },
            required: ["productId", "orderId", "rating"],
          },
        },
      },
      tags: [
        { name: "Auth" },
        { name: "Customer" },
        { name: "Orders" },
        { name: "Feedback" },
        { name: "Admin" },
      ],
      paths: {
        "/auth/login": {
          post: {
            tags: ["Auth"],
            summary: "Login",
            requestBody: {
              required: true,
              content: {
                "application/json": { schema: { $ref: "#/components/schemas/LoginRequest" } },
              },
            },
            responses: {
              200: {
                description: "Logged in",
                content: {
                  "application/json": { schema: { $ref: "#/components/schemas/AuthResponse" } },
                },
              },
            },
          },
        },
        "/customer/orders": {
          get: {
            tags: ["Orders"],
            security: [{ bearerAuth: [] }],
            summary: "List my orders",
            responses: {
              200: {
                description: "Orders",
                content: {
                  "application/json": {
                    schema: { type: "array", items: { $ref: "#/components/schemas/Order" } },
                  },
                },
              },
            },
          },
          post: {
            tags: ["Orders"],
            security: [{ bearerAuth: [] }],
            summary: "Checkout cart to create order (PENDING)",
            requestBody: {
              required: true,
              content: {
                "application/json": { schema: { $ref: "#/components/schemas/CheckoutRequest" } },
              },
            },
            responses: {
              201: { description: "Order created" },
            },
          },
        },
        "/customer/orders/{orderId}": {
          delete: {
            tags: ["Orders"],
            security: [{ bearerAuth: [] }],
            summary: "Cancel my order while PENDING",
            parameters: [{ name: "orderId", in: "path", required: true }],
            responses: { 200: { description: "Cancelled" } },
          },
        },
        "/feedback": {
          post: {
            tags: ["Feedback"],
            security: [{ bearerAuth: [] }],
            summary: "Create feedback per product per order",
            requestBody: {
              required: true,
              content: {
                "application/json": { schema: { $ref: "#/components/schemas/FeedbackRequest" } },
              },
            },
            responses: { 201: { description: "Created" } },
          },
        },
        "/admin/orders/{orderId}/ship": {
          post: {
            tags: ["Admin"],
            security: [{ bearerAuth: [] }],
            summary: "Mark order as shipped",
            parameters: [{ name: "orderId", in: "path", required: true }],
            responses: { 200: { description: "Shipped" } },
          },
        },
        "/admin/orders/{orderId}/deliver": {
          post: {
            tags: ["Admin"],
            security: [{ bearerAuth: [] }],
            summary: "Mark order as delivered",
            parameters: [{ name: "orderId", in: "path", required: true }],
            responses: { 200: { description: "Delivered" } },
          },
        },
      },
    },
    apis: [],
  };

  const spec = swaggerJSDoc(options);

  app.get("/api/openapi.json", (_req: Request, res: Response) => {
    res.json(spec);
  });

  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(spec));
}
