import {PrismaClient} from "@prisma/client";
import {NextApiRequest, NextApiResponse} from "next";

type Jahr = {
    jahr: string
}

export default async function handler(req : NextApiRequest, res: NextApiResponse) {
    const prisma : PrismaClient = new PrismaClient()

    function calcTotal(total : {total: number}[]): object{
        this.average = total.reduce((sum:number,a:{total:number})=>sum+a.total,0)/total.length

        this.max_min = total.reduce((sum:number,a:{total:number}):number=>a.total<this.average?sum+a.total:sum,0)/total.reduce((sum:number,a:{total:number}):number=>a.total<this.average?sum+1:sum,0)
        this.mitte_min = total.reduce((sum:number,a:{total:number}):number=>a.total<this.max_min?sum+a.total:sum,0)/total.reduce((sum:number,a:{total:number}):number=>a.total<this.max_min?sum+1:sum,0)
        this.min_min = total.reduce((sum:number,a:{total:number}):number=>a.total<this.mitte_min?sum+a.total:sum,0)/total.reduce((sum:number,a:{total:number}):number=>a.total<this.mitte_min?sum+1:sum,0)
        this.min = total[0].total

        this.min_max = total.reduce((sum:number,a:{total:number}):number=>a.total>this.average?sum+a.total:sum,0)/total.reduce((sum:number,a:{total:number}):number=>a.total>this.average?sum+1:sum,0)
        this.mitte_max = total.reduce((sum:number,a:{total:number}):number=>a.total>this.min_max?sum+a.total:sum,0)/total.reduce((sum:number,a:{total:number}):number=>a.total>this.min_max?sum+1:sum,0)
        this.max_max = total.reduce((sum:number,a:{total:number}):number=>a.total>this.mitte_max?sum+a.total:sum,0)/total.reduce((sum:number,a:{total:number}):number=>a.total>this.mitte_max?sum+1:sum,0)
        this.max = total[total.length-1].total
        return this
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

    let year : Jahr[] = await prisma.erneuerbareElektrizitatsproduktionNachEnergietragernUndGemeinden.findMany({
        select:{
            jahr:true
        }
    })
    let years : string[] = year.map(year=>year.jahr.toString())

    // @ts-ignore
    years = [...new Set<string>(years)]

    if(years.includes(req.query.jahr as string)){
        // @ts-ignore
        const total:Object= new Object(Object.fromEntries(Object.entries(new calcTotal(await prisma.erneuerbareElektrizitatsproduktionNachEnergietragernUndGemeinden.findMany({
            where: {
                jahr: req.query.jahr as string
            },
            orderBy: {
                total: 'asc',
            },
            select: {
                total: true
            }
        })))))
        const allg:any[] = set_color(await prisma.erneuerbareElektrizitatsproduktionNachEnergietragernUndGemeinden.findMany({
            where: {
                jahr: req.query.jahr as string
            },
            select: {
                nr_gemeinde: true,
                gemeinde_name: true,
                total: true,
            }
        }), total)
        const out = []
        for(let a of allg){
            out.push({
                allg: a,
                traeger: await prisma.erneuerbareElektrizitatsproduktionNachEnergietragernUndGemeinden.findUnique({
                    where: {
                        nr_gemeinde_jahr: {
                            jahr: req.query.jahr as string,
                            nr_gemeinde: a.nr_gemeinde
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
                    }})
            })
        }
        res.status(200).json(out);
    }else{
        res.status(406).json({error: "year not found"})
    }
    await prisma.$disconnect()
}
