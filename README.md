# Sona Landing

Marketing landing page for Sona, the agentic development environment, at [sona-ade.com](https://sona-ade.com/).

Product repository: [Sermilion/SonaADE](https://github.com/Sermilion/SonaADE).

Static HTML/CSS/JS. No build step.

## Preview locally

```bash
python3 -m http.server 8765
```

Open http://127.0.0.1:8765/

## Layout

| Path | Role |
|------|------|
| `index.html` | Page structure, the HTML app preview, and copy |
| `styles.css` | Design tokens (from the Sona desktop design system), layout and components |
| `main.js` | Install-command copy buttons and the animated app preview |
| `assets/sona-mark.svg` | Ping mark on a dark tile, used as the favicon |
| `assets/og-image.png` | Social sharing image |
| `CNAME` | GitHub Pages custom domain |
| `design/landing.html` | Standalone design prototype the live page was ported from |

## External links

The page links to these files in the product repository. Keep them in sync if the repository moves or the files are renamed.

| Link | Target |
|------|--------|
| Install command | `https://raw.githubusercontent.com/Sermilion/SonaADE/main/install.sh` |
| Docs | `https://github.com/Sermilion/SonaADE/blob/main/docs/getting-started.md` |
| Telemetry privacy | `https://github.com/Sermilion/SonaADE/blob/main/docs/telemetry-privacy.md` |
| GitHub | `https://github.com/Sermilion/SonaADE` |

## Deployment

GitHub Pages serves the site from `main`. `CNAME` sets the custom domain to `sona-ade.com`, which also appears in the canonical URL and Open Graph tags in `index.html`. The domain's DNS must point to GitHub Pages before the site resolves.
