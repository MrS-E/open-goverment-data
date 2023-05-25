/** @type {import('next').NextConfig} */
const chalk = require('chalk');
const prisma = require('./modules/testPrisma')
const { execSync } = require("child_process");

module.exports = async () =>{
  const env = process.env.NODE_ENV
  let empty = false;

  console.log(`- ${chalk.cyan('wait')} Checking database...`)
  if(!await prisma.test(["erneuerbareElektrizitatsproduktionNachEnergietragernUndGemeinden","polizeiposten"])){
    console.log(`- ${chalk.yellow('warn')} Database will be created`)
    console.log(`- ${chalk.bgMagenta('Info')} If an error occurs regarding th DB try running ${chalk.blackBright("\"prisma migrate dev\"")}`)
    empty = true
    if(env === "development"){
      await runShellCommand("prisma migrate dev --name "+(new Date().toISOString()))
    }
    else if (env === "production"){
      await runShellCommand("prisma migrate deploy");
    }
  }

  require('dns').resolve('www.google.com',  async function(err) {
    if (err) {
      console.log(`- ${chalk.blue('status')} Server has no internet connection`)
      if(empty){
        console.log(`- ${chalk.blue('error')} Database is empty`)
        throw 500
      }
    } else {
      console.log(`- ${chalk.blue('status')} Server has internet connection available`)
      console.log(`- ${chalk.cyan('wait')} Server trying to fetch data...`)
      try {
        await require('./modules/db-loader')()
        console.log(`- ${chalk.blue('status')} Server successfully read data into db`)
      }catch (e){
        console.log(`- ${chalk.red('error')} Server was not able to fetch data`)
        console.log(`- ${chalk.blue('status')} Use db without checking datasource`)
        if(empty){
          console.error(e)
          console.log(`- ${chalk.blue('error')} Database is empty`)
          throw 500
        }
      }
    }
  })

  return nextConfig = {
    webpack: (config) => {
      config.resolve.extensions.push('.ts', '.tsx');
      return config;
    },
    reactStrictMode: false,
  };
}

async function runShellCommand(command) {
  try {
    execSync(command);
    console.log(`- ${chalk.magenta("info")} Shell command executed successfully.`);
  } catch (error) {
    console.error(`- ${chalk.magenta("info")} Error executing shell command: ${error.message}`);
    throw 500
  }
}

