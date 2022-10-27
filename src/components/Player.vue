<script setup lang="ts">
import { ref, onMounted } from "vue";

const theoplayer = ref<HTMLElement | null>(null);
const props = defineProps<{ source: Array<any> }>();

function playerInit() {
  if (theoplayer.value != null) {
    const player = new window.THEOplayer.Player(theoplayer.value, {
      fluid: true,
      libraryLocation: "//cdn.theoplayer.com/dash/theoplayer/",
    });
    player.source = {
      sources: props.source,
    };
  }
}

onMounted(() => {
  playerInit();
});
</script>

<template>
  <div
    class="theoplayer-container video-js theoplayer-skin vjs-16-9 theoplayer"
    ref="theoplayer"
  ></div>
</template>

<style scoped>
.theoplayer-container {
  margin: 0 auto;
  padding-top: 56.24%;
  width: 100%;
}
</style>
