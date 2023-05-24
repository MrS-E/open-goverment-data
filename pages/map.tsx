import Head from 'next/head'
import Map from "../components/Map/";
import React, {useEffect, useState} from "react";
import Thurgau from "../components/ThurgauMap";
import {SVGOverlay} from "react-leaflet";
export default function Home() : JSX.Element {
    const [polizei, changePolizei] = React.useState<object>(null)
    useEffect( (): void=>{
        fetch('/api/polizeiposten/all')
            .then(response=>response.json())
            .then(res=>changePolizei(res))
    },[])
    console.log(polizei)
    return (
        <>
            <Head>
                <title>Place Finder</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <main>
                <h1 className="text-4xl mb-2 text-center mt-0 font-medium leading-tight text-primary">Suche für den Idealen Wohnort</h1>
                <div className="grid place-items-center">
                        <Map marker={[polizei]}/>
                </div>
            </main>
        </>
    )
}