<a id="readme-top"></a>

<div align="center">
  <a href="https://github.com/KevzPeter/Leetcode-Badge-Showcase">
    <img src="images/guardian.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">LeetCode Badge Showcase</h3>

  <p align="center">
    Showcase your LeetCode badges on your Github README page 🤩
    <br />
    <a href="https://leetcode-badge-showcase.vercel.app/">✨ View Demo</a>
    ·
    <a href="https://github.com/KevzPeter/Leetcode-Badge-Showcase/issues">🐛 Report Bug</a>
    ·
    <a href="https://github.com/KevzPeter/Leetcode-Badge-Showcase/issues">💁🏽 Request Feature</a>
  </p>
</div>

<div align="center">
<a href="https://leetcode.com/kevzpeter/">
  <img src="https://leetcode-badge-showcase.vercel.app/api?username=kevzpeter&filter=annual&limit=8&animated=true" />
</a>
</div>

## 🚀 Add to your README page

<br/>

Add the following line to your Github README.md (or HTML) page and replace {your-leetcode-username} ⤵️

```html
<img src="https://leetcode-badge-showcase.vercel.app/api?username={your-leetcode-username}" alt="LeetCode Badges" />
```

Or even this way ⤵️

```mark
![LeetCode Badges](https://leetcode-badge-showcase.vercel.app/api?username={your-leetcode-username})
```

<br/>

## ✨ Animated Badges

By default, all badges are static. To animate your badges in the showcase, add the parameter _animated_ to the url and set its value to `true`:

```html
<img src="https://leetcode-badge-showcase.vercel.app/api?username={your-leetcode-username}&animated=true" alt="LeetCode Badges" />
```

## 🎨 Themes

Want to spice up the look and feel of your badge showcase?
You can choose your favorite among 17 different themes!

Simply add the _theme_ parameter to the url like so:

```html
<img src="https://leetcode-badge-showcase.vercel.app/api?username={your-leetcode-username}&theme={your-theme}" alt="LeetCode Badges" />
```

### Examples

