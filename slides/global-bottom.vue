<template>
  <footer
    v-if="!$frontmatter?.hideFooter && !String($frontmatter?.class ?? '').includes('live-terminal-slide') && !['cover', 'section', 'image', 'image-left', 'image-right', 'iframe'].includes($nav.currentLayout)"
    class="nus-footer"
  >
    <div>
      <span class="nus-footer-page">{{ $nav.currentPage }}</span>
      <span>/{{ $nav.total }}</span>
    </div>
  </footer>
</template>
