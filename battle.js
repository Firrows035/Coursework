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
        }
    // }
    return source;
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
function playerAttack(){
    for(let i=1;i<=enemyCount;i++){
        if(enemy[i].isDefeat){
            continue;
        }
        if(distanceEnemyToPlayer(i)<=player.atkR&&!isPathBlocked(enemy[i].X,enemy[i].Y,player.X,player.Y)){
            dealDamage(i,player.atk,false);
        }
    }
}
function playerHeal(hp){
    player.hp=Math.min(player.hp+hp,player.mhp);
}

function flashmove(event){
    if(onBattle){
        let x=Math.floor(event.offsetX*scaleX/50);
        let y=Math.floor(event.offsetY*scaleY/50);
        if(x==player.X&&y==player.Y){
            return 0;
        }
        let xtemp=player.X;
        let ytemp=player.Y;
        player.X=x;
        player.Y=y;
        if(isPosAvaliableLE1(x,y)&&isPosLegal(x,y)){
            requestAnimationFrame(drawBattlefield);
            return 1;
        }
        else{
            player.X=xtemp;
            player.Y=ytemp;
            return 0;
        }
    }
}
function fireball(event){
    if(onBattle){
        let x=Math.floor(event.offsetX*scaleX/50);
        let y=Math.floor(event.offsetY*scaleY/50);
        console.log(x,y);
        let dx=x-player.X;
        let dy=y-player.Y;
        if(dx==0&&dy==0){
            return 0;
        }
        createProjectile("fireball.png",player.X,player.Y,dx,dy,3,1,player.mat*2,true,true,3);
        requestAnimationFrame(drawBattlefield);
        return 1;
    }
    else{
        return 0;
    }
}
function sacrificialStrike(event){
    if(onBattle){
        if(player.hp<=player.mhp*0.1){
            return 0;
        }
        player.hp=max(1,player.hp-player.mhp*0.2);
        for(let e=enemyCount-enemyInround+1;e<=enemyCount;e++){
            if(enemy[e].isDefeat==0&&distanceEnemyToPlayer(e)<=6){
                dealDamage(e,player.atk*5.5,false);
            }
        }
        requestAnimationFrame(drawBattlefield);
        return 1;
    }
}


function clearProjectile(){
    for(let i=1;i<=projectileCount;i++){
        projectileSet[i].isExpired=1;
    }
}

function checkPlayerStat(){
    if(player.hp<=0){
        onBattle=0;
        clearProjectile();
        setTimeout(()=>{requestAnimationFrame(failurePage)},50);
    }
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

function checkScene(){
    if(onBattle&&enemyAlive==0){
        onBattle=0;
        intermisson=1;
        clearProjectile();
        setTimeout(()=>{requestAnimationFrame(intermissonPage)},50);
    }
}

function cdDown(t){
    for(let i=1;i<=skillCount;i++){
        skillSet[i].cdt=Math.max(skillSet[i].cdt-t,0);
    }
}

function dealDamage(ec,dmg,isMagic){
    if(isMagic){
        enemy[ec].hp=max(0,enemy[ec].hp-max(dmg*0.05,dmg*(1-enemy[ec].mdf/100))*(1+boost.player.dmg/100))
    }
    else{
        enemy[ec].hp=max(0,enemy[ec].hp-max(dmg*0.05,dmg-enemy[ec].def)*(1+boost.player.dmg/100));
    }
}
function takeDamage(dmg,isMagic){
    if(isMagic){
        player.hp=max(0,player.hp-max(dmg*0.05,dmg*(1-player.mdf/100))*(1+boost.enemy.dmg/100))
    }
    else{
        player.hp=max(0,player.hp-max(dmg*0.05,dmg-player.def)*(1+boost.enemy.dmg/100));
    }
}

function updatePlayerStat(){
    player.mhp=player.baseMhp*(1+boost.player.mhp/100);
    player.mmp=player.baseMmp*(1+boost.player.mmp/100);
    player.def=player.baseDef*(1+boost.player.def/100);
    player.atk=player.baseAtk*(1+boost.player.atk/100);
    player.mat=player.baseMat*(1+boost.player.mat/100);
    player.mdf=player.baseMdf*(1+boost.player.mdf/100);
    player.dmgBoost=1+boost.player.dmg/100;   
    player.atkR=player.baseAtkR+boost.player.atkR;
}
