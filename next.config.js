/** @type {import('next').NextConfig} */
const {fetch} = require("next/dist/compiled/@edge-runtime/primitives/fetch");
const {PrismaClient} = require("@prisma/client");
const chalk = require('chalk');
const jsdom = require("jsdom");

const prisma = new PrismaClient()

module.exports = async ()=>{
  console.log(`- ${chalk.blue('status')} server trying to fetch data`)
  try {
    await fetch_main()
    await fetch_polizei()
    console.log(`- ${chalk.blue('status')} server successfully read data into db`)
  }catch (e){
    console.log(`- ${chalk.red('error')} server was not able to fetch data`)
    console.log(e)
  }

  return nextConfig = {
    webpack: (config) => {
      config.resolve.extensions.push('.ts', '.tsx');
      return config;
    },
    reactStrictMode: true,
  };
}

async function fetch_main(){
  const data = await(await fetch((await(await fetch('https://ckan.opendata.swiss/api/3/action/package_show?id=erneuerbare-elektrizitatsproduktion-nach-energietragern-und-gemeinden')).json()).result.resources.filter(obj => {
    return obj.media_type === "application/json"
  })[0].uri)).json();
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
  return true
}

async function fetch_polizei(){
  const xml = new jsdom.JSDOM(await(await fetch("https://ows.geo.tg.ch/geofy_access_proxy/kapopostenkarte?Service=WFS&Version=2.0.0&request=GetFeature&typeName=pgzpostp")).text())
  const xmlDoc = xml.window.document
  const value = {"ms:objectid":[], "ms:art":[], "gml:pos":[]}
  const data = []
  for(let d of ["ms:objectid","ms:art", "gml:pos"]) {
    for (let el of xmlDoc.getElementsByTagName(d)) {
      value[d].push(el.childNodes[0].nodeValue);
    }
  }
  for(let d in value["ms:objectid"]){
    data.push({
      key:value["ms:objectid"][d],
      art:value["ms:art"][d],
      koordinaten: await convertCoordinates(value["gml:pos"][d])
    })
  }
  await Promise.all(data.map(async d => {
    await prisma.polizeiposten.upsert({
      where: {
        key: parseInt(d.key)
      },
      update: {},
      create: {
        key: parseInt(d.key),
        art: d.art,
        koordinaten: d.koordinaten
      }
    })
  }))
  return true
}

async function convertCoordinates(cords){
  const kords = await (await fetch("http://geodesy.geo.admin.ch/reframe/lv95towgs84?easting="+cords.split(' ')[0]+"&northing="+cords.split(' ')[1]+"&format=json")).json()
  return kords.northing +","+kords.easting
}