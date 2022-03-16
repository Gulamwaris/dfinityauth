const file = require('fs');
const shell = require('shelljs');
const yargs = require('yargs');

const argv = yargs
  .option('clean', {
    alias: 'c',
    description: 'clean .dfx/ folder',
    type: 'boolean',
  })
  .help()
  .alias('help', 'h').argv;

// third_party configs
const thirdFolder = process.cwd() + '/canisters/';

const thirdPartyList = [
  {
    folder: 'internet_identity',
    config: 'ii_config.json',
    url: true,
  },
  {
    folder: 'ledger',
    private: 'dfx.private.json',
    public: 'dfx.public.json',
    config: 'ledger_config.json',
  },
  {
    folder: 'nns-dapp',
    config: 'nns_config.json',
  },
];

// run deploy

function runDeploy() {
  for (const f of thirdPartyList) {
    const dfx_folder = thirdFolder + f.folder;
    const dfx_sh = dfx_folder + '/dfx.sh';
    if (argv.clean) {
      if (f.private !== undefined) {
        const prv = file.readFileSync(dfx_folder + '/' + f.private);
        const pub = file.readFileSync(dfx_folder + '/' + f.public);
        file.writeFileSync(dfx_folder + '/dfx.json', prv);
        shell.exec(`cd ${dfx_folder} && rm -rf .dfx && sh dfx.sh`);
        file.writeFileSync(dfx_folder + '/dfx.json', pub);
      } else {
        shell.exec(`cd ${dfx_folder} && rm -rf .dfx && sh dfx.sh`);
      }
    } else {
      shell.exec(`cd ${dfx_folder} && sh dfx.sh`);
    }
    const localCanisterJson = file
      .readFileSync(dfx_folder + '/.dfx/local/canister_ids.json')
      .toString('utf8');
    const localCanisterId = JSON.parse(localCanisterJson)[f.folder]['local'];

    const configJson = file.readFileSync(f.config).toString('utf8');

    const configObject = {
      ...JSON.parse(configJson),
      LOCAL_CANISTERID: localCanisterId,
    };

    if (f.url) {
      Object.assign(configObject, {
        LOCAL_URL: `http://${localCanisterId}.localhost:8000`,
      });
    }

    file.writeFileSync(f.config, JSON.stringify(configObject));
  }
}

runDeploy();
