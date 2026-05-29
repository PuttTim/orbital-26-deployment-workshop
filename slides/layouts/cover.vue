<template>
  <div class="slidev-layout nus-layout nus-cover">
    <div class="nus-cover-brand" aria-hidden="true">
      <img class="nus-logo-light" src="/logos/logo_light.webp" alt="" />
      <img class="nus-logo-dark" src="/logos/logo_dark.webp" alt="" />
    </div>

    <main class="nus-cover-content">
      <div class="nus-terminal-eyebrow"><span>~</span><span>/</span>workshops/orbital</div>
      <slot />
    </main>
  </div>
</template>
