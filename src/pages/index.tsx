import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';

import styles from './index.module.css';

// Import SVG icons
import HeroSvg from '@site/static/img/hero-tech.svg';
import HTML5Icon from '@site/static/img/tech/html5.svg';
import CSS3Icon from '@site/static/img/tech/css3.svg';
import JavaScriptIcon from '@site/static/img/tech/javascript.svg';
import TypeScriptIcon from '@site/static/img/tech/typescript.svg';
import ReactIcon from '@site/static/img/tech/react.svg';
import VueIcon from '@site/static/img/tech/vue.svg';
import NextJSIcon from '@site/static/img/tech/nextjs.svg';
import NodeJSIcon from '@site/static/img/tech/nodejs.svg';
import WebpackIcon from '@site/static/img/tech/webpack.svg';
import ViteIcon from '@site/static/img/tech/vite.svg';
import TailwindIcon from '@site/static/img/tech/tailwind.svg';
import GitIcon from '@site/static/img/tech/git.svg';
import DockerIcon from '@site/static/img/tech/docker.svg';
import NginxIcon from '@site/static/img/tech/nginx.svg';
import PythonIcon from '@site/static/img/tech/python.svg';
import OpenAIIcon from '@site/static/img/tech/openai.svg';

import DocsIcon from '@site/static/img/stats/docs-new.svg';
import TopicsIcon from '@site/static/img/stats/topics-new.svg';
import CasesIcon from '@site/static/img/stats/cases-new.svg';
import UpdateIcon from '@site/static/img/stats/update-new.svg';

// Tech stack with real SVG icons
const techStack = [
  { name: 'HTML5', icon: HTML5Icon },
  { name: 'CSS3', icon: CSS3Icon },
  { name: 'JavaScript', icon: JavaScriptIcon },
  { name: 'TypeScript', icon: TypeScriptIcon },
  { name: 'React', icon: ReactIcon },
  { name: 'Vue', icon: VueIcon },
  { name: 'Next.js', icon: NextJSIcon },
  { name: 'Node.js', icon: NodeJSIcon },
  { name: 'Webpack', icon: WebpackIcon },
  { name: 'Vite', icon: ViteIcon },
  { name: 'Tailwind', icon: TailwindIcon },
  { name: 'Git', icon: GitIcon },
  { name: 'Docker', icon: DockerIcon },
  { name: 'Nginx', icon: NginxIcon },
  { name: 'Python', icon: PythonIcon },
  { name: 'OpenAI', icon: OpenAIIcon },
];

const stats = [
  { number: '300+', label: '面试题目', icon: DocsIcon },
  { number: '15+', label: '技术专题', icon: TopicsIcon },
  { number: '50+', label: '实战案例', icon: CasesIcon },
  { number: '24/7', label: '持续更新', icon: UpdateIcon },
];

function HomepageHeader() {
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <HeroSvg className={styles.heroBg} />
      <div className="container">
        <Heading as="h1" className="hero__title">
          前端知识体系 & AI 开发
        </Heading>
        <p className="hero__subtitle">
          系统化的前端面试知识库，涵盖基础、框架、工程化到 AI 应用开发，助你构建完整的技术能力图谱
        </p>
        <div className={styles.buttons}>
          <Link className={clsx('button button--lg', styles.btnPrimary)} to="/docs">
            开始学习
          </Link>
          <Link className={clsx('button button--lg', styles.btnSecondary)} to="/docs/ai">
            AI 开发专栏
          </Link>
        </div>
      </div>
    </header>
  );
}

function StatsSection() {
  return (
    <section className={styles.statsSection}>
      <div className="container">
        <div className={styles.statsGrid}>
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className={styles.statCard}>
                <Icon className={styles.statIcon} />
                <span className={styles.statNumber}>{stat.number}</span>
                <span className={styles.statLabel}>{stat.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function TechStackSection() {
  return (
    <section className={styles.techSection}>
      <div className="container">
        <h2 className={styles.sectionTitle}>覆盖技术栈</h2>
        <p className={styles.sectionSubtitle}>从前端基础到 AI 应用开发的完整知识体系</p>
        <div className={styles.techGrid}>
          {techStack.map((tech, idx) => {
            const Icon = tech.icon;
            return (
              <div key={idx} className={styles.techItem}>
                <Icon className={styles.techIcon} />
                <span className={styles.techName}>{tech.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description={`${siteConfig.tagline}`}>
      <HomepageHeader />
      <main>
        <StatsSection />
        <HomepageFeatures />
        <TechStackSection />
      </main>
    </Layout>
  );
}
