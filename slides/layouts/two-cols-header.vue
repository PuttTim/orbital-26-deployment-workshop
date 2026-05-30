<template>
  <div class="slidev-layout nus-layout nus-two-cols-header">
    <header>
      <slot />
    </header>

    <div class="nus-two-cols-grid">
      <section>
        <slot name="left" />
      </section>
      <section>
        <slot name="right" />
      </section>
    </div>
  </div>
</template>
