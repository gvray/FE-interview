import clsx from 'clsx';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: JSX.Element;
  link: string;
};

const FeatureList: FeatureItem[] = [
  {
    title: '前端面试宝典',
    Svg: require('@site/static/img/feature-interview.svg').default,
    description: (
      <>
        系统化整理 HTML、CSS、JavaScript、React、Vue 等核心知识点，
        覆盖高频面试题目，助你轻松应对技术面试。
      </>
    ),
    link: '/docs',
  },
  {
    title: 'AI 应用开发',
    Svg: require('@site/static/img/feature-ai.svg').default,
    description: (
      <>
        深入学习 LangChain、RAG、Agent 等大模型应用开发技术，
        掌握 AI 时代的必备技能，打造智能化应用。
      </>
    ),
    link: '/docs/ai',
  },
  {
    title: '开源共建',
    Svg: require('@site/static/img/feature-community.svg').default,
    description: (
      <>
        欢迎参与文档贡献和问题讨论，一起打造最全面的前端知识库。
        通过开源协作，共同成长，互相学习。
      </>
    ),
    link: 'https://github.com/gvray/FE-interview',
  },
];

function Feature({title, Svg, description, link}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className={styles.featureCard}>
        <Svg className={styles.featureSvg} role="img" />
        <h3 className={styles.featureTitle}>{title}</h3>
        <p className={styles.featureDesc}>{description}</p>
        <Link className={styles.featureLink} to={link}>
          了解更多 →
        </Link>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className={styles.featuresHeader}>
          <h2 className={styles.featuresTitle}>核心内容</h2>
          <p className={styles.featuresSubtitle}>三大板块助你全面提升</p>
        </div>
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
