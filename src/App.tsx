import Experience from "./Experience";
import { useState } from "react";
import type { ReactNode } from "react";

const data = {
  overview: {
    name: "决策者 · DecisionMind",
    tagline: "中国民企一号位的 AI 思维伙伴",
    mission:
      "让每一个关键决策都有一个不说谎、不迎合、只讲真话的战略伙伴陪伴左右。",
    vision: "成为中国最受一号位信任的 AI 决策基础设施",
    highlights: [
      { label: "目标市场规模", value: "¥180亿+", sub: "中国高端企业服务市场" },
      { label: "首年目标客户", value: "500家", sub: "年收入5亿+民营企业" },
      { label: "客单价 (年费)", value: "¥30万", sub: "旗舰版 / 企业定制" },
      { label: "首年ARR目标", value: "¥1500万", sub: "保守预测" },
    ],
  },
  problem: [
    {
      icon: "🎭",
      title: "中层过滤与粉饰",
      desc: "汇报材料经过层层加工，CEO收到的信息已失真。项目完成率被高估，风险被隐藏，一号位在错误信息上做决策。",
    },
    {
      icon: "🧠",
      title: "关键决策孤独感",
      desc: "真正重大的战略决策，CEO无法与下属平等讨论，也难以找到真正懂自己业务又能保密的外部顾问。",
    },
    {
      icon: "💬",
      title: "关键对话缺乏准备",
      desc: "与核心合伙人摊牌、与资方谈判、处理高管危机——这些对话一旦说错，代价极高，但CEO往往只能临场发挥。",
    },
    {
      icon: "⏱️",
      title: "决策速度与质量的矛盾",
      desc: "市场变化快，CEO既要速度又要质量，传统咨询公司慢、贵、不懂内情，内部会议低效、没有结论。",
    },
  ],
  product: {
    core: [
      {
        name: "🔍 穿透汇报系统",
        desc: "CEO输入项目目标与关键里程碑，系统生成10-20个穿透性追问，帮助CEO识别汇报材料中的逻辑漏洞与数据水分，输出「实际完成概率评估报告」。",
        tag: "核心功能",
      },
      {
        name: "🧩 关键决策室",
        desc: "结构化引导CEO厘清决策背景、利益相关方、风险边界、不可逆性。AI扮演「魔鬼代言人」提出反驳，输出决策备忘录。",
        tag: "核心功能",
      },
      {
        name: "💡 关键对话沙盘",
        desc: "CEO描述即将发生的高风险对话，AI模拟对方视角进行角色扮演，预演最难的场景，提供话术建议与心理准备框架。",
        tag: "差异化亮点",
      },
      {
        name: "📊 战略思维伙伴",
        desc: "基于CEO的历史决策与业务背景，提供持续性的战略洞察推送、行业对标、思维挑战——不是信息聚合，而是思维对话。",
        tag: "长期价值",
      },
    ],
    moat: [
      "深度个性化：越用越懂CEO的思维风格与业务语境",
      "极致保密：私有化部署，数据不出企业",
      "认知护城河：积累CEO决策历史，形成不可迁移的「决策档案」",
    ],
  },
  market: {
    segments: [
      {
        name: "一线突破",
        desc: "年收入5-50亿民营企业CEO",
        size: "约8万人",
        price: "¥30万/年",
        priority: "高",
      },
      {
        name: "扩展市场",
        desc: "年收入50亿+大型民企高管团队",
        size: "约1.5万人",
        price: "¥80万+/年",
        priority: "中",
      },
      {
        name: "长尾市场",
        desc: "成长型中小企业主/创业者",
        size: "约200万人",
        price: "¥2万/年",
        priority: "后期",
      },
    ],
    gtm: [
      "私董会 & 商学院渠道切入（混沌、湖畔、正和岛）",
      "头部猎头/咨询公司联合推广",
      "口碑裂变：CEO推荐CEO（邀请制冷启动）",
      "标杆案例背书：深度服务3-5家知名企业，打造可传播案例",
    ],
  },
  business: {
    models: [
      {
        name: "旗舰年费",
        price: "¥30万/年",
        desc: "1v1定制，无限使用，含私有化部署",
        margin: "~75%",
      },
      {
        name: "团队版",
        price: "¥8万/年",
        desc: "CEO + 3名核心高管，云端SaaS",
        margin: "~80%",
      },
      {
        name: "企业定制",
        price: "¥100万+",
        desc: "大型民企，含系统集成、专属模型微调",
        margin: "~60%",
      },
    ],
    projection: [
      {
        year: "Year 1",
        clients: 50,
        arr: "¥1,500万",
        focus: "产品验证 & 口碑建立",
      },
      {
        year: "Year 2",
        clients: 200,
        arr: "¥6,000万",
        focus: "渠道扩张 & 品牌建设",
      },
      {
        year: "Year 3",
        clients: 600,
        arr: "¥1.8亿",
        focus: "市场领导地位 & 生态布局",
      },
    ],
  },
  competition: [
    {
      name: "通用AI助手\n(ChatGPT/Claude)",
      pros: "能力强、成本低",
      cons: "不懂中国商业语境，无法个性化，保密性不足",
      threat: "低",
    },
    {
      name: "传统管理咨询\n(麦肯锡等)",
      pros: "品牌背书强",
      cons: "慢、贵、不连续、无法随叫随到",
      threat: "低",
    },
    {
      name: "国内AI工具\n(钉钉AI等)",
      pros: "渠道好",
      cons: "定位在协同效率，非CEO决策，深度不够",
      threat: "中",
    },
    {
      name: "私董会/教练",
      pros: "人际信任强",
      cons: "不可扩展、时间受限、无法积累决策数据",
      threat: "低",
    },
  ],
  roadmap: [
    {
      phase: "Phase 0",
      period: "0-3个月",
      title: "MVP验证",
      tasks: [
        "招募10位种子CEO深度共创",
        "核心功能原型：穿透汇报 + 决策室",
        "验证核心价值主张与付费意愿",
      ],
    },
    {
      phase: "Phase 1",
      period: "3-9个月",
      title: "产品成熟",
      tasks: [
        "完成私有化部署方案",
        "关键对话沙盘上线",
        "打磨到NPS > 70",
        "完成首批50家付费客户",
      ],
    },
    {
      phase: "Phase 2",
      period: "9-18个月",
      title: "规模增长",
      tasks: [
        "渠道合作体系建立",
        "团队版产品上线",
        "A轮融资（目标¥5000万）",
        "客户数达200家",
      ],
    },
    {
      phase: "Phase 3",
      period: "18-36个月",
      title: "生态布局",
      tasks: [
        "「CEO决策数据库」产品化",
        "国际化：东南亚华人企业市场",
        "战略咨询生态联盟",
        "考虑B轮或上市路径",
      ],
    },
  ],
  risks: [
    {
      risk: "信任建立难度高",
      level: "高",
      mitigation: "创始团队必须有CEO圈子背景；邀请制冷启动；提供免费深度体验期",
    },
    {
      risk: "数据安全顾虑",
      level: "高",
      mitigation: "私有化部署作为标配；第三方安全认证；保密协议法律强化",
    },
    {
      risk: "AI能力局限",
      level: "中",
      mitigation:
        "混合AI+人类教练模式；持续微调行业模型；设置AI判断的置信度边界",
    },
    {
      risk: "竞争对手快速跟进",
      level: "中",
      mitigation: "深度定制护城河；CEO决策档案的迁移成本；率先建立品牌认知",
    },
    {
      risk: "付费决策链长",
      level: "中",
      mitigation: "CEO直销为主；ROI量化（一个决策的失误成本远超年费）",
    },
  ],
};

