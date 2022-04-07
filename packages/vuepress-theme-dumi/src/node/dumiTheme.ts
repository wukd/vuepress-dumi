import type { Theme, ThemeObject, Page, ThemeConfig } from '@vuepress/core';
import { fs, path } from '@vuepress/utils';

import type {
  DefaultThemeLocaleOptions,
  DefaultThemePluginsOptions,
  DefaultThemePageData,
} from '../shared';

import {
  assignDefaultLocaleOptions,
  resolveActiveHeaderLinksPluginOptions,
  resolveContainerPluginOptions,
  resolveContainerPluginOptionsForDetails,
  resolveContainerPluginOptionsForCodeGroup,
  resolveContainerPluginOptionsForCodeGroupItem,
  resolveExternalLinkIconPluginOptions,
} from './utils';

export interface DumiThemeOptions extends ThemeConfig, DefaultThemeLocaleOptions {
  /**
   * To avoid confusion with the root `plugins` option,
   * we use `themePlugins`
   */
  themePlugins?: DefaultThemePluginsOptions;
}

export const dumiTheme: Theme<DumiThemeOptions> = (
  { themePlugins = {}, ...localeOptions },
  app
): ThemeObject => {
  if (app.options.bundler.endsWith('vite')) {
    // eslint-disable-next-line import/no-extraneous-dependencies
    app.options.bundlerConfig.viteOptions = require('vite').mergeConfig(
      app.options.bundlerConfig.viteOptions,
      {
        css: {
          preprocessorOptions: {
            scss: { charset: false },
          },
        },
      }
    );
  }

  assignDefaultLocaleOptions(localeOptions);

  return {
    name: 'vuepress-theme-dumi',

    layouts: path.resolve(__dirname, '../client/layouts'),

    templateBuild: path.resolve(__dirname, '../../templates/index.build.html'),

    // use alias to make all components replaceable
    alias: Object.fromEntries(
      fs
        .readdirSync(path.resolve(__dirname, '../client/components'))
        .filter((file) => file.endsWith('.vue'))
        .map((file) => [`@theme/${file}`, path.resolve(__dirname, '../client/components', file)])
    ),

    clientAppEnhanceFiles: path.resolve(__dirname, '../client/clientAppEnhance.js'),

    clientAppSetupFiles: path.resolve(__dirname, '../client/clientAppSetup.js'),

    extendsPage: (page: Page<Partial<DefaultThemePageData>>) => {
      // save relative file path into page data to generate edit link
      page.data.filePathRelative = page.filePathRelative;
      // save title into route meta to generate navbar and sidebar
      page.routeMeta.title = page.title;
    },

    plugins: [
      ['@vuepress/active-header-links', resolveActiveHeaderLinksPluginOptions(themePlugins)],
      ['@vuepress/back-to-top', themePlugins.backToTop !== false],

      ['@vuepress/container', resolveContainerPluginOptions(themePlugins, localeOptions, 'tip')],
      [
        '@vuepress/container',
        resolveContainerPluginOptions(themePlugins, localeOptions, 'warning'),
      ],
      ['@vuepress/container', resolveContainerPluginOptions(themePlugins, localeOptions, 'danger')],
      ['@vuepress/container', resolveContainerPluginOptionsForDetails(themePlugins)],
      ['@vuepress/container', resolveContainerPluginOptionsForCodeGroup(themePlugins)],
      ['@vuepress/container', resolveContainerPluginOptionsForCodeGroupItem(themePlugins)],
      [
        '@vuepress/external-link-icon',
        resolveExternalLinkIconPluginOptions(themePlugins, localeOptions),
      ],
      ['@vuepress/nprogress', themePlugins.nprogress !== false],
      ['@vuepress/prismjs', themePlugins.prismjs !== false],
      ['@vuepress/search', true],
      ['@vuepress/theme-data', { themeData: localeOptions }],
    ],
  };
};
