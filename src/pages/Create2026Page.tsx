import { useEffect } from 'react';
import { ArrowUpRight, Building2, CheckCircle2, ChevronsDown, CircleDot, DatabaseZap, Gauge, Layers3, Route, Sparkles, UsersRound } from 'lucide-react';
import './Create2026Page.css';

type Insight = {
  id: string;
  index: string;
  eyebrow: string;
  title: string;
  summary: string;
  quote: string;
  image: string;
  imageAlt: string;
  icon: typeof Gauge;
};

const imageBase = '/create2026/assets';

const insights: Insight[] = [
  {
    id: 'direction',
    index: '01',
    eyebrow: '方向感',
    title: '百度可以吐槽，但有些判断值得留意',
    summary:
      '2023 年行业还在卷参数时，李彦宏强调应用价值；2024 年大家等超级应用时，他更看好智能体。今天回头看，这些判断确实踩中了 AI 落地的节奏。',
    quote: '调侃归调侃，百度总是能起个大早，说明方向感还是值得留意。',
    image: `${imageBase}/overview.png`,
    imageAlt: 'Create2026 大会概览',
    icon: CircleDot,
  },
  {
    id: 'daa',
    index: '02',
    eyebrow: 'DAA',
    title: '少看热闹，多看交付',
    summary:
      '过去互联网看 DAU，AI 时代更该看每天有多少 Agent 在替人干活。对组织来说，AI 转型要少看工具使用人数，多看真实任务有没有被改造。',
    quote: '从 AI 使用率，走向 AI 任务闭环率。',
    image: `${imageBase}/daa.png`,
    imageAlt: '从 DAU 到 DAA',
    icon: Gauge,
  },
  {
    id: 'evolution',
    index: '03',
    eyebrow: '三层进化',
    title: 'Agent、个人和组织一起变',
    summary:
      '智能体开始拆任务、调工具、吸收反馈；个人可以调用一组 AI 能力扩展工作边界；组织则走向人和 Agent 的混合协作。',
    quote: '这套框架真正有意思的地方，是把 AI 从工具问题推到了组织问题。',
    image: `${imageBase}/evolution.png`,
    imageAlt: 'Agent、个人与组织三层进化',
    icon: Layers3,
  },
  {
    id: 'data',
    index: '04',
    eyebrow: '数据底座',
    title: '让 AI 读懂业务，而不只是读材料',
    summary:
      '百度胜算这类产品的启发在于，企业 AI 落地的难点常常不在有没有数据，而在数据背后的对象、关系、规则和流程有没有被建模。',
    quote: '智库的数据资产，光存起来不够，关键是让 AI 能理解、能推理、能调用。',
    image: `${imageBase}/databuilder.png`,
    imageAlt: '百度胜算与业务本体',
    icon: DatabaseZap,
  },
  {
    id: 'opc',
    index: '05',
    eyebrow: 'Super OPC',
    title: '把试点经验变成组织能力',
    summary:
      'Super OPC 不宜讲成个人英雄叙事。真正有价值的，是小团队先跑通具体场景，再把经验扩散到更多课题、更多业务、更多对外服务里。',
    quote: '重点不在某个人变得多厉害，而在试点经验能不能变成组织能力。',
    image: `${imageBase}/opc.png`,
    imageAlt: 'Super OPC 组织能力沉淀',
    icon: UsersRound,
  },
];

const takeaways = [
  {
    label: '衡量方式',
    value: '从使用量到任务闭环',
    detail: '培训、注册、调用都只是表层指标，真正要看任务有没有被 AI 接住。',
  },
  {
    label: '落地基础',
    value: '从知识库到业务本体',
    detail: '数据需要带着对象、关系和语义进入模型，AI 才能理解真实业务。',
  },
  {
    label: '组织形态',
    value: '从单点试用到组织沉淀',
    detail: '小团队跑通的流程，要沉淀成模板、工具和公共能力。',
  },
];

