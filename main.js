function preset(){
    addSkill(fireball,5,1,"fireball.png");
    addSkill(flashmove,5,3,"Lagrange.jpg");
}
function beginTurn(){
    summonEnemy("Enemy1.jpg",2+turn);
    requestAnimationFrame(drawBattlefield);
}
function frontPage(){
    clearCanvas();
    context.fillStyle="black";
    context.font="100px Arial";
    context.fillText("Simple Turn Fight",200,300); 
    context.font="50px Arial";
    context.fillText("Click to Start",200,450);
    startReady=1;
}

function failurePage(){
    clearBattlefield();
    context.fillStyle="black";
    context.font="100px Arial";
    context.fillText("You died!",300,200);
    context.font="50px Arial";
    context.fillText("Enemy Defeated: "+enemyDefeated,300,300);
}

function intermissonPage(){
    clearBattlefield();
    context.fillStyle="black";
    context.font="100px Arial";
    context.fillText("Turn "+turn+" Cleared!",300,200);
    context.font="50px Arial";
    context.fillText("Enemy Defeated: "+enemyDefeated,300,300);
    context.fillText("Click to Continue",300,400);
}

function drawBattlefield(){
  
    clearCanvas();
    enemyAction();
    playerAttack();
    checkEnemyStat();
    drawMesh();
    drawImgZoom("Lagrange.jpg",player.X*50,player.Y*50,50,50);
    projectileMove();
    checkEnemyStat();
    if(player.mp<player.mmp*0.3){
        recoverMP(player.mmp*0.01);
    }
    cdDown(1);
    drawEnemy();
    setTimeout(()=>{drawEnemyStat();},50);
    drawProjectile();
    drawPlayerStat();
    checkPlayerStat();
    checkScene();
}

function addSkill(func,cost,cd,source){
    if(skillCount<9){
        skillCount++;
        skillSet[skillCount]={
            skill:func,
            cost:cost,
            cd:cd,
            cdt:0,
            source:source,
        }
        loadImg(source);
        return 1;
    }
    return 0;
}

var choice1=document.createElement("div");