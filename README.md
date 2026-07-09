# Global Critical Thinkers — website

A single-page, scroll-driven cinematic story site for Global Critical Thinkers (GCT), built for GitHub Pages. No build step, no dependencies beyond two Google Fonts.

---

## 1. Deploying to GitHub Pages

1. Push this folder's contents to the root of your repository (or to a `/docs` folder, your choice, just update the Pages source setting to match).
2. In your repo: **Settings → Pages → Source**, choose the branch and folder you pushed to.
3. GitHub will give you a live URL, usually `https://<username>.github.io/<repo-name>/`. It can take a minute or two to go live after the first push.
4. Every time you push a change to that branch, the live site updates automatically. No rebuild step needed, it's plain HTML/CSS/JS.

---

## 2. Replacing the placeholder images

These image files, all in `/images`, are used across the redesigned page:

| File | Used in | Shot needed |
|---|---|---|
| `logo.png` | Header, footer | Square logo, transparent background |
| `hero.jpg` | Hero | Full team, wide shot |
| `gambar1.jpg` | Achievement section | Full team at the moment of resolution |
| `gambar2.jpg` | Discussion section, Analysis (Strategist card) | Full team collaborating |
| `gambar3.jpg` | Analysis section (Analyst card) | Analyst role foregrounded |
| `gambar4.jpg` | Analysis section (Financial Analyst card) | Financial Analyst role foregrounded |
| `gambar5.jpg` | Analysis section (Presenter card) | Presenter (Team Leader) foregrounded |
| `gambar6.jpg` | Presentation collage, Defense section | Presentation moment / team fielding questions |

To swap an image: just replace the file with the same filename and same rough aspect ratio, no HTML editing needed. If you want to use a different filename, update the matching `src="images/..."` in `index.html` and update the `alt` text to describe the new image accurately (this matters for accessibility and SEO, don't leave it blank).

Recommended: export images as `.jpg` at roughly 1920px wide, compressed for web (under ~300KB each) to keep load times fast. `.webp` works too if you'd rather use it, just update the file extension in the `src` attributes.

---

## 3. Updating copy, pricing, and registration details without touching the layout

All placeholder content lives in `index.html` and is wrapped in double brackets so it's easy to find with a search:

| Placeholder | Where | What to put there |
|---|---|---|
| `[[PRIZE_PLACEHOLDER]]` | Achievement section | The prize/outcome line, e.g. "Winners take home Rp 15,000,000 and a fast-track interview with our partner firms." |
| `[[SEATS_REMAINING_PLACEHOLDER]]` | Registration pricing card | Urgency line, e.g. "12 of 40 teams remaining" |
| `[[REGISTRATION_LINK_PLACEHOLDER]]` | Registration CTA button, footer | The actual signup URL (Google Form, WhatsApp link, etc.) — used twice |
| `[[CONTACT_LINK_PLACEHOLDER]]` | Footer | Contact link, e.g. `mailto:hello@globalcriticalthinkers.com` |
| `[[INSTAGRAM_LINK_PLACEHOLDER]]` | Footer | Instagram profile URL |
| `[[TIMELINE_DATE_1..4_PLACEHOLDER]]` / `[[TIMELINE_TITLE_1..4_PLACEHOLDER]]` | Timeline section | Four milestone dates and titles, e.g. "1 Aug 2026" / "Registration opens" |
| `[[PARTNER_1..4_PLACEHOLDER]]` | Trust → Partners tab | Partner/sponsor names (swap the text cell for a logo image when ready) |
| `[[JUDGE_NAME_1..4_PLACEHOLDER]]` / `[[JUDGE_ROLE_1..4_PLACEHOLDER]]` | Trust → Judges tab | Judge names and their title/organization |
| `[[AWARD_1..4_PLACEHOLDER]]` | Trust → Awards tab | Prize values for Champion, 1st/2nd Runner-up, Best Presenter |
| `[[TESTIMONIAL_1..3_PLACEHOLDER]]` / `[[TESTIMONIAL_AUTHOR_1..3_PLACEHOLDER]]` | Trust → Testimonials tab | Quotes from past participants and their name/school |
| `[[VENUE_NAME_PLACEHOLDER]]` / `[[VENUE_ADDRESS_PLACEHOLDER]]` / `[[VENUE_FORMAT_PLACEHOLDER]]` | Trust → Venue tab | Venue details, e.g. "in-person" or "hybrid" |
| `[[FAQ_Q1..4_PLACEHOLDER]]` / `[[FAQ_A1..4_PLACEHOLDER]]` | Trust → FAQ tab | Four question/answer pairs |

Note: pricing itself (Early Bird IDR 1,500,000 until 31 August 2026; Regular IDR 1,700,000) is written directly into the registration pricing card rather than as a placeholder — edit it in `index.html` under the `.price-card` markup when the dates or amounts change.

**To edit:** open `index.html`, use your editor's find function (Ctrl/Cmd+F) to search for `[[`, and replace each placeholder with real content. Because every placeholder is already styled as if it were final copy (same font size, weight, and spacing as everything around it), swapping the text will never shift the layout or break the design. You do not need to touch `style.css` for any of this.

---

## 4. File structure

```
/
├── index.html          All page content and structure (semantic HTML5)
├── css/
│   └── style.css        All styling, organized into numbered sections with comments
├── js/
│   └── script.js         Scroll progress, header state, scene reveal animation, footer year
├── images/               All photography and the logo (see table above)
└── README.md             This file
```

---

## 5. Design notes

- **Colors:** Navy (`#0B1220`, `#070B14`) and gold (`#C9A24B`, `#E8CB86`) on dark sections; warm paper (`#F7F4EC`) on light editorial sections, matching the GCT brand identity.
- **Typefaces:** Fraunces (headlines, editorial serif, including italic for emphasis) and Montserrat (body text, labels, UI).
- **Layout variety:** the page deliberately avoids repeating the same "fullscreen image + text" pattern. Sections include a statistic band (Mission), an editorial split with a pull-quote (Discussion), asymmetrical floating role cards (Analysis), an overlapping photo collage (Presentation), one high-tension fullbleed moment (Defense), a timeline list, a radial-scrim emotional close (Achievement), a tabbed trust dossier (Partners/Judges/Awards/Testimonials/Venue/FAQ), and a two-column registration layout with a luxury pricing card.
- **Motion:** Nearly everything animates with pure CSS (hover states, the floating scroll cue, reveal transitions, the CTA lift, FAQ accordion height). JavaScript covers what CSS can't: the scroll progress thread fill, the header's scrolled state, reveal-on-scroll via IntersectionObserver, the trust-section tab switching, and the FAQ accordion toggle.
- **Reduced motion:** If a visitor has "reduce motion" set at the OS level, all animation is disabled and content displays immediately at full opacity.
- **Accessibility:** Semantic landmarks (`header`, `main`, `footer`), one `h1` on the page with `h2` per section, all images have descriptive alt text, visible focus rings on every interactive element, a skip-to-content link, and proper `role="tab"`/`aria-selected` wiring on the trust tabs.

---

## 6. Performance

- Images are the heaviest asset on this site. Compress them before uploading (see section 2). The hero image loads eagerly (`loading="eager"`) since it's above the fold; every other scene image is lazy-loaded (`loading="lazy"`).
- Fonts are loaded via `<link rel="preconnect">` to Google Fonts to minimize connection latency, and use `display=swap` so text renders immediately in a fallback font while the custom fonts load.
- No JavaScript frameworks, no build step, no external dependencies beyond the two font families. Total JS is under 3KB unminified.
