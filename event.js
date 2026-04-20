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
            currentStage="prologue";
            characterPage();  
            return 1;      
        }else{
            console.log(`Loading resources. Please wait...`);
            return 0;
        }
    }
    if(currentStage=="prologue"){
        checkOnClick();
    }
    if(currentStage=="battle"&&skillReady){
        if(isPosLegal(mouseX,mouseY)){
            if(skill[skillReady].spell(event)){
                skill[skillReady].cdt=skill[skillReady].cd+1;
                player.mp-=skill[skillReady].cost;
            }
            skill[skillReady].isSelected=0;
            skillReady=0;
            drawSkillStat();
        }else{
            skill[skillReady].isSelected=0;
            skillReady=0;
            checkOnClick();
        }      
    }else if(currentStage=="intermission"&&choiceChosen){
        currentStage="battle";
        boost.enemy.atk+=5;
        boost.enemy.mhp+=5;
        recoverHP(Math.max((player.mhp-player.hp)*0.8,player.mhp*0.2));
        recoverMP(Math.max((player.mmp-player.mp)*0.5,player.mmp*0.2));
        beginRound();
    }else{
        checkOnClick();
    }
}
function onMouseMove(event){
    
    if(mouseMoveCd){
        return;
    }
    mouseMoveCd=1;
    setTimeout(()=>{
        mouseMoveCd=0;
    },20);
    // console.log(event);
    rect=canvas.getBoundingClientRect();
    scaleX=canvas.width/rect.width;
    scaleY=canvas.height/rect.height;
    mouseOffsetX=event.offsetX*scaleX;
    mouseOffsetY=event.offsetY*scaleY;
    let mx=floor(event.offsetX*scaleX/50);
    let my=floor(event.offsetY*scaleY/50);
    mouseX=mx;
    mouseY=my;
    if(currentStage=="prologue"){
        characterPage();
    }
    if(currentStage=="battle"){
        drawBattlefieldStatic();

        if(isPosLegal(mx,my)){
            drawBlockSelector(mx,my,"red");
        }
    }
    if(currentStage=="intermission"){
        intermissonPage();
    }
    checkSelector();
    
}
function keyPress(e){
        console.log(e.key);
        e.preventDefault();
    if(e.key=="w"||e.key=="a"||e.key=="s"||e.key=="d"||e.key==" "){
        
        if(skillReady){
            skill[skillReady].isSelected=0;
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
    let isTroopSelected=0;
    enemy.forEach(emy=>{
        emy.updateSelector();
        if(isTargetOnMouseOver(emy)&&currentStage=="battle"&&!emy.isDefeat){
            emy.onMouseOver();
            isTroopSelected=1;
        }
    })
    skill.forEach(skil=>{
        if(isTargetOnMouseOver(skil)&&currentStage=="battle"){
            skil.onMouseOver();
        }
    })
    player.updateSelector();
    if(isTargetOnMouseOver(player)&&currentStage=="battle"){
        player.onMouseOver();
        isTroopSelected=1;
    }
    key.forEach(k=>{
        if(isTargetOnMouseOver(k)&&currentStage=="battle"){
            k.onMouseOver();
        }
    })
    choiceSlot.forEach(slot=>{
        if(isTargetOnMouseOver(slot)&&currentStage=="intermission"&&!choiceChosen){
            slot.onMouseOver();
        }
    })
    character.forEach(chara=>{
        if(isTargetOnMouseOver(chara)&&currentStage=="prologue"){
            chara.onMouseOver();
        }
    })
    if(!isTroopSelected)
    block.forEach(bloc=>{
        if(isTargetOnMouseOver(bloc)&&currentStage=="battle"){
            bloc.onMouseOver();
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
    skill.forEach(skil=>{
        if(isTargetOnMouseOver(skil)&&currentStage=="battle"){
            skil.onClick();
        }
    })
    player.updateSelector();
    if(isTargetOnMouseOver(player)&&currentStage=="battle"){
        player.onClick();
    }
    choiceSlot.forEach(slot=>{
        if(isTargetOnMouseOver(slot)&&currentStage=="intermission"&&!choiceChosen){
            slot.onClick();
        }
    })
    character.forEach(chara=>{
        if(isTargetOnMouseOver(chara)&&currentStage=="prologue"){
            chara.onClick();
        }
    })
}
function isTargetOnMouseOver(target){
    if(target.selector.offsetX<mouseOffsetX&&target.selector.offsetY<mouseOffsetY&&target.selector.offsetX+target.selector.width>mouseOffsetX&&target.selector.offsetY+target.selector.height>mouseOffsetY) return true;
    else return false;
}