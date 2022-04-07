import { defineClientAppEnhance } from '@vuepress/client';
import Previewer from './Previewer.vue';

export default defineClientAppEnhance(({ app }) => {
  app.component('Previewer', Previewer);
});
