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
    switch(currentStage){
        case "pause":
            pausePage();
            checkOnClick(event);
            break;
        case "startReady":
            frontPage();
            checkOnClick(event);
            break;
        case "prologue":
            characterPage();
            checkOnClick(event);
            break;
        case "battle":
            if(skillReady){
                let skil=skill.get(skillReady);
                if(isPosLegal(mouseX,mouseY)){
                    playerTurn("skill",event);
                }else{
                    skil.isSelected=0;
                    skillReady=0;
                    drawBattlefieldStatic();
                    checkOnClick(event);
                }
            }else{
                drawBattlefieldStatic();
                checkOnClick(event);
            }
            break;
        case "intermission":
            intermissonPage();
            checkOnClick(event);
            break;
        case "failure":
            failurePage();
            checkOnClick(event);
            break;
        default:
            checkOnClick(event);
            break;
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
            skill.get(skillReady).isSelected=0;
            skillReady=0;
            // drawSkillStat();
        }
        playerTurn("move",e.key);
    }
    if(e.key>="1"&&e.key<="9"&&currentStage=="battle"){
        prepareSkill(+e.key);
    }
}
function checkSelector(){
    for(let emy of enemy){
        emy.updateSelector();
        if(isTargetOnMouseOver(emy)&&currentStage=="battle"&&!emy.isDefeat){
            emy.onMouseOver();
            return;
        }
    }
    for(let [id,skil] of skill){
        if(isTargetOnMouseOver(skil)&&currentStage=="battle"){
            skil.onMouseOver();
            return;
        }
    }
    player.updateSelector();
    if(isTargetOnMouseOver(player)&&currentStage=="battle"){
        player.onMouseOver();
        return;
    }
    for(let k of key){
        if(isTargetOnMouseOver(k)&&currentStage=="battle"){
            k.onMouseOver();
            return;
        }
    }
    for(let slot of choiceSlot){
        if(isTargetOnMouseOver(slot)&&currentStage=="intermission"&&!choiceChosen){
            slot.onMouseOver();
            return;
        }
    }
    for(let [id,chara] of character){
        if(isTargetOnMouseOver(chara)&&currentStage=="prologue"){
            chara.onMouseOver();
            return;
        }
    }

    for(let bloc of block){
        if(isTargetOnMouseOver(bloc)&&currentStage=="battle"){
            bloc.onMouseOver();
            return;
        }
    }
    for(let eff of player.effect){
        if(isTargetOnMouseOver(eff)&&currentStage=="battle"){
            eff.onMouseOver();
            return;
        }
    }
}
function checkOnClick(){
    for(let emy of enemy){
        if(isTargetOnMouseOver(emy)&&currentStage=="battle"){
            emy.onClick();
            return;
        }
    }
    for(let k of key){
        if(isTargetOnMouseOver(k)&&currentStage=="battle"){
            k.onClick();
            return;
        }
    }
    for(let [id,skil] of skill){
        if(isTargetOnMouseOver(skil)&&currentStage=="battle"){
            skil.onClick();
            return;
        }
    }
    player.updateSelector();
    if(isTargetOnMouseOver(player)&&currentStage=="battle"){
        player.onClick();
        return;
    }
    for(let slot of choiceSlot){
        if(isTargetOnMouseOver(slot)&&currentStage=="intermission"&&!choiceChosen){
            slot.onClick();
            return;
        }
    }
    for(let [id,chara] of character){
        if(isTargetOnMouseOver(chara)&&currentStage=="prologue"){
            chara.onClick();
            return;
        }
    }
}
function isTargetOnMouseOver(target){
    if(target.selector.offsetX<mouseOffsetX&&target.selector.offsetY<mouseOffsetY&&target.selector.offsetX+target.selector.width>mouseOffsetX&&target.selector.offsetY+target.selector.height>mouseOffsetY) return true;
    else return false;
}