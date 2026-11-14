# Project guidance

## Writing

- Use short, direct sentences and consistent terms. Follow ASD-STE100 principles without claiming certified compliance.
- Keep official card names, IDs, effect text, and rule labels unchanged.
- Separate verified rules, published lists, simulator data, and theory. Label which kind of claim you make.
- Do not treat missing event records as evidence of matchup wins.
- Do not combine data from different platforms without saying so.
- State sample sizes, dates, filters, and source limitations. Do not present them as proof of cause.
- Treat matchup ideas as tradeoffs supported by evidence, not fixed prescriptions.
- Explain core roles, flexible choices, and overlapping build styles. Do not present exact counts as mandatory.
- A reference list of 50 cards is optional. Do not silently change its contents.

## Card and rules accuracy

- Check each card's actual text, cost, power, leader condition, and current trigger.
- Distinguish On Play from Play, On K.O. from battle, and Rush, Blocker, Counter, and Wisdom effects.
- Do not infer an effect from a card's name.
- Describe optional costs and once-per-turn limits where they apply.
- Account for region legality and the rules version used.
- Keep card-specific details grounded in a source. Check Robin's Life gain after a Wisdom character without Blocker is K.O.'d, Luffy's attached-DON!! condition, Megalo's On Play timing, Captain John's restriction on all attackers, and Kyo's protection against effect-based removal rather than battle.

## Sources and privacy

- Attribute real card art and provide meaningful alternative text. Use empty alternative text only for decorative images.
- Cite appropriate public sources. Do not include account secrets or private social information.
- Never add hardcoded API credentials.

## Implementation

- Edit the MDX source, not generated `dist` output.
- Keep interactive TypeScript components separate from content.
- Preserve accessible controls, reduced-motion behavior, and mobile usability when changing existing interactions.
- Run the relevant check and build after content or code changes. Verify GitHub Pages subpath links when possible.
