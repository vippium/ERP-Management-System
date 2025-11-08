import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "ERP Management System API",
      version: "1.0.3",
      description:
        "Comprehensive API documentation for the ERP Management System built using the MERN Stack.",
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Local Development Server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          required: ["name", "email", "role"],
          properties: {
            _id: { type: "string", example: "64f43f1a42cd9b5a001a9d73" },
            name: { type: "string", example: "John Doe" },
            email: { type: "string", example: "john@example.com" },
            role: { type: "string", example: "admin" },
          },
        },
        Product: {
          type: "object",
          required: ["title", "price", "stock"],
          properties: {
            _id: { type: "string", example: "64f45a1a92cd9b5a001b3a15" },
            title: { type: "string", example: "Wireless Mouse" },
            price: { type: "number", example: 499.99 },
            stock: { type: "number", example: 120 },
            reorderLevel: { type: "number", example: 10 },
          },
        },
        Customer: {
          type: "object",
          required: ["name", "email"],
          properties: {
            _id: { type: "string", example: "64f4ac1a92cd9b5a001b8c19" },
            name: { type: "string", example: "Acme Corporation" },
            email: { type: "string", example: "contact@acme.com" },
            phone: { type: "string", example: "+91 9876543210" },
            address: { type: "string", example: "Mumbai, India" },
          },
        },
        Supplier: {
          type: "object",
          required: ["name", "contact"],
          properties: {
            _id: { type: "string" },
            name: { type: "string", example: "Global Supplies Ltd" },
            contact: { type: "string", example: "+91 9123456789" },
            address: { type: "string", example: "Delhi, India" },
          },
        },
        SaleOrder: {
          type: "object",
          required: ["customer", "totalPrice"],
          properties: {
            _id: { type: "string" },
            customer: { $ref: "#/components/schemas/Customer" },
            products: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  productId: { type: "string" },
                  quantity: { type: "number" },
                },
              },
            },
            totalPrice: { type: "number", example: 15000 },
            status: { type: "string", example: "Completed" },
          },
        },
        PurchaseOrder: {
          type: "object",
          required: ["supplier", "products"],
          properties: {
            _id: { type: "string" },
            supplier: { $ref: "#/components/schemas/Supplier" },
            products: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  productId: { type: "string" },
                  quantity: { type: "number" },
                },
              },
            },
            status: { type: "string", example: "Received" },
          },
        },
        Invoice: {
          type: "object",
          required: ["saleOrder", "amount"],
          properties: {
            _id: { type: "string" },
            saleOrder: { $ref: "#/components/schemas/SaleOrder" },
            amount: { type: "number", example: 12000 },
            issuedDate: {
              type: "string",
              format: "date",
              example: "2025-11-08",
            },
          },
        },
        ReportSummary: {
          type: "object",
          properties: {
            totalSales: { type: "number", example: 120 },
            totalRevenue: { type: "number", example: 450000 },
            topProducts: {
              type: "array",
              items: { $ref: "#/components/schemas/Product" },
            },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);
export { swaggerUi, swaggerSpec };
