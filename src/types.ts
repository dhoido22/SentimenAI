export interface Metadata {
  report_id: string;
  generated_at: string;
  total_reviews_analyzed: number;
  industry_sector: string;
  analysis_engine: string;
  confidence_score: number;
}

export interface ExecutiveSummary {
  headline: string;
  overall_sentiment_label: 'SANGAT POSITIF' | 'POSITIF' | 'CAMPURAN / WASPADA' | 'KRITIS / NEGATIF' | string;
  sentiment_score: number; // 0 - 100
  status_level: 'HEALTHY' | 'WARNING' | 'CRITICAL';
  key_takeaways: string[];
  management_alert_flag: boolean;
}

export interface SatisfactionMetrics {
  csat_score: number; // 0 - 100
  csat_benchmark_status: string;
  nps_score: number; // -100 to +100
  nps_category: string;
  ces_score: number; // 1 to 5
  sentiment_distribution: {
    positive_percentage: number;
    positive_count: number;
    neutral_percentage: number;
    neutral_count: number;
    negative_percentage: number;
    negative_count: number;
  };
  urgency_levels: {
    critical_urgent: number;
    high: number;
    medium: number;
    low: number;
  };
}

export interface IssueBreakdown {
  category_id: string;
  category_name: string;
  issue_count: number;
  percentage_of_total: number;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  problem_summary: string;
  representative_quotes: string[];
  root_cause_analysis: string;
  business_impact: string;
}

export interface WeeklyTrend {
  week_label: string;
  week_number: number;
  csat: number;
  nps: number;
  positive_pct: number;
  negative_pct: number;
  neutral_pct: number;
  dominant_issue: string;
}

export interface NegativeSpikeAlert {
  is_spike_detected: boolean;
  spike_threshold_pct: number;
  current_negative_pct: number;
  delta_from_baseline: string;
  urgency_status: 'NORMAL' | 'ELEVATED' | 'TRIGGERED_ALERT';
  alert_message: string;
  immediate_containment_action: string;
  suggested_channel_alert: string;
}

export interface StrategicInsights {
  core_strengths: string[];
  systemic_bottlenecks: string[];
  churn_risk_projection: string;
  revenue_impact_estimate: string;
}

export interface ActionableRecommendation {
  id: string;
  title: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  category: string;
  owner_department: string;
  timeline: string;
  expected_impact: string;
  action_steps: string[];
}

export interface DetailedReview {
  id: string;
  text: string;
  source: string;
  timestamp: string;
  sentiment: 'POSITIF' | 'NETRAL' | 'NEGATIF';
  sentiment_score: number;
  category: string;
  urgency: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  detected_keywords: string[];
  summary: string;
}

export interface ExecutiveReport {
  metadata: Metadata;
  executive_summary: ExecutiveSummary;
  satisfaction_metrics: SatisfactionMetrics;
  issue_breakdown: IssueBreakdown[];
  weekly_trends: WeeklyTrend[];
  negative_spike_alert: NegativeSpikeAlert;
  strategic_insights: StrategicInsights;
  actionable_recommendations: ActionableRecommendation[];
  detailed_review_analysis: DetailedReview[];
}
