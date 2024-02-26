<a id="readme-top"></a>
<!-- PROJECT LOGO -->
<br />
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
<img src="https://leetcode-badge-showcase.vercel.app/api?username=kevzpeter" />
</div>

## ⭐ Add to your README page ⭐
<br/>

Add the following line to your Github README.md page and replace {your-leetcode-username} ⤵️

```html
<img src="https://leetcode-badge-showcase.vercel.app/api?username={your-leetcode-username}" alt="LeetCode Badges"/>
```
 
 Or even this way ⤵️

```mark
![LeetCode Badges](https://leetcode-badge-showcase.vercel.app/api?username={your-leetcode-username})
```

For example, if your Leetcode username is "kevzpeter", add the following line:

```mark
![LeetCode Badges](https://leetcode-badge-showcase.vercel.app/api?username=kevzpeter)`
```

👉🏼 *Image not rendering? Simply refresh the page!* 
<br/>

## 🎨 THEMES 🎨

Want to spice up the look and feel of your badge showcase?
You can choose your favorite among 16 different themes!

Simply add the *theme* parameter to the url like so:

```html
<img src="https://leetcode-badge-showcase.vercel.app/api?username={your-leetcode-username}&theme={your-theme}" alt="LeetCode Badges"/>
```
<br /> 

| | |
| :--: | :--: |
| `light` <br /> ![light][light] | `dark` <br />  ![dark][dark] |
| `github-dark` <br />  ![github-dark][github-dark] | `monokai` <br />  ![monokai][monokai] |
| `tokyonight` <br />  ![tokyonight][tokyonight] | `nightowl` <br />  ![nightowl][nightowl] |
| `onedark` <br />  ![onedark][onedark] | `shades-of-purple` <br />  ![shades-of-purple][shades-of-purple] 
| `dracula` <br />  ![dracula][dracula] | `cobalt2` <br />  ![cobalt2][cobalt2] |
| `sky` <br />  ![sky][sky] | `beach` <br />  ![beach][beach] |
| `purple-gang` <br />  ![purple-gang][purple-gang] | `mint` <br />  ![mint][mint] |
| `leafy` <br />  ![leafy][leafy] | `black` <br />  ![black][black] |

[light]: https://leetcode-badge-showcase.vercel.app/api?username=kevzpeter&theme=light&filter=study
[dark]: https://leetcode-badge-showcase.vercel.app/api?username=kevzpeter&theme=dark&filter=study
[github-dark]: https://leetcode-badge-showcase.vercel.app/api?username=kevzpeter&theme=github-dark&filter=study
[monokai]: https://leetcode-badge-showcase.vercel.app/api?username=kevzpeter&theme=monokai&filter=study
[tokyonight]: https://leetcode-badge-showcase.vercel.app/api?username=kevzpeter&theme=tokyonight&filter=study
[nightowl]: https://leetcode-badge-showcase.vercel.app/api?username=kevzpeter&theme=nightowl&filter=study
[onedark]: https://leetcode-badge-showcase.vercel.app/api?username=kevzpeter&theme=onedark&filter=study
[shades-of-purple]: https://leetcode-badge-showcase.vercel.app/api?username=kevzpeter&theme=shades-of-purple&filter=study
[dracula]: https://leetcode-badge-showcase.vercel.app/api?username=kevzpeter&theme=dracula&filter=study
[cobalt2]: https://leetcode-badge-showcase.vercel.app/api?username=kevzpeter&theme=cobalt2&filter=study
[sky]: https://leetcode-badge-showcase.vercel.app/api?username=kevzpeter&theme=sky&filter=study
[beach]: https://leetcode-badge-showcase.vercel.app/api?username=kevzpeter&theme=beach&filter=study
[purple-gang]: https://leetcode-badge-showcase.vercel.app/api?username=kevzpeter&theme=purple-gang&filter=study
[mint]: https://leetcode-badge-showcase.vercel.app/api?username=kevzpeter&theme=mint&filter=study
[leafy]: https://leetcode-badge-showcase.vercel.app/api?username=kevzpeter&theme=leafy&filter=study
[black]: https://leetcode-badge-showcase.vercel.app/api?username=kevzpeter&theme=black&filter=study

<br/>

## ✂️ FILTERS ✂️

Wanna only show a specific set of badges ? Add a filter parameter like so :

- Competitive: &filter=comp
- Daily Challenge: &filter=daily
- Study Plan: &filter=study


<!-- BUILT WITH -->
## 🔧 Built With 🔧
<br/>

* [![Next][Next.js]][Next-url]
* [![React][React.js]][React-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- SET UP -->
## 🏗️ Set Up your own Server 🏗️

* Make sure you have Node.js installed
* Clone the repository
* Run *npm i* in the root directory
* Run *npm run dev* to make sure everything's working fine
* Replace BASEURL in *utils/config.ts* to the deployment url of your choice 
* Deploy to Vercel with the same deployment url
* Head over to https://{your-vercel-deployment-url}/api?username={your-leetcode-username} to view the results
* Oh, and make sure to update the links in your README file as well :P

<br/>

<!-- CONTRIBUTING -->
## 🙌🏼 Contributing 🙌🏼

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
[contributors-shield]: https://img.shields.io/github/contributors/othneildrew/Best-README-Template.svg?style=for-the-badge
[contributors-url]: https://github.com/othneildrew/Best-README-Template/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/othneildrew/Best-README-Template.svg?style=for-the-badge
[forks-url]: https://github.com/othneildrew/Best-README-Template/network/members
[stars-shield]: https://img.shields.io/github/stars/othneildrew/Best-README-Template.svg?style=for-the-badge
[stars-url]: https://github.com/othneildrew/Best-README-Template/stargazers
[issues-shield]: https://img.shields.io/github/issues/othneildrew/Best-README-Template.svg?style=for-the-badge
[issues-url]: https://github.com/othneildrew/Best-README-Template/issues
[license-shield]: https://img.shields.io/github/license/othneildrew/Best-README-Template.svg?style=for-the-badge
[license-url]: https://github.com/othneildrew/Best-README-Template/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/othneildrew
[product-screenshot]: images/screenshot.png
[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Vue.js]: https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D
[Vue-url]: https://vuejs.org/
[Angular.io]: https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white
[Angular-url]: https://angular.io/
