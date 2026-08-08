# 🎰 Lottery Statistical Analyzer & Ticket Generator

A high-performance, web-based statistical engine and combinatorial ticket generator for multi-ball lottery matrices (Powerball, Mega Millions, and Custom Game Rules). Built with **Next.js 14**, **React**, **TypeScript**, **Tailwind CSS**, and **Recharts**.

🚀 **Live Demo:** (https://lottery-analyzer-nine.vercel.app/)

---

## 📌 Executive Overview

The **Lottery Statistical Analyzer** evaluates historical lottery draw datasets (via CSV upload) to detect statistical imbalances, frequency spectrum distribution, and parity ratios. 

Using weighted probability sampling and historical gap tracking, the engine filters out statistically improbable extreme combinations (such as all-low or all-even picks) and generates balanced candidate tickets matching real-world draw distributions.

---

## 🎯 Primary Evaluation Parameters & Metrics

The system analyzes uploaded draw histories across six core statistical parameters:

### 1. High/Low Boundary Balance
* **Definition:** Divides the white ball pool into two equal halves based on the mathematical midpoint threshold:
  $$\text{Midpoint Threshold} = \left\lceil \frac{\text{Max White Ball}}{2} \right\rceil$$
* **Powerball ($1\text{–}69$):** Threshold $\ge 35$ (High: $35\text{–}69$, Low: $1\text{–}34$)
* **Mega Millions ($1\text{–}70$):** Threshold $\ge 36$ (High: $36\text{–}70$, Low: $1\text{–}35$)
* **Statistical Target:** Historical draw combinations align with a Gaussian distribution, where $\approx 80\%$ of winning draws fall into balanced $3\text{ High} / 2\text{ Low}$ or $2\text{ High} / 3\text{ Low}$ splits.

### 2. Odd / Even Parity Ratio
* Tracks the percentage breakdown of odd versus even numbers drawn across all evaluated draws to verify natural random distribution.

### 3. Frequency Spectrum (Hot & Cold Balls)
* **Hot Balls:** Top $N$ most frequently drawn numbers in the dataset.
* **Cold Balls:** Top $N$ least frequently drawn numbers in the dataset.

### 4. Overdue Gap Analysis
* Tracks the draw gap count (how many consecutive draws have elapsed since a specific number was last selected) to highlight cold numbers that are overdue for variance rebound.

### 5. Sum Range & Averages
* Calculates the sum total of white balls for each historical draw, tracking minimums, maximums, and overall moving averages to prevent generating combinations with sums outside normal statistical bell curves.

### 6. Consecutive Pair Tracking
* Monitors the frequency of adjacent consecutive numbers (e.g., $14, 15$) occurring in the same draw.

---

## 🕹️ Supported Game Matrices

| Game Mode | Balls Drawn | Max White Ball ($1..N$) | Max Bonus Ball ($1..M$) | Auto High/Low Threshold |
| :--- | :---: | :---: | :---: | :---: |
| **Powerball** | $5$ | $69$ | $26$ | $\ge 35$ |
| **Mega Millions** | $5$ | $70$ | $25$ | $\ge 36$ |
| **Custom Matrix** | Configurable ($1\text{--}10$) | Configurable ($10\text{--}100$) | Configurable ($1\text{--}50$) | Auto Calculated ($\lceil N/2 \rceil$) |

---

## 📄 CSV Format & Sanitization Rules

The analyzer supports both **single-column space-separated strings** and **multi-column header formats**.

### Supported CSV Formats

#### Format A: Single Combined Column
```csv
Draw Date, Winning Numbers, Multiplier
08/05/2026, 14 20 48 54 61 04, 03
08/03/2026, 08 30 41 48 54 14, 02
```

### Format B: Multi-Column Headers
In this format, each drawn ball is separated into distinct numeric columns:

```csv
Draw Date, Num1, Num2, Num3, Num4, Num5, Mega Ball
08/04/2026, 04, 18, 26, 43, 70, 21
08/01/2026, 12, 18, 33, 43, 65, 11
```

### Data Sanitization Pipeline
Any row containing out-of-range numbers ($> \text{Max White Ball}$ or $> \text{Max Bonus Ball}$), non-numeric characters, or incorrect ball counts is safely isolated and logged in the Upload Sanitization Log banner without disrupting valid dataset processing.

## 🛠️ Tech Stack & Architecture

```text
src/app/
├── components/
│   ├── Header.tsx
│   ├── CustomMatrixSettings.tsx
│   ├── DashboardControls.tsx
│   ├── AnalyticsMetrics.tsx
│   ├── FrequencyChart.tsx
│   └── CandidateTickets.tsx
├── lib/
│   ├── lotteryEngine.ts
│   └── csvParser.ts
└── page.tsx
```

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Lucide Icons
- **Data Visualization:** Recharts
- **CSV Parsing:** PapaParse

## 🚀 Getting Started

### Prerequisites

- **Node.js:** `v18.0.0` or higher
- **npm** or **yarn**

### Local Setup

1. **Clone the repository:**

```bash
git clone https://github.com/your-username/lottery-statistical-analyzer.git
cd lottery-statistical-analyzer
```

2. **Install dependencies:**

```bash
npm install
```

3. **Run the development server:**

```bash
npm run dev
```

4. **Open in browser:**

Navigate to http://localhost:3000/

## 🧪 Automated Testing
To execute automated CSV parsing test suites and verify production builds:

```bash
# Run unit test suite
npm run test

# Perform production build check
npm run build
```
