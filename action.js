function playerMove(direction){
    if(!onBattle){
        return;
    }
    if(actionCooldown){
        return;
    }
    actionCooldown=1;
    setTimeout(()=>{actionCooldown=0;},100);
    let xtemp=player.X;
    let ytemp=player.Y;
    switch(direction){
        case "w":
            player.Y=Math.max(player.Y-1,0);
            break;
        case "a":
            player.X=Math.max(player.X-1,0);
            break;
        case "s":
            player.Y=Math.min(player.Y+1,12);
            break;
        case "d":
            player.X=Math.min(player.X+1,20);
            break;
        case " ":
            break;
        default:
            return;
    }
    if(!isPosAvaliable(player.X,player.Y)){
        player.X=xtemp;
        player.Y=ytemp;
    }
    if(onBattle){
        requestAnimationFrame(drawBattlefield);
    }
}

function playerSkill(num){
    if(actionCooldown){
        return;
    }
    if(num<1||num>skillCount){
        return;
    }
    if(skillSet[num].cdt>0){
        return;
    }
    if(skillSet[num].cost>player.mp){
        console.log("Cast Failed: No Enough MP");
        return;
    }
    else{
        actionCooldown=1;
        setTimeout(()=>{actionCooldown=0;},100);
        skillReady=num;
        return num;
    }
} 



//randomly move or halt
function enemyMove(count,direction){
    let xtemp=enemySet[count].X;
    let ytemp=enemySet[count].Y;
    switch(direction){
        case 0:
            enemySet[count].Y=Math.max(enemySet[count].Y-1,0);
            break;
        case 1:
            enemySet[count].X=Math.max(enemySet[count].X-1,0);
            break;
        case 2:
            enemySet[count].Y=Math.min(enemySet[count].Y+1,12);
            break;
        case 3:
            enemySet[count].X=Math.min(enemySet[count].X+1,20);
            break;
        case 5:
            return;
        default:
            return;
    }
    if(!isPosAvaliable(enemySet[count].X,enemySet[count].Y)){
        enemySet[count].X=xtemp;
        enemySet[count].Y=ytemp;
        enemyMove(count,Math.floor(Math.random()*100)%5);
    }
}
function enemyApproachPlayer(count){
    let xtemp=enemySet[count].X;
    let ytemp=enemySet[count].Y;
    if(Math.abs(directionEnemyToPlayer(count)[0])>=Math.abs(directionEnemyToPlayer(count)[1])){
        enemySet[count].X+=Math.sign(directionEnemyToPlayer(count)[0]);
        if(!isPosAvaliable(enemySet[count].X,enemySet[count].Y)){
            enemySet[count].X=xtemp;
            enemySet[count].Y+=Math.sign(directionEnemyToPlayer(count)[1]);
            if(!isPosAvaliable(enemySet[count].X,enemySet[count].Y)){
                enemySet[count].Y=ytemp;
                return;
            }
        }
    }
    else{
        enemySet[count].Y+=Math.sign(directionEnemyToPlayer(count)[1]);
        if(!isPosAvaliable(enemySet[count].X,enemySet[count].Y)){
            enemySet[count].Y=ytemp;
            enemySet[count].X+=Math.sign(directionEnemyToPlayer(count)[0]);
            if(!isPosAvaliable(enemySet[count].X,enemySet[count].Y)){
                enemySet[count].X=xtemp;
                return;
            }
        }
    }
    if(!isPosAvaliable(enemySet[count].X,enemySet[count].Y)){
        enemySet[count].X=xtemp;
        enemySet[count].Y=ytemp;
        enemyMove(count,Math.floor(Math.random()*100)%5);
    }
}

function enemyAction(){
    for(let i=1;i<=enemyCount;i++){
        if(enemySet[i].isDefeat){
            continue;
        }
        let r=Math.floor(Math.random()*100);
        if(distanceEnemyToPlayer(i)>10){
            enemyMove(i,r%5);
        }
        else if(distanceEnemyToPlayer(i)>1){
            enemyApproachPlayer(i);
        }
        enemyAttack(i);
    }
}

function isPosAvaliable(x,y){
    let c=0;
    for(let i=1;i<=enemyCount;i++){
        if(enemySet[i].X==x&&enemySet[i].Y==y&&enemySet[i].isDefeat==0){
            c++;
        }
    }
    if(player.X==x&&player.Y==y){
        c++;
    }
    return c<=1;
}

function distanceEnemyToPlayer(count){
    return Math.abs(player.X-enemySet[count].X)+Math.abs(player.Y-enemySet[count].Y);
}
function directionEnemyToPlayer(count){
    return [player.X-enemySet[count].X,player.Y-enemySet[count].Y];
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
                triggerProjectile(i);
            }
        }
    }
}

function distanceEnemyToProjectile(Ecount,Pcount){
    return Math.sqrt((enemySet[Ecount].X-projectileSet[Pcount].X)**2+(enemySet[Ecount].Y-projectileSet[Pcount].Y)**2);
}

function isProjectileTriggered1(Pcount){
    for(let i=1;i<=enemyCount;i++){
        if(distanceEnemyToProjectile(i,Pcount)<=projectileSet[Pcount].triggerR&&enemySet[i].isDefeat==0){
            console.log("triggered");
            
            return 1;
        }
    }
    return 0;
}

function triggerProjectile(Pcount){
    for(let i=1;i<=enemyCount;i++){
        if(distanceEnemyToProjectile(i,Pcount)<=projectileSet[Pcount].damageR){
            enemySet[i].hp=Math.max(enemySet[i].hp-projectileSet[Pcount].damage*(100-enemySet[i].mdf)/100,0);
        }
    }
    projectileSet[Pcount].isExpired=1;
}

function isPosLegal(x,y){
    if(x<=20&&x>=0&&y<=12&&y>=0)return 1;
    else return 0;
}