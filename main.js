var cooldownPerTurn=1;

function preset(){
    addSkill("fireball");
    addSkill("flashmove");
    addSkill("sacriStrike");
    addSkill("heal");
    loadMap(0);
}
function characterPage(){
    clearCanvas();
    drawMesh();
    drawText("选择角色",50,80,"black","60px 微软雅黑",1000,90,true);
    drawCharacterChoice();
}
function beginRound(){
    round++;
    loadMap(random(0,map.length-1));
    summonEnemy(enemyType[0],min(20,2+round));
    requestAnimationFrame(drawBattlefield);
}
function frontPage(){
    clearCanvas();
    context.fillStyle="black";
    context.font="100px Arial";
    context.fillText("Simple Turn Fight",200,300); 
    context.font="50px Arial";
    context.fillText("Click to Start",200,450);
    currentStage="startReady";
}

function failurePage(){
    clearBattlefield();
    context.fillStyle="black";
    context.font="100px Arial";
    context.fillText("You died!",300,200);
    context.font="50px Arial";
    context.fillText(`Enemy Defeated: ${enemyDefeated}`,300,300);
}

function intermissonPage(){
    clearBattlefield();
    context.fillStyle="black";
    context.font="100px Arial";
    context.fillText("Turn "+round+" Cleared!",200,200);
    context.font="50px Arial";
    context.fillText(`Enemy Defeated: ${enemyDefeated}`,200,300);
    context.fillText("Click to Continue",200,400);
    if(!choiceChosen) drawChoiceSlot();
}

function drawBattlefield(){
    clearCanvas();
    //player's turn
    activateEffects(player,"turnStart");
    
    
    drawPlayerEffects();
    drawMesh();
    drawBlocks();
    drawKeys();
    drawImgZoom(player.source,player.X*50+5,player.Y*50+5,40,40);
    drawPlayerAttackRange();
    
    projectileMove();

    activateBlockEffectAll();
    activateEnemyEffects("turnEnd");

    checkEnemyStat();
    
    drawProjectile();
    drawEnemy();
    drawEnemyStat();
    drawPlayerStat();
    
    //enemy turn
    activateEnemyEffects("turnStart");
    enemyAction();
    
    cdDown(cooldownPerTurn);
    drawSkillStat();
    setTimeout(() => {
        clearBattlefield();

        drawMesh();
        drawBlocks();
        drawKeys();
        drawImgZoom(player.source,player.X*50+5,player.Y*50+5,40,40);
        drawPlayerAttackRange();
        drawProjectile();

        checkEnemyStat();
        drawEnemy();
        drawEnemyStat();
        activateEffects(player,"turnEnd");
        drawPlayerEffects();
        checkPlayerStat();
        drawPlayerStat();
        checkScene();
    }, 80);
    if(player.mp<player.mmp*0.3){
        recoverMP(player.mmp*0.01);
    }
    
   
}

function drawBattlefieldStatic(){
    clearCanvas();
    drawMesh();
    drawBlocks();
    drawKeys();
    drawImgZoom(player.source,player.X*50+5,player.Y*50+5,40,40);
    drawPlayerAttackRange();
    drawEnemy();
    drawProjectile();
    drawSkillStat();
    drawPlayerStat();
    drawEnemyStat();
    drawPlayerEffects();
}


