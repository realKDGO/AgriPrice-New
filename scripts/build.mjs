import {spawnSync} from 'node:child_process';
import {cp,rm} from 'node:fs/promises';
const result=spawnSync('npm',['run','build','-w','frontend'],{stdio:'inherit'});
if(result.status!==0)process.exit(result.status||1);
await rm('dist',{recursive:true,force:true});
await cp('frontend/dist','dist',{recursive:true});
