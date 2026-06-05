<template>
  <div class="docker-stack">
    <div
      v-for="(layer, index) in layers"
      :key="layer.id"
      v-click="index + 1"
      class="docker-stack-row transition-opacity duration-300"
    >
      <div class="docker-stack-layer" :class="`docker-stack-layer--${layer.tone}`">
        <span class="docker-stack-layer-label">{{ layer.label }}</span>
        <span class="docker-stack-layer-desc">{{ layer.description }}</span>
      </div>
      <div class="docker-stack-annotations" aria-label="Alternatives at this layer">
        <span
          v-for="option in layer.options"
          :key="option"
          class="docker-stack-chip"
        >
          {{ option }}
        </span>
        <span v-if="layer.hint" class="docker-stack-hint">{{ layer.hint }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const layers = [
	{
		id: "desktop",
		label: "Docker app",
		description: "Installer and local dashboard",
		tone: "tooling",
		options: ["Docker Desktop", "OrbStack"],
		hint: "On macOS / Windows, this also starts the Linux environment Docker needs.",
	},
	{
		id: "cli",
		label: "Docker CLI",
		description: "The commands you type",
		tone: "cli",
		options: ["docker build", "docker run", "docker compose"],
		hint: "The CLI sends requests to the Docker service running in the background.",
	},
	{
		id: "engine",
		label: "Docker Engine",
		description: "Builds images and starts containers",
		tone: "engine",
		options: ["image builds", "container lifecycle", "networking"],
		hint: "This is the part doing the real container work for this workshop.",
	},
	{
		id: "image",
		label: "Container image",
		description: "Portable app package",
		tone: "standard",
		options: ["OCI format", "Dockerfile layers"],
		hint: "The standard image format is why the same image can run locally and on Render.",
	},
	{
		id: "registry",
		label: "Registry",
		description: "Stores and shares images",
		tone: "registry",
		options: ["Docker Hub", "GHCR"],
		hint: "Like npm for container images. Render can also build straight from your repo.",
	},
] as const;
</script>

<style scoped>
.docker-stack {
  display: flex;
  flex-direction: column;
  gap: 0.62rem;
  max-width: 60rem;
  margin: 0.65rem auto 0;
  font-size: 0.9rem;
}

.docker-stack-row {
  display: grid;
  grid-template-columns: minmax(0, 1.08fr) minmax(0, 1.32fr);
  gap: 0.78rem;
  align-items: center;
}

.docker-stack-layer {
  display: flex;
  flex-direction: column;
  gap: 0.08rem;
  border: 1px solid var(--nus-border);
  border-radius: 0.42rem;
  background: var(--nus-bg-elevated);
  padding: 0.58rem 0.72rem;
  min-height: 3.2rem;
  justify-content: center;
}

.docker-stack-layer::before {
  position: absolute;
  content: none;
}

.docker-stack-layer--tooling {
  border-color: color-mix(in srgb, var(--nus-muted), var(--nus-border) 55%);
}

.docker-stack-layer--cli {
  border-color: color-mix(in srgb, var(--nus-accent-hi), var(--nus-border) 45%);
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--nus-accent-hi), transparent 84%);
}

.docker-stack-layer--engine {
  border-color: color-mix(in srgb, var(--nus-accent), var(--nus-border) 40%);
  background: color-mix(in srgb, var(--nus-accent) 8%, var(--nus-bg-elevated));
}

.docker-stack-layer--standard {
  border-color: color-mix(in srgb, var(--nus-success), var(--nus-border) 50%);
}

.docker-stack-layer--registry {
  border-color: color-mix(in srgb, var(--nus-muted), var(--nus-border) 45%);
  background: color-mix(in srgb, var(--nus-success) 5%, var(--nus-bg-elevated));
}

.docker-stack-layer-label {
  color: var(--nus-text);
  font-size: 0.95em;
  font-weight: 800;
  line-height: 1.15;
}

.docker-stack-layer-desc {
  color: var(--nus-muted);
  font-size: 0.82em;
  font-weight: 600;
  line-height: 1.25;
}

.docker-stack-annotations {
  display: flex;
  flex-wrap: wrap;
  gap: 0.36rem;
  align-items: center;
}

.docker-stack-chip {
  border: 1px solid var(--nus-border);
  border-radius: 0.28rem;
  background: var(--nus-code-bg);
  color: var(--nus-text);
  font-size: 0.8em;
  font-weight: 700;
  line-height: 1.2;
  padding: 0.24rem 0.48rem;
  white-space: nowrap;
}

.docker-stack-hint {
  flex: 1 1 100%;
  color: var(--nus-faint);
  font-size: 0.74em;
  font-style: italic;
  line-height: 1.25;
}
</style>
