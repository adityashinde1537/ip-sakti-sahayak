# Data Sources and Corpus Policy

The SIH26045 problem statement requires a curated, version-tracked corpus and mandatory citations. This repository starts with a **source registry**, not a claim that the full legal corpus has already been ingested.

## Initial official source leads

### India
- Traditional Knowledge Digital Library (TKDL)
- India Code for statutes and rules
- IP India public databases and registries
- National Biodiversity Authority / ABS materials
- official Ayurveda product-classification and drug-regulatory instruments
- Ayurveda-Aahar / food-route materials
- advertising, labelling and related product-regulation sources referenced by the problem statement

### International
- TRIPS
- Convention on Biological Diversity
- Nagoya Protocol
- WIPO Treaty on Intellectual Property, Genetic Resources and Associated Traditional Knowledge (2024)
- PCT
- Madrid System
- Hague System
- Budapest Treaty
- herbal-product market-access regimes for target export markets

## Required metadata per ingested source

- canonical source ID
- title
- issuing authority
- jurisdiction
- exact document/version
- effective date where available
- retrieval date
- source URL or registry locator
- citation locator (section/article/page/record)
- checksum for immutable snapshots where legally permissible
- access type: public, private, paid

## Access rules

Public official sources may be indexed according to their terms. Private or paid sources must never be connected without explicit, logged permission from the entitled user.

## Citation rule

A generated statement must be backed by retrieved evidence. If the system cannot point to the supporting source location, it should not present the statement as authoritative.
