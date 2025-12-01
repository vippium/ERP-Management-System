![ERP-Management-System](https://socialify.git.ci/vippium/ERP-Management-System/image?custom_language=Vite&description=1&font=Jost&language=1&name=1&pattern=Transparent&theme=Auto)

## 🧩 Features

### 🔐 Authentication & Authorization
- Secure login & registration with **JWT**
- **Role-based access** (Admin, Sales, Purchase)
- Auto token expiration & session handling

### 📦 Modules
- **Products:** Add, edit, delete, and manage stock
- **Customers & Suppliers:** CRUD operations with CSV import
- **Sales Orders:** Create, edit, delete, and generate invoices
- **Purchase Orders:** Track vendor purchases & generate GRNs
- **Reports:** Revenue trends, sales stats, and purchase summaries
- **Stock Alerts:** Real-time low-stock notifications
- **Company Settings:** Manage logo and business info

### 💻 UI & UX
- **React + Material UI** for clean, responsive design
- **Redux Toolkit** for global state management
- **Axios interceptors** for token handling and loading states
- **Toast notifications** for success/error feedback
- Charts via **Recharts/Chart.js**

---

## 🧠 Tech Stack

| Category | Technology |
|-----------|-------------|
| **Frontend** | React, Redux Toolkit, React Router, Axios, Material UI |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB + Mongoose |
| **Authentication** | JWT + bcrypt |
| **Documentation** | Swagger UI |
| **Deployment** | Vercel (Frontend), Render (Backend) |
| **Extras** | Chart.js, Formik + Yup, React-Hot-Toast |

---

## 🧾 Folder Structure

```
ERP-Management-System/
├── erp-backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   ├── companyController.js
│   │   ├── customerController.js
│   │   ├── customerImportController.js
│   │   ├── productController.js
│   │   ├── purchaseController.js
│   │   ├── reportController.js
│   │   ├── saleController.js
│   │   ├── stockController.js
│   │   ├── supplierController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── errorMiddleware.js
│   │   └── uploadMiddleware.js
│   ├── models/
│   │   ├── companyModel.js
│   │   ├── customerModel.js
│   │   ├── productModel.js
│   │   ├── purchaseModel.js
│   │   ├── saleModel.js
│   │   ├── supplierModel.js
│   │   └── userModel.js
│   ├── package-lock.json
│   ├── package.json
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── companyRoutes.js
│   │   ├── customerRoutes.js
│   │   ├── productRoutes.js
│   │   ├── purchaseRoutes.js
│   │   ├── reportRoutes.js
│   │   ├── saleRoutes.js
│   │   ├── stockRoutes.js
│   │   ├── supplierRoutes.js
│   │   └── userRoutes.js
│   ├── server.js
│   ├── swagger.js
│   ├── uploads/
│   │   └── logo-1762577168035.png
│   └── utils/
│       └── generateInvoice.js
├── erp-frontend/
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── public/
│   │   ├── erp_logo.png
│   │   └── vite.svg
│   ├── README.md
│   ├── src/
│   │   ├── api/
│   │   │   └── api.js
│   │   ├── app/
│   │   │   └── store.js
│   │   ├── App.jsx
│   │   ├── assets/
│   │   │   ├── empty_image.png
│   │   │   └── stock_limit.png
│   │   ├── components/
│   │   │   ├── CSVImport.css
│   │   │   ├── CSVImport.jsx
│   │   │   ├── CSVImportModal.jsx
│   │   │   ├── Layout/
│   │   │   │   ├── layout.css
│   │   │   │   ├── Layout.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   └── Topbar.jsx
│   │   │   ├── loader.css
│   │   │   ├── Loader.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── features/
│   │   │   ├── company/
│   │   │   │   ├── company.css
│   │   │   │   └── CompanySettings.jsx
│   │   │   ├── customers/
│   │   │   │   ├── CustomerForm.jsx
│   │   │   │   ├── CustomerList.jsx
│   │   │   │   └── customerSlice.js
│   │   │   ├── products/
│   │   │   │   ├── ProductForm.jsx
│   │   │   │   ├── ProductList.jsx
│   │   │   │   └── productSlice.js
│   │   │   ├── purchases/
│   │   │   │   ├── PurchaseForm.jsx
│   │   │   │   ├── PurchaseList.jsx
│   │   │   │   └── purchaseSlice.js
│   │   │   ├── reports/
│   │   │   │   └── Reports.jsx
│   │   │   ├── sales/
│   │   │   │   ├── SaleForm.jsx
│   │   │   │   ├── SaleList.jsx
│   │   │   │   └── saleSlice.js
│   │   │   ├── stock/
│   │   │   │   └── StockAlerts.jsx
│   │   │   ├── suppliers/
│   │   │   │   ├── SupplierForm.jsx
│   │   │   │   ├── SupplierList.jsx
│   │   │   │   └── supplierSlice.js
│   │   │   ├── ui/
│   │   │   │   └── uiSlice.js
│   │   │   └── users/
│   │   │       ├── UserManagement.jsx
│   │   │       ├── users.css
│   │   │       └── userSlice.js
│   │   ├── hooks/
│   │   │   └── useDebounce.js
│   │   ├── index.css
│   │   ├── main.jsx
│   │   ├── pages/
│   │   │   ├── auth.css
│   │   │   ├── Dashboard.jsx
│   │   │   └── Login.jsx
│   │   └── styles/
│   │       ├── buttons.css
│   │       ├── dashboard.css
│   │       ├── erp-theme.css
│   │       ├── forms.css
│   │       └── tables.css
│   └── vite.config.js
├── jsconfig.json
├── LICENSE
└── README.md
```

---

## 🚀 Live Links

- **Frontend (Vercel):** https://erp-management-system-eta.vercel.app
- **Backend (Render):** https://erp-backend-w1x2.onrender.com
- **API Documentation (Swagger):** https://erp-backend-w1x2.onrender.com/api-docs

---

## 🧪 Demo Credentials

- **Email/Username:** vipinpr@admin.com
- **Password:** password123

---


## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/erp-management-system.git
cd erp-management-system
```

### 2️⃣ Backend Setup
```bash
cd backend
npm install
npm run dev
```

- Setup Environment Variables (.env) by using sample file (.env.example)
---

## 🧩 Key Highlights

- Role-based protected routes (Admin, Sales, Purchase)
- JWT-secured REST APIs
- Redux-based global UI state and loading management
- Integrated Swagger UI documentation
- Clean modular Express + React architecture
- Scalable, production-ready deployment setup

---

## 🏆 License

This project is licensed under the [MIT License](https://github.com/vippium/ERP-Management-System/blob/main/LICENSE) — feel free to use, modify, and distribute.
