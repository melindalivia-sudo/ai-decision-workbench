import React, { useMemo, useState } from "react";

type TimeHorizon = "今天" | "一周" | "一月" | "季度";
type RiskAppetite = "保守" | "平衡" | "激进";

export type DecisionInput = {
  title: string;
  context: string;
  options: string[];
  constraints: string;
  timeHorizon: TimeHorizon;
  riskAppetite: RiskAppetite;
  stakeholders: string; // comma separated
};

export type RiskItem = {
  risk: string;
  probability: "低" | "中" | "高";
  impact: "低" | "中" | "高";
  mitigation: string;
};

export type ActionItem = {
  action: string;
  owner: string;
  due: string;
};

export type DecisionOutput = {
  recommendation: string;
  score: number;
  scoreReasons: string[];
  unknowns: string[];
  devilsAdvocate: string[];
  piercingQuestions: string[];
  actions72h: ActionItem[];
  riskRegister: RiskItem[];
  costOfWrongDecision: string[];
  stamp: string;
};

function nowStamp() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}`;
}

function clampScore(n: number) {
  if (n < 0) return 0;
  if (n > 100) return 100;
  return Math.round(n);
}

function generateMock(input: DecisionInput): DecisionOutput {
  const has2Options = input.options.filter(Boolean).length >= 2;
  const hasContext = input.context.trim().length >= 12;
  const hasConstraints = input.constraints.trim().length >= 6;
  const hasStakeholders = input.stakeholders.trim().length >= 3;

  // score heuristic: readable, deterministic, not "random"
  let score = 70;
  if (!has2Options) score -= 18;
  if (!hasContext) score -= 12;
  if (!hasConstraints) score -= 10;
  if (!hasStakeholders) score -= 6;

  // time pressure penalty/boost
  if (input.timeHorizon === "今天") score -= 8;
  if (input.timeHorizon === "季度") score += 5;

  // risk appetite adjustment: not better/worse, just "clarity"
  if (input.riskAppetite === "保守") score += 2;
  if (input.riskAppetite === "激进") score -= 2;

  score = clampScore(score);

  const optA = input.options[0] || "选项A";
  const optB = input.options[1] || "选项B";
  const optC = input.options[2] || "选项C（可选）";

  const recommendation =
    score >= 75
      ? `优先推进「${optA}」，但必须先补齐关键未知数；同时保留「${optB}」作为对冲选项。`
      : `信息不足，不建议直接拍板「${optA}」。先用 72 小时补数据与验证，再决定是否走「${optA}」或转向「${optB}」。`;

  const scoreReasons: string[] = [
    has2Options ? "已给出至少2个可比较选项（可做对冲/备选）。" : "选项不足，无法做有效对比与对冲。",
    hasConstraints ? "已有约束/红线，可用于筛除不可接受路径。" : "缺少约束/红线，决策边界不清。",
    hasContext ? "背景信息可形成可验证的假设与行动。" : "背景过少，无法形成可验证假设。",
  ].slice(0, 3);

  const unknowns = [
    "真实需求强度：客户是否愿意用钱而非口头支持投票？",
    "单位经济：获客成本、交付成本、毛利是否可持续？",
    "执行带宽：关键团队是否有连续 4-6 周的交付窗口？",
    "最坏情景：失败后现金流/信誉/供应链的不可逆损失是什么？",
    "外部变量：政策/竞争/渠道是否存在突然变化的触发点？",
  ];

  const devilsAdvocate = [
    `你在用“愿景”替代“证据”。现在所有乐观假设都还没被证伪。`,
    `你可能低估了「${optA}」的二阶成本：协调成本、学习曲线、内部阻力。`,
    `如果「${optB}」的试错成本更低，你为什么要先选高成本路径？`,
  ];

  const piercingQuestions = [
    "这是不是不可逆决策？哪一部分可逆，哪一部分不可逆？",
    "最关键的一个“必须为真”的假设是什么？怎么在72小时验证？",
    "如果你只能保留一个指标来判断对错，你选哪个？",
    "失败的边界是什么？触发什么条件你必须立刻止损？",
    "谁会在背后反对？他们反对的真实原因是什么？",
    "这件事对现金流的影响路径是什么（按周列）？",
    "执行的瓶颈角色是谁？如果他/她拒绝配合怎么办？",
    "你有没有把“习惯路径”误当成“正确路径”？",
    "如果竞争对手明天复制，你还剩什么护城河？",
    "你现在最缺的不是方案，是哪一条关键数据？",
  ];

  const actions72h: ActionItem[] = [
    { action: "把决策拆成 3 个可验证假设（含通过/失败阈值）", owner: "Owner（待填）", due: "T+1天" },
    { action: "对 3 位关键客户做付费意愿验证（要钱/要时间/要签字）", owner: "Owner（待填）", due: "T+2天" },
    { action: "做一页单位经济测算（CAC/LTV/毛利/交付工时）", owner: "Owner（待填）", due: "T+2天" },
    { action: "列出红线：什么情况必须停止推进（止损条件）", owner: "Owner（待填）", due: "T+1天" },
    { action: "决策会议：只讨论证据与阈值，不讨论立场", owner: "Owner（待填）", due: "T+3天" },
  ];

  const riskRegister: RiskItem[] = [
    { risk: "需求被高估（口头支持≠付费）", probability: "中", impact: "高", mitigation: "用付费/签字/排期验证需求强度" },
    { risk: "执行带宽不足导致半途而废", probability: "中", impact: "高", mitigation: "冻结一项低优先级工作，换取连续交付窗口" },
    { risk: "成本结构失控（交付成本>收入）", probability: "中", impact: "高", mitigation: "先测单位经济，再扩张" },
    { risk: "关键人反对导致内部阻力", probability: "中", impact: "中", mitigation: "明确利益相关方与决策权，做反对者访谈" },
    { risk: "竞争对手快速跟进", probability: "低", impact: "中", mitigation: "把差异化写成可执行机制/数据壁垒" },
    { risk: "现金流承压（时间换不来收入）", probability: "中", impact: "高", mitigation: "设里程碑触发分期投入与止损点" },
  ];

  const costOfWrongDecision = [
    "现金流：3-12个月的投入沉没成本 + 机会成本",
    "组织：团队信心受损，关键人离开风险上升",
    "市场：窗口期错过，竞争格局不可逆变化",
  ];

  const stamp = `CONFIDENTIAL · ${nowStamp()}`;

  return {
    recommendation,
    score,
    scoreReasons,
    unknowns,
    devilsAdvocate,
    piercingQuestions,
    actions72h,
    riskRegister,
    costOfWrongDecision,
    stamp,
  };
}

function toMarkdown(input: DecisionInput, out: DecisionOutput) {
  const lines: string[] = [];
  lines.push(`# Decision Room Memo`);
  lines.push(``);
  lines.push(`**Title**: ${input.title || "（未填）"}`);
  lines.push(`**Time Horizon**: ${input.timeHorizon} · **Risk Appetite**: ${input.riskAppetite}`);
  lines.push(`**Stakeholders**: ${input.stakeholders || "（未填）"}`);
  lines.push(``);
  lines.push(`---`);
  lines.push(``);
  lines.push(`## A. Recommendation`);
  lines.push(out.recommendation);
  lines.push(``);
  lines.push(`## B. Decision Quality Score`);
  lines.push(`**${out.score}/100**`);
  out.scoreReasons.forEach((r) => lines.push(`- ${r}`));
  lines.push(``);
  lines.push(`## C. Unknowns`);
  out.unknowns.forEach((u) => lines.push(`- ${u}`));
  lines.push(``);
  lines.push(`## D. Devil’s Advocate`);
  out.devilsAdvocate.forEach((d) => lines.push(`- ${d}`));
  lines.push(``);
  lines.push(`## E. Piercing Questions`);
  out.piercingQuestions.forEach((q, i) => lines.push(`${i + 1}. ${q}`));
  lines.push(``);
  lines.push(`## F. 72h Actions`);
  out.actions72h.forEach((a, i) => lines.push(`${i + 1}. **${a.action}**  _(Owner: ${a.owner}, Due: ${a.due})_`));
  lines.push(``);
  lines.push(`## G. Risk Register`);
  out.riskRegister.forEach((r, i) =>
    lines.push(
      `${i + 1}. **${r.risk}**  _(P: ${r.probability}, I: ${r.impact})_ — ${r.mitigation}`
    )
  );
  lines.push(``);
  lines.push(`## H. Cost of Wrong Decision`);
  out.costOfWrongDecision.forEach((c) => lines.push(`- ${c}`));
  lines.push(``);
  lines.push(`---`);
  lines.push(``);
  lines.push(out.stamp);
  lines.push(``);
  return lines.join("\n");
}

