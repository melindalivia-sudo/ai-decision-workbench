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

  // 演示稳定优先：在线输出先进入 onePager
  return {
    assumptions: ["（在线模式：详见下方“决策一页纸”）"],
    risks: ["（在线模式：详见下方“决策一页纸”）"],
    signals: ["（在线模式：详见下方“决策一页纸”）"],
    nextSteps: ["（在线模式：详见下方“决策一页纸”）"],
    onePager: text || "（在线模式未返回可用文本）",
  };
}

export default function Experience() {
  const [decision, setDecision] = useState("");
  const [live, setLive] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Output | null>(null);

  const canRun = useMemo(() => decision.trim().length >= 8, [decision]);

  // --------- UI Styles (dark/gold) ----------
  const colors = {
    text: "#e8dcc8",
    border: "rgba(255,255,255,0.18)",
    cardBg: "rgba(0,0,0,0.25)",
    inputBg: "rgba(0,0,0,0.35)",
    goldBg: "rgba(255,215,0,0.12)",
    dimBg: "rgba(255,255,255,0.06)",
  };

  const btnBase: React.CSSProperties = {
    color: colors.text,
    fontWeight: 700,
  };

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
      alert("已复制到剪贴板 ✅");
    } catch {
      alert("复制失败：请手动复制（可能是浏览器权限限制）");
    }
  };

  const clear = () => {
    setDecision("");
    setResult(null);
  };

  const run = async () => {
    if (!canRun) return;

    // 离线兜底：现场永远不翻车
    if (!live) {
      setResult(simulateAI(decision));
      return;
    }

    // 在线模式：现场有网时调用真实模型（演示用）
    if (!apiKey.trim()) {
      setResult({
        assumptions: [],
        risks: [],
        signals: [],
        nextSteps: [],
        onePager:
          "在线模式需要填写 OpenAI API Key（仅本机演示使用，不会保存）。",
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
    <div
      style={{
        padding: 28,
        maxWidth: 1180,
        margin: "0 auto",
        color: colors.text,
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontSize: 12, letterSpacing: 2, opacity: 0.7 }}>
          DECISION WORKBENCH · MVP
        </div>
        <h1 style={{ margin: "8px 0 6px", fontSize: 34 }}>
          战略/机会判断 · 决策工作台
        </h1>
        <div style={{ opacity: 0.85, lineHeight: 1.6 }}>
          输入一个你正在犹豫的关键机会（投不投、做不做、进入不进入）。
          我会用“董事会式质询”帮你生成：假设、最大风险、验证信号与下一步行动。
        </div>
      </div>

      {/* Input Card */}
      <div
        style={{
          border: `1px solid ${colors.border}`,
          borderRadius: 14,
          padding: 16,
          background: colors.cardBg,
          marginBottom: 18,
        }}
      >
        {/* Live mode toggle */}
        <div
          style={{
            display: "flex",
            gap: 10,
            alignItems: "center",
            flexWrap: "wrap",
            marginBottom: 12,
          }}
        >
          <label
            style={{
              display: "flex",
              gap: 8,
              alignItems: "center",
              fontSize: 13,
              opacity: 0.9,
              color: colors.text,
              fontWeight: 600,
            }}
          >
            <input
              type="checkbox"
              checked={live}
              onChange={(e) => setLive(e.target.checked)}
            />
            在线模式（现场有网时调用真实模型）
          </label>

          {live && (
            <input
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="输入 OpenAI API Key（仅本机演示用，不保存）"
              style={{
                flex: "1 1 420px",
                borderRadius: 12,
                padding: "10px 12px",
                border: `1px solid ${colors.border}`,
                background: colors.inputBg,
                color: colors.text,
                outline: "none",
              }}
            />
          )}
        </div>

        {/* Templates */}
        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
            marginBottom: 12,
          }}
        >
          {templates.map((t) => (
            <button
              key={t.label}
              onClick={() => {
                setDecision(t.text);
                setResult(null);
              }}
              style={{
                ...btnBase,
                fontWeight: 600,
                fontSize: 12,
                padding: "8px 12px",
                borderRadius: 12,
                border: `1px solid ${colors.border}`,
                background: "rgba(255,255,255,0.06)",
                cursor: "pointer",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div style={{ fontSize: 13, opacity: 0.85, marginBottom: 8 }}>
          你的决策主题（越具体越好）
        </div>

        <textarea
          value={decision}
          onChange={(e) => {
            setDecision(e.target.value);
            setResult(null);
          }}
          placeholder="例如：是否投入 300 万做一条 AI 决策助手产品线，目标客户是年营收 5–30 亿的民企一号位。"
          rows={4}
          style={{
            width: "100%",
            resize: "vertical",
            borderRadius: 12,
            padding: 12,
            border: `1px solid ${colors.border}`,
            background: colors.inputBg,
            color: colors.text,
            outline: "none",
            lineHeight: 1.6,
          }}
        />

        {/* Action Buttons */}
        <div
          style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}
        >
          <button
            onClick={run}
            disabled={!canRun || loading}
            style={{
              ...btnBase,
              padding: "10px 14px",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.22)",
              background: !canRun || loading ? colors.dimBg : colors.goldBg,
              cursor: !canRun || loading ? "not-allowed" : "pointer",
              opacity: !canRun || loading ? 0.65 : 1,
            }}
          >
            {loading
              ? "生成中..."
              : live
              ? "生成董事会式质询（在线）"
              : "生成董事会式质询（离线）"}
          </button>

          <button
            onClick={clear}
            style={{
              ...btnBase,
              fontWeight: 600,
              padding: "10px 14px",
              borderRadius: 12,
              border: `1px solid ${colors.border}`,
              background: colors.dimBg,
              cursor: "pointer",
            }}
          >
            清空
          </button>

          {result && (
            <button
              onClick={() => copy(result.onePager)}
              style={{
                ...btnBase,
                padding: "10px 14px",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.22)",
                background: colors.goldBg,
                cursor: "pointer",
              }}
            >
              一键复制“决策一页纸”
            </button>
          )}
        </div>

        {!canRun && (
          <div style={{ marginTop: 10, fontSize: 12, opacity: 0.75 }}>
            提示：至少写 8 个字，并尽量包含金额/人群/时间/目标等要素。
          </div>
        )}
      </div>

      {/* Output */}
      {result && (
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}
        >
          <Card
            title="关键假设（先假设，再验证）"
            items={result.assumptions}
            colors={colors}
          />
          <Card
            title="最大风险（优先排雷）"
            items={result.risks}
            colors={colors}
          />
          <Card
            title="验证信号（哪些行为=真的）"
            items={result.signals}
            colors={colors}
          />
          <Card
            title="下一步行动（30天MVP）"
            items={result.nextSteps}
            colors={colors}
          />

          <div style={{ gridColumn: "1 / -1" }}>
            <div style={{ fontSize: 14, opacity: 0.9, margin: "10px 0 6px" }}>
              决策一页纸（可发给团队）
            </div>
            <pre
              style={{
                whiteSpace: "pre-wrap",
                borderRadius: 14,
                border: "1px solid rgba(255,255,255,0.15)",
                padding: 14,
                background: colors.cardBg,
                lineHeight: 1.6,
                margin: 0,
                color: colors.text,
              }}
            >
              {result.onePager}
            </pre>
          </div>
        </div>
      )}

      {/* Footer hint for live mode */}
      {live && (
        <div
          style={{
            marginTop: 16,
            fontSize: 12,
            opacity: 0.65,
            lineHeight: 1.6,
          }}
        >
          提醒：在线模式为演示方便，API Key 仅在当前页面内存中使用，不会保存。
          若要给客户长期使用，建议用后端代理接口来保护密钥。
        </div>
      )}
    </div>
  );
}

function Card({
  title,
  items,
  colors,
}: {
  title: string;
  items: string[];
  colors: {
    text: string;
    border: string;
    cardBg: string;
  };
}) {
  return (
    <div
      style={{
        borderRadius: 14,
        border: `1px solid ${colors.border}`,
        background: colors.cardBg,
        padding: 14,
        minHeight: 120,
        color: colors.text,
      }}
    >
      <div style={{ fontSize: 14, opacity: 0.9, marginBottom: 8 }}>{title}</div>

      {items.length === 0 ? (
        <div style={{ fontSize: 12, opacity: 0.65 }}>（暂无）</div>
      ) : (
        <ul
          style={{ margin: 0, paddingLeft: 18, lineHeight: 1.75, opacity: 0.9 }}
        >
          {items.map((x, i) => (
            <li key={i}>{x}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
