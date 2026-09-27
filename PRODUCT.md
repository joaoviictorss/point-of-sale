# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary user is a small/mid retail shop owner-operator in Brazil — someone who owns or runs a single physical store (or a very small team), handling checkout, stock, and sellers themselves rather than delegating to specialized back-office staff. The multi-tenant model (`Organization`/`Member` with `ADMIN`/`EMPLOYEE` roles) also supports a small team of employees under one owner, but the primary persona is the owner-operator, not a multi-branch chain.

## Product Purpose

VNS Admin is a point-of-sale and lightweight retail-management system: product catalog (unit/weight/volume types), stock movements (sale/return/adjustment/purchase), seller tracking, a checkout/cart flow with multiple Brazilian payment methods (cash, credit/debit card, PIX, bank transfer, with installments), customers, and order lifecycle including cancellation. Success means an owner-operator can run day-to-day sales and stock without needing training or a back office.

## Positioning

Simplicity over feature bloat, relative to generic Brazilian PDV/ERP competitors (Bling, Tiny, PDV Legal, etc.). VNS is not trying to be a full accounting/ERP suite — it stays deliberately leaner and faster to use than bloated competitors, favoring a fast, clean checkout and admin experience over exhaustive feature coverage.

## Operating Context

- Brazilian retail context: Portuguese-language UI (`pt-BR`), CPF/CNPJ customer documents, PIX as a first-class payment method, monetary values stored in centavos.
- Multi-tenant: each shop is an `Organization` (with a `slug`-based URL segment), created via an onboarding modal (`OrganizationModal`) that is forced open until an organization exists.
- Core workflows already implemented: sign-up/sign-in (email+password and Google OAuth), password reset via email, product CRUD plus batch import (spreadsheet upload → review/correct rows), stock movement management, seller management, new-sale/checkout flow with cart and payment tiles, sales list with cancellation and receipts.
- Fiscal invoicing (`Invoice` model: NFe/NFCe, DRAFT/ISSUED/CANCELLED/ERROR) exists in the schema but is not confirmed as implemented UI/flow yet — treat as schema scaffolding, not a working feature, unless code says otherwise at the time of the work.

## Capabilities and Constraints

- Stack: Next.js 15 (App Router) + React 19, tRPC + TanStack Query/Table, Prisma 6 + PostgreSQL, Tailwind v4 + shadcn/radix components, react-hook-form + zod, S3-compatible media storage, Resend for transactional email.
- Terminology (Portuguese, used throughout routes and UI): vendas (sales), produtos (products), vendedores (sellers), estoque (stock), cadastro em lote (batch registration).
- Multi-payment checkout: cash, credit card, debit card, PIX, bank transfer, with installments and per-payment status tracking.
- Open/undecided: whether NFe/NFCe fiscal invoicing will be built out as a real user-facing flow, and on what timeline.

## Brand Commitments

- Product name is **VNS** (shown as "VNS - Admin" in the app title/metadata) — this is the committed name, not a placeholder, despite the repo/package being internally named `point-of-sale`.
- Existing brand assets: `public/logo.png` (app logo) and `public/hero-login.png` (a real photo of a physical retail POS terminal, used as the sign-in page hero).
- A related visual-exploration project ("VNS-Admin POS mockups") exists in Claude Design (claude.ai/design), with tokens intended to map 1:1 to this codebase's shadcn setup — treat as a source of prior visual direction to check, not as this file's concern.

## Standing Design Preference

For marketing/Persuade surfaces (landing pages, campaigns), VNS commits to the **category-standard professional SaaS look** ("canon"), played straight — not an invented bespoke visual world. The craft bar is **lp.gestio.com.br** (a Brazilian B2B purchasing-software LP): clean grid, generous whitespace, floating product-visual hero, feature sections, pricing cards, confident but conventional motion. Execute in VNS's own existing tokens (`--primary` blue, shadcn component set, Geist font) rather than gestio's literal palette. This preference was set after a bolder "shop-signage" concept (enamel plaques, saturated palette) was tried and explicitly rejected by the user as unrelated to the product. Future Persuade-mode work on VNS should start from this canon, not from a fresh direction tournament.

## Evidence on Hand

- No real customers, testimonials, or case studies yet — `hero-login.png` and `logo.png` are the only concrete visual assets on hand; do not treat them as proof of traction or fabricate customer evidence around them.

## Product Principles

1. Favor a fast, uncluttered checkout and admin experience over matching every feature of larger Brazilian ERPs.
2. Design for a single owner-operator (or tiny team) running a physical shop, not a back-office team or multi-branch enterprise.
3. Respect Brazilian retail conventions as real constraints, not stylistic choices: pt-BR copy, PIX, CPF/CNPJ, centavos-based pricing.
4. Keep fiscal invoicing (NFe/NFCe) treated as unconfirmed/in-progress until the code shows otherwise — don't design around it as a finished capability.
