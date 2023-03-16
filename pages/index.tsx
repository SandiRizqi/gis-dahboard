import type { NextPage } from 'next'
import Head from 'next/head'
import { Wrap, WrapItem } from '@chakra-ui/react'
import { Card, CardHeader, Heading, CardFooter } from '@chakra-ui/react'
import { Text } from '@chakra-ui/react'
import { Image } from '@chakra-ui/react'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Portal GIS Web App</title>
        <meta name="description" content="Web App of Survey Division TAPG" />
        <link rel="icon" href="/logo-tap.png" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <strong><a href="/#">Portal GIS</a></strong>
        </h1>
        <br />
        <p>Web Application of Survey Division TAPG</p>
        <br />
        <hr />
        <div className={styles.portalcontainer}>
          <Wrap spacing='30px' justify='center'>
            <WrapItem style={{padding: "1rem"}}>
              <a href='/hotspots'>
                <Card maxW='sm'>
                  <CardHeader>
                    <Heading size='md' textAlign={"left"}>Hotspot Events</Heading>
                  </CardHeader>
                  <Image
                    objectFit='cover'
                    src='/Hotspot.png'
                    height={150}
                    alt='Image_HS'
                  />
                  <CardFooter>
                    <Text>
                      Hotspot alerts and hotspots recording with near realtime update data
                    </Text>
                  </CardFooter>
                </Card>
              </a>
            </WrapItem>
            <WrapItem style={{padding: "1rem"}}>
              <a href='/deforestations'>
                <Card maxW='sm'>
                  <CardHeader>
                    <Heading size='md' textAlign={"left"}>Deforestation Events</Heading>
                  </CardHeader>
                  <Image
                    objectFit='cover'
                    src='/DFChart.png'
                    height={150}
                    alt='Image_DF'
                  />
                  <CardFooter>
                    <Text>
                      Deforestation alerts, events recording, and event's summary for every company
                    </Text>
                  </CardFooter>
                </Card>
              </a>
            </WrapItem>
            <WrapItem style={{padding: "1rem"}}>
              <a href='/hectarestatement'>
                <Card maxW='sm'>
                  <CardHeader>
                    <Heading size='md' textAlign={"left"}>Hectares Statement</Heading>
                  </CardHeader>
                  <Image
                    objectFit='cover'
                    src='/HS.png'
                    height={150}
                    alt='Image_DF'
                  />
                  <CardFooter>
                    <Text>
                      Hestares statement of Planted Area, Non Planted, Land Clearing, Year of Planting, etc
                    </Text>
                  </CardFooter>
                </Card>
              </a>
            </WrapItem>

          </Wrap>
        </div>
      </main>
    </div>
  )
}

export default Home
