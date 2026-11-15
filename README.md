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
| `impressum.html` | Operator name and email, linked from the footer |
| `terms.html` | Terms for the website and software, including the current beta and planned trial |
| `styles.css` | Design tokens (from the Sona desktop design system), layout and components |
| `main.js` | OS preselection, download picker and the animated app preview |
| `assets/sona-mark.svg` | Ping mark on a dark tile, used as the favicon |
| `assets/og-image.png` | Social sharing image |
| `CNAME` | GitHub Pages custom domain |
| `design/landing.html` | Standalone design prototype the live page was ported from |

## External links

The page links to installers in Hetzner Object Storage and documentation in the product repository. Keep these targets in sync if files move or change names.

| Link | Target |
|------|--------|
| Installers and SHA-256 checksums | `https://sonadesktop.hel1.your-objectstorage.com/latest/` |
| Docs | `https://github.com/Sermilion/SonaADE/blob/main/docs/getting-started.md` |
| Telemetry privacy | `https://github.com/Sermilion/SonaADE/blob/main/docs/telemetry-privacy.md` |
| GitHub | `https://github.com/Sermilion/SonaADE` |

## Downloads

The picker preselects macOS, Windows or Linux using browser OS information. Mobile devices, ChromeOS and unknown systems start with no selection. Visitors can always switch platforms. OS detection does not detect CPU architecture, so the page shows the available architecture beside each installer.

Downloads use the stable `latest/sona-latest-macos-arm64.dmg`, `latest/sona-latest-windows-x64.msi` and `latest/sona-latest-linux-x64.deb` paths. Each checksum link appends `.sha256` to its installer URL. With JavaScript disabled, the section lists all three installers and checksums.

## Deployment

GitHub Pages serves the site from `main`. `CNAME` sets the custom domain to `sona-ade.com`, which also appears in the canonical URL and Open Graph tags in `index.html`. The domain's DNS must point to GitHub Pages before the site resolves.
