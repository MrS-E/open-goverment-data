import Head from 'next/head'
import Map from "../components/Map";
import React from "react";

export default function Home() : JSX.Element {
    return (
        <>
            <Head>
                <title>Place Finder</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <main>
               <Map/>
            </main>
        </>
    )
}