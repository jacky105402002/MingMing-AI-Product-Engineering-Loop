import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
const tests=fs.readdirSync('tests').filter(p=>p.endsWith('.test.mjs')).map(p=>'tests/'+p);
for(const args of [['scripts/validate-workflow.mjs'],['--test',...tests]]){
  const r=spawnSync(process.execPath,args,{stdio:'inherit',shell:false,windowsHide:true});
  if(r.status!==0){process.exitCode=1;break;}
}
