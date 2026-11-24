@AGENTS.md

# Design rules (from owner, apply to every UI change)

1. No filler badges.
2. No redundant labels.
3. Don't make random words italic.
4. Mono only where needed (data, IDs, timestamps, code).
5. Show the actual product, using simulations and visualizations.
6. Enlarge the main feature.
7. Group with spacing.
8. Make headlines specific.
9. Emphasize the CTA.
10. Keep icons consistent (one set, one stroke weight, one size scale).
11. Add an accent color.
12. Inner radius = outer radius - padding.
13. Improve text contrast.
14. Wrap headlines properly (`text-wrap: balance`).
15. Align by eye, not just pixels (optical alignment).
16. Tabular numbers (`tabular-nums`) for any figures.
17. Add loading states.
18. Animate useful feedback only.
19. No purple gradients.
20. No gradient text.
21. Lose the glow (no glow effects).
22. No glossy blobs.
23. No pill/eyebrow chip above headlines.
24. No hype words.
25. Don't center everything; default to left-aligned.
26. One main button per view.
27. 4-point spacing grid.
28. Not every corner a pill; vary radius by role.
29. No tiny all-caps text.
30. One bright moment per page.

# Brand

Logo kit: `public/brand/`. Navy #0F1B2D, Coral #E8604C (accent only, never body text), Paper #F6F5F1, Slate #5B6472, Mist #A9B4C4. Headings Space Grotesk, body Inter. Don't retype/recolor the logo.

# Site scope

Two pages only: `/` (home) and `/how-it-works`. Contact = "Book a call" external link (`site.bookingUrl` in `src/content/site.ts`); no contact form or contact page.
Public copy must not include internal information: tech stack, customer profiles, pricing, partner plans, competitor notes.

# Color usage (60-30-10)

- Two colors that get along do 90% of the work; the odd one goes only on the button you want pressed.
- Homaro mapping: Paper #F6F5F1 = 60% (backgrounds), Navy #0F1B2D = 30% (text, cards, dark sections), Coral #E8604C = 10%, primary CTA only (plus the logo's o's).
- Slate/Mist are tints of the navy family for secondary text, not extra colors.

# References

- Style library: https://styles.refero.design/ (DESIGN.md per brand). Relevant: teenage engineering, Linear, Vercel, Depot, Dovetail, Moving Parts. Use for structure ideas, not to copy a brand.
