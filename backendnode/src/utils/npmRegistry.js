const axios = require('axios');

async function getLatestVersion(packageName) {
  
  try {
    const response = await axios.get(`https://registry.npmjs.org/${packageName}`);
    
    const version = response.data['dist-tags'].latest;
    
    return version;
    
  } catch (error) {
    console.error(error);
  }

}

getLatestVersion('express')
  .then(version => {
    console.log(`Latest version: ${version}`);  
  })
  .catch(err => {
    console.log(err);
  });