function downloadText(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function pillStyle(active: boolean): React.CSSProperties {
  return {
    borderRadius: 999,
    border: active ? "1px solid rgba(26,115,232,0.25)" : "1px solid #e0e0e0",
    background: active ? "rgba(26,115,232,0.10)" : "#fff",
    color: active ? "#174ea6" : "#202124",
    padding: "7px 10px",
    fontSize: 13,
    fontWeight: 800,
    cursor: "pointer",
  };
}

export default function DecisionRoom() {
  const fontStack =
    "'Microsoft YaHei','微软雅黑', Arial, 'PingFang SC','Hiragino Sans GB','Noto Sans CJK SC','Segoe UI', Roboto, sans-serif";

  const [input, setInput] = useState<DecisionInput>({
    title: "",
    context: "",
    options: ["", ""],
    constraints: "",
    timeHorizon: "一周",
    riskAppetite: "平衡",
    stakeholders: "",
  });

  const [preset, setPreset] = useState<"进入新市场" | "投资产品线" | "并购/合作" | null>(null);
  const [output, setOutput] = useState<DecisionOutput | null>(null);

  const canGenerate = useMemo(() => {
    const hasTitle = input.title.trim().length >= 2;
    const hasContext = input.context.trim().length >= 8;
    const opts = input.options.map((o) => o.trim()).filter(Boolean);
    return hasTitle && hasContext && opts.length >= 2;
  }, [input]);

  const setPresetFill = (p: typeof preset) => {
    setPreset(p);
    if (p === "进入新市场") {
      setInput((prev) => ({
        ...prev,
        title: prev.title || "是否进入一个新的区域/行业市场？",
        context:
          prev.context ||
          "我们当前增长趋缓，考虑进入新市场获取新增量。需要判断：进入路径、首批客户、成本与时间窗口。",
        options: prev.options.map((o, idx) => (o ? o : idx === 0 ? "先做小规模试点" : "直接重投入进入")),
        constraints: prev.constraints || "现金流不能承压超过 3 个月；不能影响现有核心业务交付。",
        stakeholders: prev.stakeholders || "CEO, 销售负责人, 交付负责人, 财务",
      }));
    }
    if (p === "投资产品线") {
      setInput((prev) => ({
        ...prev,
        title: prev.title || "是否追加预算投入一条新产品/新功能线？",
        context:
          prev.context ||
          "现有产品增长不错，但竞争加剧。考虑投入新产品线拉开差距。需要判断：用户价值、成本结构、交付能力。",
        options: prev.options.map((o, idx) => (o ? o : idx === 0 ? "投入 MVP（4周验证）" : "直接组建完整团队")),
        constraints: prev.constraints || "不能牺牲当前现金流安全；核心团队不能长期加班透支。",
        stakeholders: prev.stakeholders || "CEO, 产品负责人, 技术负责人, 财务",
      }));
    }
    if (p === "并购/合作") {
      setInput((prev) => ({
        ...prev,
        title: prev.title || "是否推进并购/战略合作？",
        context:
          prev.context ||
          "对方能补齐能力或渠道，但整合与文化风险很高。需要判断：协同价值、不可逆成本、谈判底线。",
        options: prev.options.map((o, idx) => (o ? o : idx === 0 ? "先做合作试运行（90天）" : "直接并购/深度绑定")),
        constraints: prev.constraints || "不接受核心客户数据外泄；并购后12个月必须实现协同收益。",
        stakeholders: prev.stakeholders || "CEO, 法务, 财务, 业务负责人",
      }));
    }
  };

  const onAddOption = () => {
    setInput((prev) => ({ ...prev, options: [...prev.options, ""] }));
  };

  const onRemoveOption = (idx: number) => {
    setInput((prev) => {
      const next = prev.options.filter((_, i) => i !== idx);
      return { ...prev, options: next.length >= 2 ? next : ["", ""] };
    });
  };

  const onGenerate = () => {
    const out = generateMock(input);
    setOutput(out);
  };

  const onClear = () => {
    setPreset(null);
    setInput({
      title: "",
      context: "",
      options: ["", ""],
      constraints: "",
      timeHorizon: "一周",
      riskAppetite: "平衡",
      stakeholders: "",
    });
    setOutput(null);
  };

  const onCopy = async () => {
    if (!output) return;
    const md = toMarkdown(input, output);
    try {
      await navigator.clipboard.writeText(md);
      alert("已复制（Markdown）");
    } catch {
      // fallback
      const ta = document.createElement("textarea");
      ta.value = md;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      alert("已复制（Markdown）");
    }
  };

  const onDownload = () => {
    if (!output) return;
    const md = toMarkdown(input, output);
    downloadText(`DecisionRoom_${Date.now()}.md`, md);
  };

  return (
    <div
      style={{
        fontFamily: fontStack,
        background: "#ffffff",
        minHeight: "100vh",
        color: "#202124",
      }}
    >
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "22px 16px 44px" }}>
        {/* Header */}
        <div style={{ marginBottom: 14 }}>
          <div
            style={{
              fontSize: 12,
              letterSpacing: "0.12em",
              color: "#5f6368",
              textTransform: "uppercase",
              marginBottom: 10,
            }}
          >
            DECISION WORKBENCH · MVP
          </div>
          <div
            style={{
              fontSize: "clamp(26px, 3.2vw, 38px)",
              fontWeight: 900,
              lineHeight: 1.15,
              marginBottom: 8,
            }}
          >
            CEO 决策对话框 · Decision Room
          </div>
          <div style={{ color: "#5f6368", fontSize: 14, lineHeight: 1.7 }}>
            输入少量关键信息 → 输出结构化「真话型」建议。<b>不迎合、不鸡汤、可执行。</b>
            <span style={{ marginLeft: 8, color: "#174ea6", fontWeight: 900 }}>
              （纯前端模拟，后续可接 OpenAI）
            </span>
          </div>
        </div>

        {/* Main grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.05fr",
            gap: 14,
            alignItems: "start",
          }}
        >
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
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 900 }}>输入</div>
                <div style={{ fontSize: 12, color: "#5f6368", marginTop: 4 }}>
                  最小可用版：标题 + 背景 + 至少2个选项
                </div>
              </div>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
                <button style={pillStyle(preset === "进入新市场")} onClick={() => setPresetFill("进入新市场")}>
                  进入新市场
                </button>
                <button style={pillStyle(preset === "投资产品线")} onClick={() => setPresetFill("投资产品线")}>
                  投资产品线
                </button>
                <button style={pillStyle(preset === "并购/合作")} onClick={() => setPresetFill("并购/合作")}>
                  并购/合作
                </button>
              </div>
            </div>

            {/* Fields */}
            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: 12, color: "#5f6368", fontWeight: 900, marginBottom: 6 }}>决策标题（title）</div>
              <input
                value={input.title}
                onChange={(e) => setInput((p) => ({ ...p, title: e.target.value }))}
                placeholder="例如：是否在未来 90 天进入某新市场？"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 12,
                  border: "1px solid #e0e0e0",
                  outline: "none",
                  fontSize: 14,
                }}
              />

              <div style={{ fontSize: 12, color: "#5f6368", fontWeight: 900, margin: "12px 0 6px" }}>
                决策背景（context）
              </div>
              <textarea
                value={input.context}
                onChange={(e) => setInput((p) => ({ ...p, context: e.target.value }))}
                placeholder="用 4-8 句写清：现状、目标、为什么现在、你担心什么。"
                rows={6}
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

              <div style={{ fontSize: 12, color: "#5f6368", fontWeight: 900, margin: "12px 0 6px" }}>
                选项列表（options，至少2条）
              </div>

              <div style={{ display: "grid", gap: 8 }}>
                {input.options.map((opt, idx) => (
                  <div key={idx} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <input
                      value={opt}
                      onChange={(e) => {
                        const v = e.target.value;
                        setInput((p) => {
                          const next = [...p.options];
                          next[idx] = v;
                          return { ...p, options: next };
                        });
                      }}
                      placeholder={`选项 ${idx + 1}：例如「先小规模试点」`}
                      style={{
                        flex: 1,
                        padding: "10px 12px",
                        borderRadius: 12,
                        border: "1px solid #e0e0e0",
                        outline: "none",
                        fontSize: 14,
                      }}
                    />
                    <button
                      onClick={() => onRemoveOption(idx)}
                      disabled={input.options.length <= 2}
                      style={{
                        padding: "9px 10px",
                        borderRadius: 12,
                        border: "1px solid #e0e0e0",
                        background: input.options.length <= 2 ? "rgba(60,64,67,0.06)" : "#fff",
                        color: "#202124",
                        cursor: input.options.length <= 2 ? "not-allowed" : "pointer",
                        fontWeight: 900,
                      }}
                      title="删除该选项"
                    >
                      −
                    </button>
                  </div>
                ))}
                <button
                  onClick={onAddOption}
                  style={{
                    padding: "9px 12px",
                    borderRadius: 12,
                    border: "1px solid rgba(26,115,232,0.25)",
                    background: "rgba(26,115,232,0.10)",
                    color: "#174ea6",
                    cursor: "pointer",
                    fontWeight: 900,
                    width: "fit-content",
                  }}
                >
                  + 添加选项
                </button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 12 }}>
                <div>
                  <div style={{ fontSize: 12, color: "#5f6368", fontWeight: 900, marginBottom: 6 }}>
                    时间压力（timeHorizon）
                  </div>
                  <select
                    value={input.timeHorizon}
                    onChange={(e) => setInput((p) => ({ ...p, timeHorizon: e.target.value as TimeHorizon }))}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: 12,
                      border: "1px solid #e0e0e0",
                      outline: "none",
                      fontSize: 14,
                      background: "#fff",
                    }}
                  >
                    <option value="今天">今天</option>
                    <option value="一周">一周</option>
                    <option value="一月">一月</option>
                    <option value="季度">季度</option>
                  </select>
                </div>

                <div>
                  <div style={{ fontSize: 12, color: "#5f6368", fontWeight: 900, marginBottom: 6 }}>
                    风险偏好（riskAppetite）
                  </div>
                  <select
                    value={input.riskAppetite}
                    onChange={(e) => setInput((p) => ({ ...p, riskAppetite: e.target.value as RiskAppetite }))}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: 12,
                      border: "1px solid #e0e0e0",
                      outline: "none",
                      fontSize: 14,
                      background: "#fff",
                    }}
                  >
                    <option value="保守">保守</option>
                    <option value="平衡">平衡</option>
                    <option value="激进">激进</option>
                  </select>
                </div>
              </div>

              <div style={{ fontSize: 12, color: "#5f6368", fontWeight: 900, margin: "12px 0 6px" }}>
                约束与红线（constraints）
              </div>
              <textarea
                value={input.constraints}
                onChange={(e) => setInput((p) => ({ ...p, constraints: e.target.value }))}
                placeholder="例如：现金流不能承压超过3个月；不能影响现有交付；不接受数据外泄。"
                rows={3}
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

              <div style={{ fontSize: 12, color: "#5f6368", fontWeight: 900, margin: "12px 0 6px" }}>
                关键利益相关方（stakeholders，逗号分隔）
              </div>
              <input
                value={input.stakeholders}
                onChange={(e) => setInput((p) => ({ ...p, stakeholders: e.target.value }))}
                placeholder="例如：CEO, 财务, 销售负责人, 交付负责人"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 12,
                  border: "1px solid #e0e0e0",
                  outline: "none",
                  fontSize: 14,
                }}
              />

              {/* Actions */}
              <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
                <button
                  onClick={onGenerate}
                  disabled={!canGenerate}
                  style={{
                    padding: "10px 12px",
                    borderRadius: 999,
                    border: "1px solid #1a73e8",
                    background: canGenerate ? "#1a73e8" : "rgba(60,64,67,0.10)",
                    color: canGenerate ? "#fff" : "#5f6368",
                    cursor: canGenerate ? "pointer" : "not-allowed",
                    fontWeight: 900,
                  }}
                >
                  生成建议
                </button>

                <button
                  onClick={onClear}
                  style={{
                    padding: "10px 12px",
                    borderRadius: 999,
                    border: "1px solid #e0e0e0",
                    background: "#fff",
                    color: "#202124",
                    cursor: "pointer",
                    fontWeight: 900,
                  }}
                >
                  清空
                </button>

                <button
                  onClick={onCopy}
                  disabled={!output}
                  style={{
                    padding: "10px 12px",
                    borderRadius: 999,
                    border: "1px solid #e0e0e0",
                    background: output ? "#fff" : "rgba(60,64,67,0.06)",
                    color: output ? "#202124" : "#5f6368",
                    cursor: output ? "pointer" : "not-allowed",
                    fontWeight: 900,
                  }}
                >
                  复制输出
                </button>

                <button
                  onClick={onDownload}
                  disabled={!output}
                  style={{
                    padding: "10px 12px",
                    borderRadius: 999,
                    border: "1px solid rgba(26,115,232,0.25)",
                    background: output ? "rgba(26,115,232,0.10)" : "rgba(60,64,67,0.06)",
                    color: output ? "#174ea6" : "#5f6368",
                    cursor: output ? "pointer" : "not-allowed",
                    fontWeight: 900,
                  }}
                >
                  下载为 Markdown
                </button>
              </div>

              <div style={{ marginTop: 10, fontSize: 12, color: "#5f6368", lineHeight: 1.6 }}>
                提示：标题≥2字、背景≥8字、选项≥2条即可生成。输出是<strong>结构化董事会 memo</strong>，并明确哪些是推断、哪些需补数据。
              </div>
            </div>
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
                <div style={{ fontSize: 16, fontWeight: 900 }}>输出（董事会 memo）</div>
                <div style={{ fontSize: 12, color: "#5f6368", marginTop: 4 }}>
                  结构固定 · 不迎合 · 明确边界
                </div>
              </div>

              {output && (
                <div
                  style={{
                    fontSize: 12,
                    color: "#174ea6",
                    fontWeight: 900,
                    background: "rgba(26,115,232,0.10)",
                    border: "1px solid rgba(26,115,232,0.22)",
                    padding: "6px 10px",
                    borderRadius: 999,
                    whiteSpace: "nowrap",
                  }}
                >
                  决策质量 {output.score}/100
                </div>
              )}
            </div>

            {!output ? (
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
                还没有输出。点击左侧「生成建议」后，会出现：
                <ul style={{ margin: "10px 0 0", paddingLeft: 18 }}>
                  <li>A. 一句话结论</li>
                  <li>B. 决策质量评分 + 理由</li>
                  <li>C~H. Unknowns / Devil’s Advocate / 10问 / 72小时行动 / 风险清单 / 选错代价</li>
                  <li>I. CONFIDENTIAL + 时间戳</li>
                </ul>
              </div>
            ) : (
              <div style={{ marginTop: 14, display: "grid", gap: 12 }}>
                {/* A */}
                <section>
                  <div style={{ fontSize: 12, color: "#5f6368", fontWeight: 900, letterSpacing: "0.12em" }}>
                    A. RECOMMENDATION
                  </div>
                  <div style={{ marginTop: 8, fontSize: 15, fontWeight: 900, lineHeight: 1.55 }}>
                    {output.recommendation}
                  </div>
                </section>

                {/* B */}
                <section>
                  <div style={{ fontSize: 12, color: "#5f6368", fontWeight: 900, letterSpacing: "0.12em" }}>
                    B. DECISION QUALITY SCORE
                  </div>
                  <div style={{ marginTop: 8, display: "flex", alignItems: "baseline", gap: 10 }}>
                    <div style={{ fontSize: 28, fontWeight: 900, color: "#174ea6" }}>{output.score}</div>
                    <div style={{ color: "#5f6368", fontSize: 13 }}>/ 100</div>
                  </div>
                  <ul style={{ margin: "8px 0 0", paddingLeft: 18, color: "#5f6368", fontSize: 14, lineHeight: 1.7 }}>
                    {output.scoreReasons.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </section>

                {/* C */}
                <section>
                  <div style={{ fontSize: 12, color: "#5f6368", fontWeight: 900, letterSpacing: "0.12em" }}>
                    C. UNKNOWNS
                  </div>
                  <ul style={{ margin: "8px 0 0", paddingLeft: 18, color: "#5f6368", fontSize: 14, lineHeight: 1.7 }}>
                    {output.unknowns.map((u, i) => (
                      <li key={i}>{u}</li>
                    ))}
                  </ul>
                </section>

                {/* D */}
                <section>
                  <div style={{ fontSize: 12, color: "#5f6368", fontWeight: 900, letterSpacing: "0.12em" }}>
                    D. DEVIL’S ADVOCATE
                  </div>
                  <ul style={{ margin: "8px 0 0", paddingLeft: 18, color: "#5f6368", fontSize: 14, lineHeight: 1.7 }}>
                    {output.devilsAdvocate.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                </section>

                {/* E */}
                <section>
                  <div style={{ fontSize: 12, color: "#5f6368", fontWeight: 900, letterSpacing: "0.12em" }}>
                    E. PIERCING QUESTIONS
                  </div>
                  <ol style={{ margin: "8px 0 0", paddingLeft: 20, color: "#5f6368", fontSize: 14, lineHeight: 1.7 }}>
                    {output.piercingQuestions.map((q, i) => (
                      <li key={i}>{q}</li>
                    ))}
                  </ol>
                </section>

                {/* F */}
                <section>
                  <div style={{ fontSize: 12, color: "#5f6368", fontWeight: 900, letterSpacing: "0.12em" }}>
                    F. 72H ACTIONS
                  </div>
                  <div style={{ display: "grid", gap: 8, marginTop: 8 }}>
                    {output.actions72h.map((a, i) => (
                      <div
                        key={i}
                        style={{
                          border: "1px solid #e0e0e0",
                          borderRadius: 12,
                          padding: 10,
                          background: "#fff",
                        }}
                      >
                        <div style={{ fontSize: 14, fontWeight: 900, lineHeight: 1.55 }}>{a.action}</div>
                        <div style={{ marginTop: 4, fontSize: 12, color: "#5f6368" }}>
                          Owner: {a.owner} · Due: {a.due}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* G */}
                <section>
                  <div style={{ fontSize: 12, color: "#5f6368", fontWeight: 900, letterSpacing: "0.12em" }}>
                    G. RISK REGISTER
                  </div>
                  <div style={{ display: "grid", gap: 8, marginTop: 8 }}>
                    {output.riskRegister.map((r, i) => (
                      <div
                        key={i}
                        style={{
                          border: "1px solid #e0e0e0",
                          borderRadius: 12,
                          padding: 10,
                          background: "#fff",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                          <div style={{ fontSize: 14, fontWeight: 900 }}>{r.risk}</div>
                          <div style={{ fontSize: 12, color: "#5f6368", fontWeight: 900 }}>
                            P:{r.probability} · I:{r.impact}
                          </div>
                        </div>
                        <div style={{ marginTop: 6, fontSize: 13, color: "#5f6368", lineHeight: 1.6 }}>
                          缓解：{r.mitigation}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* H */}
                <section>
                  <div style={{ fontSize: 12, color: "#5f6368", fontWeight: 900, letterSpacing: "0.12em" }}>
                    H. COST OF WRONG DECISION
                  </div>
                  <ul style={{ margin: "8px 0 0", paddingLeft: 18, color: "#5f6368", fontSize: 14, lineHeight: 1.7 }}>
                    {output.costOfWrongDecision.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </section>

                {/* I */}
                <section
                  style={{
                    borderTop: "1px solid #e0e0e0",
                    paddingTop: 10,
                    marginTop: 6,
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                    flexWrap: "wrap",
                    alignItems: "center",
                  }}
                >
                  <div style={{ fontSize: 12, color: "#5f6368", letterSpacing: "0.12em", fontWeight: 900 }}>
                    CONFIDENTIAL
                  </div>
                  <div style={{ fontSize: 12, color: "#5f6368" }}>{output.stamp.replace("CONFIDENTIAL · ", "")}</div>
                </section>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
