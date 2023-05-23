import Head from 'next/head'
import Map from '../components/ThurgauMap'
import Popup from '../components/Popup'
import React, {useEffect, useRef, useState} from "react"
import {PrismaClient} from '@prisma/client'
import MapStyle from '../styles/ThuraguMap.module.css'
import Slider from '../components/Tailwind/Slider'
import Graph from "../components/Graph";
// @ts-ignore
import {Stromproduzenten} from "../types/global";
import {GetStaticProps} from "next";

const prisma = new PrismaClient()

export default function Home(props): JSX.Element {
    const [popup, changePopup] = React.useState<boolean>(false)
    const [display, changeDisplay] = React.useState<Stromproduzenten>({allg:{}, traeger:{}})
    const [year, changeYear] = React.useState<string>(props.year.max as string)
    const [energy, changeEnergy] = React.useState<Stromproduzenten[]>(null)
    useEffect(():void => {
        if(energy) {
            for (let obj of energy) {
                let doc :HTMLElement = document.getElementById(`${obj.allg.nr_gemeinde}`);
                doc.addEventListener('click', () => {
                    changePopup(true)
                    changeDisplay(obj)

                })
                doc.setAttributeNS(null, 'class', '')
                doc.classList.add(MapStyle[obj.allg.color])
            }
            document.getElementsByClassName(MapStyle.lakes)[0].addEventListener('click', () => {
                alert("Geehrter Nutzer der Bodensee ist keine Gemeinde. \nBitte klicken Sie nur Gemeinden an.")
            })
        }
    }, [energy])
    useEffect(():void=>{
        fetch("/api/erneuerbareElektrizitatsproduktionNachEnergietragernUndGemeinden/" + year)
            .then((res) :any => res.json())
            .then((res):any=>{
                if(Object.keys(res).includes("error")){
                    changeYear(props.year.max as string)
                }else{
                    changeEnergy(res)
                }
            })
    }, [year])
    return (
        <>
            <Head>
                <title>Open Government Data</title>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
            </Head>
            <main className="relative p-4 grid place-items-center">
                <h1 className="text-4xl mb-2 text-center mt-0 font-medium leading-tight text-primary">Strom aus erneuerbaren Energieträgern</h1>
                <div className="max-w-[90vh] min-w-[90vw]">
                    <Map/>
                    <Slider id={"mapSlider"} min={parseInt(props.year.min)} max={parseInt(props.year.max)}
                            value={parseInt(year)} steps={1} text={""} onChange={(e) => {
                        changeYear(e.target.value)
                    }}/>
                    <Popup changeTrigger={changePopup} trigger={popup}>
                        <h3 className="text-2xl">{display.allg.gemeinde_name ? display.allg.gemeinde_name : ""}</h3>
                        <div className="grid gris-cols-1 md:grid-cols-2">
                            <div className="grid">
                                <p>
                                    <strong>Total </strong> {display.allg.total}%
                                </p>
                                <div className="place-items-center">
                                    <table className="hidden md:block">
                                        <thead>
                                            <tr>
                                                <th className="pr-1 text-left">Energie Typ</th>
                                                <th>Prozent</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                        {Object.keys(display.traeger).map((e):React.ReactNode =>{
                                            return(
                                                <tr>
                                                    <td className="pr-1">{(e.split('_').map(x=>x.charAt(0).toUpperCase() + x.slice(1))).join(' ')}</td>
                                                    <td>{display.traeger[e]?display.traeger[e]:0}%</td>
                                                </tr>
                                            )
                                        })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="grid place-items-center">
                                <Graph data={{labels:Object.keys(display.traeger).map((e):string=>(e.split('_').map(x=>x.charAt(0).toUpperCase() + x.slice(1))).join(' ')),datasets:[{data:Object.values(display.traeger)}]}}/>
                            </div>
                        </div>
                    </Popup>
                </div>
            </main>
        </>
    )
}

export async function getStaticProps(){
    const year: {jahr: string}[] = await prisma.erneuerbareElektrizitatsproduktionNachEnergietragernUndGemeinden.findMany({
        orderBy: {
            jahr: 'desc',
        },
        select: {
            jahr: true
        }
    })
    return {
        props: {
            year: {
                max: year[0].jahr,
                min: year[year.length - 1].jahr
            },
        },
        revalidate: false
    }
}