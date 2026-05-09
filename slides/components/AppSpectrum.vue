<script setup lang="ts">
interface App {
  name: string
  logo: string
  dotColor: string
  annotation?: string
}

// biome-ignore lint/correctness/noUnusedVariables: used in <template> via v-for
const apps: App[] = [
  {
    name: 'Calculator',
    logo: '/logos/Calculator_(iOS_26)_app_icon.png',
    dotColor: '#10b981',
  },
  {
    name: 'Minecraft',
    logo: '/logos/minecraft_bedrock_icon.svg',
    dotColor: '#34d399',
    annotation: 'Multiplayer needs a server',
  },
  {
    name: 'Spotify',
    logo: '/logos/Spotify_App_Logo.svg',
    dotColor: '#fbbf24',
    annotation: 'Has an offline mode',
  },
  {
    name: 'Instagram',
    logo: '/logos/Instagram_logo_2016.svg',
    dotColor: '#fb923c',
  },
  {
    name: 'Grab',
    logo: '/logos/grab_app_icon.svg',
    dotColor: '#ef4444',
  },
]
</script>

<template>
  <div class="relative mx-auto mt-6 w-full max-w-[60rem] px-4 pt-6 pb-2 text-[0.9rem]">
    <div
      v-click="6"
      class="needs-server-region pointer-events-none absolute -top-1 right-1 bottom-18 left-[40%] rounded-[14px] border border-black/10 transition-opacity duration-300 dark:border-white/5"
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
          class="absolute top-1 left-1/2 w-[88%] -translate-x-1/2 text-center text-[0.72rem] leading-snug text-black/65 italic dark:text-white/70"
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
        <div class="mt-1 text-[0.72rem] leading-snug text-black/55 dark:text-white/55">
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
      class="absolute right-1 -bottom-14 left-[40%] text-center text-red-500/80 transition-opacity duration-300 dark:text-red-400/75"
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
      <div class="text-base font-semibold text-red-500/95 dark:text-red-400/95">
        Needs a server running somewhere
      </div>
      <div class="mt-1 text-[0.74rem] text-black/55 dark:text-white/55">
        This is what we're deploying today
      </div>
    </div>
  </div>
</template>

<style scoped>
.needs-server-region {
  background: linear-gradient(
    180deg,
    rgb(239 68 68 / 4%) 0%,
    rgb(239 68 68 / 8%) 55%,
    rgb(239 68 68 / 13%) 100%
  );
  box-shadow: inset 0 -1px 0 rgb(239 68 68 / 22%);
}

:global(.dark) .needs-server-region {
  background: linear-gradient(
    180deg,
    rgb(239 68 68 / 2%) 0%,
    rgb(239 68 68 / 6%) 55%,
    rgb(239 68 68 / 11%) 100%
  );
  box-shadow: inset 0 -1px 0 rgb(239 68 68 / 18%);
}

.bar {
  background: linear-gradient(
    to right,
    #10b981 0%,
    #34d399 22%,
    #fbbf24 48%,
    #fb923c 72%,
    #ef4444 90%,
    #b91c1c 100%
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
