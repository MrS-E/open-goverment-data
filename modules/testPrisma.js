const {PrismaClient} = require('@prisma/client')

exports.test = async function (modules){
    const prisma = new PrismaClient()
    try{
        for(let m of modules){
            await prisma[m].findFirst()
        }
        await prisma.$disconnect()
        return true
    }catch (e){
        await prisma.$disconnect()
        return false
    }
}