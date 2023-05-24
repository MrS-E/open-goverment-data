import {PrismaClient} from "@prisma/client";
import {NextApiRequest, NextApiResponse} from "next";

export default async function handler(req : NextApiRequest, res: NextApiResponse) {
    const prisma: PrismaClient = new PrismaClient()
    const gemeinden: {nr_gemeinde:string,gemeinde_name:string,total:number}[] = await prisma.erneuerbareElektrizitatsproduktionNachEnergietragernUndGemeinden.findMany({
        where:{
          jahr:req.query.year?req.query.year as string:"2020"
        },
        orderBy:{
            total: "desc"
        },
        select:{
            gemeinde_name: true,
            nr_gemeinde:true,
            total:true,
        }
    })
    const out: {
        top: { nr_gemeinde: string; gemeinde_name: string; total: number }[];
        worst: { nr_gemeinde: string; gemeinde_name: string; total: number }[]
    } = req.query.amount?{top: gemeinden.slice(0, parseInt(req.query.amount as string)), worst: gemeinden.reverse().slice(0, parseInt(req.query.amount as string))}:{top: gemeinden.slice(0, 5), worst: gemeinden.reverse().slice(0, 5)}
    res.status(200).json(out)
}
