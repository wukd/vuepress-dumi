<script setup lang="ts">
import { ref, toRefs, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import SidebarGroup from '@theme/SidebarGroup.vue';
import SidebarLink from '@theme/SidebarLink.vue';
import { isActive } from '../utils';

const props = defineProps([
  'items',
  'depth', // depth of current sidebar links
  'sidebarDepth', // depth of headers to be extracted
  'initialOpenGroupIndex',
]);
const route = useRoute();

const { items, depth, sidebarDepth, initialOpenGroupIndex } = toRefs(props);
const openGroupIndex = ref(initialOpenGroupIndex?.value || 0);

// close sidebar after navigation
let unregisterRouterHook;
onMounted(() => {
  const router = useRouter();
  unregisterRouterHook = router.afterEach(() => {
    refreshIndex();
  });
  refreshIndex();
});
onUnmounted(() => {
  unregisterRouterHook();
});

const refreshIndex = () => {
  const index = resolveOpenGroupIndex(route, items);
  if (index > -1) {
    openGroupIndex.value = index;
  }
};

const toggleGroup = (index) => {
  openGroupIndex.value = index === openGroupIndex ? -1 : index;
};

function resolveOpenGroupIndex(route, items) {
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (descendantIsActive(route, item)) {
      return i;
    }
  }
  return -1;
}

function descendantIsActive(route, item) {
  if (item.type === 'group') {
    return item.children.some((child) => {
      if (child.type === 'group') {
        return descendantIsActive(route, child);
      } else {
        return child.type === 'page' && isActive(route, child.path);
      }
    });
  }
  return false;
}
</script>

<template>
  <ul v-if="items.length" class="sidebar-links">
    <li v-for="(item, i) in items" :key="i">
      <SidebarGroup
        v-if="item.type === 'group'"
        :item="item"
        :open="i === openGroupIndex"
        :collapsable="item.collapsable || item.collapsible"
        :depth="depth"
        @toggle="toggleGroup(i)"
      />
      <SidebarLink v-else :sidebar-depth="sidebarDepth" :item="item" />
    </li>
  </ul>
</template>
