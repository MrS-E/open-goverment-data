import {polizeiposten, PrismaClient} from "@prisma/client";
import {NextApiRequest, NextApiResponse} from "next";

export default async function handler(req : NextApiRequest, res: NextApiResponse) {
    const prisma: PrismaClient = new PrismaClient();
    const data:polizeiposten[] = await prisma.polizeiposten.findMany()
    const out:object[]=[]
    for(let d of data){
        out.push({
            key: d.key,
            coordinates: [parseFloat(d.koordinaten.split(',')[0]),parseFloat(d.koordinaten.split(',')[1])]
        })
    }
    res.status(200).send(out)
    await prisma.$disconnect()
}