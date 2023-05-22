import Head from 'next/head'
import {fetch} from "next/dist/compiled/@edge-runtime/primitives/fetch";
import Map from '@/components/ThurgauMap'
import Popup from '@/components/Popup'
import {useEffect, useState} from "react";
import { PrismaClient } from '@prisma/client'

//const prisma = new PrismaClient()

export default function Home(props) {
    const [energy, changeEnergy] = useState([])
    const [popup, changePopup] = useState(false)
    const [display, changeDisplay] = useState({})
    useEffect(()=>{
        for(let doc of document.querySelectorAll('path')){
            let result = props.energy.filter(obj => {
                return ((obj.bfs_nr_gemeinde == doc.id && obj.jahr == "2020"));
            })
            console.log(result)
            changeEnergy(oldArray => [...oldArray, result])
            doc.addEventListener('click', ()=>{
                changePopup(true);
                changeDisplay(result[0])
                console.log(energy)
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
                    <h3 className="text-2xl">{display.gemeinde_name?display.gemeinde_name:""}</h3>
                </Popup>
            </main>
        </>
    )
}

/*
* bfs_nr_gemeinde: "4911"
biogasanlagen_abwasser: null
biogasanlagen_industrie: null
biogasanlagen_landwirtschaft: null
biomasse_holz: null
einwohner: 3946
gemeinde_name: "Bürglen (TG)"
jahr: "2020"
kehricht: null
photovoltaik: 1.88
total: 15.108
wasserkraft: 13.228
wind: null
* */

export async function getStaticProps({params}) {
    const req = await fetch((await (await fetch('https://ckan.opendata.swiss/api/3/action/package_show?id=erneuerbare-elektrizitatsproduktion-nach-energietragern-und-gemeinden')).json()).result.resources.filter(obj=>{return obj.media_type==="application/json"})[0].uri);
    const data = await req.json();
    //const data = await prisma.energy.findMany()

    return {
        props: {energy: data},
    }
}