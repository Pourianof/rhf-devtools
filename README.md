# RHF DevTools

Developer tool for debugging and inspecting React Hook Form instances in React applications.

## Installation

### 1) Install package

```bash
npm i rhf-devtools
```

### 2) Enable Tailwind source scanning (required)

#### Tailwind v4 requirement: use @source

In your Tailwind CSS entry file (commonly src/index.css, src/app.css, or whatever your project imports):

```css
@import "tailwindcss";
@source "../node_modules/rhf-devtools/dist";
```

If your package exports utilities from a different folder, update the @source path to match your package layout.

#### Tailwind v3

Add packages source files to your `tailwind.config.js` configs:

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // your other sources
    "./node_modules/rhf-devtools/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};
```

## Quick Start

### 1. Add the provider to your layout

```tsx
// app/layout.tsx
import { RhfDevTools } from "rhf-devTools";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <RhfDevTools>{children}</RhfDevTools>
      </body>
    </html>
  );
}
```

### 2. Register your forms

```tsx
// Any component with a form
import { useForm } from "react-hook-form";
import { useRhfDevTool } from "rhf-devTools";

export function MyForm() {
  const form = useForm();
  useRhfDevTool(form, "MyForm");

  return <form>{/* your fields */}</form>;
}
```

### Next.js Guide

For next.js and server-rendering frameworks, you need a `use-client` component to render `<RhfDevtools>...</RhfDevtools` component.

```ts
"use client";

export function ClientRhfDevtools({children}:{children:RactNode}){
  return <RhfDevtools>{children}</RhfDevtools>;
}
```

## API

### RhfDevTools

Provider component that wraps your application.

| Prop                         | Type      | Default | Description                                             |
| ---------------------------- | --------- | ------- | ------------------------------------------------------- |
| `displayOnlyIfAnyFormExists` | `boolean` | `false` | Only show devtools when at least one form is registered |

### useRhfDevTool

Hook to register a form instance with the dev tools.

```tsx
useRhfDevTool(formInstance: UseFormReturn, formName?: string)
```

| Param          | Type                | Description               |
| -------------- | ------------------- | ------------------------- |
| `formInstance` | `UseFormReturn`     | React Hook Form instance  |
| `formName`     | `string` (optional) | Display name for the form |

## Features

- Real-time form state inspection
- Nested object and array value viewer (expandable tree)
- Inline value editing (double-click)
- Save/load form states as samples (localStorage)
- Form validation trigger and field clearing
- Dark mode support
- Development mode only (no production impact)

## The Importance of formName (Form Identifier)

The `formName` you provide to `useRhfDevTool` serves as a unique identifier for each form instance. This identifier is critical for two main reasons:

### 1. Sample Management Isolation

Each form's saved samples are stored separately in localStorage using the `formName` as the storage key. This ensures:

- Samples from a login form don't appear in a registration form
- Different forms on different pages maintain their own sample lists
- No accidental cross-contamination of form data between unrelated forms

```tsx
// Samples for these forms are stored completely separately
useRhfDevTool(loginForm, "LoginForm");
useRhfDevTool(registrationForm, "RegistrationForm");
useRhfDevTool(checkoutForm, "CheckoutForm");
```

### 2. Persistent Sample Storage

When you save a sample, it is stored in localStorage under a composite key that combines the `formName` with the sample data:

```json
{
  "LoginForm": {
    "samples": [...],
    "activeSampleId": "..."
  },
  "RegistrationForm": {
    "samples": [...],
    "activeSampleId": "..."
  }
}
```

This persistence is lost if you change the `formName` of a registered form. Existing saved samples will not be accessible under a different name.

### Best Practices for formName

- Use stable, unique names that won't change between sessions
- Avoid dynamic values like `Date.now()` or random strings
- Use descriptive names that reflect the form's purpose (e.g., `"ProductEditForm"`, `"UserProfileForm"`)
- Keep names consistent across page reloads for persistent sample access

### Example

```tsx
// Good - stable and descriptive
useRhfDevTool(form, "ProductEditForm");

// Bad - changes every time, samples will be lost
useRhfDevTool(form, `Form_${Date.now()}`);

// Bad - not descriptive enough
useRhfDevTool(form, "Form1");
```

## Usage Example

```tsx
import { RhfDevTools, useRhfDevTool } from "@/components/rhf-dev-tools";

function ProductForm() {
  const form = useForm({
    defaultValues: {
      name: "",
      price: 0,
      variations: [],
    },
  });

  // Using a stable, descriptive name for persistence
  useRhfDevTool(form, "ProductEditForm");

  return <form>{/* form fields */}</form>;
}

function UserProfileForm() {
  const form = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
    },
  });

  // Different form name = isolated sample storage
  useRhfDevTool(form, "UserProfileForm");

  return <form>{/* form fields */}</form>;
}

export default function RootLayout({ children }) {
  return <RhfDevTools displayOnlyIfAnyFormExists>{children}</RhfDevTools>;
}
```

## How It Works

The tool only runs in development mode (`NODE_ENV === "development"`). Forms register themselves on mount and unregister on unmount. Samples are persisted to localStorage under the key `form_samples`, with each form's data stored under its unique `formName` identifier.

## Contribution

As I coded this package in one week and with help of AI(deepseek), so I'm aware of
flaws and code mistakes.
So any contribution to code refactoring, style improvements, bug fixes, additional tools and... are welcome.

Contribution recommendations:

- Do your changes in separate branch
- Describe what you try to improve in your PRs
- It is better to work on only single feature in each PR(Don't follow multiple goal in one PR)

Thank you

## License

MIT
