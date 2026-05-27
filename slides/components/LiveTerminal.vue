<script setup lang="ts">
import { onSlideEnter, useIsSlideActive } from "@slidev/client";
import { computed, ref, watch } from "vue";

const props = withDefaults(
	defineProps<{
		url?: string;
		title?: string;
		height?: string;
		full?: boolean;
		fontSize?: number;
	}>(),
	{
		url: "http://127.0.0.1:7681",
		title: "terminal",
		height: "min(52vh, 28rem)",
		full: false,
	},
);

const iframeRef = ref<HTMLIFrameElement | null>(null);
const isOnline = ref(false);
const isChecking = ref(true);
const iframeKey = ref(0);

const CHECK_TIMEOUT_MS = 4000;

// biome-ignore lint/correctness/noUnusedVariables: used in template
const terminalUrl = computed(() => {
	if (props.fontSize == null) return props.url;
	const parsed = new URL(props.url);
	parsed.searchParams.set("fontSize", String(props.fontSize));
	return parsed.toString();
});

// biome-ignore lint/correctness/noUnusedVariables: used in template
const frameHeight = computed(() => (props.full ? "100%" : props.height));

let checkTimeout: ReturnType<typeof setTimeout> | null = null;

function clearCheckTimeout() {
	if (checkTimeout != null) {
		clearTimeout(checkTimeout);
		checkTimeout = null;
	}
}

function beginCheck() {
	clearCheckTimeout();
	isChecking.value = true;
	isOnline.value = false;
	checkTimeout = setTimeout(() => {
		isChecking.value = false;
	}, CHECK_TIMEOUT_MS);
}

// biome-ignore lint/correctness/noUnusedVariables: used in template
function onIframeLoad() {
	clearCheckTimeout();
	isOnline.value = true;
	isChecking.value = false;
}

// biome-ignore lint/correctness/noUnusedVariables: used in template
function focusTerminal() {
	const win = iframeRef.value?.contentWindow;
	if (win) win.focus();
	iframeRef.value?.focus();
}

// biome-ignore lint/correctness/noUnusedVariables: used in template
function retry() {
	iframeKey.value += 1;
	beginCheck();
}

onSlideEnter(() => {
	beginCheck();
});

const isActive = useIsSlideActive();

watch(isActive, (active) => {
	if (active) beginCheck();
});
</script>

<template>
  <div
    class="live-terminal"
    :class="{ 'live-terminal--full': full }"
  >
    <div class="terminal-card">
      <div class="terminal-chrome" aria-hidden="true">
        <span class="dot dot-red" />
        <span class="dot dot-yellow" />
        <span class="dot dot-green" />
        <span class="terminal-title">{{ title }}</span>
        <div class="terminal-chrome-actions">
          <span class="terminal-hint">Click terminal to type</span>
          <button
            v-if="isOnline"
            type="button"
            class="terminal-focus-btn"
            @click="focusTerminal"
          >
            Focus
          </button>
          <button
            v-else-if="!isChecking"
            type="button"
            class="terminal-focus-btn"
            @click="retry"
          >
            Retry
          </button>
        </div>
      </div>

      <div
        class="terminal-frame"
        :style="{ height: frameHeight }"
      >
        <iframe
          v-show="isOnline || isChecking"
          :key="iframeKey"
          ref="iframeRef"
          :src="terminalUrl"
          class="terminal-iframe"
          title="Live terminal"
          @load="onIframeLoad"
        />

        <div
          v-if="!isOnline && !isChecking"
          class="terminal-offline"
        >
          <p class="terminal-offline-title">ttyd is not running</p>
          <p class="terminal-offline-body">
            Start a shell in another terminal, then retry.
          </p>
          <pre class="terminal-offline-cmd"><code>cd slides && pnpm ttyd</code></pre>
          <button
            type="button"
            class="terminal-focus-btn terminal-offline-retry"
            @click="retry"
          >
            Retry
          </button>
        </div>

        <div
          v-else-if="isChecking && !isOnline"
          class="terminal-connecting"
        >
          Connecting to ttyd…
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.live-terminal {
  width: 100%;
}

.live-terminal--full {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  min-height: 0;
  height: auto;
  max-height: 100%;
}

.live-terminal--full .terminal-card {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
}

.live-terminal--full .terminal-frame {
  flex: 1;
  min-height: 0;
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

.terminal-chrome-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: auto;
}

.terminal-hint {
  color: var(--nus-faint);
  font-size: 0.62rem;
  font-weight: 500;
}

.terminal-focus-btn {
  border: 1px solid var(--nus-border);
  border-radius: 0.25rem;
  padding: 0.12rem 0.45rem;
  background: var(--nus-bg-elevated);
  color: var(--nus-muted);
  font-family: inherit;
  font-size: 0.62rem;
  font-weight: 600;
  cursor: pointer;
}

.terminal-focus-btn:hover {
  border-color: var(--nus-accent);
  color: var(--nus-text);
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

.terminal-frame {
  position: relative;
  width: 100%;
  min-height: 8rem;
  background: #0a0a0a;
}

.terminal-iframe {
  display: block;
  width: 100%;
  height: 100%;
  border: 0;
  background: #0a0a0a;
}

.terminal-connecting,
.terminal-offline {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  height: 100%;
  padding: 1.25rem;
  text-align: center;
}

.terminal-connecting {
  color: var(--nus-faint);
  font-size: 0.75rem;
  font-weight: 500;
}

.terminal-offline-title {
  margin: 0;
  color: var(--nus-text);
  font-size: 0.85rem;
  font-weight: 700;
}

.terminal-offline-body {
  margin: 0;
  color: var(--nus-muted);
  font-size: 0.72rem;
  font-weight: 500;
  line-height: 1.4;
  max-width: 22rem;
}

.terminal-offline-cmd {
  margin: 0;
  padding: 0.45rem 0.65rem;
  border: 1px solid var(--nus-border);
  border-radius: 0.25rem;
  background: var(--nus-bg);
  box-shadow: none;
}

.terminal-offline-cmd code {
  border: 0;
  background: transparent;
  color: var(--nus-success);
  font-size: 0.78rem;
  font-weight: 700;
  padding: 0;
}

.terminal-offline-retry {
  margin-top: 0.25rem;
  font-size: 0.68rem;
}
</style>
