var projectile=[];
var projectileType={};
var projectileCount=0;
projectileType.fireball={
    id:"fireball",
    source:"fireball.png",
    X:0,
    Y:0,
    speed:3,
    triggerR:1,
    isAOE:true,
    damageR:1,
    isMagic:true,
    isSelectable:false,
    isFriendly:true,
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
}
function createProjectile(projId,sx,sy,dx,dy,damage,isFriendly){
    projectileCount++;
    let type=projectileType[projId];
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
        speed:type.speed,
        triggerR:type.triggerR,
        isAOE:type.isAOE,
        isMagic:type.isMagic,
        isFriendly:type.isFriendly,
        damage:damage,
        damageR:type.damageR,
        isSelectable:false,
        selector:{
            type:"trace",
        },
        isExpired:0,
    })
}
function projectileMove(){
    projectile.forEach(proj=>{
        let tempX=proj.X,tempY=proj.Y;
        for(let i=0;i<proj.speed*2;i++){
            tempX+=0.5*proj.direction.X;
            tempY+=0.5*proj.direction.Y;
            proj.X=floor(tempX);
            proj.Y=floor(tempY);
            if(isProjectileTriggered(proj)){
                triggerProjectile(proj);
            }
        }
        proj.X=tempX;
        proj.Y=tempY;
    })
}
function isProjectileTriggered(proj){
    let sign=0;
    if(!isPosLegal(proj.X,proj.Y)) return true;
    if(proj.isFriendly){
        enemy.forEach(emy=>{
            if(distanceBetweenEntity(emy,proj)<proj.triggerR&&emy.isDefeat==0){
                sign=1;
            }
        })
    }else if(distanceBetweenEntity(player,proj)<proj.triggerR) sign=1;
    if(sign) return true;
    block.forEach(bloc=>{
        if(distanceBetweenEntity(bloc,proj)<proj.triggerR&&bloc.isOnField&&!bloc.isProjectilePassable){
            sign=1;
        }
    })
    if(sign) return true;
    else return false;
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
        enemy.forEach(emy=>{
            if(distanceBetweenEntity(proj,emy)<minD){
                minD=distanceBetweenEntity(proj,emy);
                target=emy;
            }
        })
        if(target!={}) dealDamage(target,proj.damage,proj.isMagic);
    }
    projectile.splice(projectile.findIndex(p=>p.number==proj.number));
}
function clearProjectile(){
    projectile=[];
}