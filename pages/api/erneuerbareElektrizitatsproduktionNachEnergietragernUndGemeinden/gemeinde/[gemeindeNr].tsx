import {PrismaClient} from "@prisma/client";
import {NextApiRequest, NextApiResponse} from "next";


export default async function handler(req : NextApiRequest, res: NextApiResponse) {
    const gNr:string = req.query.gemeindeNr as string
    const prisma :PrismaClient = new PrismaClient()
    const gemeinde = await prisma.erneuerbareElektrizitatsproduktionNachEnergietragernUndGemeinden.findMany({
        where:{
            nr_gemeinde: gNr
        },
        take: 1,
        select:{
            gemeinde_name: true
        }
    })
    const data = await prisma.erneuerbareElektrizitatsproduktionNachEnergietragernUndGemeinden.findMany({
        where:{
            nr_gemeinde: gNr
        },
        select:{
            jahr:true,
            biogasanlagen_abwasser:true,
            biogasanlagen_industrie: true,
            biogasanlagen_landwirtschaft:true,
            biomasse_holz:true,
            kehricht:true,
            photovoltaik:true,
            wasserkraft:true,
            wind:true,
            total:true
        }
    })
    const out: any = {
        gemeinde_name: gemeinde[0],
        nr_gemeinde: gNr,
        data: data
    }
    res.status(200).send(out)
    await prisma.$disconnect()

}