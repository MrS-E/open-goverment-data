import Head from 'next/head'
import Map from '@/components/ThurgauMap'
import Popup from '@/components/Popup'
import {useEffect, useRef, useState} from "react"
import {PrismaClient} from '@prisma/client'
import {console} from "next/dist/compiled/@edge-runtime/primitives/console"
import MapStyle from '@/styles/ThuraguMap.module.css'
import Slider from '@/components/Tailwind/Slider'
import { useRouter } from 'next/router';
import Graph from "@/components/Graph";

const prisma = new PrismaClient()

export default function Home(props) {
    const [popup, changePopup] = useState(false)
    const [display, changeDisplay] = useState({meta:{}, data:{}})
    const [year, changeYear] = useState(props.year.max)
    useEffect(() => {
        for(let obj of props.energy){
            let doc = document.getElementById(`${obj.meta.nr_gemeinde}`);
            doc.addEventListener('click', () => {
                changePopup(true)
                changeDisplay(obj)

            })
            doc.classList.add(MapStyle[obj.meta.color])
        }
        document.getElementsByClassName(MapStyle.lakes)[0].addEventListener('click', ()=>{
            alert("Geehrter Nutzer der Bodensee ist keine Gemeinde. \nBitte klicken Sie nur Gemeinden an.")
        })
    }, [props.energy])
    useEffect(()=>{}, [year])
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
                            value={parseInt(props.year.max)} steps={1} text={""} onChange={(e) => {
                        changeYear(e.target.value)
                    }}/>
                    <Popup changeTrigger={changePopup} trigger={popup}>
                        <h3 className="text-2xl">{display.meta.gemeinde_name ? display.meta.gemeinde_name : ""}</h3>
                        <div className="grid gris-cols-1 md:grid-cols-2">
                            <div className="grid place-items-center">
                                <table>
                                    <theah>
                                        <tr>
                                            <th>Energie Typ</th>
                                            <th>Prozent</th>
                                        </tr>
                                    </theah>
                                    <tbody>
                                    {Object.keys(display.data).map(e=>{
                                        return(
                                            <tr>
                                                <td>{(e.split('_').map(x=>x.charAt(0).toUpperCase() + x.slice(1))).join(' ')}</td>
                                                <td>{display.data[e]?display.data[e]:0}</td>
                                            </tr>
                                        )
                                    })}
                                    </tbody>
                                </table>
                            </div>
                            <div className="grid place-items-center">
                                <Graph data={{labels:Object.keys(display.data).map(e=>(e.split('_').map(x=>x.charAt(0).toUpperCase() + x.slice(1))).join(' ')),datasets:[{data:Object.values(display.data)}]}}/>
                            </div>
                        </div>
                    </Popup>
                </div>
            </main>
        </>
    )
}


export async function getStaticProps() {
    function calcTotal(total){
        this.average = total.reduce((sum,a)=>sum+a.total,0)/total.length

        this.max_min = total.reduce((sum,a)=>a.total<this.average?sum+a.total:sum+0,0)/total.reduce((sum,a)=>a.total<this.average?sum+1:sum+0,0)
        this.mitte_min = total.reduce((sum,a)=>a.total<this.max_min?sum+a.total:sum+0,0)/total.reduce((sum,a)=>a.total<this.max_min?sum+1:sum+0,0)
        this.min_min = total.reduce((sum,a)=>a.total<this.mitte_min?sum+a.total:sum+0,0)/total.reduce((sum,a)=>a.total<this.mitte_min?sum+1:sum+0,0)
        this.min = total[0].total

        this.min_max = total.reduce((sum,a)=>a.total>this.average?sum+a.total:sum+0,0)/total.reduce((sum,a)=>a.total>this.average?sum+1:sum+0,0)
        this.mitte_max = total.reduce((sum,a)=>a.total>this.min_max?sum+a.total:sum+0,0)/total.reduce((sum,a)=>a.total>this.min_max?sum+1:sum+0,0)
        this.max_max = total.reduce((sum,a)=>a.total>this.mitte_max?sum+a.total:sum+0,0)/total.reduce((sum,a)=>a.total>this.mitte_max?sum+1:sum+0,0)
        this.max = total[total.length-1].total
        return this
    }
    async function fetch(type, year, nr){
        switch (type){
            case "year":
                return await prisma.erneuerbareElektrizitatsproduktionNachEnergietragernUndGemeinden.findMany({
                    orderBy: {
                        jahr: 'desc',
                    },
                    select: {
                        jahr: true
                    }
                })
            case "total":
                return await prisma.erneuerbareElektrizitatsproduktionNachEnergietragernUndGemeinden.findMany({
                    where: {
                        jahr: year
                    },
                    orderBy: {
                        total: 'asc',
                    },
                    select: {
                        total: true
                    }
                })
            case "data":
                return await prisma.erneuerbareElektrizitatsproduktionNachEnergietragernUndGemeinden.findMany({
                    where: {
                        jahr: year
                    },
                    select:{
                        nr_gemeinde: true,
                        gemeinde_name: true,
                        einwohner: true,
                        total: true,
                    }
                })
            case "traeger":
                return await prisma.erneuerbareElektrizitatsproduktionNachEnergietragernUndGemeinden.findUnique({
                    where: {
                        nr_gemeinde_jahr: {
                            jahr: year,
                            nr_gemeinde: nr
                        }
                    },
                    select:{
                        biogasanlagen_abwasser: true,
                        biogasanlagen_industrie: true,
                        biogasanlagen_landwirtschaft: true,
                        biomasse_holz: true,
                        kehricht: true,
                        photovoltaik: true,
                        wasserkraft: true,
                        wind: true,
                    }
                })
            }
        }
    function set_color(data, total){
        total = Object.keys(total).map(el=>{return new Array(total[el], el)}).sort((a,b)=>(a[0] > b[0]) ? 1 : ((b[0] > a[0]) ? -1 : 0))
        const out = []
        for(let d of data) {
            total.forEach((el) => {
                if (d.total >= el[0]) d["color"] = el[1]
            })
            out.push(d)
        }
        return out;
    }

    const year = await fetch("year")
    const total= new Object(Object.fromEntries(Object.entries(new calcTotal(await fetch("total", year[0].jahr)))))
    const data = set_color(await fetch("data", year[0].jahr), total)
    const energy = []
    for(let d of data){
        energy.push({
            meta: d,
            data: await fetch("traeger", year[0].jahr, d.nr_gemeinde)
        })
    }
    return {
        props: {
            year: {
                max: year[0].jahr,
                min: year[year.length - 1].jahr
            },
            energy: energy,
        },
        revalidate: false
    }
}