|                                                                                     |                                                                                                    |
| :---------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------: |
|          `light` <br /> [![light][light]](https://leetcode.com/kevzpeter/)          |                   `dark` <br /> [![dark][dark]](https://leetcode.com/kevzpeter/)                   |
| `github-dark` <br /> [![github-dark][github-dark]](https://leetcode.com/kevzpeter/) |              `monokai` <br /> [![monokai][monokai]](https://leetcode.com/kevzpeter/)               |
|  `tokyonight` <br /> [![tokyonight][tokyonight]](https://leetcode.com/kevzpeter/)   |             `nightowl` <br /> [![nightowl][nightowl]](https://leetcode.com/kevzpeter/)             |
|       `onedark` <br /> [![onedark][onedark]](https://leetcode.com/kevzpeter/)       | `shades-of-purple` <br /> [![shades-of-purple][shades-of-purple]](https://leetcode.com/kevzpeter/) |
|       `dracula` <br /> [![dracula][dracula]](https://leetcode.com/kevzpeter/)       |              `cobalt2` <br /> [![cobalt2][cobalt2]](https://leetcode.com/kevzpeter/)               |
|             `sky` <br /> [![sky][sky]](https://leetcode.com/kevzpeter/)             |                 `beach` <br /> [![beach][beach]](https://leetcode.com/kevzpeter/)                  |
| `purple-gang` <br /> [![purple-gang][purple-gang]](https://leetcode.com/kevzpeter/) |                   `mint` <br /> [![mint][mint]](https://leetcode.com/kevzpeter/)                   |
|          `leafy` <br /> [![leafy][leafy]](https://leetcode.com/kevzpeter/)          |                 `black` <br /> [![black][black]](https://leetcode.com/kevzpeter/)                  |
| `transparent` <br /> [![transparent][transparent]](https://leetcode.com/kevzpeter/) |                                                                                                    |

[light]: images/examples/theme-light.png
[dark]: images/examples/theme-dark.png
[github-dark]: images/examples/theme-github-dark.png
[monokai]: images/examples/theme-monokai.png
[tokyonight]: images/examples/theme-tokyonight.png
[nightowl]: images/examples/theme-nightowl.png
[onedark]: images/examples/theme-onedark.png
[shades-of-purple]: images/examples/theme-shades-of-purple.png
[dracula]: images/examples/theme-dracula.png
[cobalt2]: images/examples/theme-cobalt2.png
[sky]: images/examples/theme-sky.png
[beach]: images/examples/theme-beach.png
[purple-gang]: images/examples/theme-purple-gang.png
[mint]: images/examples/theme-mint.png
[leafy]: images/examples/theme-leafy.png
[black]: images/examples/theme-black.png
[transparent]: images/examples/theme-transparent.png

<br/>

## ✂️ Filters

Wanna only show a specific set of badges ? Add a _filter_ parameter like so :

```html
<img src="https://leetcode-badge-showcase.vercel.app/api?username={your-leetcode-username}&filter={your-filter}" alt="LeetCode Badges" />
```

|             Filter              |                               Example                               |
| :-----------------------------: | :-----------------------------------------------------------------: |
|   Competitive Badges: `comp`    |   [![Competition Badges][comp]](https://leetcode.com/LeoHunt/)    |
|       Study Plan: `study`       |   [![Study Plan Badges][study]](https://leetcode.com/kevzpeter/)    |
|     Annual Badges: `annual`     |     [![Annual Badges][annual]](https://leetcode.com/kevzpeter/)     |
| Submission Badges: `submission` | [![Submission Badges][submission]](https://leetcode.com/kevzpeter/) |
|    Daily Challenge: `daily`     | [![Daily Challenge Badges][daily]](https://leetcode.com/kevzpeter/) |

[comp]: images/examples/filter-comp.png
[study]: images/examples/filter-study.png
[annual]: images/examples/filter-annual.png
[submission]: images/examples/filter-submission.png
[daily]: images/examples/filter-daily.png

These examples are repository-hosted screenshots; only the animated showcase above is fetched live. The competition example uses `LeoHunt`, who has a competition badge.

> [!TIP]
> Want to hide the border? add the parameter `border` to the url and set its value to `no-border`:

<br/>

## 🙈 Hide Username

Want to hide your username from the card header?
Add the parameter `anon` to the url and set its value to `true`.

When enabled, the card header will show **"LeetCode Badges"** instead of **"{username} LeetCode Badges"**.

<br/>

## 🔢 Limit Badges

If you have a lot of badges and want a smaller card, you can limit the **total number of badges** displayed to the latest `x` badges earned.

Add the parameter `limit` to the url like so:

```html
<img src="https://leetcode-badge-showcase.vercel.app/api?username={your-leetcode-username}&limit=10" alt="LeetCode Badges" />
```

You can combine it with other parameters (e.g. filter + animated):

```mark
![LeetCode Badges](https://leetcode-badge-showcase.vercel.app/api?username=kevzpeter&filter=annual&animated=true&limit=12)
```

<!-- BUILT WITH -->

## 📦 Caching and bandwidth

- Successful badge, JSON, and image-proxy responses are fresh in Vercel's CDN for **7 days**. The next request can serve stale content while refreshing it in the background for up to **1 additional day**. Browser caching is also 7 days, so newly earned badges are not immediately visible. Cache storage is best-effort, not guaranteed for the full lifetime.
- Static badges are embedded as WebP at up to 96×96 for their 48×48 display size. The logo is at most 72×72. Animated GIFs retain their existing 48×48 encoding.
- The generator omits default URL options. Equivalent GET/HEAD URLs redirect to a canonical URL before fetching badges. Unknown options are ignored and removed, so adding a random query parameter is **not** a supported cache-refresh mechanism. Duplicate parameters are rejected.
- CDN hits reduce Fast Origin Transfer, but still use CDN-to-visitor transfer. Repository-hosted README examples avoid Vercel traffic entirely.

### Restricted image proxy

`/api/proxy?img={encoded-image-url}` returns a plain-text image data URL. It accepts GET/HEAD and only HTTPS images on the exact hosts `leetcode.com` and `assets.leetcode.com`, with no credentials or nonstandard ports. Redirects are limited to three and must pass the same host and public-address checks at every hop.

Downloads have a 10-second total deadline and a 5 MiB limit on both encoded and decompressed bytes. The final base64 data URL is also capped at 4 MiB (roughly 3 MiB of image bytes) to stay below Vercel's buffered Function response limit. Supported content is PNG, JPEG, WebP, or GIF with at most 16 megapixels across frames. Returned data URLs use the verified image MIME type instead of always claiming PNG. Invalid destinations return 400, oversized downloads/responses 413, upstream/unsupported-image failures 502, and timeouts 504. Errors are not cached. The main `/api?username=...` endpoint does not use this proxy.

### Maintaining the asset cache

The weekly GitHub workflow discovers new badges from active users configured in the repository variable `USERS` (comma-separated; fallback: `LeoHunt,hc167,u77`). It retains existing assets, optimizes newly discovered static images using the runtime encoding policy, and commits only actual cache changes. Manual dispatch updates its selected branch rather than always writing to `main`. Scheduled cache commits can still trigger deployments; no-change runs do not create commits.

```sh
npm run update-cache
npm run update-cache -- --users "LeoHunt,hc167,u77"
# One-time migration of oversized existing static entries, including older/non-discovery assets:
npm run update-cache -- --rebuild-static --skip-discovery
# Offline migration from existing cached image bytes instead of original sources:
npm run update-cache -- --rebuild-static --skip-discovery --cached-only
```

Migration preserves GIF entries and is idempotent. It prefers original sources, falling back to cached image bytes when unavailable. Partial failures are reported with a nonzero exit status without deleting usable entries.

To regenerate README screenshots, start the app on port 3100 (`npm run dev -- --port 3100`) and run `npm run capture-examples` in another terminal. Install Chromium with `npx playwright install chromium`, or set `CHROME_PATH` to an installed Chrome executable (the usual Windows Chrome path is detected automatically). Optional `CAPTURE_BASE_URL` and `CAPTURE_USERNAME` override the local origin and sample user.

Run `npm test`, `npm run lint`, `npx tsc --noEmit`, and `npm run build` before submitting changes.

## 🔧 Built With

<br/>

- [![Next][Next.js]][Next-url]
- [![React][React.js]][React-url]

<!-- SET UP -->

## 🏗️ Set Up your own Server

- Make sure you have Node.js installed
- Clone the repository
- Run _npm i_ in the root directory
- Run _npm run dev_ to make sure everything's working fine
- Replace BASEURL in _utils/config.ts_ to the deployment url of your choice
- Deploy to Vercel with the same deployment url
- Head over to https://{your-vercel-deployment-url}/api?username={your-leetcode-username} to view the results
- Oh, and make sure to update the links in your README file as well :P

<br/>

<!-- CONTRIBUTING -->

## 🙌🏼 Contributing

If you wanna add your custom theme or suggest enhancements, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[product-screenshot]: images/screenshot.png
[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
