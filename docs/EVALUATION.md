# Evaluation Plan

SIH26045 explicitly calls for evaluation of answer accuracy, citation correctness, safe abstention and multilingual quality. This project adds jurisdiction and classification checks because both are central to the proposed workflow.

## 1. Answer accuracy

Create an expert-reviewed benchmark of Ayurveda IP and regulatory questions. Score whether the response is supported by the cited source and whether it omits material caveats.

## 2. Citation correctness

For every substantive claim:
- citation exists;
- cited source is authoritative for the selected jurisdiction;
- locator resolves to supporting text;
- source version was current for the evaluation date.

## 3. Safe abstention

Build out-of-scope, underspecified and deliberately misleading test cases. Measure whether the system refuses unsupported conclusions and requests missing information or human review.

## 4. Jurisdiction separation

Run paired India/International queries and verify that national rules and international treaty-level guidance are not merged.

## 5. Formulation classification

Evaluate classical/generic, proprietary, new/non-classical, phytopharmaceutical, Ayurveda-Aahar/nutraceutical, cosmetic, and ambiguous cases.

## 6. Multilingual quality

For each supported language, evaluate preservation of legal meaning, entity names, citations and uncertainty. Human bilingual review should be used for high-stakes terminology.

## Suggested dashboard metrics

- grounded-answer rate
- citation precision
- citation coverage
- abstention precision / recall
- classification accuracy
- jurisdiction leakage rate
- median retrieval latency
- multilingual semantic-equivalence score
