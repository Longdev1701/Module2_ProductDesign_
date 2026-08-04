---
name: ai-compliance
description: Build the compliance check engine — rule engine, Gemini orchestration, RAG retrieval, structured output parsing. Use when editing be/src/modules/compliance/, be/src/modules/ai/, or be/src/jobs/compliance/.
---

# SKILL: AI Compliance Engine

## ARCHITECTURE
pipeline: Documents → Extraction → User Verify → Applicable Regs → Rule Engine + RAG → Gemini → Validate → Findings → Score → Report

## TWO SEPARATE ENGINES (never mix)

### 1. Deterministic Rule Engine (TypeScript, no AI)
handles: MRL threshold, doc expiry, missing required docs, unit validation,
         batch code mismatch, date logic, duplicate certificates,
         regulation not yet in effect, total weight mismatch
pattern:
  if (measuredValue > allowedMrl) {
    createFinding({ severity:"critical", code:"MRL_LIMIT_EXCEEDED",
      observedValue, expectedValue, citationIds:[chunkId] })
  }

### 2. AI Engine (Gemini via RAG)
handles: qualitative analysis, document interpretation, cross-doc reasoning
RAG flow: filter(market+category+effectiveDate) → hybrid search(keyword+vector) → top chunks → Gemini prompt

## GEMINI PROMPT STRUCTURE
system:  [constraints — only use provided context, no invented law, must cite, return JSON]
domain:  [market, product type, check type, severity criteria]
context: [batch data + extracted doc fields + relevant reg chunks]

## REQUIRED OUTPUT SCHEMA (validate with Zod before saving)
{
  summary: { result: ResultEnum, riskScore: 0-100, confidence: 0-1 },
  findings: [{
    code: string,           // SCREAMING_SNAKE_CASE
    title: string,
    severity: SeverityEnum,
    status: "open",
    requirement: string,    // what the law requires
    observedData: string,   // what we found
    recommendation: string,
    citationIds: string[],  // REQUIRED — reg chunk IDs from pgvector
    confidence: 0-1,
    manualReviewRequired: boolean
  }],
  missingInformation: [{ field: string, reason: string }]
}

## CONFIDENCE RULES
< 0.6  → manualReviewRequired: true, DO NOT conclude compliant
0.6-0.8 → show warning to user
> 0.8  → still requires citationIds
any    → no citationIds = cannot save finding, cannot conclude compliant

## RESULT ENUMS
compliant | conditionally_compliant | non_compliant
insufficient_information | not_applicable | manual_review_required
FORBIDDEN: pass | fail | warning

## CITATION REQUIREMENT
every finding.citationIds[] must reference real RegulationChunk.id from DB
backend must verify citationId exists before saving finding
if citationIds empty → finding rejected, logged, returned as missingInformation

## RAG SETUP (pgvector)
embed: regulation text split by article/annex/section
store per chunk: regulation_id, version_id, market, category, effective_at, article, text, embedding
search: filter by market + category + effective_at ≤ today → cosine similarity → top-k

## CHECK STATUS FLOW
queued → processing → completed | failed | needs_input | cancelled | superseded

## RETRY LOGIC
max retries: 3
backoff: exponential
on JSON parse fail: retry with stricter prompt
on timeout: mark failed, allow manual retry
idempotency: same check_id + same doc versions = same result (don't re-run unnecessarily)

## FORBIDDEN
- AI must NOT generate legal text not in provided context
- AI must NOT conclude compliant when data is missing
- AI must NOT directly mutate user data without confirmation
- Do NOT run full AI analysis synchronously in HTTP handler → use job queue
- Do NOT store raw Gemini response — only validated structured output
