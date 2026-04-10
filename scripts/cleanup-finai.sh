#!/bin/bash
# Cleanup script — removes junk files created by GTM agents in the FinAI repo
cd /Users/rafaelmartinez/Desktop/App-Desarrollo/Finam/FinamPer

echo "Removing GTM agent junk files..."
rm -f CEO_CRISIS_DECISION.md
rm -f CRISIS_QA_EMERGENCY_REPORT.md
rm -f FINAI_FINANCIAL_RECOVERY_PLAN.md
rm -f FINAL_PRE_ESCALATION_STATUS.md
rm -f FINANCE_EMERGENCY_STANDALONE_AUTHORITY.md
rm -f FINANCE_FINAL_WARNING_STATUS.md
rm -f FINANCIAL_CRISIS_ANALYSIS.md
rm -f GTM_STRATEGY_COMPLETE.md
rm -f ICP_ANALYSIS.md
rm -f POST_ESCALATION_200K_THRESHOLD_BREACH.md
rm -f QA_2HOUR_ESCALATION_NOTICE.md
rm -f QA_ASSESSMENT_REPORT.md
rm -f QA_BOARD_DEADLINE_EXCEEDED.md
rm -f QA_BOARD_ESCALATION_DEPLOYED.md
rm -f QA_COORDINATED_ESCALATION_UPDATE.md
rm -f QA_COORDINATED_FINAL_APPROACH.md
rm -f QA_CRISIS_MONITORING_DAY1.md
rm -f QA_FINAL_HOUR_STATUS.md
rm -f QA_FINAL_WARNING_STATUS.md
rm -f QA_POST_ESCALATION_13MIN.md
rm -f QA_RISK_REGISTER.md
rm -f QA_TESTING_CHECKLIST.md
rm -f STRATEGIC_ANALYSIS.md
rm -f UNIT_ECONOMICS_ANALYSIS.md
rm -f URGENT_QA_FOLLOWUP_ALERT.md
rm -f "3:1"
echo "Done — removed all junk files"
echo ""
echo "Remaining files:"
ls -la *.md *.tsx *.ts *.json *.html 2>/dev/null
