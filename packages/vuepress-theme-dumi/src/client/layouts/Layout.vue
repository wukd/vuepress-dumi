<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useThemeLocaleData } from '@vuepress/plugin-theme-data/lib/client';
import { usePageFrontmatter } from '@vuepress/client';

import Home from '@theme/Home.vue';
import Navbar from '@theme/Navbar.vue';
import Page from '@theme/Page.vue';
import Sidebar from '@theme/Sidebar.vue';
import { useSidebarItems } from '../composables';

const emit = defineEmits(['toggle-sidebar']);
const isSidebarOpen = ref(false);
const themeLocale = useThemeLocaleData();
const frontmatter = usePageFrontmatter();

const shouldShowNavbar = computed(
  () => frontmatter.value.navbar !== false && themeLocale.value.navbar !== false
);
const sidebarItems = useSidebarItems();

const shouldShowSidebar = computed(() => {
  return (
    !frontmatter.value.home && frontmatter.value.sidebar !== false && sidebarItems.value.length
  );
});

const pageClasses = computed(() => {
  const userPageClass = frontmatter.value.pageClass;
  return [
    {
      'no-navbar': !shouldShowNavbar.value,
      'sidebar-open': isSidebarOpen.value,
      'no-sidebar': !shouldShowSidebar.value,
    },
    userPageClass,
  ];
});

const toggleSidebar = (to?: boolean): void => {
  isSidebarOpen.value = typeof to === 'boolean' ? to : !isSidebarOpen.value;
  emit('toggle-sidebar', isSidebarOpen.value);
};

const touchStart = { x: 0, y: 0 };
const onTouchStart = (e): void => {
  touchStart.x = e.changedTouches[0].clientX;
  touchStart.y = e.changedTouches[0].clientY;
};
const onTouchEnd = (e): void => {
  const dx = e.changedTouches[0].clientX - touchStart.x;
  const dy = e.changedTouches[0].clientY - touchStart.y;
  if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
    if (dx > 0 && touchStart.x <= 80) {
      toggleSidebar(true);
    } else {
      toggleSidebar(false);
    }
  }
};

// close sidebar after navigation
let unregisterRouterHook;
onMounted(() => {
  const router = useRouter();
  unregisterRouterHook = router.afterEach(() => {
    toggleSidebar(false);
  });
});
onUnmounted(() => {
  unregisterRouterHook();
});
</script>

<template>
  <div
    class="theme-container"
    :class="pageClasses"
    @touchstart="onTouchStart"
    @touchend="onTouchEnd"
  >
    <Navbar v-if="shouldShowNavbar" @toggle-sidebar="toggleSidebar" />

    <div class="sidebar-mask" @click="toggleSidebar(false)" />

    <!-- <Sidebar :items="sidebarItems" @toggle-sidebar="toggleSidebar">
      <template #top>
        <slot name="sidebar-top" />
      </template>
      <template #bottom>
        <slot name="sidebar-bottom" />
      </template>
    </Sidebar> -->
    <slot name="sidebar">
      <Sidebar>
        <template #top>
          <slot name="sidebar-top" />
        </template>
        <template #bottom>
          <slot name="sidebar-bottom" />
        </template>
      </Sidebar>
    </slot>

    <Home v-if="frontmatter.home" />

    <Page v-else :sidebar-items="sidebarItems">
      <template #top>
        <slot name="page-top" />
      </template>
      <template #bottom>
        <slot name="page-bottom" />
      </template>
    </Page>
  </div>
</template>
