//
var skillSet=[];
var skillCount=0;
var skillReady=0;

function addSkill(func,cost,cd,source,source_cd,displayFunc){
    if(skillCount<9){
        skillCount++;
        skillSet[skillCount]={
            skill:func,
            cost:cost,
            cd:cd,
            cdt:0,
            source:source,
            sourceCD:source_cd,
            isSelected:0,
            drawSelector:displayFunc,
            type:"skill",
        }
        return 1;
    }
    return 0;
}

function playSkill(num){
    if(actionCooldown){
        return 0;
    }
    if(player.hp==0){
        return 0;
    }
    if(num<1||num>skillCount){
        return 0;
    }
    if(skillSet[num].cdt>0){
        return 0;
    }
    if(skillSet[num].cost>player.mp){
        console.log("Cast Failed: No Enough MP");
        return 0;
    }
    else{
        if(skillReady!=0){
            skillSet[skillReady].isSelected=0;
        }
        actionCooldown=1;
        setTimeout(()=>{actionCooldown=0;},100);
        skillReady=num;
        skillSet[num].isSelected=1;
        drawBattlefieldStatic();
        skillSet[num].drawSelector(mouseX,mouseY);
        return num;
    }
} 
function cdDown(t){
    for(let i=1;i<=skillCount;i++){
        skillSet[i].cdt=Math.max(skillSet[i].cdt-t,0);
    }
}
//skills
function flashmove(event){
    if(currentStage=="battle"){
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
    if(currentStage=="battle"){
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
    if(currentStage=="battle"){
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