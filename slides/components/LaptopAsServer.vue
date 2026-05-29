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

    <div v-click="3" class="url-section transition-opacity duration-300">
      <p class="laptop-as-server-lead nus-token-muted">What the URL means:</p>

      <div class="url-display">
        <span class="url-protocol">http://</span>
        <span class="url-host">localhost</span>
        <span class="url-colon">:</span>
        <span class="url-port">5173</span>
      </div>

      <p class="url-gloss">
        <span class="url-gloss-host">localhost</span> = this machine ·
        <span class="url-gloss-port">5173</span> = port ·
        ask this computer for the app
      </p>
    </div>

    <div v-click="4" class="etymology-section transition-opacity duration-300">
      <p class="etymology-formula">
        <code>localhost</code>
        <span class="etymology-eq">=</span>
        <code>local</code>
        <span class="etymology-plus">+</span>
        <code>host</code>
      </p>

      <p class="etymology-inline">
        <span><strong>local</strong> — this machine</span>
        <span class="etymology-sep" aria-hidden="true">·</span>
        <span><strong>host</strong> — the machine serving something</span>
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
  padding-bottom: 2.75rem;
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

.url-section {
  margin-top: 0.05rem;
}

.url-display {
  margin: 0.2rem 0 0.3rem;
  font-size: 1.35em;
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.02em;
  word-break: break-all;
}

.url-protocol {
  color: var(--nus-faint);
  font-weight: 600;
}

.url-host {
  color: var(--nus-accent-hi);
  text-decoration: underline;
  text-decoration-color: color-mix(in srgb, var(--nus-accent), transparent 35%);
  text-underline-offset: 0.12em;
}

.url-colon {
  color: var(--nus-muted);
}

.url-port {
  color: var(--nus-text);
  border-bottom: 2px solid color-mix(in srgb, var(--nus-muted), transparent 50%);
}

.url-gloss {
  margin: 0;
  border-left: 0.25rem solid var(--nus-accent);
  color: var(--nus-muted);
  font-size: 0.95em;
  font-weight: 600;
  line-height: 1.35;
  padding-left: 0.5rem;
}

.url-gloss-host {
  color: var(--nus-accent-hi);
  font-weight: 700;
}

.url-gloss-port {
  color: var(--nus-text);
  font-weight: 700;
}

.etymology-section {
  margin-top: 0;
}

.etymology-formula {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.2rem 0.3rem;
  margin: 0 0 0.25rem;
  color: var(--nus-muted);
  font-size: 1em;
  font-weight: 600;
}

.etymology-formula code {
  color: var(--nus-text);
  font-size: 1.05em;
  font-weight: 700;
}

.etymology-eq,
.etymology-plus {
  color: var(--nus-accent-hi);
  font-weight: 800;
}

.etymology-inline {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.25rem 0.4rem;
  margin: 0;
  color: var(--nus-muted);
  font-size: 0.95em;
  font-weight: 600;
  line-height: 1.35;
}

.etymology-inline strong {
  color: var(--nus-text);
  font-weight: 700;
}

.etymology-sep {
  color: var(--nus-faint);
}
</style>
