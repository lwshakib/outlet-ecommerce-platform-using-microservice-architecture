# Outlet Ecommerce Platform Using Microservice Architecture

A modern e-commerce platform built with React, TypeScript, and Nx monorepo architecture. This project implements a microservices-based approach with separate portals for customers, admins, and companies.

<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>

## 🚀 Project Overview

This is a full-stack e-commerce platform designed with a microservice architecture, featuring multiple applications for different user roles:

- **Outlet Web** - Customer-facing e-commerce storefront
- **Admin Portal** - Administrative dashboard for managing the platform
- **Company Portal** - Portal for company/vendor management

## 📦 Applications

### Outlet Web (Customer Portal)

The main customer-facing e-commerce application with the following features:

#### Features

- **Home Page**

  - Hero slider with auto-rotating banners
  - Latest Collections section
  - Best Sellers section
  - Product grid with responsive design

- **Product Management**

  - Product detail pages with image galleries
  - Product options (color, size, quantity)
  - Related products section ("Customers also bought")
  - Product search and filtering

- **Shopping Cart**

  - Add/remove items
  - Quantity management
  - Price calculations (subtotal, shipping, tax)
  - Cart persistence

- **Checkout & Orders**

  - Multi-step checkout process
  - Payment methods (Stripe, Cash on Delivery)
  - Order placement
  - Order tracking with visual progress indicators
  - Order history page

- **User Authentication**

  - Sign in page
  - Create account page
  - User session management

- **UI Components**
  - Responsive header with navigation
  - Footer with links and newsletter
  - Modern, clean design with Tailwind CSS
  - Luxury branding with custom typography

#### Tech Stack

- React 19
- React Router 7
- TypeScript
- Tailwind CSS
- Headless UI
- Heroicons
- Vite

### Admin Portal

Administrative dashboard for managing the e-commerce platform (in development).

### Company Portal

Portal for companies/vendors to manage their products and orders (in development).

## 🛠️ Tech Stack

### Frontend

- **React** 19.0.0
- **TypeScript** 5.9.2
- **React Router** 7.2.0
- **Tailwind CSS** 3.4.3
- **Headless UI** 2.2.9
- **Heroicons** 2.2.0
- **Vite** 7.0.0

### Development Tools

- **Nx** 22.1.3 - Monorepo management
- **Vitest** 4.0.0 - Testing framework
- **Playwright** 1.36.0 - E2E testing
- **ESLint** 9.8.0 - Code linting
- **Prettier** 2.6.2 - Code formatting

## 📁 Project Structure

```
outlet-ecommerce-platform-using-microservice-architecture/
├── apps/
│   ├── outlet-web/              # Customer-facing e-commerce app
│   │   ├── src/
│   │   │   ├── app/             # App configuration
│   │   │   ├── components/      # Reusable components
│   │   │   │   ├── Footer.tsx
│   │   │   │   ├── HeroSlider.tsx
│   │   │   │   └── OutletHeader.tsx
│   │   │   └── pages/           # Page components
│   │   │       ├── Home.tsx
│   │   │       ├── ProductDetail.tsx
│   │   │       ├── Cart.tsx
│   │   │       ├── SignIn.tsx
│   │   │       ├── CreateAccount.tsx
│   │   │       ├── PlaceOrder.tsx
│   │   │       ├── OrderSuccess.tsx
│   │   │       └── Orders.tsx
│   │   ├── index.html
│   │   └── vite.config.mts
│   ├── admin-portal/            # Admin dashboard
│   ├── company-portal/          # Company/vendor portal
│   └── *-e2e/                   # E2E tests for each app
├── package.json
├── tsconfig.base.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v20 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd outlet-ecommerce-platform-using-microservice-architecture
```

2. Install dependencies:

```bash
npm install
```

### Development

Run the development server for the outlet-web app:

```bash
npx nx serve outlet-web
```

Or use the Nx run command:

```bash
npx nx run @outlet-ecommerce-platform-using-microservice-architecture/outlet-web:dev
```

The app will be available at `http://localhost:4200`

#### Run All Applications

To run all applications simultaneously:

```bash
npx nx run-many --target=dev --all
```

#### Run Individual Applications

```bash
# Run outlet-web
npx nx run @outlet-ecommerce-platform-using-microservice-architecture/outlet-web:dev

# Run admin-portal
npx nx run @outlet-ecommerce-platform-using-microservice-architecture/admin-portal:dev

# Run company-portal
npx nx run @outlet-ecommerce-platform-using-microservice-architecture/company-portal:dev
```

### Build

Create a production build:

```bash
npx nx build outlet-web
```

### Testing

Run unit tests:

```bash
npx nx test outlet-web
```

Run E2E tests:

```bash
npx nx e2e outlet-web-e2e
```

## 📝 Available Commands

### Run Tasks

```bash
# Serve outlet-web app
npx nx serve outlet-web

# Build outlet-web app
npx nx build outlet-web

# Test outlet-web app
npx nx test outlet-web

# Lint outlet-web app
npx nx lint outlet-web
```

### View Project Graph

```bash
npx nx graph
```

### Show Project Details

```bash
npx nx show project outlet-web
```

## 🎨 Features in Detail

### Outlet Web Features

#### Navigation

- Responsive header with logo
- Navigation menu (Home, Collections, About, Contact, Company, Stores)
- Search functionality
- Shopping cart icon with item count
- User authentication links

#### Product Pages

- Product listing with grid layout
- Product detail pages with:
  - Image gallery with thumbnails
  - Product information
  - Color and size selection
  - Quantity selector
  - Add to cart functionality
  - Related products section

#### Shopping Experience

- Shopping cart with item management
- Checkout process with:
  - Contact information
  - Shipping address
  - Payment method selection (Stripe, Cash on Delivery)
  - Order summary
- Order confirmation page
- Order tracking with visual progress indicators

#### User Account

- Sign in page
- Create account page
- Order history with detailed tracking

## 🎯 Routes

### Outlet Web Routes

- `/` - Home page with hero slider and product collections
- `/product/:productId` - Product detail page
- `/cart` - Shopping cart
- `/place-order` - Checkout page
- `/order-success` - Order confirmation page
- `/orders` - Order history and tracking
- `/sign-in` - User sign in
- `/create-account` - User registration

## 🏗️ Architecture

This project uses:

- **Nx Monorepo** - For managing multiple applications in a single repository
- **Microservices Architecture** - Separate applications for different user roles
- **Component-Based Design** - Reusable React components
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework

## 📦 Dependencies

Key dependencies are managed at the root level and shared across applications:

- React ecosystem (React, React DOM, React Router)
- UI libraries (Headless UI, Heroicons)
- Styling (Tailwind CSS, PostCSS, Autoprefixer)
- Build tools (Vite, Nx)
- Testing (Vitest, Playwright, Testing Library)

## 🔧 Configuration

### Tailwind CSS

Tailwind CSS is configured for all applications. Configuration files:

- `tailwind.config.js` - Per application
- `postcss.config.js` - PostCSS configuration

### TypeScript

TypeScript configuration is shared via:

- `tsconfig.base.json` - Base configuration
- `tsconfig.json` - Per application overrides

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## 📄 License

MIT

## 🔗 Useful Links

- [Nx Documentation](https://nx.dev)
- [React Router Documentation](https://reactrouter.com)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [Headless UI Documentation](https://headlessui.com)

## 📞 Support

For issues and questions, please open an issue in the repository.

---

Built with ❤️ using Nx, React, and TypeScript
