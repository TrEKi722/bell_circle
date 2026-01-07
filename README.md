# Bell Circle

A simple, fast, and readable way to view bell schedules for Capistrano Unified schools. Bell Circle began by adapting schedule code provided by Rewordify and has grown into a custom, theme-aware site with per‑school pages, special schedules, and URL‑driven custom schedules.

- Production: https://bell-circle.com
- Beta: https://beta.bell-circle.com
- Repo: https://github.com/TrEKi722/bell_circle

---

## Why Bell Circle

Students, parents, and staff need quick access to accurate schedules—without PDFs buried in emails or unclear screenshots. Bell Circle:
- Centralizes per-school schedules in one place
- Makes special schedules easy to find
- Lets you create and share custom schedules when the day doesn’t follow the usual pattern
- Loads fast and works well on phones, with dark mode support

Not affiliated with Capistrano Unified School District.

---

## Features

- Per‑school schedules with clear period names and times
- Special schedules for assemblies, minimum days, testing windows, and one‑offs
- Custom schedule generator via URL parameters
- Dark mode with theme‑aware logos and favicon
- Static architecture (HTML/CSS/JS) for reliability and speed
- Sitemap and routing for clean URLs and simple navigation

---

## Recent Highlights

- Dark mode, logo switching, and favicon updates
- Fixed AVMS Monday schedule
- Issue templates added for reporting problems and requests
- Beta branch used for iterative changes; merged periodically to main
- Sitemap updated with new pages; routes file syntax fixed

---

## Project Structure

```
bell_circle/
├─ .github/ISSUE_TEMPLATE/      # Issue templates
├─ RewordifySchedules/          # Legacy schedule pages
├─ SpecialSchedules/            # One-off or district-wide deviations
├─ about/                       # About
├─ anhs/ avms/ djams/ fnms/ ... # Per-school folders
├─ blog/                        # Updates
├─ change-log/                  # Version notes
├─ comingsoon/                  # Teaser pages
├─ css/                         # Global stylesheets
├─ custom/                      # Custom schedule implementation
├─ cv/                          # CV page(s)
├─ feedback/                    # Feedback/info
├─ privacy/                     # Privacy policy
├─ 404.html                     # Not-found page
├─ README.md                    # This file
├─ _routes.json                 # Clean URL routes (Cloudflare Pages)
├─ favicon.ico                  # Fallback favicon
├─ footer.html                  # Shared footer
├─ index.html                   # Home
├─ navbar.html                  # Shared navbar
├─ navbar.js                    # Navbar behavior
├─ sitemap.xml                  # SEO sitemap
└─ Media/                       # Images and assets
```

Languages (approx.):
- HTML ~73%
- CSS ~24%
- JavaScript ~3%

---

## Per‑School Pages

Each school has its own folder and index page with:
- Daily schedule blocks
- Notes on special cases (zero period, office hours, etc.)
- Links to any special schedules when applicable

Examples:
- /anhs/
- /avms/
- /djams/
- /fnms/
…and more

---

## Special Schedules

Located in `/SpecialSchedules/`. Use these pages when the normal schedule is replaced (assemblies, minimum days, testing, etc.). When a special schedule is active, per‑school pages link or redirect accordingly.

Contribute updates by opening an issue with the official source (school/district announcement) or submitting a PR with the new schedule page.

---

## Custom Schedules (URL Format)

Create ad‑hoc schedules via URL parameters using a 24‑hour time format and simple segment syntax. This is helpful for events, testing blocks, or personal planning.

Syntax:
- Segment format: `start-end@name`
- Separate segments with commas
- Times: `HH:MM` (24‑hour)
- Names: use `+` or `%20` for spaces

Example:
```
https://bell-circle.com/custom/?q=08:00-08:55@Period+1,09:00-09:55@Period+2,10:00-10:15@Break,10:20-11:15@Period+3
```

Guidelines:
- Use chronological order (non‑overlapping)
- Include passing periods explicitly if you want them shown
- Prefer explicit names for clarity
- Malformed segments or invalid times may be ignored or flagged

Short links (if enabled):
- Custom short links may be available under `c.bell-circle.com` via Cloudflare Workers/KV
- Collisions are retried; 404s preserve the requested URL and show `/404.html`
- Calls should originate from `*.bell-circle.com` in production environments

---

## Local Development

Prerequisites:
- Modern browser
- Optional: local static server (Python http.server, Node http-server, VS Code Live Server)

Quick start:
1. Clone the repo
   ```
   git clone https://github.com/TrEKi722/bell_circle.git
   cd bell_circle
   ```
2. Serve locally (pick one)
   - Python:
     ```
     python3 -m http.server 8080
     ```
     Visit http://localhost:8080
   - Node:
     ```
     npx http-server -p 8080
     ```
   - VS Code:
     - Open the folder
     - Right‑click index.html → “Open with Live Server”

Notes:
- Serve from the repo root to keep relative asset paths correct
- If the dev server doesn’t honor `_routes.json`, navigate directly to file paths

---

## Deployment

GitHub Pages:
- Static site; no build step required
- In Settings → Pages, point to the `main` branch and root
- If using a custom domain via GitHub Pages, configure `CNAME` and ensure DNS records point correctly
- Keep `sitemap.xml` updated for SEO

Cloudflare Pages:
- Connect the repository
- `_routes.json` defines clean routing rules
- Configure domains `bell-circle.com` and `beta.bell-circle.com`
- Optional Workers/KV integration for `c.bell-circle.com` short links
- 404 behavior should preserve the path and render `/404.html`

---

## Contributing

We welcome fixes and improvements.

Workflow:
1. Open an issue using templates in `.github/ISSUE_TEMPLATE`
2. For larger changes, branch from `beta`; small fixes can target `main`
3. Keep styles consistent with `css/` and reuse `navbar.html` / `footer.html`
4. Test locally; verify links, dark mode, and mobile
5. Submit a PR with a clear description; include screenshots for UI changes and link to related issues

Guidelines:
- HTML: semantic markup and accessible labels/roles
- CSS: readable naming; honor dark mode; avoid heavy dependencies
- JS: keep lightweight and defensive; no secrets in client code
- Performance: compress images; minify only if needed; prefer static solutions

---

## Reporting Issues

Common issues to report:
- Schedule errors: school, date, and exact affected periods
- Special schedules: provide official source link if available
- UI/UX problems: screenshots, device, and browser/version

Open issues here:
- https://github.com/TrEKi722/bell_circle/issues

---

## Privacy

Bell Circle is a static site. If forms (e.g., feedback) are used, they may rely on third‑party services. Avoid submitting sensitive personal information. See `/privacy/` for details.

---

## Roadmap

- Streamlined custom schedules UI and validation
- Expanded special schedules coverage
- Accessibility improvements and keyboard navigation
- More robust short‑link tooling and analytics integration
- Content edits and translations where relevant

---

## Attribution

- Original schedule concept inspired by Rewordify’s shared schedule code
- Ongoing design and maintenance by contributors to Bell Circle

---

## License

Unless otherwise noted, content in this repository is provided under the MIT License. See the LICENSE file or license headers where included.
