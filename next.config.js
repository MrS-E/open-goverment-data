/** @type {import('next').NextConfig} */
const chalk = require('chalk');
const reader = require('./db-loader')

module.exports = async ()=>{
  console.log(`- ${chalk.blue('status')} server trying to fetch data`)
  try {
    reader();
    console.log(`- ${chalk.blue('status')} server successfully read data into db`)
  }catch (e){
    console.log(`- ${chalk.red('error')} server was not able to fetch data`)
    console.error(e)
  }

  return nextConfig = {
    webpack: (config) => {
      config.resolve.extensions.push('.ts', '.tsx');
      return config;
    },
    reactStrictMode: false,
  };
}

/*async function fetch_polizei(){
  const xml = new jsdom.JSDOM(await(await fetch()).text())
  const xmlDoc = xml.window.document
  const value = {:[], :[], :[]}
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
}*/
async function convertCoordinates(cords){
  const kords = await (await fetch("http://geodesy.geo.admin.ch/reframe/lv95towgs84?easting="+cords.split(' ')[0]+"&northing="+cords.split(' ')[1]+"&format=json")).json()
  return kords.northing +","+kords.easting
}
async function fetch_schutzraum(){
  const xml = new jsdom.JSDOM(await(await fetch("https://ows.geo.tg.ch/geofy_access_proxy/schutzraeume?Service=WFS&Version=2.0.0&request=GetFeature&typenames=Schutzraeume")).text())
  const xmlDoc = xml.window.document
  const id = []
  for (let el of xmlDoc.getElementsByTagName("ms:objekt_nr")) {
    if(el.childNodes[0])id.push(el);
  }
  for(let d in id){
    await prisma.schutzraeume.upsert(
      {
      where: {
        key: d
      },
      update: {},
      create: {
        key: d,
        plaetze: parseInt(xmlDoc.getElementsByTagName("ms:anz_plaetze")[d].childNodes[0].nodeValue),
        bau:xmlDoc.getElementsByTagName("ms:bauabnahme")[d].childNodes[0].nodeValue,
        koordinaten: await convertCoordinates(xmlDoc.getElementsByTagName("gml:pos")[d].childNodes[0].nodeValue)
      }
    })
  }
  return true
}
