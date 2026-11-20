# Accessibility and responsive evidence

Implemented:
- Semantic landmarks (`header`, `nav`, `main`, `section`, `footer`) and a skip link.
- Visible focus indicators and keyboard-operable native buttons, selects, inputs, and dialogs.
- Search/filter labels; application labels and inline field errors.
- `aria-live` result count and `role=status` messages; loading indicator with `aria-busy`.
- Native `<dialog>` for details/application, with close controls and Escape support.
- Reduced-motion preference and responsive CSS breakpoints.
- Cards and form controls reflow at narrow widths; no fixed page width.

Manual evidence checklist (record screenshots before submission):
- [ ] 360px viewport: no horizontal page scrolling; cards stack.
- [ ] 768px viewport: two-column card grid.
- [ ] Desktop (≥1024px): three-column grid.
- [ ] Keyboard: Tab through navigation, search, filters, cards, dialogs and form; use Enter/Space and Escape.
- [ ] Screen reader: confirm labels, result count and validation messages.
- [ ] Empty search and server-offline retry states.
