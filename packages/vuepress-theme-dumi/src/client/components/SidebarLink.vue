<script lang="ts">
import { h, defineComponent } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import { usePageFrontmatter } from '@vuepress/client';
import { useThemeLocaleData } from '@vuepress/plugin-theme-data/lib/client';

import { isActive, hashRE } from '../utils';

export default defineComponent({
  props: ['item', 'sidebarDepth'],

  setup({ item, sidebarDepth }) {
    const pageFrontmatter = usePageFrontmatter();
    const route = useRoute();
    const themeLocaleData = useThemeLocaleData();

    return () => {
      // use custom active class matching logic
      // due to edge case of paths ending with / + hash
      const selfActive = isActive(route, item.link);
      // for sidebar: auto pages, a hash link should be active if one of its child
      // matches
      const active =
        item.type === 'auto'
          ? selfActive || item.children.some((c) => isActive(route, item.path + '#' + c.text))
          : selfActive;
      const link =
        item.type === 'external'
          ? renderExternal(item.link, item.text || item.link)
          : renderLink(item.link, item.text || item.link, active, 0);

      const maxDepth = [
        pageFrontmatter.value.sidebarDepth,
        sidebarDepth,
        themeLocaleData.value.sidebarDepth,
        themeLocaleData.value.sidebarDepth,
        1,
      ].find((depth) => depth !== undefined);

      const displayAllHeaders =
        themeLocaleData.value.displayAllHeaders || themeLocaleData.value.displayAllHeaders;

      if (item.type === 'auto') {
        return [link, renderChildren(item.children, item.path, route, maxDepth)];
      } else if ((active || displayAllHeaders) && !hashRE.test(item.link)) {
        // const children = groupHeaders(item.headers);
        return [link, renderChildren(item.children, item.link, route, maxDepth)];
      } else {
        return link;
      }
    };
  },
});

function renderLink(to, text, active, level) {
  const props: any = {
    to,
    activeClass: '',
    exactActiveClass: '',
    class: {
      active,
      'sidebar-link': true,
    },
  };

  if (level > 2) {
    props.style = {
      'padding-right': level + 'rem',
    };
  }

  return h(RouterLink, props, text);
}

function renderChildren(children, path, route, maxDepth, depth = 1) {
  if (!children || depth > maxDepth) return null;
  return h(
    'ul',
    { class: 'sidebar-sub-headers' },
    children.map((c) => {
      const active = isActive(route, path + '#' + c.text);
      return h('li', { class: 'sidebar-sub-header' }, [
        renderLink(path + '#' + c.text, c.text, active, c.level - 1),
        renderChildren(c.children, path, route, maxDepth, depth + 1),
      ]);
    })
  );
}

function renderExternal(to, text) {
  return h(
    'a',
    {
      attrs: {
        href: to,
        target: '_blank',
        rel: 'noopener noreferrer',
      },
      class: {
        'sidebar-link': true,
      },
    },
    [text, h('ExternalLinkIcon')]
  );
}
</script>

<style lang="stylus">
@require '../styles/palette.styl'

.sidebar .sidebar-sub-headers
  padding-left 1rem
  font-size 0.95em

a.sidebar-link
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

  .sidebar-sub-headers &
    border-right none
    background: none;
    &.active
      &::before
        opacity: 1;
        transform: scale(1) translate(0, -50%);
</style>
