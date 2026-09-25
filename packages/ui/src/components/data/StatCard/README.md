# StatCard

A reusable, token-driven dashboard metric (KPI) card for the **Antrosys UI Kit**. It includes an animated number counter powered by `CountUp.js`, up/down trend indicators with accessible directional iconography, a lightweight responsive SVG sparkline mini-chart, period comparison badges, and an accessible skeleton loading placeholder.

---

## Features

- **Animated Number Counter**: Mounts and updates smoothly with `CountUp.js`, respecting `prefers-reduced-motion` settings.
- **Trend Indicators**: Directional up/down indicators with semantic success/error styling and hidden screen reader descriptions.
- **Sparkline Mini-Chart**: Lightweight SVG sparkline rendered with gradient area fills using Antrosys design tokens.
- **Skeleton Loading**: Built-in animated skeleton state (`loading={true}`) matching the card's exact dimensions.
- **Prefix & Suffix Support**: Formats currency symbols, percentage signs, units, and magnitudes without layout shifting.
- **Dark Mode Ready**: Fully integrated with the Antrosys design token pipeline and `ThemeContext`.

---

## Installation / Import

```tsx
import { StatCard } from "@antrosys/ui";
import type { StatCardProps } from "@antrosys/ui";
```

---

## Props

### `StatCardProps`

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `label` | `string` | *(required)* | Metric label describing what the number represents. |
| `value` | `number` | *(required)* | Current numerical metric value. |
| `trend` | `"up" \| "down"` | `undefined` | Trend direction indicating growth or decline. |
| `sparklineData` | `number[]` | `undefined` | Data points used to render the SVG mini-chart. |
| `prefix` | `string` | `undefined` | Content displayed immediately before the value (e.g., `"$"`). |
| `suffix` | `string` | `undefined` | Content displayed immediately after the value (e.g., `"%"`, `"k"`). |
| `loading` | `boolean` | `false` | Whether to display the animated skeleton loading state. |
| `trendValue` | `string \| number` | `undefined` | Trend comparison value or percentage text (e.g., `"+12.5%"`). |
| `period` | `string` | `undefined` | Period description for comparison (e.g., `"vs last month"`). |
| `className` | `string` | `undefined` | Optional additional CSS classes for the root card container. |

---

## Usage Examples

### 1. Basic KPI Card

```tsx
import React from "react";
import { StatCard } from "@antrosys/ui";

export function BasicStatDemo() {
  return (
    <StatCard
      label="Active Users"
      value={12450}
    />
  );
}
```

### 2. Metric with Trend Indicator & Comparison

```tsx
import React from "react";
import { StatCard } from "@antrosys/ui";

export function FinancialMetric() {
  return (
    <StatCard
      label="Monthly Recurring Revenue"
      value={48500}
      prefix="$"
      trend="up"
      trendValue="+12.5%"
      period="vs last month"
    />
  );
}
```

### 3. Metric with Sparkline Mini-Chart

```tsx
import React from "react";
import { StatCard } from "@antrosys/ui";

export function ServerTrafficCard() {
  return (
    <StatCard
      label="Server Requests"
      value={94200}
      suffix="/min"
      trend="up"
      trendValue="+18.2%"
      period="past 7 days"
      sparklineData={[45, 52, 49, 62, 58, 71, 84, 95]}
    />
  );
}
```

### 4. Skeleton Loading State

```tsx
import React, { useState, useEffect } from "react";
import { StatCard } from "@antrosys/ui";

export function LoadingMetricDemo() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <StatCard
      label="Active Subscribers"
      value={3820}
      sparklineData={[10, 20, 15, 30]}
      loading={loading}
    />
  );
}
```

---

## Accessibility

- **Screen Readers**: The card exposes semantic labels for metrics and hides decorative SVG sparklines via `aria-hidden="true"`.
- **Trend Semantics**: Up and down trend badges include hidden text announcements (`"Trending up"` / `"Trending down"`) to ensure the direction is not communicated by color alone.
- **Loading State**: Uses `role="status"` and accessible announcements (`"Loading ... metric"`) during skeleton state.
- **Motion Reduction**: Automatically disables counter animations when `prefers-reduced-motion: reduce` is enabled.
