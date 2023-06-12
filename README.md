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
    <a href="https://github.com/KevzPeter/Leetcode-Badge-Showcase/issues">💁🏽 sRequest Feature</a>
  </p>
</div>

<div align="center">
<img src="https://leetcode-badge-showcase.vercel.app/api?username=kevzpeter" />
</div>

## ⭐ Add to your README page ⭐
<br/>

Add the following line to your Github README.md page and replace {your-leetcode-username} ⤵️

`<img src="https://leetcode-badge-showcase.vercel.app/api?username={your-leetcode-username}" alt="LeetCode Badges"/>`
 
 Or even this way ⤵️

`![LeetCode Badges](https://leetcode-badge-showcase.vercel.app/api?username={your-leetcode-username})`

For example, if your Leetcode username is "kevzpeter", add the following line:

`![LeetCode Badges](https://leetcode-badge-showcase.vercel.app/api?username=kevzpeter)`

👉🏼 *Image not rendering? Simply refresh the page!* 
<br/>

## 🎨 THEMES 🎨

Want to spice up the look and feel of your badge showcase?
You can choose your favorite among 8 different themes!

- light (default)
- dark
- sky
- beach
- mint
- leafy
- purple-gang
- orange

Simply add the *theme* parameter to the url like so:

`<img src="https://leetcode-badge-showcase.vercel.app/api?username={your-leetcode-username}&theme={your-theme}" alt="LeetCode Badges"/>`

<div style="display:grid; gap: 1rem; grid-template-columns: 1fr 1fr 1fr; grid-template-rows: 10fr 10fr; justify-items: center;">
<img src="https://leetcode-badge-showcase.vercel.app/api?username=lee215&theme=sky" title="Sky" alt="LeetCode Badges"/>
<img src="https://leetcode-badge-showcase.vercel.app/api?username=neal_wu&theme=beach" title="Beach"  alt="LeetCode Badges"/>
<img src="https://leetcode-badge-showcase.vercel.app/api?username=uwi&theme=dark" title="Dark"  alt="LeetCode Badges"/>
<img src="https://leetcode-badge-showcase.vercel.app/api?username=lee215&theme=leafy" title="Leafy"  alt="LeetCode Badges"/>
<img src="https://leetcode-badge-showcase.vercel.app/api?username=neal_wu&theme=purple-gang" title="Purple-Gang"  alt="LeetCode Badges"/>
<img src="https://leetcode-badge-showcase.vercel.app/api?username=uwi&theme=mint" title="Mint"  alt="LeetCode Badges"/>
</div>

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
