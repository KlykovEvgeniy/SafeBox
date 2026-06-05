# SafeBox (Smart Store & Dynamic Schema Validator) 🚀

An advanced, production-ready state management architecture that combines a reactive state machine (**Smart Store**) with strict data mutation locks and an automated, type-driven runtime schema validator.

---

## 🏗 Core Architecture

* **Smart Store (`new Store()`)** – A generic-driven container for isolated, reactive state slices featuring secure read/write locks.
* **Dynamic Validator** – A type-based engine with recursion support for validating deep, nested data structures and rule evaluation.

---

## 🛠 API Reference (Smart Store)

* `createState(name, value)`: Initializes a new state slice. Throws if the key already exists.
* `subscribe(name, cbName, callback)`: Registers an event listener for state updates. **Returns an unsubscribe function** for immediate cleanup.
* `setSafe(name, newValue)`: Updates state safely. Rejects modifications and throws an error if the state is currently locked.
* `lock(name)` / `unlock(name)`: Toggles the write-protection state, preventing unauthorized mutations.
* `showState(name?)`: Returns a snapshot array of either a specific state slice or the entire store.

---

## 💻 Quick Start

```typescript
import { Store } from "./Store";

// 1. Define your store interface
interface AppState {
  amount: number;
  theme: "light" | "dark";
}

// 2. Initialize the SafeBox store
const store = new Store<AppState>();
store.createState("amount", 12);

// 3. Subscribe to reactive changes
const unsubscribe = store.subscribe("amount", "UI_Logger", (state) => {
  console.log(`[Update] ${state.name} changed to: ${state.value}`);
});

// 4. Modify safely (triggers subscriber)
store.setSafe("amount", 23);

// 5. Lock state against mutation
store.lock("amount");
// store.setSafe("amount", 50); // ❌ Throws Error: amount is locked

// 6. Clean up subscription
unsubscribe();
```

---

## 📖 Complete Documentation

Detailed type definitions for `ValidationFlatRules` and the internal recursive `Validator` engine specifications can be found within the codebase.
