import React, { useMemo, useState } from "react";

type Output = {
  assumptions: string[];
  risks: string[];
  signals: string[];
  nextSteps: string[];
  onePager: string;
};

function simulateAI(decision: string): Output {
  const d = decision.trim();

  const assumptions = [
    "目标客户痛点真实且紧迫（不是“听起来需要”）。",
    "我们能在 2–4 周内交付一个可被真实使用的最小闭环，而非只做演示。",
    "获客渠道可复制：至少 1 条渠道不依赖单点人脉。",
    "交付成本与质量可控：关键能力可标准化/模块化。",
    "竞争对手在 60 天内无法轻易复制同等价值密度。",
  ];

  const risks = [
    "需求被“高层口头支持”伪装：真正使用者不买单，POC 停在演示。",
    "ROI 口径不一致：无法证明节省时间/降低风险/提升决策质量。",
    "组织阻力：流程、权限、数据源无法接入，断在“生产前”。",
    "价值主张模糊：客户把它当咨询/培训而非基础设施（续费风险）。",
    "过度定制：形成项目制陷阱，无法规模化。",
  ];

  const signals = [
    "客户愿意给真实材料（会议纪要/报表/合同条款）至少 1 份。",
    "客户愿意 7 天内安排 3 类访谈：CEO/核心高管/一线负责人。",
    "客户愿意为“试运行 30 天”付费（哪怕小额），而不只是要免费试用。",
    "能定义 3 个量化指标：决策周期、返工率、重大风险暴露时间。",
    "能找到一个流程 owner 承诺推进（不是口头支持）。",
  ];

  const nextSteps = [
    "把决策拆成：目标（Why）/选择（What）/边界（What not）/验证（How）。",
    "做 1 页“决策一页纸”：假设、关键变量、反例、触发器、止损线。",
    "用 10 个问题做“董事会式质询”：我们忽略了什么？反对者会怎么说？",
    "设计 30 天 MVP：每周 1 次决策回顾 + 1 个真实场景闭环交付。",
    "定义止损线：如果 30 天内拿不到 2 个关键证据，就不继续投入。",
  ];

  const onePager = [
    `【决策主题】${d || "（未填写）"}`,
    "",
    "【要证明的 3 个关键假设】",
    "1) 痛点真实且紧迫（谁的什么痛？为何现在？）",
    "2) 2–4 周能交付并被真实使用的最小闭环（不是演示）",
    "3) 渠道可复制、非单点人脉（至少 1 条可持续渠道）",
    "",
    "【最大风险（优先排雷）】",
    "1) POC 停在演示，使用者不买单",
    "2) ROI 口径不一致，价值不可证",
    "3) 数据/权限/流程无法接入，断在生产前",
    "",
    "【本周要拿到的证据】",
    "1) 真实材料：会议纪要/报表/合同条款（至少 1 份）",
    "2) 三类访谈排期：CEO/核心高管/一线负责人",
    "3) 指标口径：决策周期/返工率/风险暴露时间（至少 1 个可量化）",
    "",
    "【30 天止损线】",
    "若 30 天内拿不到“付费试运行 + 指标改善证据”，停止投入或重构方案。",
  ].join("\n");

  return { assumptions, risks, signals, nextSteps, onePager };
}

/**
 * Live mode: direct browser call (demo-only).
 * NOTE: Production should proxy via backend to protect API key.
 */
async function callLiveAI(apiKey: string, decision: string): Promise<Output> {
  const resp = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-5",
      input: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text:
                `你是“董事会式战略质询官”。请针对下面这个决策，输出严格结构化内容：\n` +
                `A. 关键假设（5条，短句）\n` +
                `B. 最大风险（5条，短句）\n` +
                `C. 验证信号（5条，短句，可观测行为/数据）\n` +
                `D. 下一步行动（5条，含30天止损线）\n` +
                `E. 决策一页纸（可直接发给团队，含：主题/假设/风险/证据/止损线）\n\n` +
                `决策主题：${decision}\n\n` +
                `请用中文，条目清晰，避免空话。`,
            },
          ],
        },
      ],
    }),
  });

  if (!resp.ok) {
    const t = await resp.text();
    throw new Error(t);
  }

  const json: any = await resp.json();
  const text =
    json.output_text ||
    json.output?.[0]?.content?.map((c: any) => c.text).join("\n") ||
    "";

  return {
    assumptions: ["（在线模式：详见下方“决策一页纸”）"],
    risks: ["（在线模式：详见下方“决策一页纸”）"],
    signals: ["（在线模式：详见下方“决策一页纸”）"],
    nextSteps: ["（在线模式：详见下方“决策一页纸”）"],
    onePager: text || "（在线模式未返回可用文本）",
  };
}

