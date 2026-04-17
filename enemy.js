function addEnemy(source){
    // if(!enemy[name]){
        enemyCount++;
        enemyAlive++;
        enemy[enemyCount]={
            appear:source,

            atk:15*(1+boost.enemy.atk/100),
            hp:80*(1+boost.enemy.mhp/100),
            mhp:80*(1+boost.enemy.mhp/100),
            def:0+boost.enemy.def,
            mat:15*(1+boost.enemy.mat/100),
            mdf:0+boost.enemy.mdf,
            dmgBoost:1+boost.enemy.dmg/100,
            atkR:1+boost.enemy.atkR,
            warnR:10,
            atktype:1,
            X:0,
            Y:0,
            isDefeat:0,
            movePattern:"default",
            navigatePosition:[0,0],
            warnedTime:0,
            isUnderAttack:0,
            bio:``,
            effect:[],
            type:"entity",
        }
    // }
    return source;
}
function enemyMove(count,direction){
    let xtemp=enemy[count].X;
    let ytemp=enemy[count].Y;
    switch(direction){
        case 0:
            enemy[count].Y=Math.max(enemy[count].Y-1,0);
            break;
        case 1:
            enemy[count].X=Math.max(enemy[count].X-1,0);
            break;
        case 2:
            enemy[count].Y=Math.min(enemy[count].Y+1,12);
            break;
        case 3:
            enemy[count].X=Math.min(enemy[count].X+1,20);
            break;
        case 4:
            return;
        default:
            return;
    }
    if(!isPosAvaliableLE1(enemy[count].X,enemy[count].Y)){
        enemy[count].X=xtemp;
        enemy[count].Y=ytemp;
        enemyMove(count,random(0,4));
    }
}
function enemyApproachPlayer(count){
    let xtemp=enemy[count].X;
    let ytemp=enemy[count].Y;
    if(Math.abs(directionEnemyToPlayer(count)[0])>=Math.abs(directionEnemyToPlayer(count)[1])){
        enemy[count].X+=Math.sign(directionEnemyToPlayer(count)[0]);
        if(!isPosAvaliableLE1(enemy[count].X,enemy[count].Y)){
            enemy[count].X=xtemp;
            enemy[count].Y+=Math.sign(directionEnemyToPlayer(count)[1]);
            if(!isPosAvaliableLE1(enemy[count].X,enemy[count].Y)){
                enemy[count].Y=ytemp;
                return;
            }
        }
    }
    else{
        enemy[count].Y+=Math.sign(directionEnemyToPlayer(count)[1]);
        if(!isPosAvaliableLE1(enemy[count].X,enemy[count].Y)){
            enemy[count].Y=ytemp;
            enemy[count].X+=Math.sign(directionEnemyToPlayer(count)[0]);
            if(!isPosAvaliableLE1(enemy[count].X,enemy[count].Y)){
                enemy[count].X=xtemp;
                return;
            }
        }
    }
    if(!isPosAvaliableLE1(enemy[count].X,enemy[count].Y)){
        enemy[count].X=xtemp;
        enemy[count].Y=ytemp;
        enemyMove(count,random(0,4));
    }
}
function enemyMoveNavigated(count){
    if([enemy[count].X,enemy[count].Y]==enemy[count].navigatePosition){
        enemyMove(count,random(0,3));
        return;
    }
    if(isPosLegal(enemy[count].navigatePosition[0],enemy[count].navigatePosition[1])){
        let xtemp=enemy[count].X;
        let ytemp=enemy[count].Y;
        if(Math.abs(directionToPosition([enemy[count].X,enemy[count].Y],enemy[count].navigatePosition)[0])>=Math.abs(directionToPosition([enemy[count].X,enemy[count].Y],enemy[count].navigatePosition)[1])){
            enemy[count].X+=Math.sign(directionToPosition([enemy[count].X,enemy[count].Y],enemy[count].navigatePosition)[0]);
            if(!isPosAvaliableLE1(enemy[count].X,enemy[count].Y)){
                enemy[count].X=xtemp;
                enemy[count].Y+=Math.sign(directionToPosition([enemy[count].X,enemy[count].Y],enemy[count].navigatePosition)[1]);
                if(!isPosAvaliableLE1(enemy[count].X,enemy[count].Y)){
                    enemy[count].Y=ytemp;
                    return;
                }
            }
        }
        else{
            enemy[count].Y+=Math.sign(directionToPosition([enemy[count].X,enemy[count].Y],enemy[count].navigatePosition)[1]);
            if(!isPosAvaliableLE1(enemy[count].X,enemy[count].Y)){
                enemy[count].Y=ytemp;
                enemy[count].X+=Math.sign(directionToPosition([enemy[count].X,enemy[count].Y],enemy[count].navigatePosition)[0]);
                if(!isPosAvaliableLE1(enemy[count].X,enemy[count].Y)){
                    enemy[count].X=xtemp;
                    return;
                }
            }
        }
        if(!isPosAvaliableLE1(enemy[count].X,enemy[count].Y)){
            enemy[count].X=xtemp;
            enemy[count].Y=ytemp;
            enemyMove(count,random(0,4));
        }
    }

}
function enemyAction(){
    for(let i=1;i<=enemyCount;i++){
        if(enemy[i].isDefeat){
            continue;
        }

        if(enemy[i].movePattern=="default"){
            enemyMove(i,random(0,4));
        }
        else if(enemy[i].movePattern=="navigate"){
            enemyMoveNavigated(i);
        }
        else if(enemy[i].movePattern=="attack"){
            
        }
        if(enemyAttack(i)){
            enemy[i].movePattern="attack";
        }
    }
}
function summonEnemy(source,quantity){
    for(let i=1;i<=quantity;i++){
        addEnemy(source);
    }
    enemyInround=quantity;
    for(let i=enemyCount-quantity+1;i<=enemyCount;i++){
        placeEnemy(i,10);
    }
}
function placeEnemy(c,attempt){
    let xtemp=Math.floor(Math.random()*1000)%21;
    let ytemp=Math.floor(Math.random()*1000)%12;
    enemy[c].X=xtemp;
    enemy[c].Y=ytemp;
    if(!isPosAvaliableLE1(xtemp,ytemp)||distanceEnemyToPlayer(c)<=5||!isPosEnemyPlacable(xtemp,ytemp)){
        if(attempt>0){
            placeEnemy(c,attempt-1);
        }
        else{
            enemy[c].isDefeat=1;
            enemyInround--;
            return 0;
        }
    }
    return 1;
}
function setEnemy(count,x,y){
    if(!enemy[count]){
        return console.error("enemy id not found");
    }
    // drawImgZoom(enemy[count].appear,x*50,y*50,50,50);
    enemy[count].X=x;
    enemy[count].Y=y;
}
function enemyAttack(count){
    if(enemy[count].atktype==1&&distanceEnemyToPlayer(count)<=enemy[count].atkR&&Math.random()<0.8&&enemy[count].isDefeat==0&&!isPathBlocked(enemy[count].X,enemy[count].Y,player.X,player.Y)){
        takeDamage(enemy[count].atk,false);
        return 1;
    }
    return 0;
}

