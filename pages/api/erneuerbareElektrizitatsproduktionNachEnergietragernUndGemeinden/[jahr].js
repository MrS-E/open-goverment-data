import {PrismaClient} from "@prisma/client";

export default async function handler(req, res) {
    const prisma = new PrismaClient()

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

    let year = await prisma.erneuerbareElektrizitatsproduktionNachEnergietragernUndGemeinden.findMany({
        select:{
            jahr:true
        }
    })
    year = [...new Set(year)]
    year = year.map(year=>year.jahr.toString())

    if(year.includes(req.query.jahr)){
        const total= new Object(Object.fromEntries(Object.entries(new calcTotal(await prisma.erneuerbareElektrizitatsproduktionNachEnergietragernUndGemeinden.findMany({
            where: {
                jahr: req.query.jahr
            },
            orderBy: {
                total: 'asc',
            },
            select: {
                total: true
            }
        })))))
        const allg = set_color(await await prisma.erneuerbareElektrizitatsproduktionNachEnergietragernUndGemeinden.findMany({
            where: {
                jahr: req.query.jahr
            },
            select:{
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
                            jahr: req.query.jahr,
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

}
