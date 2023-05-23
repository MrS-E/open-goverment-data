import Head from 'next/head'
import Map from '../components/ThurgauMap'
import Popup from '../components/Popup'
import React, {useEffect} from "react"
import {PrismaClient} from '@prisma/client'
import MapStyle from '../styles/ThuraguMap.module.css'
import Graph from "../components/Graph";
// @ts-ignore
import {Stromproduzenten, Trager} from "../types/global";

const prisma : PrismaClient = new PrismaClient()

export default function Home(props) :JSX.Element {
    const [popup, changePopup] = React.useState<boolean>(false)
    const [display, changeDisplay] = React.useState<{meta:Allgemein, data:Trager}>(null)
    useEffect(():any => {
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
    return (
        <>
            <Head>
                <title>Open Government Data</title>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
            </Head>
            <main className="relative p-4 grow grid place-items-center">
                <h1 className="mb-2 text-center mt-0 text-3xl font-medium leading-tight text-primary">{props.year}</h1>
                <Map/>
                <Popup changeTrigger={changePopup} trigger={popup}>
                    <h3 className="text-2xl">{display ? display.meta.gemeinde_name : ""}</h3>
                    <div className="grid gris-cols-1 md:grid-cols-2">
                        <div className="grid">
                            <p>
                                <strong>Total </strong> {display ? display.meta.total : ""}%
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
                                    {display ? Object.keys(display.data).map((e):React.ReactNode=>{
                                        return(
                                            <tr>
                                                <td className="pr-1">{(e.split('_').map(x=>x.charAt(0).toUpperCase() + x.slice(1))).join(' ')}</td>
                                                <td>{display.data[e]?display.data[e]:0}%</td>
                                            </tr>
                                        )
                                    }) :  <></>}
                                    </tbody>
                                </table>
                            </div>
                        </div>                        <div className="grid place-items-center">
                            <Graph data={{labels:display?(Object.keys(display.data).map((e):string=>(e.split('_').map(x=>x.charAt(0).toUpperCase() + x.slice(1))).join(' '))):[],datasets:[{data:display?Object.values(display.data):[]}]}}/>
                        </div>
                    </div>
                </Popup>
            </main>
        </>
    )
}


export async function getStaticProps({params}) {
    function calcTotal(total: {total:number}[]){
        this.average = total.reduce((sum : number,a: {total: number}):number=>sum+a.total,0)/total.length

        this.max_min = total.reduce((sum: number,a: {total: number}) :number=>a.total<this.average?sum+a.total:sum,0)/total.reduce((sum: number,a: {total: number}): number=>a.total<this.average?sum+1:sum,0)
        this.mitte_min = total.reduce((sum: number,a: {total: number}):number=>a.total<this.max_min?sum+a.total:sum,0)/total.reduce((sum: number,a: {total: number}): number=>a.total<this.max_min?sum+1:sum,0)
        this.min_min = total.reduce((sum: number,a: {total: number}):number=>a.total<this.mitte_min?sum+a.total:sum,0)/total.reduce((sum: number,a: {total: number}): number=>a.total<this.mitte_min?sum+1:sum,0)
        this.min = total[0].total

        this.min_max = total.reduce((sum: number,a:{total: number}): number=>a.total>this.average?sum+a.total:sum,0)/total.reduce((sum: number,a:{total: number}): number=>a.total>this.average?sum+1:sum,0)
        this.mitte_max = total.reduce((sum: number,a:{total: number}): number=>a.total>this.min_max?sum+a.total:sum,0)/total.reduce((sum: number,a:{total: number}): number=>a.total>this.min_max?sum+1:sum,0)
        this.max_max = total.reduce((sum: number,a:{total: number}): number=>a.total>this.mitte_max?sum+a.total:sum,0)/total.reduce((sum: number,a:{total: number}): number=>a.total>this.mitte_max?sum+1:sum,0)
        this.max = total[total.length-1].total
        return this
    }
    async function fetch(type: string, year:string, nr?:string):Promise<any>{
        switch (type){
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
    function set_color(data, total) : Allgemein[]{
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

    // @ts-ignore
    const total: Object= new Object(Object.fromEntries(Object.entries(new calcTotal(await fetch("total", params.id)))))
    const data:Allgemein[] = set_color(await fetch("data", params.id), total)
    const energy: Stromproduzenten[] = []
    for(let d of data){
        energy.push({
            meta: d,
            data: await fetch("traeger", params.id, d.nr_gemeinde)
        })
    }
    return {
        props: {
            year: params.id,
            energy: energy
        },
        revalidate: false
    }
}

export async function getStaticPaths() {
     let years:{jahr: string}[] = await prisma.erneuerbareElektrizitatsproduktionNachEnergietragernUndGemeinden.findMany({
        orderBy: {
            jahr: 'desc',
        },
        select: {
            jahr: true
        }
    })
    // @ts-ignore
    years = [...new Set(years)]
    const paths:{params:{id:string}}[] = years.map((year):{params:{id:string}} =>({
        params: {id: year.jahr.toString()}
    }))
    return {
        paths: paths,
        fallback: false,
    };
}