import Head from 'next/head'
import Map from '@/components/ThurgauMap'
import Popup from '@/components/Popup'
import {useEffect, useState} from "react"
import {PrismaClient} from '@prisma/client'
import MapStyle from '@/styles/ThuraguMap.module.css'

const prisma = new PrismaClient()

export default function Home(props) {
    const [popup, changePopup] = useState(false)
    const [display, changeDisplay] = useState({})
    useEffect(() => {
        for(let obj of props.energy){
            let doc = document.getElementById(`${obj.nr_gemeinde}`);
            doc.addEventListener('click', () => {
                changePopup(true)
                changeDisplay(obj)
            })
            doc.classList.add(MapStyle[obj.color])
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
            <main className="container relative p-4 grow grid place-items-center">
                <div className="max-w-[80vmin] flex-shrink-0 min-w-[80vmin]">
                    <h1 className="mb-2 text-center mt-0 text-3xl font-medium leading-tight text-primary">{props.year}</h1>
                    <Map/>
                    <Popup changeTrigger={changePopup} trigger={popup}>
                        <h3 className="text-2xl">{display.gemeinde_name ? display.gemeinde_name : ""}</h3>
                    </Popup>
                </div>
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
                if (d.total >= el[0]) d["color"] = el[1]
            })
            out.push(d)
        }
        return out;
    }

    const total= new Object(Object.fromEntries(Object.entries(new calcTotal(await fetch("total", params.id)))))
    const data = set_color(await fetch("data", params.id), total)
    return {
        props: {
            year: params.id,
            energy: data
        },
        revalidate: false
    }
}

export async function getStaticPaths() {
     let years = await prisma.erneuerbareElektrizitatsproduktionNachEnergietragernUndGemeinden.findMany({
        orderBy: {
            jahr: 'desc',
        },
        select: {
            jahr: true
        }
    })
    years = [...new Set(years)]
    const paths = years.map(year=>({
        params: {id: year.jahr.toString()}
    }))
    return {
        paths: paths,
        fallback: false,
    };
}