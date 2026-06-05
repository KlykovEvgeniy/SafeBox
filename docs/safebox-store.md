# 📦 SafeBox-store
### 1. Initialize and Create State
Define your global state contract and instantiate the `SafeBox` store. TypeScript automatically guarantees end-to-end type safety across all storage actions.

```typescript
interface IAppState {
  amount: number;
  username?: string; // Optional property support out-of-the-box
}

const store = new SafeBox<IAppState>();

// Register state nodes inside the secure container
store.createState('amount', 12);
store.createState('username', undefined); 
```

### 2. Configure SafeBox-validation
Validation schemas automatically morph based on the underlying data type. Use `optional: true` for optional fields to seamlessly skip checks if the value is missing.

```typescript
// Strict numeric validation rules for the 'amount' field
store.createValidation('amount', { 
  required: true, 
  isInt: true, 
  positive: true, 
  min: 1, 
  message: 'Amount is not working' 
});

// String validation rules for an optional 'username' field
store.createValidation('username', { 
  optional: true, 
  length: { min: 3, max: 15 } 
});

// Execute SafeBox-validation routine manually
const amountReport = store.validation('amount');
const userReport = store.validation('username');
```

### 3. Reactive Subscriptions
Track state updates per key using a unique subscriber identifier to prevent duplicate handlers. Every subscription returns its own absolute lifecycle cleanup token.

```typescript
// Subscribe to reactive updates
const unsubscribe = store.subscribe('amount', 'subscriber1', (stateNode) => {
  console.log('Value changed! Current node data structure:', stateNode);
});

// Fire the cleanup token to unsubscribe safely at any point
unsubscribe();
```

### 4. Safe State Mutations
Mutate properties securely. SafeBox will automatically dispatch the update and notify all registered observers on every successful transaction.

```typescript
// Safely dispatch mutations into the SafeBox
store.setSafe('amount', 23);
```

### 5. State Lock Mechanism
Freeze specific properties to lock them from unintended mutations during asynchronous processing, network traffic, or sensitive user workflows.

```typescript
// Freeze property mutations completely
const lockMsg = store.lock('amount'); // Returns: "amount has been locked"

// Throws an internal exception: "amount is locked"
// store.setSafe('amount', 45); 

// Release the property back to an active mutable state
const unlockMsg = store.unlock('amount'); // Returns: "amount has been unlocked"
```

### 6. Debug and Inspect Storage
Read the current runtime state layout out of the storage registry for rapid prototyping, analytics, or UI state mirroring.

```typescript
// Retrieve the complete storage memory array
const allStates = store.showState();

// Retrieve a single targeted state node wrapped inside an array
const amountState = store.showState('amount');
```
