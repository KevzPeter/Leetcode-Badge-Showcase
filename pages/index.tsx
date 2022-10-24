import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.scss'
import { useRouter } from 'next/router';
import { useEffect, useState, useRef, useCallback } from 'react';
import Category from '../components/Category';

const Home: NextPage = () => {

  const router = useRouter();
  const[response, setResponse] = useState(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(()=>{
    if(router.isReady){
      const {username} = router.query;
      getBadgeStats(username);
    }
  }, [router.isReady])

  // useEffect(()=>{
  //   if (ref.current === null || !badges) {
  //     return
  //   }
  //   toSvg(ref.current)
  //    .then(function (dataUrl) {
  //      let svg = decodeURIComponent(dataUrl.split(',')[1])
  //      console.log(svg);
       
  //      document.body.parentElement.innerHTML = svg          
  //    });
  // }, [badges])

  const getBadgeStats = async (username:any) => {
    const response = await fetch(`/api/?username=${username}`);
    const data = await response.json();
    if(data.status === 'success'){
      setResponse(data.body);
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
        {response?.length > 0 && <div className={styles.showCase}>
          <h4>LeetCode Badge List</h4>
          {response.map((category:Object, index:number)=>{
            return(<Category category={category} key={index}/>)
          })}
        </div>}
      </main>
    </div>
  )
}

export default Home
