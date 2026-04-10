# ASB Landing Page Migration Plan

## Goal

Rebuild the source landing pages from `D:\asb-lps\asb` inside
`D:\asb-lps\asb-nextjs\asb-next` using Next.js, TypeScript, and Tailwind v4
without changing the visual output, lead flow behavior, or source content.

The migration strategy is source-first:

- Preserve the original HTML structure, class names, copy, and assets.
- Keep the original CSS files available unchanged from `public/assets/css`.
- Use Tailwind for layout helpers, component boundaries, and future cleanup.
- Replace PHP, jQuery, inline scripts, and DOM mutation code with typed React and
  Next API routes.
- Optimize only after the page is functionally and visually matched.

## Current Findings

- `app/page.tsx` is not the ASB landing page from `asb/index.html`.
- `app/lp/page.tsx` is an ALC page and should not be treated as the ASB source.
- The source ASB page is `asb/index.html`.
- The source ASB lead flow is OTP-based and posts to:
  - `send-otp-auto.php`
  - `verifyotpauto.php`
  - `thank-you.php`
- The Next app already contains reusable OTP APIs and a `LeadForm` component, but
  they must be aligned to the exact ASB source fields and copy.
- Assets and CSS have already been copied into `public/`, which is a good base.

## Source Inventory To Port

### Core page

- `asb/index.html`

### Related server flows

- `asb/send-otp-auto.php`
- `asb/verifyotpauto.php`
- `asb/thank-you.php`
- `asb/lp.php`

### Styling

- `asb/assets/css/*.css`
- `asb/whm-sections.css`
- inline `<style>` blocks inside `asb/index.html`

### Behaviors to preserve

- Hero lead form with OTP modal
- Sticky desktop and mobile CTA buttons
- Smooth scrolling with sticky navbar offset
- International/Oxford image slider
- Testimonial video carousel and modal
- Brochure modal and brochure download marker
- Footer anchor behavior
- Tracking snippets and conversion hooks

## Execution Order

1. Create route ownership and page map for ASB pages.
2. Port the source ASB home page markup into typed Next components with the same
   section order and class names.
3. Move inline source styles into route-scoped CSS or global source CSS without
   changing selectors.
4. Replace source DOM scripts with React state/hooks and small utility helpers.
5. Align the Next OTP APIs and thank-you flow with the ASB source behavior.
6. Validate visuals section by section against `asb/index.html`.
7. Optimize images, script loading, and CSS delivery only after parity is reached.

## Immediate Build Plan

### Phase 1

- Treat `asb/index.html` as the primary migration source.
- Keep existing Opus work as reference only, not as the source of truth.
- Rework `app/page.tsx` toward the ASB page instead of continuing the current
  mixed implementation.

### Route Map

- `/` -> main ASB landing from `asb/index.html`
- `/bba` -> BBA landing from `asb/bba23.html`
- `/bca` -> BCA landing from `asb/bca23.html`
- `/bcom` -> B.Com landing from `asb/bcom23.html`
- `/bsc` -> B.Sc landing from `asb/bsc23.html`
- `/thank-you` -> main ASB thank-you flow
- `/thank-you/bba` -> BBA thank-you flow
- `/thank-you/bca` -> BCA thank-you flow
- `/thank-you/bcom` -> B.Com thank-you flow
- `/thank-you/bsc` -> B.Sc thank-you flow

### Phase 2

- Extract the ASB page into source-faithful sections:
  - Header and hero
  - Lead form and OTP modal
  - International section
  - Recruiters
  - Programs
  - Testimonials
  - Leadership
  - Campus
  - Events
  - Contact CTA
  - Brochure modal
  - Footer
  - Sticky CTAs

### Phase 3

- Reuse or adapt shared typed pieces only where they do not break parity:
  - `LeadForm`
  - `/api/send-otp`
  - `/api/verify-otp`

## Rules For The Migration

- Do not redesign sections while porting.
- Do not rename CSS classes unless there is a strong technical reason.
- Do not convert everything to Tailwind-only at the cost of visual drift.
- Do not optimize by deleting source behavior before it is replicated in React.
- Prefer exact copy/assets/spacing first, cleanup second.
