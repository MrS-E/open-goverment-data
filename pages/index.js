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
            for (let doc of document.querySelectorAll('path')) {
                let result = props.energy.filter(obj => {
                    return ((obj.nr_gemeinde == doc.id))
                })
                const total = Object.keys(props.total).map(el=>{return new Array(props.total[el], el)}).sort((a,b)=>(a[0] > b[0]) ? -1 : ((b[0] > a[0]) ? 1 : 0))
                console.log(total)
                total.forEach((el)=>{if(props.energy.total>=el[0]) doc.classList.add(MapStyle[el[1]]); console.log(MapStyle[el[1]])})
                /*switch(true){
                    case (props.energy.total<=props.total.min):
                        doc.classList.add()
                        break
                    case (props.energy.total<=props.total.min_min):
                        doc.classList.add()
                        break
                    case (props.energy.total<=props.total.mitte_min):
                        doc.classList.add()
                        break
                    case (props.energy.total<=props.total.max_min):
                        doc.classList.add()
                        break
                    case (props.energy.total<=props.total.average):
                        doc.classList.add()
                        break
                    case (props.energy.total<=props.total.min_max):
                        doc.classList.add()
                        break
                    case (props.energy.total<=props.total.mitte_max):
                        doc.classList.add()
                        break
                    case (props.energy.total<=props.total.max_max):
                        doc.classList.add()
                        break
                    case (props.energy.total<=props.total.max):
                        doc.classList.add()
                        break

                }*/
                doc.addEventListener('click', () => {
                    changePopup(true)
                    changeDisplay(result[0])
                })
            }
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

    const year = await prisma.erneuerbareElektrizitatsproduktionNachEnergietragernUndGemeinden.findMany({
        orderBy: {
            jahr: 'desc',
        },
        select: {
            jahr: true
        }
    })
    const data = await prisma.erneuerbareElektrizitatsproduktionNachEnergietragernUndGemeinden.findMany({
        where: {
            jahr: year[0].jahr
        }
    })
    const total = await prisma.erneuerbareElektrizitatsproduktionNachEnergietragernUndGemeinden.findMany({
        where: {
            jahr: year[0].jahr
        },
        orderBy: {
            total: 'asc',
        },
        select: {
            total: true
        }
    })
    return {
        props: {
            total: new Object(Object.fromEntries(Object.entries(new calcTotal(total)))),
            year: {
                max: year[0].jahr,
                min: year[year.length - 1].jahr
            },
            energy: data
        }
    }
}