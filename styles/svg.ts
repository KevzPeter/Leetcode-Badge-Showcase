import css from 'styled-jsx/css';

export const allStyles = css.global`
html,
body {
  padding: 0;
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
    Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
  font-weight: 500;
}

a {
  color: inherit;
  text-decoration: none;
}

* {
  box-sizing: border-box;
}

@media (prefers-color-scheme: dark) {
  html {
    color-scheme: light;
  }
}
.main {
  min-height: 100vh;
  padding:0;
  margin: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: left;
}
.showCase {
  background-color: #2B2B2B;
  display: flex;
  flex-direction: column;
  padding: 1rem 1.5rem;
  max-width: 600px;
  color: white;
  border-radius: 1rem;
}
.showCase hr{
  width: 100%;
  height: 1px;
  border-width: 0;
  color: #B6C1AC;
  background-color: #B6C1AC;
}
.showCase h4{
  display: flex;
  align-items: center;
  margin: 0.6rem 0;
}
.category #title {
    color : #B6C1AC;
}

.grid {
  display: flex;
  align-items: center;
  justify-content: left;
  flex-wrap: wrap;
  max-width: 600px;
}

.badge {
  margin: 0.8rem;
  padding: 1rem;
  text-align: center;
  color: inherit;
  text-decoration: none;
  border-radius: 10px;
  transition: color 0.15s ease, border-color 0.15s ease;
  max-width: 300px;
}

.badge:hover,
.badge:focus,
.badge:active {
  color: #0070f3;
  border-color: #0070f3;
}

.badge p {
  margin: 0;
  font-size: 0.9rem;
  font-weight: 500;
  line-height: 1.5;
}
.badge h6 {
  margin: 0;
  font-size: 0.8rem;
  line-height: 1.5;
  font-weight: 600;
  color: #808080;
}
`;