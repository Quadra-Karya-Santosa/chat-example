
Certainly! Below is a basic structure for a Markdown document outlining a React.js project using TypeScript:

```markdown
# React.js TypeScript Project

This document provides an overview of the structure and setup of a React.js project using TypeScript.
```
## Project Structure
```
project-root/
├── src/
│   ├── _layouts/
│   │   ├── header.layout.tsx
│   │   ├── footer.layout.tsx
│   │   └── ...
│   ├── _store/
│   │   ├── auth/
│   │   │   └── index.ts
│   │   ├── account-configs/
│   │   │   └── index.ts
│   │   ├── cookieStore.js
│   │   ├── index.ts
│   │   └── ...
│   ├── _utils/
│   │   ├── currency-formatter.ts
│   │   ├── debounce.ts
│   │   └── ...
│   ├── assets/
│   │   ├── images/
│   │   │   └── logo.webp
│   │   └── ...
│   ├── components/
│   │   ├── button/
│   │   │   ├── prop-types.ts
│   │   │   └── index.tsx
│   │   ├── input/
│   │   │   ├── prop-types.ts
│   │   │   └── index.tsx
│   │   └── ...
│   ├── data/
│   │   ├── data1.ts
│   │   └── ...
│   ├── interfaces/
│   │   ├── home.interfaces.ts
│   │   ├── profile.interfaces.ts
│   │   └── ...
│   ├── pages/
│   │   ├── home/
│   │   │   ├── sections
│   │   │   │   └── jumbotron.section.tsx
│   │   │   ├── useHome.hooks.tsx
│   │   │   └── home.page.tsx
│   │   ├── profile/
│   │   │   ├── sections
│   │   │   │   ├── profile-information.section.tsx
│   │   │   │   └── tabs.section.tsx
│   │   │   ├── useProfile.hooks.tsx
│   │   │   └── profile.page.tsx
│   │   └── ...
│   ├── routes/
│   │   ├── index.tsx
│   │   ├── route-config.tsx
│   │   └── ...
│   ├── services/
│   │   ├── modules/
│   │   │   ├── module1
│   │   │   │   └── service.tsx
│   │   │   ├── module2
│   │   │   │   └── service.tsx
│   │   ├── api.ts
│   │   ├── errorHandler.ts
│   │   └── ...
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   └── ...
├── public/
│   ├── index.html
│   └── ...
├── package.json
├── tsconfig.json
└── ...
```
FAQ:
- How to fetch data:
	1. Create service inside `/src/services/modules/[modulesName]/index.tsx`
	2. Use RTK Query that already wrapped `/src/services/api.ts`
	3. Use build.mutation for DELETE, POST, PATCH, PUT
	4. Use build.query for GET
	5. Call wrapped mutation or query from page level like you call hooks
	6. **You don't need to re-setup authorization token inside service module!**
	7. Read the documentation https://redux-toolkit.js.org/rtk-query/overview
- What should I do if i need to store data
	1. **Important! Don't store all data**
	2. **Just store if you need to re-use the data from other modules OR multiple components OR you don't need to refetch**
	3. Create store `/src/store/[modulesName]/index.tsx`
	4. Register store that you create inside combine reducer `/src/store/index.ts`
	5. Read the documentation https://redux-toolkit.js.org/api/createslice

## Project Setup

### 1. Initialize project

```bash
yarn
```

### 2. Start the development server

```bash
yarn dev
```

## Dependencies

The primary dependencies for this project are:

- **React**: JavaScript library for building user interfaces.
- **TypeScript**: A typed superset of JavaScript that compiles to plain JavaScript.
- **react-scripts**: Toolchain for creating React applications with no configuration.

## Getting Started

1. **Component Development**: Develop your reusable components inside the `src/components` directory.
2. **Entry Point**: The entry point of your application is `src/main.tsx`.
3. **Run the Project**: Start the development server using `yarn dev`.
4. **Build**: Build your project for production using `yarn build`.

Happy coding!