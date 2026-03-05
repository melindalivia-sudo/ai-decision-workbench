import React, { useState } from "react"
import { generateDecision, DecisionResult } from "./decisionEngine"

export default function DecisionRoom() {
  const [input, setInput] = useState("")
  const [result, setResult] = useState<DecisionResult | null>(null)

  const handleGenerate = () => {
    const res = generateDecision(input)
    setResult(res)
  }

  return (
    <div style={{ padding: 40, maxWidth: 800, margin: "auto" }}>
      <h1>CEO 决策室</h1>

      <textarea
        placeholder="请输入你的决策问题..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{
          width: "100%",
          height: 120,
          padding: 10,
          marginBottom: 20
        }}
      />

      <button onClick={handleGenerate}>生成建议</button>

      {result && (
        <div style={{ marginTop: 30 }}>
          <h3>机会</h3>
          <p>{result.opportunity}</p>

          <h3>风险</h3>
          <p>{result.risk}</p>

          <h3>关键变量</h3>
          <p>{result.variables}</p>

          <h3>建议行动</h3>
          <p>{result.action}</p>
        </div>
      )}
    </div>
  )
}
