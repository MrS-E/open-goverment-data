import {NextApiRequest, NextApiResponse} from "next";
import {PrismaClient} from "@prisma/client";

export default async function handler(req : NextApiRequest, res: NextApiResponse) {
    const prisma:PrismaClient = new PrismaClient()
    const jahr:string = req.query.jahr as string
    const gNr: string = req.query.gemeindeNr as string
    const data: any = await  prisma.erneuerbareElektrizitatsproduktionNachEnergietragernUndGemeinden.findUnique({
        where:{
            nr_gemeinde_jahr:{
                nr_gemeinde: gNr,
                jahr: jahr
            }
        }
    })
    res.status(200).send(data)
    await prisma.$disconnect()
}
