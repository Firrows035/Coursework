var cooldownPerTurn=1;

function initialize(){
    currentStage="startReady";
    skill=new Map();
    enemy=[];
    projectile=[];
    setCharacter("Lagrange");
    player.effect=[];
    boost.player.atk=0;
    boost.player.def=0;
    boost.player.mat=0;
    boost.player.mdf=0;
    boost.player.mhp=0;
    boost.player.mmp=0;
    boost.player.dmg=0;
    boost.player.atkR=0;
    boost.enemy.atk=0;
    boost.enemy.def=0;
    boost.enemy.mat=0;
    boost.enemy.mdf=0;
    boost.enemy.mhp=0;
    boost.enemy.mmp=0;
    boost.enemy.dmg=0;
    boost.enemy.atkR=0;
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
    drawButton();
}
function beginRound(){
    round++;
    boost.enemy.atk+=min(5,round);
    boost.enemy.mhp+=min(5,round);
    if(round<=10){
        recoverHP(Math.max((player.mhp-player.hp)*0.8,player.mhp*0.2));
        recoverMP(Math.max((player.mmp-player.mp)*0.8,player.mmp*0.2));
    }else{
        recoverHP(Math.min((player.mhp-player.hp)*0.5,player.mhp*0.2));
        recoverMP(Math.min((player.mmp-player.mp)*0.5,player.mmp*0.2));
    }
    loadMap(random(0,map.length-1));
    summonEnemy("Kanade",min(20,2+round));
    if(round>=5){
        summonEnemy("Nene",random(1,floor(round/3)));
    }
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
    drawButton();
}
function pausePage(event){
    if(currentStage!="pause")lastStage=currentStage;
    currentStage="pause";
    clearCanvas();
    drawText("Game Paused",100,200,"black","100px Arial",1800,120,false);
    drawText("click to continue",100,400,"black","50px Arial",1800,80,false);
    drawButton();
}
function failurePage(){
    clearBattlefield();
    context.fillStyle="black";
    context.font="100px Arial";
    context.fillText("You died!",300,200);
    context.font="50px Arial";
    context.fillText(`Enemy Defeated: ${enemyDefeated}`,300,300);
    drawButton();
}

function intermissonPage(){
    drawBattlefieldStatic();
    clearBattlefield();
    context.fillStyle="black";
    context.font="100px Arial";
    context.fillText("Round "+round+" Compelete!",200,200);
    context.font="50px Arial";
    context.fillText(`Enemy Defeated: ${enemyDefeated}`,200,300);
    context.fillText("Click to Continue",200,400);
    if(!choiceChosen) drawChoiceSlot();
    drawButton();
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
    drawInfo();
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
    drawButton();
}