function pill(active: boolean): React.CSSProperties {
  return {
    borderRadius: 999,
    border: active ? "1px solid rgba(26,115,232,0.28)" : "1px solid #e0e0e0",
    background: active ? "rgba(26,115,232,0.10)" : "#fff",
    color: active ? "#174ea6" : "#202124",
    padding: "7px 10px",
    fontSize: 13,
    fontWeight: 800,
    cursor: "pointer",
    whiteSpace: "nowrap",
  };
}

function buttonPrimary(enabled: boolean): React.CSSProperties {
  return {
    padding: "10px 12px",
    borderRadius: 999,
    border: "1px solid #1a73e8",
    background: enabled ? "#1a73e8" : "rgba(60,64,67,0.10)",
    color: enabled ? "#fff" : "#5f6368",
    cursor: enabled ? "pointer" : "not-allowed",
    fontWeight: 900,
  };
}

function buttonGhost(enabled: boolean): React.CSSProperties {
  return {
    padding: "10px 12px",
    borderRadius: 999,
    border: "1px solid #e0e0e0",
    background: enabled ? "#fff" : "rgba(60,64,67,0.06)",
    color: enabled ? "#202124" : "#5f6368",
    cursor: enabled ? "pointer" : "not-allowed",
    fontWeight: 900,
  };
}

