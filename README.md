# IC_ENV
A repo that deploy some needed canisters of IC from local machine
Preset will be written in script, see below

## Quick start
1. run `dfx`
```bash
dfx start --clean # if you wish to have a clean env from scratch, add --clean, a separate command window is recommended
```
2. run script
```bash
npm install && npm run deploy
```
3. check configs
In {name}_config.json, we have canister id generated automatically, `PRODUCTION_` is for mainnet, `LOCAL_` is for local machine.
Each time you run deploy script, these canister id will change due to `--clean` option in script

## Canisters
* Internet Identity
* Ledger Canister
* NNS Canister
* Bitcoin Canister(TBD)