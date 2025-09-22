import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import styles from '../styles/Home.module.scss'
import { useState, CSSProperties } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { THEME_NAMES, BORDER } from '../utils/config';
import { Analytics } from "@vercel/analytics/next";

const Home: NextPage = () => {
  let [loading, setLoading] = useState(false);
  const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "white",
  };
  const router = useRouter();
  const themes = THEME_NAMES;
  const filters = [
    { name: 'All', value: '' },
    { name: 'Daily Badges', value: 'daily' },
    { name: 'Study Badges', value: 'study' },
    { name: 'Competition Badges', value: 'comp' },
    { name: 'Annual Badges', value: 'annual' },
    { name: 'Submission Badges', value: 'submission' }
  ]
  // Created const border
  const border = BORDER;

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    let username = e.target.username.value;
    let theme = e.target.theme.value;
    let filter = e.target.filter.value;
    let animated = e.target.animated.value;
    let border = e.target.border.value;
    if (username) {
      let href = `/api?username=${username}`
      if (theme)
        href += `&theme=${theme}`
      if (filter)
        href += `&filter=${filter}`
      if (border)
        href += `&border=${border}`
      if (animated)
        href += `&animated=${animated}`
      router.push(href)
        .then(() => setLoading(false))
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
    else setLoading(false);
  }
  return (
    <>
      <div className={styles.container}>
        <Head>
          <title>Leetcode Badge Showcase</title>
          <meta name="description" content="Showcase your Leetcode badges on your Github readme page" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className={styles.container}>
          <form className={styles.form} onSubmit={e => handleSubmit(e)}>
            <label htmlFor="username">🧑🏽 Username</label>
            <input id="username" name="username" type="name"></input>
            <label htmlFor="theme">🎨 Theme</label>
            <select name='theme'>
              {themes.map((theme, index) => {
                return <option key={index} value={theme}>{theme}</option>
              })}
            </select>
            <label htmlFor="filter">🔧 Filter</label>
            <select name='filter'>
              {filters.map((filter, index) => {
                return <option key={index} value={filter.value}>{filter.name}</option>
              })}
            </select>
            <label htmlFor="animated">✨ Animated Badges</label>
            <select name='animated'>
              <option value='true'>Yes</option>
              <option value='false'>No</option>
            </select>
            <label htmlFor="border">🖌️ Border</label>
            <select name='border'>
              <option value='border'>Yes</option>
              <option value='no-border'>No</option>
            </select>
            <button className={styles.btn} type="submit">Get Badges!</button>
          </form>
          <p>Check out the <a href="https://github.com/KevzPeter/Leetcode-Badge-Showcase">Github Page</a> for more info!</p>
        </main>
      </div>
      <Analytics />
    </>
  )
}

export default Home
