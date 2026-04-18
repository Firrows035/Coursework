function Click(event){
    rect=canvas.getBoundingClientRect();
    scaleX=canvas.width/rect.width;
    scaleY=canvas.height/rect.height;
    mouseOffsetX=event.offsetX*scaleX;
    mouseOffsetY=event.offsetY*scaleY;
    let X=floor(event.offsetX*scaleX/50);
    let Y=floor(event.offsetY*scaleY/50);
    mouseX=X;
    mouseY=Y;
    if(currentStage=="startReady"){
        if(imageReady){
            currentStage="battle";
            round++;
            beginTurn();            
        }else{
            console.log(`Loading resources. Please wait...`);
            return 0;
        }
    }
    if(skillReady){
        skillSet[skillReady].isSelected=0;
        if(skillSet[skillReady].skill(event)){
            skillSet[skillReady].cdt=skillSet[skillReady].cd+1;
            player.mp-=skillSet[skillReady].cost;
            skillReady=0;
        }else{
            skillReady=0;
            drawSkillStat();
        }
    }else if(currentStage=="intermission"&&choiceChosen){
        currentStage="battle";
        boost.enemy.atk+=5;
        boost.enemy.mhp+=5;
        recoverHP(Math.max((player.mhp-player.hp)*0.8,player.mhp*0.2));
        recoverMP(Math.max((player.mmp-player.mp)*0.5,player.mmp*0.2));
        round++;
        beginTurn();
    }else{
        checkOnClick();
    }
}
function onMouseMove(event){
    rect=canvas.getBoundingClientRect();
    scaleX=canvas.width/rect.width;
    scaleY=canvas.height/rect.height;
    if(mouseMoveCd||currentStage!="battle"){
        return;
    }
    mouseMoveCd=1;
    setTimeout(()=>{
        mouseMoveCd=0;
    },20);
    // console.log(event);
    mouseOffsetX=event.offsetX*scaleX;
    mouseOffsetY=event.offsetY*scaleY;
    let mx=floor(event.offsetX*scaleX/50);
    let my=floor(event.offsetY*scaleY/50);
    mouseX=mx;
    mouseY=my;
    // console.log(`${mx}, ${my}`);
    drawBattlefieldStatic();
    checkSelector();
    if(isPosLegal(mx,my)){
        drawBlockSelector(mx,my,"red");
    }
}
function keyPress(e){
        console.log(e.key);
        e.preventDefault();
    if(e.key=="w"||e.key=="a"||e.key=="s"||e.key=="d"||e.key==" "){
        
        if(skillReady){
            skillSet[skillReady].isSelected=0;
            skillReady=0;
            // drawSkillStat();
        }
        playerMove(e.key);
    }
    if(e.key>="1"&&e.key<="9"){
        playSkill(+e.key);
    }
}
function checkSelector(){
    enemy.forEach(emy=>{
        emy.updateSelector();
        if(isTargetOnMouseOver(emy)&&currentStage=="battle"){
            emy.onMouseOver();
        }
    })
    skillSet.forEach(skil=>{
        if(isTargetOnMouseOver(skil)&&currentStage=="battle"){
            skil.onMouseOver();
        }
    })
    player.updateSelector();
    if(isTargetOnMouseOver(player)&&currentStage=="battle"){
        player.onMouseOver();
    }
    key.forEach(k=>{
        if(isTargetOnMouseOver(k)&&currentStage=="battle"){
            k.onMouseOver();
        }
    })
}
function checkOnClick(){
    enemy.forEach(emy=>{
        if(isTargetOnMouseOver(emy)&&currentStage=="battle"){
            emy.onClick();
        }
    })
    key.forEach(k=>{
        if(isTargetOnMouseOver(k)&&currentStage=="battle"){
            k.onClick();
        }
    })
    skillSet.forEach(skil=>{
        if(isTargetOnMouseOver(skil)&&currentStage=="battle"){
            skil.onClick();
        }
    })
    player.updateSelector();
    if(isTargetOnMouseOver(player)&&currentStage=="battle"){
        player.onClick();
    }
}
function isTargetOnMouseOver(target){
    if(target.selector.offsetX<mouseOffsetX&&target.selector.offsetY<mouseOffsetY&&target.selector.offsetX+target.selector.width>mouseOffsetX&&target.selector.offsetY+target.selector.height>mouseOffsetY) return true;
    else return false;
}