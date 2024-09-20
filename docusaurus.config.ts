import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: '前端面试',
  tagline: '前端面试题收集汇总并全面给出权威优质的答案，更欢迎👏大家issues投稿 ❤️ 💞 💖，一起维护一套优质权威的前端知识体系。',
  favicon: 'img/favicon.ico',
  url: 'https://gvray.github.io',
  baseUrl: '/FE-interview',
  organizationName: 'gvray',
  projectName: 'FE-interview',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans'],
  },
  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl:
            'https://github.com/gvray/FE-interview/tree/main/',
          sidebarCollapsed: true,
        },
        blog: {
          showReadingTime: true,
          editUrl:
            'https://github.com/gvray/FE-interview/tree/main/',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: '前端面试',
      logo: {
        alt: '前端面试',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docs',
          position: 'left',
          label: '面试题',
        },
        {
          to: '/blog',
          label: '实战博客',
          position: 'left',
        },
        {
          type: 'dropdown',
          label: '知识体系',
          position: 'left',
          items: [
            {
              type: 'doc',
              label: '前端基础',
              docId: 'javascript/README',
            },
            {
              type: 'doc',
              label: '前端框架',
              docId: 'react/README',
            },
            {
              type: 'doc',
              label: '工程化',
              docId: 'webpack/README',
            },
            {
              type: 'doc',
              label: '算法与数据结构',
              docId: 'algorithm/README',
            },
          ],
        },
        {
          href: 'https://github.com/gvray/FE-interview',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: '面试题',
          items: [
            { label: 'JavaScript', to: '/docs/javascript/' },
            { label: 'TypeScript', to: '/docs/typescript/' },
            { label: 'React', to: '/docs/react/' },
            { label: 'Vue', to: '/docs/vue/' },
            { label: 'CSS', to: '/docs/css/' },
            { label: '浏览器', to: '/docs/browser/' },
          ],
        },
        {
          title: '技术栈',
          items: [
            { label: '工程化', to: '/docs/webpack/' },
            { label: 'Node.js', to: '/docs/node/' },
            { label: '算法', to: '/docs/algorithm/' },
            { label: '数据结构', to: '/docs/data-structures/' },
            { label: '设计模式', to: '/docs/design-patterns/' },
            { label: 'AI', to: '/docs/ai/' },
          ],
        },
        {
          title: '多端开发',
          items: [
            { label: '小程序', to: '/docs/miniprogram/' },
            { label: '移动端', to: '/docs/mobile/' },
            { label: '跨端框架', to: '/docs/taro/' },
            { label: '桌面端', to: '/docs/electron/' },
          ],
        },
        {
          title: '更多',
          items: [
            { label: '实战博客', to: '/blog' },
            { label: 'GitHub', href: 'https://github.com/gvray/FE-interview' },
            { label: '贡献指南', href: 'https://github.com/gvray/FE-interview/blob/main/README.md' },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} FE-interview. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
    docs: {
      sidebar: {
        autoCollapseCategories: true,
      },
    },
    announcementBar: {
      id: 'announcementBar-1',
      content: `⭐️ 如果您喜欢本网站，请点这里在<a target="_blank" class="cta" href="https://github.com/gvray/FE-interview"> <strong>GitHub</strong> </a>上给它一颗小星星！ ⭐️`,
      isCloseable: true,
      backgroundColor: '#6366f1',
      textColor: '#ffffff',
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
