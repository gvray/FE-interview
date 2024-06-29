import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';

import styles from './index.module.css';

const stats = [
  { number: '300+', label: '面试题目' },
  { number: '10+', label: '技术专题' },
  { number: '50+', label: '实战案例' },
  { number: '24/7', label: '持续更新' },
];

const techStack = [
  { icon: '⚛️', name: 'React' },
  { icon: '💚', name: 'Vue' },
  { icon: '📦', name: 'Webpack' },
  { icon: '🔷', name: 'TypeScript' },
  { icon: '🎨', name: 'CSS' },
  { icon: '🌐', name: 'Node.js' },
  { icon: '🤖', name: 'AI' },
  { icon: '🔗', name: 'LangChain' },
];

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          前端知识体系 & AI 开发
        </Heading>
        <p className="hero__subtitle">
          系统化的前端面试知识库，涵盖基础、框架、工程化到 AI 应用开发，助你构建完整的技术能力图谱
        </p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs">
            📚 开始学习
          </Link>
          <Link
            className="button button--outline button--lg"
            to="/docs/ai"
            style={{ marginLeft: '1rem', color: 'white', borderColor: 'rgba(255,255,255,0.5)' }}>
            🤖 AI 开发专栏
          </Link>
        </div>
      </div>
    </header>
  );
}

function StatsSection() {
  return (
    <section className="stats-section">
      <div className="container">
        <div className="stats-grid">
          {stats.map((stat, idx) => (
            <div key={idx} className="stat-item">
              <span className="stat-number">{stat.number}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TechStackSection() {
  return (
    <section className="tech-section">
      <div className="container">
        <h2 className="section-title">覆盖技术栈</h2>
        <p className="section-subtitle">从前端基础到 AI 应用开发的完整知识体系</p>
        <div className="tech-grid">
          {techStack.map((tech, idx) => (
            <div key={idx} className="tech-item">
              <span className="tech-icon">{tech.icon}</span>
              <span className="tech-name">{tech.name}</span>
            </div>
          ))}
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
