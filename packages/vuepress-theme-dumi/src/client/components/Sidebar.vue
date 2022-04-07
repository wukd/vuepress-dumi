<script setup lang="ts">
import NavLinks from '@theme/NavLinks.vue';
import SidebarItems from '@theme/SidebarItems.vue'
</script>

<template>
  <aside class="sidebar">
    <NavLinks />
    <slot name="top" />
    <SidebarItems />
    <slot name="bottom" />
  </aside>
</template>

<style lang="stylus">
@require '../styles/palette.styl'
  
.sidebar
  ul
    padding 0
    margin 0
    list-style-type none
  a
    display inline-block
  .nav-links
    display none
    border-bottom 1px solid $borderColor
    padding 0.5rem 0 0.75rem 0
    a
      font-weight 600
    .nav-item, .repo-link
      display block
      line-height 1.25rem
      font-size 1.1em
      padding 0.5rem 0 0.5rem 1.5rem
  & > .sidebar-items
    padding 1.5rem 0
    margin-left 1.5rem
    & > li > a.sidebar-item
      font-size 1.1em
      line-height 2
      font-weight 500
    & > li:not(:first-child)
      margin-top .75rem

@media (max-width: $MQMobile)
  .sidebar
    .nav-links
      display block
      .dropdown-wrapper .nav-dropdown .dropdown-item a.router-link-active::after
        top calc(1rem - 2px)
    & > .sidebar-items
      padding 1rem 0
      margin-left: 0
</style>
