<h1 align="center">vuepress-theme-dumi</h1>

📖 A dumi style theme for VuePress2.


## Install

* First of all, install [vuepress v2.x](https://github.com/vuepress/vuepress-next)

* Then install the theme

```bash
$ npm i -D vuepress-theme-dumi
# OR
$ yarn add -D vuepress-theme-dumi
```

## Usage
Write vuepress config

```ts
// .vuepress/config.ts
import { defineUserConfig } from 'vuepress'
import type { DefaultThemeOptions } from 'vuepress'

export default defineUserConfig<DefaultThemeOptions>({
    theme: 'vuepress-theme-dumi'
})
```

## Thanks

This repo is inspired by the following projects, Thanks for their great work.

- [dumi](https://github.com/umijs/dumi)
- [@vuepress/theme-default](https://github.com/vuepress/vuepress-next/tree/main/packages/%40vuepress/theme-default)
- [vuepress-theme-dumi](https://github.com/OrekiSH/vuepress-dumi)

