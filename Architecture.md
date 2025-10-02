# System Architecture & Design Patterns

This document provides a detailed breakdown of the architectural patterns, design principles, and visual diagrams that form the foundation of the Crisp AI Interview Assistant.

## 1. Architectural Patterns

### 1.1. Flux Architecture (via Redux)

The application implements the unidirectional data flow of the Flux pattern using Redux Toolkit. This ensures a predictable and manageable state.

**Flow Diagram:**

```
┌─────────────┐    ┌───────────┐    ┌───────────┐    ┌──────────┐
│ User Action │───▶│ Dispatch  │───▶│ Reducers  │───▶│  Store   │
└─────────────┘    └───────────┘    └───────────┘    └──────────┘
     ▲                                              │
     └──────────────────────────────────────────────┘
              Re-render Components
```

**Data Flow:**
1. **User Action**: User interacts with the UI
2. **Dispatch**: Action is dispatched to the store
3. **Reducers**: Pure functions update state based on action
4. **Store**: Updated state triggers re-renders
5. **Components**: Subscribe to state changes and update UI

### 1.2. Layered Architecture

A clear separation of concerns is achieved through a layered architecture, isolating UI, state, logic, and external services.

**Layers Diagram:**

```
┌─────────────────────────────────────────┐
│           Presentation Layer            │
│              (Components)               │
├─────────────────────────────────────────┤
│         State Management Layer          │
│               (Redux Store)             │
├─────────────────────────────────────────┤
│          Business Logic Layer           │
│            (Services/Utils)             │
├─────────────────────────────────────────┤
│         External Services Layer         │
│           (APIs, AI Services)           │
└─────────────────────────────────────────┘
```

**Layer Responsibilities:**
- **Presentation Layer**: React components, UI rendering
- **State Management Layer**: Redux store, state updates
- **Business Logic Layer**: Application logic, data processing
- **External Services Layer**: API calls, third-party integrations

## 2. Design Patterns Used

### 2.1. Observer Pattern

Implemented via Redux subscriptions (`useSelector`), allowing components to "observe" and automatically re-render when the state they depend on changes.

### 2.2. Command Pattern

Redux actions (`dispatch(action)`) encapsulate requests as command objects, decoupling the component that initiates an action from the logic that processes it.

### 2.3. Strategy Pattern

The application is designed to easily swap different AI service strategies (e.g., a real Google AI service vs. a mocked service for testing) without altering the core application logic.

### 2.4. State Machine Pattern

The interview process follows a defined and predictable sequence of states, ensuring robust control over the session flow.

**Interview State Machine:**

```
IDLE → PARSING → AWAITING_CONFIRM → IN_PROGRESS → COMPLETED
                │
                └→ ERROR
```

**State Transitions:**
- **IDLE**: Initial state, ready to start
- **PARSING**: Processing job description
- **AWAITING_CONFIRM**: Waiting for user confirmation
- **IN_PROGRESS**: Interview session active
- **COMPLETED**: Interview finished successfully
- **ERROR**: Error state from any previous state

### 2.5. Factory Pattern

Redux Toolkit's `createAsyncThunk` acts as a factory for creating complex asynchronous operations (like starting an interview session), abstracting away the boilerplate of handling promise lifecycle actions.
