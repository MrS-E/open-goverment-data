import {PrismaClient} from "@prisma/client";
import {NextApiRequest, NextApiResponse} from "next";

export default async function handler(req : NextApiRequest, res: NextApiResponse) {
    const prisma: PrismaClient = new PrismaClient();
    res.status(200).send(await prisma.polizeiposten.findMany())
    await prisma.$disconnect()
}