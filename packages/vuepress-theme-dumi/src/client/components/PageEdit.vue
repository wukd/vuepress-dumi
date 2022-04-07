<script setup lang="ts">
import { computed } from 'vue';
import { usePageFrontmatter, usePageData } from '@vuepress/client';
import { useThemeLocaleData } from '@vuepress/plugin-theme-data/lib/client';

import { endingSlashRE, outboundRE } from '../utils';

const pageFrontmatter = usePageFrontmatter();
const themeLocaleData = useThemeLocaleData();
const pageData = usePageData();

const lastUpdated = computed(() => {
  return pageFrontmatter.value.lastUpdated;
});

const lastUpdatedText = computed(() => {
  if (typeof themeLocaleData.value.lastUpdated === 'string') {
    return themeLocaleData.value.lastUpdated;
  }

  return 'Last Updated';
});

const editLink = computed(() => {
  const showEditLink =
    pageFrontmatter.value.editLink === undefined || pageFrontmatter.value.editLink === null
      ? themeLocaleData.value.editLinks
      : pageFrontmatter.value.editLink;

  const { repo, docsDir = '', docsBranch = 'master', docsRepo = repo } = themeLocaleData.value;

  if (showEditLink && docsRepo && pageData.value.path) {
    return createEditLink(repo, docsRepo, docsDir, docsBranch, pageData.value.path);
  }
  return null;
});

const editLinkText = computed(() => {
  return themeLocaleData.value.editLinkText || 'Edit this page';
});

const createEditLink = (repo, docsRepo, docsDir, docsBranch, path) => {
  const bitbucket = /bitbucket.org/;
  if (bitbucket.test(docsRepo)) {
    const base = docsRepo;
    return (
      base.replace(endingSlashRE, '') +
      '/src' +
      `/${docsBranch}/` +
      (docsDir ? docsDir.replace(endingSlashRE, '') + '/' : '') +
      path +
      `?mode=edit&spa=0&at=${docsBranch}&fileviewer=file-view-default`
    );
  }

  const gitlab = /gitlab.com/;
  if (gitlab.test(docsRepo)) {
    const base = docsRepo;
    return (
      base.replace(endingSlashRE, '') +
      '/-/edit' +
      `/${docsBranch}/` +
      (docsDir ? docsDir.replace(endingSlashRE, '') + '/' : '') +
      path
    );
  }

  const base = outboundRE.test(docsRepo) ? docsRepo : `https://github.com/${docsRepo}`;
  return (
    base.replace(endingSlashRE, '') +
    '/edit' +
    `/${docsBranch}/` +
    (docsDir ? docsDir.replace(endingSlashRE, '') + '/' : '') +
    path
  );
};
</script>

<template>
  <footer class="page-edit">
    <div v-if="editLink" class="edit-link">
      <a :href="editLink" target="_blank" rel="noopener noreferrer">{{ editLinkText }}</a>
      <ExternalLinkIcon />
    </div>

    <div v-if="lastUpdated" class="last-updated">
      <span class="prefix">{{ lastUpdatedText }}:</span>
      <span class="time">{{ lastUpdated }}</span>
    </div>
  </footer>
</template>

<style lang="stylus">
@require '../styles/palette.styl'
@require '../styles/wrapper.styl'

.page-edit
  @extend $wrapper
  padding-top 1rem
  padding-bottom 1rem
  overflow auto

  .edit-link
    display inline-block
    a
      color lighten($textColor, 25%)
      margin-right 0.25rem
  .last-updated
    float right
    font-size 0.9em
    .prefix
      font-weight 500
      color lighten($textColor, 25%)
    .time
      font-weight 400
      color #767676

@media (max-width: $MQMobile)
  .page-edit
    .edit-link
      margin-bottom 0.5rem
    .last-updated
      font-size 0.8em
      float none
      text-align left
</style>
