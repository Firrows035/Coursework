function Click(event){
    rect=canvas.getBoundingClientRect();
    scaleX=canvas.width/rect.width;
    scaleY=canvas.height/rect.height;    
    let X=floor(event.offsetX*scaleX/50);
    let Y=floor(event.offsetY*scaleY/50);
    if(currentStage=="startReady"){
        if(imageReady){
            currentStage="battle";
            round++;
            beginTurn();            
        }
        else{
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
        }
        else{
            skillReady=0;
            drawSkillStat();
        }
    }
    else if(distanceBetweenPosition(X,Y,player.X,player.Y)<=1){
        playerMoveByClick(X,Y);
    }
    if(currentStage=="intermission"&&choiceChosen){
        currentStage="battle";
        boost.enemy.atk+=5;
        boost.enemy.mhp+=5;
        recoverHP(Math.max((player.mhp-player.hp)*0.8,player.mhp*0.2));
        recoverMP(Math.max((player.mmp-player.mp)*0.5,player.mmp*0.2));
        round++;
        beginTurn();
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
    },50);
    // console.log(event);
    let mx=floor(event.offsetX*scaleX/50);
    let my=floor(event.offsetY*scaleY/50);
    mouseX=mx;
    mouseY=my;
    // console.log(`${mx}, ${my}`);
    if(isPosLegal(mx,my)){
        drawBattlefieldStatic();
        drawBlockSelector(mx,my,"#ee1111");
        if(skillReady){
            skillSet[skillReady].drawSelector(mx,my);
        }
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