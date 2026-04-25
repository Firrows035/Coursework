//已弃用
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
//已弃用
function playerMoveByClick(x,y){
    if(currentStage!="battle"){
        return;
    }
    if(actionCooldown){
        return;
    }
    actionCooldown=1;
    setTimeout(()=>{actionCooldown=0;},100);
    playerAttack();
    if(isPosAvailableL1(x,y)&&isPosLegal(x,y)){
        player.X=x;
        player.Y=y;
    }
    if(currentStage=="battle"){
        playerTurn();
    }
}
//已弃用
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

//已弃用
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

//已弃用
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

//已弃用
function addChoice(name,buff,description,weight,selectableTime){
    choiceCount++;
    choice[choiceCount]={
        name:name,
        buff:buff,
        description:description,
        weight:weight,
        selectableTime:selectableTime,
    }
    return choice[choiceCount];
}
//已弃用
function enemyAction(){
    for(let i=1;i<=enemyCount;i++){
        if(enemy[i].isDefeat){
            continue;
        }

        if(enemy[i].state=="default"){
            enemyMove(i,random(0,4));
        }
        else if(enemy[i].state=="navigate"){
            enemyMoveNavigated(i);
        }
        else if(enemy[i].state=="attack"){
            
        }
        if(enemyAttack(i)){
            enemy[i].state="attack";
        }
    }
}


//已弃用
function setEnemy(count,x,y){
    if(!enemy[count]){
        return console.error("enemy id not found");
    }
    enemy[count].X=x;
    enemy[count].Y=y;
}

//已弃用
function enemyAttack(count){
    if(enemy[count].atktype==1&&distanceEnemyToPlayer(count)<=enemy[count].atkR&&Math.random()<0.8&&enemy[count].isDefeat==0&&!isPathBlocked(enemy[count].X,enemy[count].Y,player.X,player.Y)){
        takeDamage(enemy[count].atk,false);
        return 1;
    }
    return 0;
}