const tabs = [
  "概览",
  "问题与机会",
  "产品",
  "市场",
  "商业模式",
  "竞争格局",
  "路线图",
  "风险分析",
];

function BusinessPlan({ goExperience }: { goExperience: () => void }) {
  const [active, setActive] = useState(0);

  return (
    <div
      style={{
        fontFamily: "'Georgia', 'Noto Serif SC', serif",
        background: "#0a0c10",
        minHeight: "100vh",
        color: "#e8dcc8",
        padding: "0",
      }}
    >
      {/* Header */}
      <div
        style={{
          background:
            "linear-gradient(135deg, #0f1318 0%, #1a1408 50%, #0f1318 100%)",
          borderBottom: "1px solid #b8960030",
          padding: "32px 40px 24px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage:
              "radial-gradient(ellipse at 20% 50%, #b8960012 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, #8b6a0010 0%, transparent 50%)",
          }}
        />
        <div style={{ position: "relative" }}>
          <div
            style={{
              fontSize: "11px",
              letterSpacing: "4px",
              color: "#b89600",
              textTransform: "uppercase",
              marginBottom: "8px",
              fontFamily: "monospace",
            }}
          >
            BUSINESS PLAN · 商业计划书 · 2025
          </div>
          <h1
            style={{
              fontSize: "clamp(24px, 4vw, 42px)",
              fontWeight: "400",
              margin: "0 0 6px",
              letterSpacing: "2px",
              color: "#f0e6d0",
            }}
          >
            {data.overview.name}
          </h1>
          <p
            style={{
              fontSize: "15px",
              color: "#b89600",
              margin: 0,
              fontStyle: "italic",
            }}
          >
            {data.overview.tagline}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: "0",
          overflowX: "auto",
          borderBottom: "1px solid #b8960020",
          background: "#0d0f14",
          padding: "0 24px",
        }}
      >
        {tabs.map((t, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "14px 20px",
              fontSize: "13px",
              whiteSpace: "nowrap",
              color: active === i ? "#b89600" : "#7a6a50",
              borderBottom:
                active === i ? "2px solid #b89600" : "2px solid transparent",
              transition: "all 0.2s",
              fontFamily: "inherit",
              letterSpacing: active === i ? "0.5px" : "0",
            }}
          >
            {t}
          </button>
        ))}

        <button
          onClick={goExperience}
          style={{
            marginLeft: 12,
            padding: "10px 14px",
            borderRadius: 12,
            border: "1px solid rgba(255,215,0,0.35)",
            background: "rgba(255,215,0,0.10)",
            color: "#e8dcc8",
            cursor: "pointer",
            fontSize: "12px",
            whiteSpace: "nowrap",
            letterSpacing: "0.5px",
          }}
        >
          立即体验
        </button>
      </div>

      {/* Content */}
      <div style={{ padding: "32px 40px", maxWidth: "960px", margin: "0 auto" }}>
        {/* Tab 0: Overview */}
        {active === 0 && (
          <div>
            <Gold small={false}>执行摘要</Gold>
            <p
              style={{
                fontSize: "16px",
                lineHeight: "1.9",
                color: "#c8b898",
                marginBottom: "32px",
                borderLeft: "3px solid #b89600",
                paddingLeft: "20px",
              }}
            >
              {data.overview.mission}
            </p>
            <p
              style={{
                fontSize: "14px",
                color: "#8a7a60",
                lineHeight: "1.8",
                marginBottom: "40px",
              }}
            >
              <b style={{ color: "#c8b898" }}>愿景：</b>
              {data.overview.vision}
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "16px",
              }}
            >
              {data.overview.highlights.map((h, i) => (
                <div
                  key={i}
                  style={{
                    background: "linear-gradient(135deg, #1a1810, #141008)",
                    border: "1px solid #b8960030",
                    borderRadius: "8px",
                    padding: "24px 20px",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: "28px",
                      fontWeight: "700",
                      color: "#b89600",
                      letterSpacing: "-1px",
                    }}
                  >
                    {h.value}
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#8a7a60",
                      marginTop: "6px",
                    }}
                  >
                    {h.label}
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#5a4a30",
                      marginTop: "4px",
                    }}
                  >
                    {h.sub}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 1: Problem */}
        {active === 1 && (
          <div>
            <Gold>痛点深度分析</Gold>
            <p
              style={{
                color: "#8a7a60",
                marginBottom: "28px",
                fontSize: "14px",
              }}
            >
              中国民企一号位面临独特的信息困境——他们是组织中权力最高的人，却往往是信息最不真实的人。
            </p>
            <div style={{ display: "grid", gap: "16px" }}>
              {data.problem.map((p, i) => (
                <div
                  key={i}
                  style={{
                    background: "#12100a",
                    border: "1px solid #b8960020",
                    borderRadius: "8px",
                    padding: "24px",
                    display: "flex",
                    gap: "20px",
                    alignItems: "flex-start",
                  }}
                >
                  <span style={{ fontSize: "28px", flexShrink: 0 }}>
                    {p.icon}
                  </span>
                  <div>
                    <div
                      style={{
                        fontSize: "16px",
                        color: "#e0cfa8",
                        fontWeight: "600",
                        marginBottom: "8px",
                      }}
                    >
                      {p.title}
                    </div>
                    <div
                      style={{
                        fontSize: "14px",
                        color: "#8a7a60",
                        lineHeight: "1.7",
                      }}
                    >
                      {p.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Product */}
        {active === 2 && (
          <div>
            <Gold>产品设计</Gold>
            <div style={{ display: "grid", gap: "14px", marginBottom: "36px" }}>
              {data.product.core.map((p, i) => (
                <div
                  key={i}
                  style={{
                    background: "#12100a",
                    border: "1px solid #b8960025",
                    borderRadius: "8px",
                    padding: "22px 24px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "10px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "15px",
                        color: "#e0cfa8",
                        fontWeight: "600",
                      }}
                    >
                      {p.name}
                    </div>
                    <span
                      style={{
                        fontSize: "10px",
                        padding: "3px 10px",
                        background:
                          p.tag === "差异化亮点" ? "#b8960020" : "#ffffff08",
                        color: p.tag === "差异化亮点" ? "#b89600" : "#5a4a30",
                        borderRadius: "20px",
                        border: `1px solid ${
                          p.tag === "差异化亮点" ? "#b8960040" : "#ffffff10"
                        }`,
                        letterSpacing: "1px",
                      }}
                    >
                      {p.tag}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: "13px",
                      color: "#8a7a60",
                      lineHeight: "1.7",
                    }}
                  >
                    {p.desc}
                  </div>
                </div>
              ))}
            </div>
            <Gold small>竞争护城河</Gold>
            <ul
              style={{
                paddingLeft: "0",
                listStyle: "none",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              {data.product.moat.map((m, i) => (
                <li
                  key={i}
                  style={{
                    display: "flex",
                    gap: "12px",
                    alignItems: "flex-start",
                    fontSize: "14px",
                    color: "#8a7a60",
                  }}
                >
                  <span
                    style={{
                      color: "#b89600",
                      fontSize: "18px",
                      lineHeight: "1.2",
                    }}
                  >
                    ◆
                  </span>
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tab 3: Market */}
        {active === 3 && (
          <div>
            <Gold>目标市场</Gold>
            <div style={{ display: "grid", gap: "12px", marginBottom: "36px" }}>
              {data.market.segments.map((s, i) => (
                <div
                  key={i}
                  style={{
                    background: "#12100a",
                    border: `1px solid ${i === 0 ? "#b8960050" : "#b8960018"}`,
                    borderRadius: "8px",
                    padding: "20px 24px",
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr auto",
                    gap: "16px",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: "14px",
                        color: "#e0cfa8",
                        fontWeight: "600",
                      }}
                    >
                      {s.name}
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#6a5a40",
                        marginTop: "4px",
                      }}
                    >
                      {s.desc}
                    </div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "12px", color: "#5a4a30" }}>规模</div>
                    <div style={{ fontSize: "14px", color: "#c8b898" }}>
                      {s.size}
                    </div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "12px", color: "#5a4a30" }}>定价</div>
                    <div style={{ fontSize: "14px", color: "#b89600" }}>
                      {s.price}
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: "10px",
                      padding: "4px 12px",
                      borderRadius: "20px",
                      background: s.priority === "高" ? "#b8960020" : "#ffffff05",
                      color: s.priority === "高" ? "#b89600" : "#4a3a20",
                      border: `1px solid ${
                        s.priority === "高" ? "#b8960040" : "#ffffff08"
                      }`,
                    }}
                  >
                    {s.priority}优先级
                  </span>
                </div>
              ))}
            </div>
            <Gold small>GTM 进入策略</Gold>
            <div style={{ display: "grid", gap: "10px" }}>
              {data.market.gtm.map((g, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: "14px",
                    alignItems: "flex-start",
                    padding: "14px 18px",
                    background: "#12100a",
                    borderRadius: "6px",
                    border: "1px solid #b8960015",
                  }}
                >
                  <span
                    style={{
                      color: "#b89600",
                      fontFamily: "monospace",
                      fontSize: "12px",
                      marginTop: "2px",
                    }}
                  >
                    0{i + 1}
                  </span>
                  <span style={{ fontSize: "13px", color: "#8a7a60" }}>{g}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Business Model */}
        {active === 4 && (
          <div>
            <Gold>商业模式</Gold>
            <div style={{ display: "grid", gap: "14px", marginBottom: "36px" }}>
              {data.business.models.map((m, i) => (
                <div
                  key={i}
                  style={{
                    background: "#12100a",
                    border: "1px solid #b8960025",
                    borderRadius: "8px",
                    padding: "20px 24px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "12px",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: "15px",
                        color: "#e0cfa8",
                        fontWeight: "600",
                      }}
                    >
                      {m.name}
                    </div>
                    <div
                      style={{
                        fontSize: "13px",
                        color: "#6a5a40",
                        marginTop: "6px",
                      }}
                    >
                      {m.desc}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div
                      style={{
                        fontSize: "20px",
                        color: "#b89600",
                        fontWeight: "700",
                      }}
                    >
                      {m.price}
                    </div>
                    <div
                      style={{
                        fontSize: "11px",
                        color: "#4a3a20",
                        marginTop: "4px",
                      }}
                    >
                      毛利率 {m.margin}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Gold small>营收预测</Gold>
            <div style={{ display: "grid", gap: "10px" }}>
              {data.business.projection.map((p, i) => (
                <div
                  key={i}
                  style={{
                    background: "#12100a",
                    border: "1px solid #b8960018",
                    borderRadius: "8px",
                    padding: "16px 24px",
                    display: "grid",
                    gridTemplateColumns: "80px 80px 100px 1fr",
                    gap: "20px",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: "13px",
                      color: "#b89600",
                      fontFamily: "monospace",
                    }}
                  >
                    {p.year}
                  </div>
                  <div>
                    <div style={{ fontSize: "10px", color: "#4a3a20" }}>
                      客户数
                    </div>
                    <div style={{ fontSize: "15px", color: "#c8b898" }}>
                      {p.clients}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: "10px", color: "#4a3a20" }}>ARR</div>
                    <div style={{ fontSize: "14px", color: "#b89600" }}>
                      {p.arr}
                    </div>
                  </div>
                  <div style={{ fontSize: "12px", color: "#5a4a30" }}>
                    {p.focus}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Competition */}
        {active === 5 && (
          <div>
            <Gold>竞争格局分析</Gold>
            <div style={{ display: "grid", gap: "14px" }}>
              {data.competition.map((c, i) => (
                <div
                  key={i}
                  style={{
                    background: "#12100a",
                    border: "1px solid #b8960020",
                    borderRadius: "8px",
                    padding: "20px 24px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: "12px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "14px",
                        color: "#e0cfa8",
                        fontWeight: "600",
                        whiteSpace: "pre-line",
                      }}
                    >
                      {c.name}
                    </div>
                    <span
                      style={{
                        fontSize: "10px",
                        padding: "3px 10px",
                        borderRadius: "20px",
                        background:
                          c.threat === "高"
                            ? "#ff4a2020"
                            : c.threat === "中"
                            ? "#b8960020"
                            : "#ffffff08",
                        color:
                          c.threat === "高"
                            ? "#ff6a40"
                            : c.threat === "中"
                            ? "#b89600"
                            : "#4a3a20",
                        border: `1px solid ${
                          c.threat === "高"
                            ? "#ff4a2040"
                            : c.threat === "中"
                            ? "#b8960040"
                            : "#ffffff10"
                        }`,
                      }}
                    >
                      威胁: {c.threat}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "12px",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: "10px",
                          color: "#4a8a50",
                          marginBottom: "4px",
                        }}
                      >
                        ✓ 优势
                      </div>
                      <div style={{ fontSize: "12px", color: "#5a7a60" }}>
                        {c.pros}
                      </div>
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: "10px",
                          color: "#8a4a30",
                          marginBottom: "4px",
                        }}
                      >
                        ✗ 不足
                      </div>
                      <div style={{ fontSize: "12px", color: "#7a5040" }}>
                        {c.cons}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 6: Roadmap */}
        {active === 6 && (
          <div>
            <Gold>产品路线图</Gold>
            <div style={{ position: "relative" }}>
              <div
                style={{
                  position: "absolute",
                  left: "119px",
                  top: "16px",
                  bottom: "16px",
                  width: "1px",
                  background: "linear-gradient(to bottom, #b89600, #b8960030)",
                }}
              />
              <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
                {data.roadmap.map((r, i) => (
                  <div
                    key={i}
                    style={{ display: "flex", gap: "24px", alignItems: "flex-start" }}
                  >
                    <div style={{ textAlign: "right", minWidth: "90px" }}>
                      <div
                        style={{
                          fontSize: "11px",
                          color: "#b89600",
                          fontFamily: "monospace",
                        }}
                      >
                        {r.phase}
                      </div>
                      <div style={{ fontSize: "10px", color: "#4a3a20" }}>
                        {r.period}
                      </div>
                    </div>
                    <div
                      style={{
                        width: "12px",
                        height: "12px",
                        borderRadius: "50%",
                        background: "#b89600",
                        flexShrink: 0,
                        marginTop: "4px",
                        boxShadow: "0 0 12px #b8960060",
                      }}
                    />
                    <div
                      style={{
                        flex: 1,
                        background: "#12100a",
                        border: "1px solid #b8960020",
                        borderRadius: "8px",
                        padding: "18px 20px",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "14px",
                          color: "#e0cfa8",
                          fontWeight: "600",
                          marginBottom: "12px",
                        }}
                      >
                        {r.title}
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        {r.tasks.map((t, j) => (
                          <div
                            key={j}
                            style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}
                          >
                            <span style={{ color: "#b89600", fontSize: "12px", marginTop: "2px" }}>
                              —
                            </span>
                            <span style={{ fontSize: "12px", color: "#7a6a50", lineHeight: "1.6" }}>
                              {t}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 7: Risks */}
        {active === 7 && (
          <div>
            <Gold>风险识别与应对</Gold>
            <div style={{ display: "grid", gap: "14px" }}>
              {data.risks.map((r, i) => (
                <div
                  key={i}
                  style={{
                    background: "#12100a",
                    border: `1px solid ${r.level === "高" ? "#ff4a2025" : "#b8960020"}`,
                    borderRadius: "8px",
                    padding: "20px 24px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "10px",
                    }}
                  >
                    <div style={{ fontSize: "14px", color: "#e0cfa8", fontWeight: "600" }}>
                      {r.risk}
                    </div>
                    <span
                      style={{
                        fontSize: "10px",
                        padding: "3px 12px",
                        borderRadius: "20px",
                        background: r.level === "高" ? "#ff4a2018" : "#b8960018",
                        color: r.level === "高" ? "#ff6a40" : "#b89600",
                        border: `1px solid ${r.level === "高" ? "#ff4a2030" : "#b8960030"}`,
                      }}
                    >
                      风险等级: {r.level}
                    </span>
                  </div>
                  <div style={{ fontSize: "13px", color: "#6a5a40", lineHeight: "1.7" }}>
                    <span style={{ color: "#4a7a50" }}>应对策略：</span>
                    {r.mitigation}
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                marginTop: "28px",
                padding: "20px 24px",
                background: "linear-gradient(135deg, #1a1810, #141008)",
                border: "1px solid #b8960040",
                borderRadius: "8px",
              }}
            >
              <div
                style={{
                  fontSize: "13px",
                  color: "#b89600",
                  marginBottom: "8px",
                  letterSpacing: "1px",
                }}
              >
                核心投资假设
              </div>
              <div style={{ fontSize: "13px", color: "#6a5a40", lineHeight: "1.8" }}>
                中国民企CEO群体有极强的付费能力与付费意愿——他们已经在猎头、咨询、私董会上花费数十甚至数百万。
                本产品的核心赌注是：
                <span style={{ color: "#c8b898" }}>
                  「AI能提供人类顾问无法提供的东西——随叫随到、不说谎、记忆完整、零泄密风险。」
                </span>
                如果这个假设成立，定价¥30万/年将是极具吸引力的价值交换。
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          textAlign: "center",
          padding: "24px",
          borderTop: "1px solid #b8960015",
          fontSize: "11px",
          color: "#3a2a10",
          letterSpacing: "2px",
          fontFamily: "monospace",
        }}
      >
        CONFIDENTIAL · 机密文件 · {data.overview.name}
      </div>
    </div>
  );
}

function Gold({ children, small = false }: { children: ReactNode; small?: boolean }) {
  return (
    <div
      style={{
        fontSize: small ? "12px" : "11px",
        letterSpacing: "3px",
        color: "#b89600",
        textTransform: "uppercase",
        marginBottom: small ? "14px" : "20px",
        marginTop: small ? "28px" : "0",
        fontFamily: "monospace",
        borderBottom: small ? "none" : "1px solid #b8960020",
        paddingBottom: small ? "0" : "10px",
      }}
    >
      {children}
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState<"plan" | "experience">("plan");

  if (page === "experience") {
    return (
      <div style={{ background: "#0a0c10", minHeight: "100vh", color: "#e8dcc8" }}>
        <div style={{ padding: 16, maxWidth: 1200, margin: "0 auto" }}>
          <button
            onClick={() => setPage("plan")}
            style={{
              padding: "8px 12px",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.18)",
              background: "rgba(255,255,255,0.06)",
              color: "#e8dcc8",
              cursor: "pointer",
            }}
          >
            ← 返回商业计划书
          </button>
        </div>
        <Experience />
      </div>
    );
  }

  return <BusinessPlan goExperience={() => setPage("experience")} />;
}
