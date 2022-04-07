import type { Plugin } from '@vuepress/core';
import type * as Token from 'markdown-it/lib/token';
import { path } from '@vuepress/utils';
import * as container from 'markdown-it-container';

export interface DumiPreviewerPluginOptions {
  marker?: string;
  scopeMaker?: string;
}

export type RenderPlaceFunction = (info: string) => string;

export const dumiPreviewerPlugin: Plugin<DumiPreviewerPluginOptions> = ({
  marker = 'demo',
  scopeMaker = 'demo[scope]',
}) => {
  function render(tokens: Token[], index: number, endType: string, scope: boolean): string {
    const { nesting } = tokens[index];

    if (nesting === -1) {
      return '</template></Previewer>\n';
    }

    let htmlStr = '';
    let lastLine = 0;

    for (let idx = index; idx < tokens.length; idx++) {
      const { map, type, content } = tokens[idx];

      if (type === endType) break;

      // add empty lines
      if (map) {
        const delta = map[0] - (lastLine || map[1]);

        if (delta > 0) {
          htmlStr += '\n'.repeat(delta);
        }

        lastLine = map[1];
      }

      htmlStr += content;
    }

    return `
          <Previewer
            :scope="${scope}"
            code="${encodeURIComponent(htmlStr)}"
          >
            <template slot="demo">
        `;
  }

  function slotRender(tokens, index) {
    return render(tokens, index, `container_${marker}_close`, false);
  }

  function scopeRender(tokens, index) {
    return render(tokens, index, `container_${scopeMaker}_close`, true);
  }

  return {
    name: 'vuepress-plugin-dumi-previewer',
    clientAppEnhanceFiles: [path.resolve(__dirname, '../client/clientAppEnhance.js')],
    extendsMarkdown: (md) => {
      md.use(container, marker, { render: slotRender });
      md.use(container, scopeMaker, { render: scopeRender });
    },
  };
};
