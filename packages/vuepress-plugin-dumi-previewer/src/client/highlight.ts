import prism from 'prismjs';
import loadLanguages from 'prismjs/components/index';
import escapeHtml from 'escape-html';

function wrap(code: string, lang: string) {
  if (lang === 'text') {
    code = escapeHtml(code);
  }
  return `<pre v-pre class="language-${lang}"><code>${code}</code></pre>`;
}

function getLangCodeFromExtension(extension: string) {
  const extensionMap = {
    vue: 'markup',
    html: 'markup',
    md: 'markdown',
    rb: 'ruby',
    ts: 'typescript',
    py: 'python',
    sh: 'bash',
    yml: 'yaml',
    styl: 'stylus',
    kt: 'kotlin',
    rs: 'rust',
  };

  return extensionMap[extension] || extension;
}

export default (str: string, lang: string) => {
  if (!lang) {
    return wrap(str, 'text');
  }
  lang = lang.toLowerCase();
  const rawLang = lang;

  lang = getLangCodeFromExtension(lang);

  if (!prism.languages[lang]) {
    try {
      loadLanguages([lang]);
    } catch (e) {
      console.warn(`[vuepress] Syntax highlight for language "${lang}" is not supported.`);
    }
  }
  if (prism.languages[lang]) {
    const code = prism.highlight(str, prism.languages[lang], lang);
    return wrap(code, rawLang);
  }
  return wrap(str, 'text');
};
