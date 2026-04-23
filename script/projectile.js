var projectile=[];

var projectileCount=0;

function createProjectile(projId,startX,startY,targetX,targetY,damage,isFriendly){
    projectileCount++;
    let type=projectileType.get(projId);
    projectile.push({
        id:type.id,
        number:projectileCount,
        source:type.source,
        X:startX,
        Y:startY,
        trace:findRayTrace(startX,startY,targetX,targetY,false),
        speed:type.speed,
        triggerR:type.triggerR,
        isAOE:type.isAOE,
        isMagic:type.isMagic,
        isFriendly:isFriendly,
        damage:damage,
        damageR:type.damageR,
        isSelectable:false,
        isTriggered:false,
        selector:{
            type:"trace",
        },
        isExpired:0,
    })
}

function projectileMove(){
    for(let proj of projectile){
        let tempX=proj.X,tempY=proj.Y;
        if(proj.speed==0){
            if(isProjectileTriggered(proj)){
                triggerProjectile(proj);
            }
            continue;
        }
        while(mathDistanceBetweenPosition(tempX,tempY,proj.X,proj.Y)<proj.speed){
            if(proj.trace.length==0){
                triggerProjectile(proj);
                break;
            }
            [proj.X,proj.Y]=proj.trace[0];
            proj.trace.splice(0,1);
            if(isProjectileTriggered(proj)){
                triggerProjectile(proj);
                break;
            } 
        }
    }
    clearTriggeredProjectile();
}
function isProjectileTriggered(proj){
    if(!isPosLegal(proj.X,proj.Y)) return true;
    if(proj.isFriendly){
        for(let emy of enemy){
            if(distanceBetweenEntity(emy,proj)<proj.triggerR&&emy.isDefeat==0){
                return 1;
            }
        }
    }else if(distanceBetweenEntity(player,proj)<proj.triggerR) return 1;
    for(let bloc of block){
        if(distanceBetweenEntity(bloc,proj)<1&&bloc.isOnField&&!bloc.isProjectilePassable){
            return 1;
        }
    }
    return 0;
}
function triggerProjectile(proj){
    if(proj.isAOE&&proj.isFriendly){
        enemy.forEach(emy=>{
            if(distanceBetweenEntity(emy,proj)<=proj.damageR&&emy.isDefeat==0){
                dealDamage(emy,proj.damage,proj.isMagic);
            }
        })
    }else if(proj.isFriendly){
        let minD=999;
        let target={};
        for(let emy of enemy){
            if(distanceBetweenEntity(proj,emy)<minD){
                minD=distanceBetweenEntity(proj,emy);
                target=emy;
            }
        }
        if(target!={}) dealDamage(target,proj.damage,proj.isMagic);
    }else{
        if(distanceBetweenEntity(proj,player)<=proj.damageR){
            takeDamage(proj.damage,proj.isMagic);
        }
    }
    proj.isTriggered=true;;
}
function clearTriggeredProjectile(){
    projectile=projectile.filter((proj)=>!proj.isTriggered);
}