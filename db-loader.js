const jsdom = require("jsdom");
const fetch = require('node-fetch');
const {PrismaClient} = require('@prisma/client')

class Reader{
    constructor(type, url, attributes, schema) { //attributes = [{xml:, db:}]
        this.init(type, url, attributes, schema)
    }
    async init(type, url, attributes, schema){
        switch(type){
            case"xml":
                const xmlDoc = this.getXML(await this.fetchData("xml", url))
                const searchIndex = attributes.findIndex((attr) => attr.db="key")
                const objs = []
                const keys =  xmlDoc.getElementsByTagName(attributes[searchIndex].xml)
                for (let i in keys) {
                    if(keys[i].childNodes) {
                        const data = {
                            where: {
                                key: keys[i].childNodes[0].nodeValue
                            },
                            update: {},
                            create: {}
                        }
                        for (const attr of attributes) {
                            if(attr.db!=="koordinaten") {
                                data.create[attr.db] = xmlDoc.getElementsByTagName(attr.xml)[i].childNodes[0].nodeValue
                            }else{
                                data.create[attr.db] = await this.convertCoordinates(xmlDoc.getElementsByTagName(attr.xml)[i].childNodes[0].nodeValue)
                            }
                        }
                        objs.push(data)
                    }
                }
                this.writeDB(objs, schema)
                break
            case"json":
                break;
            case "main":
                await fetch_main()
                break
            default:
                throw "Reader type not valid"
        }

    }

    async fetchData(type, url){
        switch (type){
            case "main":
                return undefined
            case "xml":
                return await (await fetch(url)).text()
            case "json":
                return await (await fetch(url)).json()
        }
    }
    writeDB(data, schema){
        const prisma = new PrismaClient()
        Promise.all(data.map(e=>{
            return prisma[schema].upsert({
                where: e.where?e.where:{},
                update: e.update?e.update:{},
                create: e.create?e.create:{}
            })
        }))
    }
    getXML(get){
        const xml = new jsdom.JSDOM(get)
        return xml.window.document
    }
    async convertCoordinates(cords) {
        const data = await (await fetch("http://geodesy.geo.admin.ch/reframe/lv95towgs84?easting=" + cords.split(' ')[0] + "&northing=" + cords.split(' ')[1] + "&format=json")).json()
        return data.northing +","+data.easting

    }
}
async function fetch_main(){
    const data = await(await fetch((await(await fetch('https://ckan.opendata.swiss/api/3/action/package_show?id=erneuerbare-elektrizitatsproduktion-nach-energietragern-und-gemeinden')).json()).result.resources.filter(obj => {
        return obj.media_type === "application/json"
    })[0].uri)).json();
    await Promise.all(data.map(async d => {
        const prisma = new PrismaClient()
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

module.exports = function () {
    Promise.all([
    new Reader("main"),
    new Reader("xml", "https://ows.geo.tg.ch/geofy_access_proxy/kapopostenkarte?Service=WFS&Version=2.0.0&request=GetFeature&typeName=pgzpostp",
        [{db: "key", xml: "ms:objectid"}, {db: "art", xml: "ms:art"}, {db: "koordinaten", xml: "gml:pos"}],
        "polizeiposten")])
}
