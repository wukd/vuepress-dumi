<script setup lang="ts">
import AutoLink from '@theme/AutoLink.vue';
import DropdownTransition from '@theme/DropdownTransition.vue';
import { computed, ref, toRefs } from 'vue';
import type { PropType } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { usePageFrontmatter } from '@vuepress/client';
import { useThemeLocaleData } from '@vuepress/plugin-theme-data/lib/client';

import type { ResolvedSidebarItem } from '../../shared';
import { isActiveSidebarItem } from '../utils';

const props = defineProps({
  item: {
    type: Object as PropType<ResolvedSidebarItem>,
    required: true,
  },
  depth: {
    type: Number,
    required: false,
    default: 0,
  },
});

const { item, depth } = toRefs(props);
const route = useRoute();
const router = useRouter();
const pageFrontmatter = usePageFrontmatter();
const themeLocaleData = useThemeLocaleData();

const maxDepth = [
  pageFrontmatter.value.sidebarDepth,
  themeLocaleData.value.sidebarDepth,
  1,
].find((depth) => depth !== undefined);
const isActive = computed(() => isActiveSidebarItem(item.value, route));
const itemClass = computed(() => ({
  'sidebar-item': true,
  'sidebar-heading': depth.value === 0,
  active: isActive.value,
  collapsible: item.value.collapsible,
}));

const isOpen = ref(true);
const onClick = ref<(() => void) | undefined>(undefined);

if (item.value.collapsible) {
  // active item is open by default
  isOpen.value = isActive.value;
  // toggle open status on click
  onClick.value = () => {
    isOpen.value = !isOpen.value;
  };
  // reset open status after navigation
  router.afterEach(() => {
    isOpen.value = isActive.value;
  });
}
</script>

<template>
  <li>
    <AutoLink v-if="item.link" :class="itemClass" :item="item" />
    <p v-else tabindex="0" :class="itemClass" @click="onClick" @keydown.enter="onClick">
      {{ item.text }}
      <span v-if="item.collapsible" class="arrow" :class="isOpen ? 'down' : 'right'" />
    </p>

    <DropdownTransition v-if="item.children?.length && depth < maxDepth - 1">
      <ul v-show="isOpen" class="sidebar-item-children">
        <SidebarItem
          v-for="child in item.children"
          :key="`${depth}${child.text}${child.link}`"
          :item="child"
          :depth="depth + 1"
        />
      </ul>
    </DropdownTransition>
  </li>
</template>

<style lang="stylus">
@require '../styles/palette.styl'

.sidebar .sidebar-item-children
  padding-left 1rem
  font-size 0.95em

a.sidebar-item
  font-size 1em
  font-weight 400
  position: relative
  display inline-block
  color $textColor
  border-right 0.25rem solid transparent
  padding 0.35rem 1rem 0.35rem 1.25rem
  line-height 2
  width: 100%
  box-sizing: border-box

  &::before
    content: ''
    position: absolute
    top: 50%
    margin-left: -10px
    display: inline-block
    width: 5px
    height: 5px
    background-color: $accentColor
    border-radius: 50%
    opacity: 0
    transition: transform 0.2s, opacity 0.2s
    transform: scale(0) translate(-10px, -50%)

  &:hover
    color $accentColor

  &.active
    color $accentColor
    border-right-color $accentColor
    background linear-gradient(270deg, #f8faff, rgba(248,250,255,0))
    font-weight: 500

  .sidebar-group &
    padding-right 2rem

  .sidebar-item-children &
    border-right none
    background: none;
    &.active
      &::before
        opacity: 1;
        transform: scale(1) translate(0, -50%);
</style>
