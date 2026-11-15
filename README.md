# Sona Landing

Marketing landing page for Sona, the agentic development environment, at [sona-ade.com](https://sona-ade.com/).

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
| `privacy.html` | Draft website and app privacy policy, pending processing and retention details |
| `terms.html` | Terms for the website and software, including the current beta and planned trial |
| `styles.css` | Design tokens (from the Sona desktop design system), layout and components |
| `main.js` | OS preselection, download picker and the animated app preview |
| `analytics-config.json` | Public PostHog project token and EU ingestion host for download click counts |
| `assets/sona-mark.svg` | Ping mark on a dark tile, used as the favicon |
| `assets/og-image.png` | Social sharing image |
| `CNAME` | GitHub Pages custom domain |
| `design/landing.html` | Standalone design prototype the live page was ported from |

## External links

The page links to installers in Hetzner Object Storage. Keep these targets in sync if files move or change names.

| Link | Target |
|------|--------|
| Installers and SHA-256 checksums | `https://sonadesktop.hel1.your-objectstorage.com/latest/` |

## Downloads

The picker preselects macOS, Windows or Linux using browser OS information. Mobile devices, ChromeOS and unknown systems start with no selection. Visitors can always switch platforms. OS detection does not detect CPU architecture, so the page shows the available architecture beside each installer.

Downloads use the stable `latest/sona-latest-macos-arm64.dmg`, `latest/sona-latest-windows-x64.msi` and `latest/sona-latest-linux-x64.deb` paths. Each checksum link appends `.sha256` to its installer URL. With JavaScript disabled, the section lists all three installers and checksums.

## Download analytics

Installer clicks send `download_clicked` to the Sona PostHog project, ID `152739`, through the capture API. Event properties are `source: sona_landing`, `platform`, `architecture`, and `filename`. Architecture describes the installer, not detected hardware. Checksum links, platform selection, and links that scroll to the download section do not count. Keyboard activation and middle clicks on the installer link count.

In PostHog, create a Trends insight for `download_clicked`, select total event count, and filter `source` to `sona_landing`. Break down by `platform` to compare operating systems. This measures download attempts, not completed downloads or unique visitors. Direct storage links and downloads with JavaScript disabled or analytics blocked are not counted.

Tracking runs only on `sona-ade.com` and `www.sona-ade.com` and respects Do Not Track and Global Privacy Control. It sends each event with a new random ID and disables person profile processing and location inference. There is no analytics SDK, persistent identifier, pageview tracking, or session recording. Requests omit cookies and the referrer, and use `keepalive` without delaying normal link navigation. The PostHog project currently anonymizes IP addresses.

`analytics-config.json` contains public ingestion configuration, not a personal API key. Keep its project token and host together when changing projects. Do not put a PostHog personal API key in this file. Local previews do not send events.

## Deployment

GitHub Pages serves the site from `main`. `CNAME` sets the custom domain to `sona-ade.com`, which also appears in the canonical URL and Open Graph tags in `index.html`. The domain's DNS must point to GitHub Pages before the site resolves.
