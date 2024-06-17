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
        alt: '前端面试 Logo',
        src: 'img/logo.svg',
      },
      items: [
        // {
        //   type: 'docSidebar',
        //   sidebarId: 'docs',
        //   position: 'left',
        //   label: '八股文',
        // },
        {
          type: 'docSidebar',
          sidebarId: 'basic',
          position: 'left',
          label: '基础',
        },
        {
          type: 'docSidebar',
          sidebarId: 'frame',
          position: 'left',
          label: '框架',
        },
        {
          type: 'docSidebar',
          sidebarId: 'advance',
          position: 'left',
          label: '进阶',
        },
        {
          type: 'docSidebar',
          sidebarId: 'ai',
          position: 'left',
          label: 'AI 开发',
        },
        {
          type: 'docSidebar',
          sidebarId: 'browser',
          position: 'left',
          label: '浏览器',
        },
        {
          type: 'docSidebar',
          sidebarId: 'pkg',
          position: 'left',
          label: '构建',
        },
        {to: '/blog', label: '实战案例', position: 'left'},
        {
          type: 'docSidebar',
          sidebarId: 'network',
          position: 'right',
          label: '计算机网络',
        },
        // {
        //   type: 'docSidebar',
        //   sidebarId: 'server',
        //   position: 'right',
        //   label: '服务端',
        // },
        {
          type: 'docSidebar',
          sidebarId: 'devops',
          position: 'right',
          label: '运维',
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
          title: '面试宝典',
          items: [
            {
              label: '八股文(ALL.)',
              to: '/docs',
            },
            {
              label: '设计模式',
              to: '/docs/category/设计模式',
            },
            {
              label: '算法',
              to: '/docs/category/算法',
            },
            {
              label: '软件服务',
              to: '/docs/category/软件服务',
            },
            {
              label: '服务端开发',
              to: '/docs/category/服务端开发',
            },
            {
              label: '手写练习场',
              to: '/docs/category/手写练习场',
            },
          ],
        },
        {
          title:'多端开发',
          items: [
            {
              label: '移动端',
              to: '#',
            },
            {
              label: '小程序',
              to: '#',
            },
            {
              label: '桌面软件',
              to: '/docs/category/移动端开发',
            },
           ]
        },
        {
          title: '社区',
          items: [
            {
              label: 'Stack Overflow',
              href: '#',
            },
          ],
        },
        {
          title: '更多',
          items: [
            {
              label: '博客',
              to: '/blog',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/gvray/FE-interview',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} FE-interview. Built with GavinRay's Docusaurus.`,
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
      backgroundColor: '#0AC1CF',
      textColor: '#000b34',
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
