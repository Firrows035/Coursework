var projectile=[];
var projectileType=new Map();
var projectileCount=0;
projectileType.set("fireball",{
    id:"fireball",
    source:"fireball.png",
    X:0,
    Y:0,
    speed:3,
    triggerR:1,
    isAOE:true,
    damageR:3,
    isMagic:true,
    isSelectable:false,
    isFriendly:true,
    isTriggered:false,
    selector:{
        type:"projectileType",
        color:"red",
        offsetX:0,
        offsetY:0,
        width:0,
        height:0,
        description:{
            id:"fireball",
            icon:"firebal.png",
            text:"fireball"
        }
    }
});
function createProjectile(projId,sx,sy,dx,dy,damage,isFriendly){
    projectileCount++;
    let type=projectileType.get(projId);
    projectile.push({
        id:type.id,
        number:projectileCount,
        source:type.source,
        X:sx,
        Y:sy,
        direction:{
            X:dx/Math.sqrt(dx**2+dy**2),
            Y:dy/Math.sqrt(dx**2+dy**2)
        },
        trace:findRayTrace(sx,sy,sx+dx,sy+dy,false),
        speed:type.speed,
        triggerR:type.triggerR,
        isAOE:type.isAOE,
        isMagic:type.isMagic,
        isFriendly:type.isFriendly,
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
        if(!proj.isTriggered)console.log("proj-"+proj.number+` ${tempX},${tempY} => ${proj.X},${proj.Y}`);
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
    console.log(proj.number+" triggered");
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
    }
    proj.isTriggered=true;;
}
function clearTriggeredProjectile(){
    projectile=projectile.filter((proj)=>!proj.isTriggered);
}