function summonEnemy(source,quantity){
    for(let i=1;i<=quantity;i++){
        addEnemy(source);
    }
    enemyInturn=quantity;
    for(let i=enemyCount-quantity+1;i<=enemyCount;i++){
        placeEnemy(i,10);
    }
}
function placeEnemy(c,attempt){
    let xtemp=Math.floor(Math.random()*1000)%21;
    let ytemp=Math.floor(Math.random()*1000)%12;
    enemySet[c].X=xtemp;
    enemySet[c].Y=ytemp;
    if(!isPosAvaliable(xtemp,ytemp)||distanceEnemyToPlayer(c)<=5){
        if(attempt>0){
            placeEnemy(c,attempt-1);
        }
        else{
            enemySet[c].isDefeat=1;
            enemyInturn--;
            return 0;
        }
    }
    return 1;
}


function addEnemy(source){
    // if(!enemySet[name]){
        loadImg(source);
        enemyCount++;
        enemyAlive++;
        enemySet[enemyCount]={
            appear:source,

            atk:10*(1+boost.enemy.atk/100),
            hp:80*(1+boost.enemy.mhp/100),
            mhp:80*(1+boost.enemy.mhp/100),
            def:0+boost.enemy.def,
            mat:15*(1+boost.enemy.mat),
            mdf:0+boost.enemy.mdf,
            dmgBoost:1+boost.enemy.dmg/100,

            atktype:1,
            X:0,
            Y:0,
            isDefeat:0,
        }
    // }
    return source;
}


function setEnemy(count,x,y){
    if(!enemySet[count]){
        return console.error("enemy id not found");
    }
    // drawImgZoom(enemySet[count].appear,x*50,y*50,50,50);
    enemySet[count].X=x;
    enemySet[count].Y=y;
}

function enemyAttack(count){
    if(enemySet[count].atktype==1&&distanceEnemyToPlayer(count)<=1&&Math.random()<0.6&&enemySet[count].isDefeat==0){
        player.hp=Math.max(player.hp-Math.max(enemySet[count].atk-player.def,enemySet[count].atk*0.1)*enemySet[count].dmgBoost,0);
    }
}
function playerAttack(){
    for(let i=1;i<=enemyCount;i++){
        if(enemySet[i].isDefeat){
            continue;
        }
        if(distanceEnemyToPlayer(i)<=1){
            enemySet[i].hp=Math.max(enemySet[i].hp-player.atk*100/(100+enemySet[i].def),0);
        }
    }
}
function playerHeal(hp){
    player.hp=Math.min(player.hp+hp,player.mhp);
}

function flashmove(event){
    if(onBattle){
        let x=Math.floor(event.offsetX/50);
        let y=Math.floor(event.offsetY/50);
        let xtemp=player.X;
        let ytemp=player.Y;
        player.X=x;
        player.Y=y;
        if(isPosAvaliable(x,y)&&isPosLegal(x,y)){
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

    //Silly AI code. does not work as expected.
    // const dx = x - player.x;
    // const dy = y - player.y;
    // const distance = Math.sqrt(dx * dx + dy * dy);
    // const dirX = dx / distance;
    // const dirY = dy / distance;

    // let fireballX = player.x;
    // let fireballY = player.y;
    // const speed = 5;
    // const explosionRadius = 50;
    // const damage = player.atk * 150 / 100;

    // const fireballInterval = setInterval(() => {
    //     fireballX += dirX * speed;
    //     fireballY += dirY * speed;

    //     for (let i = 1; i <= enemyCount; i++) {
    //         if (enemySet[i].isDefeat) continue;
    //         const dist = Math.hypot(fireballX - enemySet[i].x, fireballY - enemySet[i].y);
    //         if (dist < explosionRadius) {
    //             enemySet[i].hp = Math.max(enemySet[i].hp - damage, 0);
    //             if (enemySet[i].hp <= 0) {
    //                 enemySet[i].isDefeat = 1;
    //             }
    //             clearInterval(fireballInterval);
    //             return;
    //         }
    //     }

    //     if (Math.hypot(fireballX - x, fireballY - y) > distance) {
    //         clearInterval(fireballInterval);
    //     }
    // }, 30);

    if(onBattle){
        let x=Math.floor(event.offsetX/50);
        let y=Math.floor(event.offsetY/50);
        console.log(x,y);
        let dx=x-player.X;
        let dy=y-player.Y;
        createProjectile("fireball.png",player.X,player.Y,dx,dy,3,1,player.mat*1.2,true,3);
        requestAnimationFrame(drawBattlefield);
        return 1;
    }
    else{
        return 0;
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
function checkEnemyStat(){
    for(let i=1;i<=enemyCount;i++){
        if(!enemySet[i].isDefeat){
            if(enemySet[i].hp<=0){
                enemySet[i].isDefeat=1;
                enemyDefeated++;
                enemyAlive--;
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