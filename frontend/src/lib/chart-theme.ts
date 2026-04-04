// E:\fintrix\frontend\src\lib\chart-theme.ts

/**
 * Centralized theme and style configuration for Recharts.
 * Ensures consistency and avoids default black rendering.
 */

// 1. Color Palette
// Modern, accessible fintech palette. Avoids pure black/white.
export const CHART_PALETTE = {
  // Series colors
  emerald: '#10B981',
  blue: '#3B82F6',
  purple: '#8B5CF6',
  amber: '#F59E0B',
  cyan: '#06B6D4',

  // Theme-aware UI colors (using HSL variables from CSS)
  foreground: 'hsl(var(--foreground))',
  mutedForeground: 'hsl(var(--muted-foreground))',
  background: 'hsl(var(--background))',
  card: 'hsl(var(--card))',
  border: 'hsl(var(--border))',
}

// Ordered array for categorical data (e.g., Pie, Bar charts)
export const CATEGORICAL_COLORS = [
  CHART_PALETTE.emerald,
  CHART_PALETTE.blue,
  CHART_PALETTE.purple,
  CHART_PALETTE.amber,
  CHART_PALETTE.cyan,
]

// 2. Axis and Grid Styles
// Subtle, non-black styles for axes and grid lines.
export const AXIS_STYLE = {
  stroke: CHART_PALETTE.mutedForeground,
  tick: { fill: CHART_PALETTE.mutedForeground },
  tickLine: { stroke: CHART_PALETTE.mutedForeground },
  className: 'text-xs',
}

export const GRID_STYLE = {
  stroke: CHART_PALETTE.border,
  strokeDasharray: '3 3',
}

// 3. Line/Area Chart Styles
// Explicit styles for lines and their dots to prevent black rendering.
export const LINE_CHART_STYLES = {
  stroke: CHART_PALETTE.emerald,
  strokeWidth: 2,
  dot: {
    r: 3,
    stroke: CHART_PALETTE.emerald,
    fill: CHART_PALETTE.background, // "Hollow" dot effect
    strokeWidth: 2,
  },
  activeDot: {
    r: 5,
    stroke: CHART_PALETTE.emerald,
    fill: CHART_PALETTE.background,
    strokeWidth: 2,
  },
}

// 4. Pie/Donut Chart Styles
// Defines the border between pie slices.
export const PIE_CHART_STYLES = {
  stroke: CHART_PALETTE.card, // Separator color matches card background
  strokeWidth: 2,
}

