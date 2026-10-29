# Prediction Market Client Design

## Intent

Create a polished, desktop-first dark operations console for the existing prediction-market API. It is a learning UI only: every value is hard-coded and no frontend code may fetch from, import, or modify the backend.

## Goals

- Use React, TypeScript, Vite, and Tailwind CSS in the empty `client/` directory.
- Provide local UI flows for signup, signin, adding balance, creating a market, placing a Yes/No order, and resolving/cancelling a market.
- Follow the supplied console reference: fixed rail, compact top bar, framed panels, dense tables, restrained rounding, and a quiet dark palette with limited semantic colour.
- Keep the experience responsive: desktop rail becomes a mobile drawer and data frames retain horizontal overflow.

## Non-goals

- No API requests, authentication, database writes, persistence, or server edits.
- No real account balances, odds, payout calculations, or production validation.

## Approach

Build a self-contained Vite single-page application. A small component set owns static market data and transient UI state (active route, open modal, selected outcome, submitted confirmation). Tailwind theme tokens and a small global stylesheet provide the design system without a component library.
