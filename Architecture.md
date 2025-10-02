System Architecture & Design Patterns
This document provides a detailed breakdown of the architectural patterns, design principles, and visual diagrams that form the foundation of the Crisp AI Interview Assistant.

1. Architectural Patterns
1.1. Flux Architecture (via Redux)
The application implements the unidirectional data flow of the Flux pattern using Redux Toolkit. This ensures a predictable and manageable state.

Flow Diagram:

<div align="center">
<svg viewBox="0 0 800 200" xmlns="http://www.w3.org/2000/svg" aria-labelledby="flux-title" role="img">
<title id="flux-title">Flux Architecture Diagram</title>
<defs>
<marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
<polygon points="0 0, 10 3.5, 0 7" fill="#888" />
</marker>
</defs>
<style>
.box { fill: #2d3748; stroke: #4a5568; }
.text { fill: #e2e8f0; font-family: monospace; font-size: 14px; }
.arrow { stroke: #888; stroke-width: 2; }
.label { fill: #a0aec0; font-family: monospace; font-size: 12px; }
</style>
<!-- Boxes -->
<g text-anchor="middle">
<rect x="10" y="75" width="140" height="50" rx="5" class="box" />
<text x="80" y="105" class="text">User Action</text>

      <rect x="220" y="75" width="120" height="50" rx="5" class="box" />
      <text x="280" y="105" class="text">Dispatch</text>

      <rect x="410" y="75" width="120" height="50" rx="5" class="box" />
      <text x="470" y="105" class="text">Reducers</text>

      <rect x="600" y="75" width="120" height="50" rx="5" class="box" />
      <text x="660" y="105" class="text">Store</text>
  </g>
  <!-- Arrows -->
  <g class="arrow" marker-end="url(#arrowhead)">
      <line x1="155" y1="100" x2="215" y2="100" />
      <line x1="345" y1="100" x2="405" y2="100" />
      <line x1="535" y1="100" x2="595" y2="100" />
      <path d="M 725 100 Q 760 100 760 60 L 40 60 Q 40 10 10 100" fill="none"/>
  </g>
  <text x="20" y="45" class="label">Re-render Components</text>

</svg>
</div>

1.2. Layered Architecture
A clear separation of concerns is achieved through a layered architecture, isolating UI, state, logic, and external services.

Layers Diagram:

<div align="center">
<svg viewBox="0 0 300 220" xmlns="http://www.w3.org/2000/svg" aria-labelledby="layered-title" role="img">
<title id="layered-title">Layered Architecture Diagram</title>
<style>
.layer-box { fill: #2d3748; stroke: #4a5568; }
.layer-text { fill: #e2e8f0; font-family: monospace; font-size: 14px; text-anchor: middle; }
</style>
<g>
<rect x="10" y="10" width="280" height="40" rx="3" class="layer-box" />
<text x="150" y="35" class="layer-text">Presentation Layer</text>

      <rect x="10" y="60" width="280" height="40" rx="3" class="layer-box" />
      <text x="150" y="85" class="layer-text">State Management Layer</text>

      <rect x="10" y="110" width="280" height="40" rx="3" class="layer-box" />
      <text x="150" y="135" class="layer-text">Business Logic Layer</text>
      
      <rect x="10" y="160" width="280" height="40" rx="3" class="layer-box" />
      <text x="150" y="185" class="layer-text">External Services Layer</text>
  </g>

</svg>
</div>

2. Design Patterns Used
2.1. Observer Pattern
Implemented via Redux subscriptions (useSelector), allowing components to "observe" and automatically re-render when the state they depend on changes.

2.2. Command Pattern
Redux actions (dispatch(action)) encapsulate requests as command objects, decoupling the component that initiates an action from the logic that processes it.

2.3. Strategy Pattern
The application is designed to easily swap different AI service strategies (e.g., a real Google AI service vs. a mocked service for testing) without altering the core application logic.

2.4. State Machine Pattern
The interview process follows a defined and predictable sequence of states, ensuring robust control over the session flow.

Interview State Machine:

<div align="center">
<svg viewBox="0 0 600 150" xmlns="http://www.w3.org/2000/svg" aria-labelledby="state-title" role="img">
<title id="state-title">Interview State Machine Diagram</title>
<defs>
<marker id="arrowhead-state" markerWidth="7" markerHeight="5" refX="6" refY="2.5" orient="auto">
<polygon points="0 0, 7 2.5, 0 5" fill="#888" />
</marker>
</defs>
<style>
.state { fill: #2d3748; stroke: #4a5568; }
.state-text { font-family: monospace; font-size: 11px; fill: #e2e8f0; }
.error-state { fill: #4c1d22; stroke: #9b2c2c; }
.error-text { fill: #fed7d7; }
.state-arrow { stroke: #888; stroke-width: 1.5; }
</style>
<g text-anchor="middle">
<rect x="10" y="55" width="60" height="30" rx="15" class="state"/><text x="40" y="74" class="state-text">IDLE</text>
<rect x="100" y="55" width="80" height="30" rx="15" class="state"/><text x="140" y="74" class="state-text">PARSING</text>
<rect x="210" y="55" width="130" height="30" rx="15" class="state"/><text x="275" y="74" class="state-text">AWAITING_CONFIRM</text>
<rect x="370" y="55" width="90" height="30" rx="15" class="state"/><text x="415" y="74" class="state-text">IN_PROGRESS</text>
<rect x="490" y="55" width="90" height="30" rx="15" class="state"/><text x="535" y="74" class="state-text">COMPLETED</text>
<rect x="245" y="110" width="70" height="30" rx="15" class="error-state"/><text x="280" y="129" class="state-text error-text">ERROR</text>
</g>
<g class="state-arrow" marker-end="url(#arrowhead-state)">
<line x1="70" y1="70" x2="100" y2="70"/>
<line x1="180" y1="70" x2="210" y2="70"/>
<line x1="340" y1="70" x2="370" y2="70"/>
<line x1="460" y1="70" x2="490" y2="70"/>
<path d="M 140 85 Q 180 110 245 125" fill="none"/>
</g>
</svg>
</div>

2.5. Factory Pattern
Redux Toolkit's createAsyncThunk acts as a factory for creating complex asynchronous operations (like starting an interview session), abstracting away the boilerplate of handling promise lifecycle actions.
