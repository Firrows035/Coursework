var choiceChosen;
var cooldownPerTurn=1;

function preset(){
    addSkill(fireball,5,1,"fireball.png","fireball-cd.png",()=>{});
    addSkill(flashmove,5,3,"flash.jpg","flash-cd.jpg",()=>{});
    addSkill(sacrificialStrike,0,9,"sacriPunch.png","sacriPunch-cd.png",sacriStrikeSelector);
    loadmap(0);
}
function beginTurn(){
    summonEnemy("Enemy1.jpg",min(20,2+round));
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
    choiceChosen=0;
    setChoice();
}

function drawBattlefield(){
  
    clearCanvas();
    
    
    checkEnemyStat();

    drawMesh();
    drawBlocks();
    drawKeys();
    drawImgZoom("Lagrange.jpg",player.X*50+5,player.Y*50+5,40,40);
    drawPlayerAttackRange();
    activateEffectsAll();
    projectileMove();
    
    drawProjectile();
    checkEnemyStat();
    drawEnemy();
    drawEnemyStat();
    drawPlayerStat();
    
    enemyAction();
    activateBlockEffectAll();
    cdDown(cooldownPerTurn);
    drawSkillStat();
    setTimeout(() => {
        clearBattlefield();

        drawMesh();
        drawBlocks();
        drawKeys();
        drawImgZoom("Lagrange.jpg",player.X*50+5,player.Y*50+5,40,40);
        drawPlayerAttackRange();
        drawProjectile();

        checkEnemyStat();
        drawEnemy();
        drawEnemyStat();

        checkPlayerStat();
        checkScene();
    }, 80);
    if(player.mp<player.mmp*0.3){
        recoverMP(player.mmp*0.01);
    }
    drawPlayerStat();
   
}

function drawBattlefieldStatic(){
    clearCanvas();
    drawMesh();
    drawBlocks();
    drawKeys();
    drawImgZoom("Lagrange.jpg",player.X*50+5,player.Y*50+5,40,40);
    drawPlayerAttackRange();
    drawEnemy();
    drawProjectile();
    drawSkillStat();
    drawPlayerStat();
    drawEnemyStat();
}


