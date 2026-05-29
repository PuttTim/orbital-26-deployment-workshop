<script setup lang="ts">
const tienCheng = {
	index: "01",
	name: "Tien Cheng",
	photo: "/presenters/tiencheng.webp",
	program: "Y1 CS",
	affiliationUrl: "https://www.nushackers.org/",
	photoPosition: "center 28%",
};

const putt = {
	index: "02",
	name: "Putt",
	photo: "/presenters/putt.webp",
	program: "Y1 BAIS",
	affiliationUrl: "https://www.nushackers.org/",
	photoPosition: "center 32%",
};
</script>

<template>
  <div class="presenters-intro">
    <div class="nus-terminal-eyebrow presenters-eyebrow">
      <span>~</span><span>/</span>presenters
    </div>

    <PresenterCard v-bind="tienCheng" />
    <PresenterCard v-bind="putt" />
  </div>
</template>
