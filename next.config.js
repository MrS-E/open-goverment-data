/** @type {import('next').NextConfig} */
const {fetch} = require("next/dist/compiled/@edge-runtime/primitives/fetch");
const {PrismaClient} = require("@prisma/client");
const chalk = require('chalk');

module.exports = async ()=>{
  console.log(`- ${chalk.blue('status')} server trying to fetch json`)
  try {
    const req = await fetch((await (await fetch('https://ckan.opendata.swiss/api/3/action/package_show?id=erneuerbare-elektrizitatsproduktion-nach-energietragern-und-gemeinden')).json()).result.resources.filter(obj => {
      return obj.media_type === "application/json"
    })[0].uri);
    const prisma = new PrismaClient()
    const data = await req.json();
    await Promise.all(data.map(async d => {
      await prisma.erneuerbareElektrizitatsproduktionNachEnergietragernUndGemeinden.upsert({
        where: {
          nr_gemeinde_jahr: {
            nr_gemeinde: d.bfs_nr_gemeinde,
            jahr: d.jahr
          }
        },
        update: {},
        create: {
          nr_gemeinde: d.bfs_nr_gemeinde,
          gemeinde_name: d.gemeinde_name,
          jahr: d.jahr,
          einwohner: d.einwohner,
          biogasanlagen_abwasser: d.biogasanlagen_abwasser,
          biogasanlagen_industrie: d.biogasanlagen_industrie,
          biogasanlagen_landwirtschaft: d.biogasanlagen_landwirtschaft,
          biomasse_holz: d.biomasse_holz,
          kehricht: d.kehricht,
          photovoltaik: d.photovoltaik,
          wasserkraft: d.wasserkraft,
          wind: d.wind,
          total: d.total
        }
      })
    }))
    console.log(`- ${chalk.blue('status')} server successfully read json into db`)
  }catch (e){
    console.log(`- ${chalk.red('error')} server was not able to fetch json`)
  }

  return nextConfig = {
    reactStrictMode: true,
  };
}
