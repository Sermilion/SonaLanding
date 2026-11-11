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
| `index.html` | Page structure, product mockups, and copy |
| `styles.css` | Layout and brand styles |
| `main.js` | Page interactions and install-command copy button |
| `assets/sona-mark.svg` | Brand mark and favicon |
| `assets/og-image.png` | Social sharing image |
| `CNAME` | GitHub Pages custom domain |

## External links

The page links to these files in the product repository. Keep them in sync if the repository moves or the files are renamed.

| Link | Target |
|------|--------|
| Install command | `https://raw.githubusercontent.com/Sermilion/SonaADE/main/install.sh` |
| Docs | `https://github.com/Sermilion/SonaADE/blob/main/docs/getting-started.md` |
| Telemetry privacy | `https://github.com/Sermilion/SonaADE/blob/main/docs/telemetry-privacy.md` |
| License | `https://github.com/Sermilion/SonaADE/blob/main/LICENSE` |

## Deployment

GitHub Pages serves the site from `main`. `CNAME` sets the custom domain to `sona-ade.com`, which also appears in the canonical URL and Open Graph tags in `index.html`. The domain's DNS must point to GitHub Pages before the site resolves.
