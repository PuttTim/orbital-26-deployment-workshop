<script setup lang="ts">
interface App {
	name: string;
	logo: string;
	dotColor: string;
	annotation?: string;
}

// biome-ignore lint/correctness/noUnusedVariables: used in <template> via v-for
const apps: App[] = [
	{
		name: "Calculator",
		logo: "/logos/Calculator_(iOS_26)_app_icon.png",
		dotColor: "var(--nus-success)",
	},
	{
		name: "Minecraft",
		logo: "/logos/minecraft_bedrock_icon.svg",
		dotColor: "color-mix(in srgb, var(--nus-success), var(--nus-warning) 20%)",
		annotation: "Multiplayer needs a server",
	},
	{
		name: "Spotify",
		logo: "/logos/Spotify_App_Logo.svg",
		dotColor: "var(--nus-warning)",
		annotation: "Has an offline mode",
	},
	{
		name: "Instagram",
		logo: "/logos/Instagram_logo_2016.svg",
		dotColor: "var(--nus-accent)",
	},
	{
		name: "Grab",
		logo: "/logos/grab_app_icon.svg",
		dotColor: "var(--nus-danger)",
	},
];
</script>

<template>
  <div class="relative mx-auto mt-6 w-full max-w-[60rem] px-4 pt-6 pb-2 text-[0.9rem]">
    <div
      v-click="6"
      class="needs-server-region pointer-events-none absolute -top-1 right-1 bottom-18 left-[40%] rounded-[8px] border transition-opacity duration-300"
      aria-hidden="true"
    />

    <div class="relative z-1 grid grid-cols-5 items-end gap-2">
      <div
        v-for="(app, i) in apps"
        :key="app.name"
        v-click="i + 1"
        class="relative flex min-h-28 flex-col items-center justify-end gap-[0.55rem] transition-opacity duration-300"
      >
        <div
          v-if="app.annotation"
          class="nus-token-muted absolute top-1 left-1/2 w-[88%] -translate-x-1/2 text-center text-[0.72rem] leading-snug italic"
        >
          {{ app.annotation }}
        </div>
        <img
          :src="app.logo"
          :alt="app.name"
          class="logo h-13 w-13 rounded-[10px] object-contain"
        />
        <div class="text-base leading-none font-semibold">{{ app.name }}</div>
      </div>
    </div>

    <div class="relative z-1 mt-4 h-5">
      <div class="bar absolute top-1/2 right-0 left-0 h-[5px] -translate-y-1/2 rounded-full" />
      <div class="absolute inset-0 grid grid-cols-5 items-center">
        <div
          v-for="(app, i) in apps"
          :key="app.name"
          v-click="i + 1"
          class="dot z-2 mx-auto h-3.5 w-3.5 rounded-full transition-opacity duration-300"
          :style="{ background: app.dotColor, '--dot-color': app.dotColor }"
        />
      </div>
    </div>

    <div class="relative z-1 mt-3 grid grid-cols-5 gap-2">
      <div class="col-start-1 flex flex-col items-center text-center">
        <div class="text-base font-semibold">Fully offline</div>
        <div class="nus-token-faint mt-1 text-[0.72rem] leading-snug">
          No server needed<br />
          Just distribute the app
        </div>
      </div>
      <div class="col-start-5 flex flex-col items-center text-center">
        <div class="text-base font-semibold">Cloud-heavy</div>
      </div>
    </div>

    <div
      v-click="6"
      class="nus-token-danger absolute right-1 -bottom-14 left-[40%] text-center transition-opacity duration-300"
    >
      <svg
        class="mx-auto mb-2 block h-3 w-[92%]"
        viewBox="0 0 100 12"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M 1 0 L 1 6 Q 1 9 4 9 L 47 9 L 50 12 L 53 9 L 96 9 Q 99 9 99 6 L 99 0"
          stroke="currentColor"
          stroke-width="0.5"
          fill="none"
          stroke-linejoin="round"
          stroke-linecap="round"
        />
      </svg>
      <div class="text-base font-semibold">
        Needs a server running somewhere
      </div>
      <div class="nus-token-faint mt-1 text-[0.74rem]">
        This is what we're deploying today
      </div>
    </div>
  </div>
</template>

<style scoped>
.needs-server-region {
  border-color: var(--nus-border);
  background: linear-gradient(
    180deg,
    color-mix(in srgb, var(--nus-danger), transparent 96%) 0%,
    color-mix(in srgb, var(--nus-danger), transparent 92%) 55%,
    color-mix(in srgb, var(--nus-danger), transparent 87%) 100%
  );
  box-shadow: inset 0 -1px 0 color-mix(in srgb, var(--nus-danger), transparent 78%);
}

:global(.dark) .needs-server-region {
  background: linear-gradient(
    180deg,
    color-mix(in srgb, var(--nus-danger), transparent 98%) 0%,
    color-mix(in srgb, var(--nus-danger), transparent 94%) 55%,
    color-mix(in srgb, var(--nus-danger), transparent 89%) 100%
  );
  box-shadow: inset 0 -1px 0 color-mix(in srgb, var(--nus-danger), transparent 82%);
}

.bar {
  background: linear-gradient(
    to right,
    var(--nus-success) 0%,
    color-mix(in srgb, var(--nus-success), var(--nus-warning) 20%) 22%,
    var(--nus-warning) 48%,
    var(--nus-accent) 72%,
    var(--nus-danger) 90%,
    color-mix(in srgb, var(--nus-danger), #7f1d1d 35%) 100%
  );
}

.dot {
  box-shadow:
    0 0 0 2px rgb(255 255 255 / 75%),
    0 0 10px 0 var(--dot-color);
}

:global(.dark) .dot {
  box-shadow:
    0 0 0 2px rgb(0 0 0 / 45%),
    0 0 10px 0 var(--dot-color);
}

.logo {
  filter: drop-shadow(0 2px 4px rgb(0 0 0 / 15%));
}

:global(.dark) .logo {
  filter: drop-shadow(0 2px 4px rgb(0 0 0 / 35%));
}
</style>
