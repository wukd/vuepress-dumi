<script setup lang="ts">
import { computed } from 'vue';
import { useSiteData, usePageData, useRouter } from '@vuepress/client';
import { useThemeData, useThemeLocaleData } from '@vuepress/plugin-theme-data/lib/client';

import DropdownLink from '@theme/DropdownLink.vue';
import AutoLink from '@theme/AutoLink.vue';
import { resolveNavLinkItem } from '../utils';

const siteData = useSiteData();
const pageData = usePageData();
const router = useRouter();
const themeData = useThemeData();
const themeLocaleData = useThemeLocaleData();
const userNav = computed(() => {
  return themeLocaleData.value.navbar || [];
});
const nav = computed(() => {
  const { locales } = siteData.value;
  if (locales && Object.keys(locales).length > 1) {
    const currentLink = pageData.value.path;
    const routes = router.options.routes;
    const themeLocales = themeData.value.themeConfig.locales || {};
    const languageDropdown = {
      text: themeLocaleData.value.selectText || 'Languages',
      ariaLabel: themeLocaleData.value.ariaLabel || 'Select language',
      items: Object.keys(locales).map((path) => {
        const locale = locales[path];
        const text = (themeLocales[path] && themeLocales[path].label) || locale.lang;
        let link;
        // Stay on the current page
        if (locale.lang === siteData.value.lang) {
          link = currentLink;
        } else {
          // Try to stay on the same page
          link = currentLink.replace(pageData.value.path, path);
          // fallback to homepage
          if (!routes.some((route) => route.path === link)) {
            link = path;
          }
        }
        return { text, link };
      }),
    };
    return [userNav.value, languageDropdown];
  }
  return userNav.value;
});

const userLinks = computed(() => {
  return (nav.value || []).map((link) => {
    return Object.assign(resolveNavLinkItem(link), {
      items: (link.items || []).map(resolveNavLinkItem),
    });
  });
});

const repoLink = computed(() => {
  const { repo } = themeData.value;
  if (repo) {
    return /^https?:/.test(repo) ? repo : `https://github.com/${repo}`;
  }
  return null;
});

const repoLabel = computed(() => {
  if (!repoLink.value) return;
  if (themeData.value.repoLabel) {
    return themeData.value.repoLabel;
  }

  const repoHost = repoLink.value.match(/^https?:\/\/[^/]+/)[0];
  const platforms = ['GitHub', 'GitLab', 'Bitbucket'];
  for (let i = 0; i < platforms.length; i++) {
    const platform = platforms[i];
    if (new RegExp(platform, 'i').test(repoHost)) {
      return platform;
    }
  }

  return 'Source';
});
</script>

<template>
  <nav v-if="userLinks.length || repoLink" class="nav-links">
    <!-- user links -->
    <div v-for="item in userLinks" :key="item.link" class="nav-item">
      <DropdownLink v-if="item.type === 'links'" :item="item" />
      <AutoLink v-else :item="item" />
    </div>

    <!-- repo link -->
    <a v-if="repoLink" :href="repoLink" class="repo-link" target="_blank" rel="noopener noreferrer">
      {{ repoLabel }}
      <ExternalLinkIcon />
    </a>
  </nav>
</template>

<style lang="stylus">
@require '../styles/palette.styl'

.nav-links
  display inline-block
  height 100%
  line-height $navbarHeight
  color #4d5164
  a
    line-height 1.4rem
    color inherit
    &:hover, &.router-link-active
      color $accentColor

  .nav-item
    position relative
    display inline-block
    margin-left 2rem
    &:first-child
      margin-left 1rem
    .external
      svg
        color $arrowBgColor

  .repo-link
    margin-left 2rem
    svg
      color $arrowBgColor

@media (max-width: $MQMobile)
  .nav-links
    height auto
    .nav-item
      &:first-child
        margin-left 0
    .nav-item, .repo-link
      margin-left 0

@media (min-width: $MQMobile)
  .nav-links a
    &:hover
      color $accentColor

      svg
        color $accentColor

    &.router-link-active
      color $accentColor
      &::after
        content: ''
        position: absolute
        bottom: 0
        left: -2px
        right: -2px
        height: 2px
        background-color: $accentColor
        border-radius: 1px
  .nav-item > a:not(.external)
    &:hover, &.router-link-active
      margin-bottom -2px
</style>
