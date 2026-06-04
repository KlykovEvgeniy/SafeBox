# Smart Store & Dynamic Schema Validator

An advanced, production-ready frontend architecture stack featuring a reactive, write-lockable state manager (`Smart Store`) integrated with an ultra-type-safe runtime schema validator.

---

## 🏗️ Project Architecture

This repository forms a unified solution for state management and data integrity, structured as follows:

- **Smart Store (`new Store()`)** — A TypeScript generic container that isolates state properties into reactive memory cells, handles localized subscriptions, and supports programmatic access lock modes.
- **Dynamic Validator** — A type-driven validation engine with comprehensive recursion support for deeply nested structures, multidimensional arrays, and customizable error messages.

---

## 📖 Navigation & Documentation

Detailed specifications and technical references for each module are separated to maintain a clean repository layout:

- 🛠️ **[SaveBox Specification (Technical Task)](./specs/smart-store-task.md)** — Core requirements for internal data container cells, observer loops, and lock/unlock API mechanics.
- 🔤 **[SafeBox Validator Methods Reference](no_link)** — Quick dictionary of all available string, number, array, and date constraint methods with their data types.

---

## 🚀 Quick Preview

The entire system relies on automatic type inference from your initial state. TypeScript will prevent code typos and enforce type restrictions at compile-time without using `any` or `as` type casts.

```typescript
import { Store } from "./store";
import { Validator } from "./validator";

// 1. Define your data model
interface IProfileState {
  username: string;
  age: number;
}

// 2. Initialize with absolute type safety
const userStore = new Store<IProfileState>({
  state: {
    username: "alex_dev",
    age: 25,
  },
  validation: {
    username: { required: true, length: { min: 3 } },
    age: { isInt: true, min: 18 },
  },
});

// 3. Methods check signatures at compile time
const age = userStore.check("age"); // Returns number type directly

// TypeScript will throw a compilation error here (number is not assignable to string)
userStore.setSafe("username", 42);
```
# SafeBox
