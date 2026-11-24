## 1. The owner should understand the shop's current position at a glance
- Lead with accumulated sales, catalog size, and the count of products below the existing low-stock threshold.
- Use values from the app's live local data rather than hard-coded dashboard figures.
Visual: a clear sales summary with compact supporting metrics
Source: `src/screens/homescreen.js` · `src/services/mockData.js`

## 2. Recording a sale or restocking should take one clear tap
- Keep the two existing actions prominent and preserve their current destinations.
- Differentiate selling from replenishment using the specified blue and teal accents.
Visual: two distinct touch-friendly action cards
Source: `src/screens/homescreen.js` · `src/DESIGN.md` §UI Design Requirements

## 3. Low stock should point directly to what needs attention
- List products whose stock is below the existing threshold of 10 units.
- If none qualify, show the current helpful empty state instead of an empty list.
Visual: a focused stock alert list with readable quantities
Source: `src/screens/homescreen.js`
