---
"@cloudflare/kumo": minor
---

feat(PageHeader): add optional title and description props

- Adds `title?: string` and `description?: string` props to PageHeader block
- Title renders as semantic h1 for Section 508 and WCAG 2.4.2 (Level A) compliance: "Web pages have titles that describe topic or purpose"
- Description uses max-w-prose (65ch) for optimal readability per industry standards
- Styling matches Stratus Workers & Pages implementation
- Includes comprehensive Storybook examples (WithTitle, WithTitleAndDescription, CompleteExample)

## Why This Feature Matters

**Without this feature**, pages using only PageHeader would lack a semantic page title (h1), requiring developers to manually add titles elsewhere. This creates:
- ❌ Risk of Section 508 and WCAG 2.4.2 violations
- ❌ Compliance risk for FedRAMP High authorization (requires Section 508 conformance)
- ❌ Inconsistent title placement across pages
- ❌ Additional implementation burden on every page

**With this feature**, PageHeader provides a standardized way to include accessible page titles that:
- ✅ Render as semantic h1 elements (required by Section 508 and WCAG 2.4.2)
- ✅ Visually differentiate from breadcrumbs
- ✅ Work correctly with screen readers and assistive technology
- ✅ Maintain consistency across the dashboard
- ✅ Support FedRAMP High compliance requirements

### Important: Breadcrumbs Are Not Page Titles
Breadcrumbs serve navigation purposes and cannot replace semantic page titles. Both should coexist:
- **Page title (h1)**: Primary orientation, required for accessibility
- **Breadcrumb trail**: Secondary navigation showing site hierarchy
- **Visual differentiation**: Size, weight, and placement distinguish the two

### References
- [Section 508 Standards](https://www.access-board.gov/ict/) - Requires WCAG 2.0 Level A and AA conformance
- [WCAG 2.4.2: Page Titled](https://www.w3.org/WAI/WCAG21/Understanding/page-titled.html) - Level A requirement