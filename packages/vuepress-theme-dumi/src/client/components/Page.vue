<script setup lang="ts">
import PageEdit from '@theme/PageEdit.vue';
import PageNav from '@theme/PageNav.vue';

const props = defineProps({ sidebarItems: Array });
</script>

<template>
  <main class="page">
    <slot name="top" />

    <div class="theme-dumi-content">
      <Content />
    </div>
    <PageEdit />

    <PageNav v-bind="{ sidebarItems: props.sidebarItems }" />

    <slot name="bottom" />
  </main>
</template>

<style lang="stylus">
@require '../styles/palette.styl';
@require '../styles/wrapper.styl'

.page
  padding-bottom 2rem
  display block
</style>
