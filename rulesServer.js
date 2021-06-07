const chokidar = require('chokidar');
const fs = require('fs');
module.exports = (server) => {
  const watchPathMap = new Map();
  const readRules = (rulePath)=>{
    let fileContent = '';
    try {
      fileContent = fs.readFileSync(rulePath).toString();
    } catch (e){
      console.error('whistle.rules_watcher get error',e);
    }
    watchPathMap.set(rulePath, fileContent);
    console.log(`whistle.rules_watcher get new rules from ${rulePath}\n`,fileContent);
  }
  server.on('request', (req, res) => {
    const rulePath = req.request.ruleValue;
    if (!watchPathMap.has(rulePath)) {
      // rules = readRules(rulePath);
      chokidar.watch(rulePath).on('all', () => {
        readRules(rulePath);
      })
    }

    res.end(watchPathMap.get(rulePath));
  });
};
