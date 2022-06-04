import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react'
import styles from '../styles/Home.module.css'
import axios from "axios"
import Footer from '../components/Footer'

const Home: NextPage = () => {
  const [zkUrl, setZkUrl] = useState("");
  const [crushName, setCrushName] = useState("")
  const [admirerName, setAdmirerName] = useState("")
  
  async function crackHashToGetCrushName() {
    const url = new URL(zkUrl)
    const urlParams = new URLSearchParams(url.search)
    const zkHash = urlParams.get('hash')
    let _loverName = urlParams.get('name')
    const response = await axios.get(`/api/${zkHash}`);
    setAdmirerName(_loverName)
    setCrushName(response.data['name'])
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>ZK Crush Breaker</title>
        <meta name="description" content="Rainbow table attack on zkcrush.xyz" />
        <link rel="icon" type="image/png" sizes="16x16" href="/images/hammer.png" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Rainbow Table attack on <a href="https://www.zkcrush.xyz/"> ZkCrush.xyz! </a>
        </h1>

        <p className={styles.description}>
          Enter the URL with a hash and crush name
        </p>

        <input
          placeholder={`https://www.zkcrush.xyz/crush?hash=SOME_HASH&name=SOME_NAME`}
          value={zkUrl}
          onChange={(e) => setZkUrl(e.target.value)}
          style={{"width": "60vw"}}
        />

        <button 
          onClick={crackHashToGetCrushName}
          style={{"height": "6vh", "width": "16vw", "marginTop": "3vh"}}
        >
          Find your crush!
        </button>

        {crushName && (
          <p>
            The admirer is {admirerName} and their crush&apos;s name is: {crushName}
          </p>
        )}

        <Footer/>

      </main>
    </div>
  )
}

export default Home
