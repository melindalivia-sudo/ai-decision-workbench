export interface DecisionResult {
  opportunity: string
  risk: string
  variables: string
  action: string
}

export function generateDecision(input: string): DecisionResult {
  return {
    opportunity:
      "该领域存在增长潜力，但需要评估市场进入门槛与资源匹配度。",
    risk:
      "缺乏核心技术能力可能导致项目投入大于回报。",
    variables:
      "行业增长率、技术壁垒、资金储备、团队能力。",
    action:
      "建议先通过小规模试点或投资合作方式进入，而非直接重资产布局。"
  }
}
