/** @type {import('next').NextConfig} */
const Reader = require('modules/reader')

module.exports = async ()=>{
  try {
    new Reader("main")
  }catch (e){
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