//修改enemy的状态机。default：若索敌范围内不可见player，随机移动；attack：player在攻击范围内，跟随玩家并尝试攻击；navigate：1. 索敌范围内可见玩家，将玩家位置修改为寻路地点；2. 索敌范围内不可见玩家，但此前处于寻路状态，继续寻路至目标地点附近直到到达、发现玩家或过长时间（因为每回合check三次所以要翻三倍）未发现玩家。
function checkEnemyStat(){
    for(let i=1;i<=enemyCount;i++){
        if(!enemy[i].isDefeat){
            if(enemy[i].hp<=0){
                enemy[i].isDefeat=1;
                enemyDefeated++;
                enemyAlive--;
                continue;
            }
            if(distanceEnemyToPlayer(i)<=enemy[i].atkR){
                enemy[i].movePattern="attack";
                enemy[i].warnedTime=15;
            }
            else if(distanceEnemyToPlayer(i)<=enemy[i].warnR&&!isPathBlocked(player.X,player.Y,enemy[i].X,enemy[i].Y)){
                enemy[i].movePattern="navigate";
                enemy[i].navigatePosition=[player.X,player.Y];
                enemy[i].warnedTime=30;
            }
            else if(enemy[i].movePattern!="navigate"||[enemy[i].X,enemy[i].Y]==enemy[i].navigatePosition||enemy[i].warnedTime==0){
                enemy[i].movePattern="default";
            }
            enemy[i].warnedTime--;
            if(distanceEnemyToPlayer(i)<=player.atkR&&!isPathBlocked(player.X,player.Y,enemy[i].X,enemy[i].Y)){
                enemy[i].isUnderAttack=1;
            }
            else{
                enemy[i].isUnderAttack=0;
            }
        }
    }
}