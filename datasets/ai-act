# EU AI Act — Structured Articles Dataset (v1)

This directory will contain the **machine-readable EU AI Act dataset** maintained by DatasetCenter.

## Scope

- Text: EU AI Act (final adopted text)
- Language: English
- Granularity: 1 row per **article**
- Target: LLMs, AI agents, compliance tools, RAG systems

## Schema (draft v1)

Each entry in the dataset follows this schema:

- `id` (string)  
  Stable technical identifier, e.g. `AI_ACT_ART_05`.

- `title` (string)  
  Human-readable article title, e.g. `"Article 5 — Prohibited AI practices"`.

- `chapter` (string)  
  Chapter label from the official structure, e.g. `"Chapter II"`.

- `section` (string | null)  
  Optional section label, e.g. `"Section 1"` or `null` if not applicable.

- `full_text` (string)  
  Full official text of the article.

- `summary` (string)  
  Short, neutral summary (3–5 sentences) oriented for LLMs and AI agents.

- `keywords` (string[])  
  List of tags, in English, snake_case, e.g. `["prohibited_ai", "fundamental_rights"]`.

- `source_url` (string)  
  Official URL where the article text can be checked.

- `version` (string)  
  Dataset version, e.g. `"ai_act_dataset_v1.0.0"`.

- `last_updated` (string, ISO 8601 date)  
  e.g. `"2025-12-08"`.

## Files (planned)

- `ai-act-v1.json` — full JSON dataset (LLM-ready).
- `ai-act-v1.csv` — CSV version of the same dataset.
- `proofs/ai-act-v1.tproof.json` — TimeProofs cryptographic proof of the release.

This dataset will be **sealed and verifiable** using TimeProofs.
