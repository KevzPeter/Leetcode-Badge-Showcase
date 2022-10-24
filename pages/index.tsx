import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useRouter } from 'next/router';
import { useEffect, useState, useRef, useCallback } from 'react';
import response from "../config/response.json";
import { toPng, toSvg } from 'html-to-image';

const Home: NextPage = () => {

  const router = useRouter();
  const[badges, setBadges] = useState([]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(()=>{
    if(router.isReady){
      const {username} = router.query;
      getBadgeStats(username);
    }
  }, [router.isReady])

  useEffect(()=>{
    if (ref.current === null || badges.length == 0) {
      return
    }
    toSvg(ref.current)
     .then(function (dataUrl) {
       let svg = decodeURIComponent(dataUrl.split(',')[1])
       console.log(svg);
       
       document.body.parentElement.innerHTML = svg          
     });
  }, [badges])

  const getBadgeStats = async (username:any) => {
    const response = await fetch(`/api/?username=${username}`);
    const data = await response.json();
    if(data.status === 'success'){
      setBadges(data.body.matchedUser.badges);
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Leetcode Badge Showcase</title>
        <meta name="description" content="Showcase your Leetcode badges on your Github readme page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.grid} ref={ref}>
        {badges ? badges.map((badge, index)=>{
          return(
            <div className={styles.card} key={index}>
              {/* <img src={badge.medal.config. iconGif} alt="icon" width={64} height={64} title={badge.displayName}/> */}
              <p>{badge.shortName}</p>
              <h6>{badge.creationDate}</h6>
            </div>
          )
        }) : null}
        </div>
      </main>
    </div>
  )
}

export default Home
