import Head from 'next/head'
import {fetch} from "next/dist/compiled/@edge-runtime/primitives/fetch";
import Map from '@/components/ThurgauMap'
import Popup from '@/components/Popup'
import {useEffect, useState} from "react";
import styled from "styled-components";
import { PrismaClient } from '@prisma/client'

//const prisma = new PrismaClient()

export default function Home(props) {
    const [energy, changeEnergy] = useState(props.energy)
    const [popup, changePopup] = useState(false)
    useEffect(()=>{
        for(let doc of document.querySelectorAll('path')){
            let result = energy.filter(obj => {
                return (obj.bfs_nr_gemeinde == doc.id && obj.jahr==2020);
            }).sort((a,b) => (a.jahr > b.jahr) ? -1 : ((b.jahr > a.jahr) ? 1 : 0))[0]
            console.log(result)
            changeEnergy(oldArray => [...oldArray, result])
            doc.addEventListener('click', (e)=>{
                changePopup(true);
            })
        }
        },[]
    )
    return (
        <>
            <Head>
                <title>Open Government Data</title>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
            </Head>
            <main>
                <Map/>
                <Popup changeTrigger={changePopup} trigger={popup}>

                </Popup>
            </main>
        </>
    )
}

export async function getStaticProps({params}) {
    const req = await fetch((await (await fetch('https://ckan.opendata.swiss/api/3/action/package_show?id=erneuerbare-elektrizitatsproduktion-nach-energietragern-und-gemeinden')).json()).result.resources.filter(obj=>{return obj.media_type=="application/json"})[0].uri);
    const data = await req.json();
    //const data = await prisma.energy.findMany()

    return {
        props: {energy: data},
    }
}