import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';

import styles from './index.module.css';

// Tech stack with real SVG icons
const techStack = [
  { name: 'HTML5', icon: require('@site/static/img/tech/html5.svg').default },
  { name: 'CSS3', icon: require('@site/static/img/tech/css3.svg').default },
  { name: 'JavaScript', icon: require('@site/static/img/tech/javascript.svg').default },
  { name: 'TypeScript', icon: require('@site/static/img/tech/typescript.svg').default },
  { name: 'React', icon: require('@site/static/img/tech/react.svg').default },
  { name: 'Vue', icon: require('@site/static/img/tech/vue.svg').default },
  { name: 'Next.js', icon: require('@site/static/img/tech/nextjs.svg').default },
  { name: 'Node.js', icon: require('@site/static/img/tech/nodejs.svg').default },
  { name: 'Webpack', icon: require('@site/static/img/tech/webpack.svg').default },
  { name: 'Vite', icon: require('@site/static/img/tech/vite.svg').default },
  { name: 'Tailwind', icon: require('@site/static/img/tech/tailwind.svg').default },
  { name: 'Git', icon: require('@site/static/img/tech/git.svg').default },
  { name: 'Docker', icon: require('@site/static/img/tech/docker.svg').default },
  { name: 'Nginx', icon: require('@site/static/img/tech/nginx.svg').default },
  { name: 'Python', icon: require('@site/static/img/tech/python.svg').default },
  { name: 'OpenAI', icon: require('@site/static/img/tech/openai.svg').default },
];

const stats = [
  { number: '300+', label: '面试题目', icon: '📝' },
  { number: '15+', label: '技术专题', icon: '📚' },
  { number: '50+', label: '实战案例', icon: '💻' },
  { number: '24/7', label: '持续更新', icon: '🔄' },
];

const HeroSvg = require('@site/static/img/hero-tech.svg').default;

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
          {stats.map((stat, idx) => (
            <div key={idx} className={styles.statCard}>
              <span className={styles.statIcon}>{stat.icon}</span>
              <span className={styles.statNumber}>{stat.number}</span>
              <span className={styles.statLabel}>{stat.label}</span>
            </div>
          ))}
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
