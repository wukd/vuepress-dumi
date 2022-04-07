<script setup lang="ts">
import { computed } from 'vue';
import type { PropType } from 'vue';
import { useSiteData } from '@vuepress/client';

import { isExternal, isMailto, isTel, ensureExt } from '../utils';

const props = defineProps({
  item: {
    type: Object as PropType<{
      text: string;
      link: string;
      target?: string;
      rel?: boolean | string;
    }>,
    required: true,
  },
});

const emit = defineEmits(['focusout']);

const link = computed(() => {
  return ensureExt(props.item.link);
});

const siteData = useSiteData();

const exact = computed(() => {
  if (siteData.value.locales) {
    return Object.keys(siteData.value.locales).some((rootLink) => rootLink === link.value);
  }
  return link.value === '/';
});

const isNonHttpURI = computed(() => {
  return isMailto(link.value) || isTel(link.value);
});

const isBlankTarget = computed(() => {
  return target.value === '_blank';
});

const isInternal = computed(() => {
  return !isExternal(link.value) && !isBlankTarget.value;
});

const target = computed(() => {
  if (isNonHttpURI.value) {
    return '';
  }
  if (props.item.target) {
    return props.item.target;
  }
  return isExternal(link.value) ? '_blank' : '';
});

const rel = computed(() => {
  if (isNonHttpURI.value) {
    return;
  }
  if (props.item.rel === false) {
    return;
  }
  if (typeof props.item.rel === 'string') {
    return props.item.rel;
  }
  return isBlankTarget.value ? 'noopener noreferrer' : undefined;
});

const focusoutAction = () => {
  emit('focusout');
};
</script>

<template>
  <RouterLink
    v-if="isInternal"
    class="nav-link"
    :to="link"
    :exact="exact"
    @focusout.native="focusoutAction"
  >
    {{ item.text }}
  </RouterLink>
  <a
    v-else
    :href="link"
    class="nav-link external"
    :target="target"
    :rel="rel"
    @focusout="focusoutAction"
  >
    {{ item.text }}
    <ExternalLinkIcon v-if="isBlankTarget" />
  </a>
</template>
