function createProjectile(source,sx,sy,dx,dy,spd,triggerR,dmg,isAOE,isMagic,dmgR){

    projectileCount++;
    projectileSet[projectileCount]={
        source:source,
        X:sx,
        Y:sy,
        direction:{
            X:dx/Math.sqrt(dx**2+dy**2),
            Y:dy/Math.sqrt(dx**2+dy**2)
        },
        speed:spd,
        triggerR:triggerR,
        isAOE:isAOE,
        isMagic:isMagic,
        damage:dmg,
        damageR:dmgR,
        type:"trace",
        isExpired:0,
    }
}
function projectileMove(){
    for(let i=1;i<=projectileCount;i++){
        if(projectileSet[i].isExpired){
            continue;
        }
        for(let j=1;j<=projectileSet[i].speed*2;j++){
            if(projectileSet[i].isExpired){
                break;
            }
            projectileSet[i].X+=0.5*projectileSet[i].direction.X;
            projectileSet[i].Y+=0.5*projectileSet[i].direction.Y;
            if(isProjectileTriggered1(i)||(!isPosLegal(projectileSet[i].X,projectileSet[i].Y))){
                console.log("projectile triggered");
                triggerProjectile(i);
            }
        }
    }
}
function isProjectileTriggered1(Pcount){
    let sign=0;
    for(let i=1;i<=enemyCount;i++){
        if(distanceEnemyToProjectile(i,Pcount)<=projectileSet[Pcount].triggerR&&enemy[i].isDefeat==0){
            sign=1;
        }
    }
    block.forEach(bloc=>{
        if(distanceBetweenEntity(bloc,projectileSet[Pcount])<=projectileSet[Pcount].triggerR&&bloc.isOnField&&!bloc.isProjectilePassable){
            sign=1;
        }
    })
    return sign;
}
function triggerProjectile(Pcount){
    if(projectileSet[Pcount].isAOE){
        for(let i=1;i<=enemyCount;i++){
            if(distanceEnemyToProjectile(i,Pcount)<=projectileSet[Pcount].damageR&&enemy[i].isDefeat==0){
                dealDamage(i,projectileSet[Pcount].damage,projectileSet[Pcount].isMagic);
            }
        }
        console.log(`damage dealt`);
    }
    else{
        let minD=100;
        let minE=0;
        for(let e=1;e<=enemyCount;e++){
            if(enemy[e].isDefeat==0&&distanceEnemyToProjectile(e,Pcount)<=projectileSet[Pcount].triggerR&&distanceEnemyToProjectile(e,Pcount)<minD){
                minD=distanceEnemyToProjectile(e,Pcount);
                minE=e;
            }
        }
        if(minE!=0){
            dealDamage(minE,projectileSet[Pcount].damage,projectileSet[Pcount].isMagic);
        }
    }
    projectileSet[Pcount].isExpired=1;
}
function clearProjectile(){
    for(let i=1;i<=projectileCount;i++){
        projectileSet[i].isExpired=1;
    }
}