export default function Experience() {
  const fontStack =
    "'Microsoft YaHei','微软雅黑', Arial, 'PingFang SC','Hiragino Sans GB','Noto Sans CJK SC','Segoe UI', Roboto, sans-serif";

  const [decision, setDecision] = useState("");
  const [live, setLive] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Output | null>(null);

  const canRun = useMemo(() => decision.trim().length >= 8, [decision]);

  const templates = [
    {
      label: "进入新市场",
      text: "是否在未来 90 天进入华东新市场？预算 200 万，目标 6 个月拿到 30 家付费客户，团队现有 6 人。",
    },
    {
      label: "投新产品线",
      text: "是否投入 300 万做一条 AI 决策助手产品线，目标客户为年营收 5–30 亿的民企一号位，90 天内要完成 MVP 与 10 家试点。",
    },
    {
      label: "并购/合作",
      text: "是否与上游供应商做战略合作或小额并购，以换取稳定供给与成本优势？担心整合成本和组织摩擦。",
    },
  ];

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("已复制（决策一页纸）");
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      alert("已复制（决策一页纸）");
    }
  };

  const clear = () => {
    setDecision("");
    setResult(null);
  };

  const run = async () => {
    if (!canRun) return;

    if (!live) {
      setResult(simulateAI(decision));
      return;
    }

    if (!apiKey.trim()) {
      setResult({
        assumptions: [],
        risks: [],
        signals: [],
        nextSteps: [],
        onePager: "在线模式需要填写 OpenAI API Key（仅本机演示使用，不会保存）。",
      });
      return;
    }

    setLoading(true);
    try {
      const out = await callLiveAI(apiKey.trim(), decision);
      setResult(out);
    } catch (e: any) {
      setResult({
        assumptions: [],
        risks: [],
        signals: [],
        nextSteps: [],
        onePager:
          "在线调用失败（可切回离线模式继续演示）。\n\n" +
          String(e?.message || e),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: fontStack, background: "#fff", minHeight: "100vh", color: "#202124" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "22px 16px 44px" }}>
        {/* Header */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 12, letterSpacing: "0.12em", color: "#5f6368", textTransform: "uppercase", marginBottom: 10 }}>
            DECISION WORKBENCH · MVP
          </div>
          <div style={{ fontSize: "clamp(26px, 3.2vw, 38px)", fontWeight: 900, lineHeight: 1.15, marginBottom: 8 }}>
            战略/机会判断 · 决策工作台
          </div>
          <div style={{ color: "#5f6368", fontSize: 14, lineHeight: 1.7 }}>
            输入一个你正在犹豫的关键机会（投不投、做不做、进入不进入）。我会用<strong>董事会式质询</strong>帮你输出：
            假设、最大风险、验证信号与下一步行动。
          </div>
        </div>

        {/* Main grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.05fr", gap: 14, alignItems: "start" }}>
          {/* Left: Input */}
          <div
            style={{
              border: "1px solid #e0e0e0",
              borderRadius: 16,
              background: "#ffffff",
              boxShadow: "0 1px 2px rgba(60,64,67,0.12), 0 1px 3px rgba(60,64,67,0.08)",
              padding: 16,
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 900 }}>输入</div>
                <div style={{ fontSize: 12, color: "#5f6368", marginTop: 4 }}>
                  离线永不翻车；在线可演示真实模型（仅本机 Key）
                </div>
              </div>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
                {templates.map((t) => (
                  <button
                    key={t.label}
                    onClick={() => {
                      setDecision(t.text);
                      setResult(null);
                    }}
                    style={pill(false)}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Live toggle */}
            <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
              <label style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 13, color: "#202124", fontWeight: 900 }}>
                <input type="checkbox" checked={live} onChange={(e) => setLive(e.target.checked)} />
                在线模式（现场有网时调用真实模型）
              </label>

              {live && (
                <input
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="输入 OpenAI API Key（仅本机演示用，不保存）"
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: 12,
                    border: "1px solid #e0e0e0",
                    outline: "none",
                    fontSize: 14,
                  }}
                />
              )}
            </div>

            {/* Decision textarea */}
            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: 12, color: "#5f6368", fontWeight: 900, marginBottom: 6 }}>你的决策主题（越具体越好）</div>
              <textarea
                value={decision}
                onChange={(e) => {
                  setDecision(e.target.value);
                  setResult(null);
                }}
                placeholder="例如：是否投入 300 万做一条 AI 决策助手产品线，目标客户是年营收 5–30 亿的民企一号位。"
                rows={7}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 12,
                  border: "1px solid #e0e0e0",
                  outline: "none",
                  fontSize: 14,
                  lineHeight: 1.6,
                  resize: "vertical",
                }}
              />
              {!canRun && (
                <div style={{ marginTop: 10, fontSize: 12, color: "#5f6368", lineHeight: 1.6 }}>
                  提示：至少写 8 个字，并尽量包含金额/人群/时间/目标等要素。
                </div>
              )}
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
              <button onClick={run} disabled={!canRun || loading} style={buttonPrimary(canRun && !loading)}>
                {loading ? "生成中..." : live ? "生成（在线）" : "生成（离线）"}
              </button>

              <button onClick={clear} style={buttonGhost(true)}>
                清空
              </button>

              <button onClick={() => result && copy(result.onePager)} disabled={!result} style={buttonGhost(!!result)}>
                复制“决策一页纸”
              </button>
            </div>

            {live && (
              <div style={{ marginTop: 12, fontSize: 12, color: "#5f6368", lineHeight: 1.6 }}>
                提醒：在线模式为演示方便，API Key 仅在当前页面内存中使用，不会保存。
                若要长期给客户用，建议用后端代理接口保护密钥。
              </div>
            )}
          </div>

          {/* Right: Output */}
          <div
            style={{
              border: "1px solid #e0e0e0",
              borderRadius: 16,
              background: "#ffffff",
              boxShadow: "0 1px 2px rgba(60,64,67,0.12), 0 1px 3px rgba(60,64,67,0.08)",
              padding: 16,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "baseline" }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 900 }}>输出</div>
                <div style={{ fontSize: 12, color: "#5f6368", marginTop: 4 }}>假设 / 风险 / 信号 / 行动 / 一页纸</div>
              </div>
              <div style={{ fontSize: 12, color: "#174ea6", fontWeight: 900 }}>结构清晰 · 直接可用</div>
            </div>

            {!result ? (
              <div
                style={{
                  marginTop: 14,
                  borderRadius: 14,
                  border: "1px dashed rgba(60,64,67,0.25)",
                  background: "rgba(60,64,67,0.04)",
                  padding: 14,
                  color: "#5f6368",
                  lineHeight: 1.7,
                  fontSize: 14,
                }}
              >
                还没有输出。填写左侧决策主题并点击「生成」。
              </div>
            ) : (
              <div style={{ marginTop: 14, display: "grid", gap: 12 }}>
                <MiniCard title="关键假设（先假设，再验证）" items={result.assumptions} />
                <MiniCard title="最大风险（优先排雷）" items={result.risks} />
                <MiniCard title="验证信号（哪些行为=真的）" items={result.signals} />
                <MiniCard title="下一步行动（30天MVP）" items={result.nextSteps} />

                <div style={{ marginTop: 4 }}>
                  <div style={{ fontSize: 12, color: "#5f6368", fontWeight: 900, marginBottom: 6 }}>
                    决策一页纸（可发给团队）
                  </div>
                  <pre
                    style={{
                      whiteSpace: "pre-wrap",
                      borderRadius: 14,
                      border: "1px solid #e0e0e0",
                      padding: 12,
                      background: "rgba(60,64,67,0.04)",
                      lineHeight: 1.65,
                      margin: 0,
                      color: "#202124",
                      fontSize: 13,
                    }}
                  >
                    {result.onePager}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div style={{ border: "1px solid #e0e0e0", borderRadius: 14, padding: 12, background: "#fff" }}>
      <div style={{ fontSize: 13, fontWeight: 900, marginBottom: 8 }}>{title}</div>
      {items.length === 0 ? (
        <div style={{ fontSize: 12, color: "#5f6368" }}>（暂无）</div>
      ) : (
        <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.75, color: "#5f6368", fontSize: 13 }}>
          {items.map((x, i) => (
            <li key={i}>{x}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
