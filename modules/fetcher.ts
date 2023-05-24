let {PrismaClient} = require("@prisma/client");
const chalk = require('chalk');

module .exports = class{
    private prisma: any;

    constructor(type:string) {
        this.prisma = new PrismaClient()
        switch(type){
            case "main":
                console.log(`- ${chalk.blue('status')} server trying to fetch main json`)
                const data: Promise<object> = this.Fetcher("main")
                data.then(
                    function(error):void { throw `fetch main went wrong: ${error}`},
                    function(value):void {
                        const db_feeds:Promise<any>[] = []
                        for(let d of value){
                            let data : object ={
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
                            let where: object ={
                                nr_gemeinde_jahr: {
                                    nr_gemeinde: d.bfs_nr_gemeinde,
                                    jahr: d.jahr
                                }
                            }
                            db_feeds.push(this.this.WriteDb("erneuerbareElektrizitatsproduktionNachEnergietragernUndGemeinden", data, where))
                        }
                        Promise.all(db_feeds)
                            .then(()=>console.log(`- ${chalk.blue('status')} server successfully read main json into db`))
                            .catch((error)=>{
                                console.log(`- ${chalk.red('error')} server was not able to fetch main json`)
                                throw `db feed main went wrong: ${error}`
                            })
                    }
                )
                break
            case "police":
                break
            case "schutz":
                break
            case "notfall":
                break
            case "quelle":
                break
            case "strom":
                break
            case "risiko":
                break
            default:
                throw "not defined"
        }
    }

     Fetcher(type: string, url?: string): Promise<any> {
        switch (type) {
            case "main":
                return new Promise( (resolve, reject)=>{
                    const url:any = fetch('https://ckan.opendata.swiss/api/3/action/package_show?id=erneuerbare-elektrizitatsproduktion-nach-energietragern-und-gemeinden').then(response => response.json()).then(res => res.result.resources.filter(obj => {return obj.media_type === "application/json"})[0].uri).catch(err=>reject)
                    fetch(url).then(response => response.json()).then(res=>resolve).catch(err=>reject)
                    })
            case "text":
                return new Promise((resolve, reject) => {
                    fetch(url).then(response => response.text()).then(res => resolve).catch(err => reject)
                })
            case "json":
                return new Promise((resolve, reject) => {
                    fetch(url).then(response => response.json()).then(res => resolve).catch(err => reject)
                })
            default:
                return undefined
        }
    }

    WriteDb(module:string, data:object[], where?:object, update?:object):Promise<any>{
        return new Promise((resolve, reject) => {
                 this.prisma[module].upsert({
            where: where?where:{},
            update: update?update:{},
            create: data
        }).then(res=>resolve).catch(err=>reject)})
    }

    XMLParser(dom :string):XMLDocument{
        return new DOMParser().parseFromString(dom,"text/xml")
    }

}