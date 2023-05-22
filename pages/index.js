import Head from 'next/head'
import Map from '@/components/ThurgauMap'
import Popup from '@/components/Popup'
import {useEffect, useState} from "react"
import {PrismaClient} from '@prisma/client'
import {console} from "next/dist/compiled/@edge-runtime/primitives/console"
import MapStyle from '@/styles/ThuraguMap.module.css'

const prisma = new PrismaClient()

export default function Home(props) {
    const [popup, changePopup] = useState(false)
    const [display, changeDisplay] = useState({})
    useEffect(() => {
        console.log(props.energy)
        for(let obj of props.energy){
            let doc = document.getElementById(`${obj.nr_gemeinde}`);
            doc.addEventListener('click', () => {
                changePopup(true)
                changeDisplay(obj)
            })
            doc.classList.add(MapStyle[obj.color])
        }
        /*for (let doc of document.querySelectorAll('path')) {
                let result = props.energy.filter(obj => {
                    return ((obj.nr_gemeinde == doc.id))
                })
                doc.addEventListener('click', () => {
                    changePopup(true)
                    changeDisplay(result[0])
                })
            }*/
        }, [props.energy]
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
                    <h3 className="text-2xl">{display.gemeinde_name ? display.gemeinde_name : ""}</h3>
                </Popup>
            </main>
        </>
    )
}


export async function getStaticProps({params}) {
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
    async function fetch(type, year){
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
                    }
                })
        }
    }
    function set_color(data, total){
        total = Object.keys(total).map(el=>{return new Array(total[el], el)}).sort((a,b)=>(a[0] > b[0]) ? 1 : ((b[0] > a[0]) ? -1 : 0))
        const out = []
        for(let d of data) {
            total.forEach((el) => {
                if (d.total >= el[0]) d["color"] = el[1]; console.log(d.nr_gemeinde, d.color);
            })
            out.push(d)
        }
        return out;
    }

    const year = await fetch("year")
    const total= new Object(Object.fromEntries(Object.entries(new calcTotal(await fetch("total", year[0].jahr)))))
    const data = set_color(await fetch("data", year[0].jahr), total)
    console.log(total)
    return {
        props: {
            year: {
                max: year[0].jahr,
                min: year[year.length - 1].jahr
            },
            energy: data
        }
    }
}