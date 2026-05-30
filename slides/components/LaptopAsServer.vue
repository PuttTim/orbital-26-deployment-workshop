<template>
  <div class="laptop-as-server">
    <p class="laptop-as-server-lead nus-token-muted">When you run:</p>

    <div v-click="1" class="terminal-card transition-opacity duration-300">
      <div class="terminal-chrome" aria-hidden="true">
        <span class="dot dot-red" />
        <span class="dot dot-yellow" />
        <span class="dot dot-green" />
        <span class="terminal-title">dev</span>
      </div>
      <pre class="terminal-body"><code>pnpm dev</code></pre>
    </div>

    <div v-click="2" class="loop-section transition-opacity duration-300">
      <p class="laptop-as-server-note">
        Vite starts a development server on your laptop.
      </p>

      <div class="loop-diagram">
        <div class="loop-card loop-card-client">
          <span class="loop-role">Client</span>
          <span class="loop-label">Browser</span>
        </div>

        <div class="loop-bridge" aria-hidden="true">
          <span class="loop-arrow loop-arrow-out">→</span>
          <span class="loop-url">localhost:5173</span>
          <span class="loop-arrow loop-arrow-in">←</span>
        </div>

        <div class="loop-card loop-card-server">
          <span class="loop-role">Host</span>
          <span class="loop-label">Vite dev server</span>
        </div>
      </div>

      <p class="loop-caption nus-token-faint">Both live on this laptop</p>
    </div>

    <div v-click="3" class="local-only-note transition-opacity duration-300">
      <p>
        This URL is local. It tells <strong>this laptop</strong> to ask one of its own programs for the app.
      </p>
    </div>
  </div>
</template>

<style scoped>
.laptop-as-server {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-top: 0;
  padding-bottom: 1rem;
  font-size: 0.8rem;
}

.laptop-as-server-lead {
  margin: 0;
  font-size: 1em;
  font-weight: 600;
  line-height: 1.25;
}

.laptop-as-server-note {
  margin: 0 0 0.4rem;
  color: var(--nus-muted);
  font-size: 1em;
  font-weight: 500;
  line-height: 1.35;
}

.terminal-card {
  overflow: hidden;
  border: 1px solid var(--nus-border);
  border-radius: 0.35rem;
  background: var(--nus-code-bg);
  box-shadow: var(--nus-shadow);
}

.terminal-chrome {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  border-bottom: 1px solid var(--nus-border);
  padding: 0.3rem 0.5rem;
}

.dot {
  width: 0.52rem;
  height: 0.52rem;
  border-radius: 50%;
}

.dot-red {
  background: #ef4444;
}

.dot-yellow {
  background: #fbbf24;
}

.dot-green {
  background: #10b981;
}

.terminal-title {
  margin-left: 0.35rem;
  color: var(--nus-faint);
  font-size: 0.68rem;
  font-weight: 600;
}

.terminal-body {
  margin: 0;
  padding: 0.45rem 0.6rem 0.5rem;
  background: transparent;
  box-shadow: none;
  border: 0;
}

.terminal-body code {
  border: 0;
  background: transparent;
  color: var(--nus-success);
  font-size: 1.1em;
  font-weight: 700;
  padding: 0;
}

:global(.dark) .terminal-body code {
  color: var(--nus-success);
}

.loop-section {
  margin-top: 0.1rem;
}

.loop-diagram {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 0.5rem;
  align-items: center;
}

.loop-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  overflow: hidden;
  border: 1px solid var(--nus-border);
  border-radius: 0.3rem;
  background: var(--nus-bg-elevated);
  padding: 0.35rem 0.45rem;
  min-width: 0;
}

.loop-card::before {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  height: 3px;
  content: "";
}

.loop-card-client::before {
  background: color-mix(in srgb, var(--nus-muted), transparent 40%);
}

.loop-card-server::before {
  background: var(--nus-accent);
}

.loop-card-server {
  border-color: color-mix(in srgb, var(--nus-accent), var(--nus-border) 55%);
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--nus-accent), transparent 82%);
}

.loop-role {
  color: var(--nus-faint);
  font-size: 0.75em;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.loop-label {
  color: var(--nus-text);
  font-size: 1em;
  font-weight: 700;
  line-height: 1.15;
}

.loop-bridge {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.12rem;
  min-width: 5.5rem;
}

.loop-arrow {
  color: var(--nus-accent-hi);
  font-size: 0.95rem;
  font-weight: 800;
  line-height: 1;
}

.loop-url {
  border: 1px solid var(--nus-border);
  border-radius: 0.2rem;
  background: var(--nus-code-bg);
  color: var(--nus-text);
  font-size: 0.68rem;
  font-weight: 700;
  line-height: 1.2;
  padding: 0.2rem 0.35rem;
  white-space: nowrap;
}

.loop-caption {
  margin: 0.25rem 0 0;
  font-size: 0.85em;
  font-style: italic;
  text-align: center;
}

.local-only-note {
  border-left: 0.18rem solid var(--nus-accent);
  margin: 0;
  background: color-mix(in srgb, var(--nus-accent) 10%, transparent);
  color: var(--nus-text);
  font-size: 0.88em;
  font-weight: 600;
  line-height: 1.38;
  padding: 0.45rem 0.55rem;
}

.local-only-note p {
  margin: 0;
}

.local-only-note strong {
  color: var(--nus-accent-hi);
  font-weight: 800;
}
</style>
