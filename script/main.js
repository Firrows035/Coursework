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
    summonEnemy("Kanade",min(20,2+round));
    playerTurn("halt");
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

function playerTurn(act,target){
    if(currentStage!="battle") return 0;
    console.log(act);
    activateEffects(player,"player","TurnStart");
    activateEnemyEffects("player","TurnStart");
    player.action(act,target);
    for(let proj of projectile){
        if(isProjectileTriggered(proj))triggerProjectile(proj);
    }
    cdDown(cooldownPerTurn);
    activateEffects(player,"player","TurnMiddle");
    activateEnemyEffects("player","TurnMiddle");
    checkEnemyStat();
    checkPlayerStat();
    if(player.mp<player.mmp*0.3){
        recoverMP(player.mmp*0.01);
    }
    activateEffects(player,"player","TurnEnd");
    activateEnemyEffects("player","TurnEnd");
    drawBattlefieldStatic();
    checkScene();
    setTimeout(()=>neutralTurn(),20);
    
}
function neutralTurn(){
    activateBlockEffectAll();
    activateEffects(player,"neutral","TurnStart");
    activateEnemyEffects("neutral","TurnStart");
    projectileMove();
    for(let proj of projectile){
        if(isProjectileTriggered(proj))triggerProjectile(proj);
    }
    clearTriggeredProjectile();
    activateEffects(player,"neutral","TurnMiddle");
    activateEnemyEffects("neutral","TurnMiddle");
    checkEnemyStat();
    checkPlayerStat();
    activateEffects(player,"neutral","TurnEnd");
    activateEnemyEffects("neutral","TurnEnd");
    drawBattlefieldStatic();
    checkScene();
    setTimeout(()=>enemyTurn(),20);
}
function enemyTurn(){
    activateEffects(player,"enemy","TurnStart");
    activateEnemyEffects("enemy","TurnStart");

    for(let emy of enemy){
        emy.updateState();
        emy.action();
    }
    for(let proj of projectile){
        if(isProjectileTriggered(proj))triggerProjectile(proj);
    }
    clearTriggeredProjectile();
    activateEffects(player,"enemy","TurnMiddle");
    activateEnemyEffects("enemy","TurnMiddle");
    checkEnemyStat();
    checkPlayerStat();
    activateEffects(player,"enemy","TurnEnd");
    activateEnemyEffects("enemy","TurnEnd");
    drawBattlefieldStatic();
    checkScene();
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


