<script setup lang="ts">
withDefaults(
	defineProps<{
		index: string;
		name: string;
		photo: string;
		program: string;
		affiliationUrl: string;
		photoPosition?: string;
	}>(),
	{ photoPosition: "center 34%" },
);
</script>

<template>
  <div class="presenter-card">
    <header class="presenter-card-header">
      <span class="presenter-index">{{ index }}</span>
      <h2 class="presenter-name">{{ name }}</h2>
    </header>

    <div class="presenter-photo">
      <img
        :src="photo"
        :alt="name"
        loading="lazy"
        :style="{
          objectPosition: photoPosition,
          transformOrigin: photoPosition,
        }"
      />
    </div>

    <footer class="presenter-meta">
      <span class="presenter-tag">{{ program }}</span>
      <span class="presenter-tag">Coreteam</span>
      <a
        class="presenter-link"
        :href="affiliationUrl"
        target="_blank"
        rel="noopener noreferrer"
      >
        NUS Hackers
      </a>
    </footer>
  </div>
</template>
