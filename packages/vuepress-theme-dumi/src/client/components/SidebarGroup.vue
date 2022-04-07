<script setup lang="ts">
import { toRefs } from 'vue';
import { useRoute } from 'vue-router';

import DropdownTransition from '@theme/DropdownTransition.vue';
import SidebarLinks from '@theme/SidebarLinks.vue';
import { isActive } from '../utils';

const props = defineProps(['item', 'open', 'collapsable', 'depth']);

const { item, open, collapsable, depth } = toRefs(props);
const route = useRoute();
</script>

<template>
  <section
    class="sidebar-group"
    :class="[
      {
        collapsable,
        'is-sub-group': depth !== 0,
      },
      `depth-${depth}`,
    ]"
  >
    <RouterLink
      v-if="item.path"
      class="sidebar-heading clickable"
      :class="{
        open,
        active: isActive(route, item.path),
      }"
      :to="item.path"
      @click.native="$emit('toggle')"
    >
      <span>{{ item.title }}</span>
      <span v-if="collapsable" class="arrow" :class="open ? 'down' : 'right'" />
    </RouterLink>

    <p v-else class="sidebar-heading" :class="{ open }" @click="$emit('toggle')">
      <span>{{ item.title }}</span>
      <span v-if="collapsable" class="arrow" :class="open ? 'down' : 'right'" />
    </p>

    <DropdownTransition>
      <SidebarLinks
        v-if="open || !collapsable"
        class="sidebar-group-items"
        :items="item.children"
        :sidebar-depth="item.sidebarDepth"
        :initial-open-group-index="item.initialOpenGroupIndex"
        :depth="depth + 1"
      />
    </DropdownTransition>
  </section>
</template>

<style lang="stylus">
@require '../styles/palette.styl'
  
.sidebar-group
  .sidebar-group
    padding-left 0.5em
  &:not(.collapsable)
    .sidebar-heading:not(.clickable)
      cursor auto
      color inherit
  // refine styles of nested sidebar groups
  &.is-sub-group
    padding-left 0
    & > .sidebar-heading
      font-size 0.95em
      line-height 1.4
      font-weight normal
      padding-left 2rem
      &:not(.clickable)
        opacity 0.5
    & > .sidebar-group-items
      padding-left 1rem
      & > li > .sidebar-link
        font-size 0.95em
        border-left none
  &.depth-2
    & > .sidebar-heading
      border-left none

.sidebar-heading
  color $textColor
  transition color .15s ease
  cursor pointer
  font-size 0.6em
  // text-transform uppercase
  padding 0.35rem 1.5rem 0.35rem 1.25rem
  width 100%
  box-sizing border-box
  margin 0
  color #8f9bb3
  line-height 2.8
  margin-bottom 0.4rem

  &.open, &:hover
    color inherit
  .arrow
    position relative
    top -0.12em
    left 0.5em
  &.clickable
    &.active
      font-weight 600
      color $accentColor
    &:hover
      color $accentColor

.sidebar-group-items
  transition height .1s ease-out
  font-size 0.95em
  overflow hidden
</style>
