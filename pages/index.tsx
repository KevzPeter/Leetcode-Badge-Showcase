import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.scss'

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Leetcode Badge Showcase</title>
        <meta name="description" content="Showcase your Leetcode badges on your Github readme page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.container}>
        <p>Check out the <a href="https://github.com/KevzPeter/Leetcode-Badge-Showcase">Github Page</a> for more info!</p>
      </main>
    </div>
  )
}

export default Home