function Create2026Page() {
  useEffect(() => {
    document.title = '百度又起了个大早？聊聊 AI 落地真问题 | HIIC AI Lab';
  }, []);

  return (
    <main className="create2026-page">
      <section className="create-hero" id="top">
        <div className="create-hero__nav" aria-label="页面导航">
          <a href="/" className="create-logo" aria-label="回到 HIIC AI 主站">
            HIIC<span>AI Lab</span>
          </a>
          <div className="create-navlinks">
            <a href="#insights">现场观察</a>
            <a href="#takeaways">带回来的判断</a>
            <a href="#closing">结论</a>
          </div>
        </div>

        <div className="create-hero__content">
          <div className="create-hero__copy">
            <div className="create-kicker">
              <span>CREATE 2026</span>
              <span>北京现场观察</span>
              <span>AI 落地真问题</span>
            </div>
            <h1>百度又起了个大早？聊聊 AI 落地真问题</h1>
            <p className="create-hero__lead">
              上周去北京围观百度 Create 开发者大会。现场最强烈的感受是，AI 已经穿过模型和工具的热闹，
              开始进入企业工作流、数据底座和组织协作这些更具体的问题。
            </p>
            <div className="create-hero__actions">
              <a href="#insights" className="create-primary">
                进入观察
                <ChevronsDown size={18} />
              </a>
              <a href="https://www.feishu.cn/docx/B5CHdSu8cogPJOxdlLBc2LZhnic" className="create-secondary">
                飞书文档
                <ArrowUpRight size={18} />
              </a>
            </div>
          </div>

          <div className="create-hero__visual" aria-label="Create2026 视觉封面">
            <img src={`${imageBase}/cover.png`} alt="参加百度 Create 大会学习报告封面" />
            <div className="create-signal create-signal--top">
              <span>DAA</span>
              Daily Active Agents
            </div>
            <div className="create-signal create-signal--bottom">
              <span>OPC</span>
              试点经验变成组织能力
            </div>
          </div>
        </div>

        <div className="create-hero__stats" aria-label="核心观察指标">
          <div>
            <strong>5</strong>
            <span>个现场观察</span>
          </div>
          <div>
            <strong>3</strong>
            <span>层组织进化</span>
          </div>
          <div>
            <strong>90%</strong>
            <span>问题在工作流</span>
          </div>
        </div>
      </section>

      <section className="create-scene">
        <div className="create-section-label">
          <span>现场感</span>
          <Building2 size={18} />
        </div>
        <div className="create-scene__grid">
          <div>
            <h2>红旗招展、人山人海，AI 已经坐进了各行各业的会场。</h2>
            <p>
              大会本身的议程不需要过多介绍，网上报道和自媒体总结一搜就有。现场更值得记录的是，
              参会的不只是互联网和开发者圈子，金融、政务、制造、能源、交通、医疗、教育、文旅、媒体、
              央国企和专业服务机构都能看到身影。
            </p>
          </div>
          <figure>
            <img src={`${imageBase}/onsite.png`} alt="百度 Create 大会现场实拍" />
          </figure>
        </div>
      </section>

      <section className="create-insights" id="insights">
        <div className="create-section-heading">
          <span>OBSERVATIONS</span>
          <h2>这次真正值得看的，不只是产品。</h2>
          <p>
            把 DAA、智能体、业务本体和 Super OPC 放在一起看，会发现 AI 落地正在从“会不会用工具”，
            走向“能不能重做工作系统”。
          </p>
        </div>

        <div className="create-timeline">
          {insights.map((item) => {
            const Icon = item.icon;
            return (
              <article className="create-insight" key={item.id}>
                <div className="create-insight__marker">
                  <span>{item.index}</span>
                </div>
                <div className="create-insight__body">
                  <div className="create-insight__text">
                    <div className="create-insight__eyebrow">
                      <Icon size={18} />
                      {item.eyebrow}
                    </div>
                    <h3>{item.title}</h3>
                    <p>{item.summary}</p>
                    <blockquote>{item.quote}</blockquote>
                  </div>
                  <figure className="create-insight__image">
                    <img src={item.image} alt={item.imageAlt} />
                  </figure>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="create-takeaways" id="takeaways">
        <div className="create-section-label">
          <span>带回来的判断</span>
          <Route size={18} />
        </div>
        <h2>AI 落地开始拼真功夫了。</h2>
        <div className="create-takeaway-grid">
          {takeaways.map((item) => (
            <div className="create-takeaway" key={item.label}>
              <span>{item.label}</span>
              <h3>{item.value}</h3>
              <p>{item.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="create-closing" id="closing">
        <div className="create-closing__inner">
          <Sparkles size={28} />
          <p>
            变化不会一夜之间完成，但方向一旦清楚，真正的分化就已经开始了。
          </p>
          <div className="create-closing__meta">
            <span>HIIC AI 转型观察</span>
            <CheckCircle2 size={16} />
            <span>Create 2026</span>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Create2026Page;
