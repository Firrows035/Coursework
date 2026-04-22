

//these delays are essential but idk why -- now i know and solved that
function drawImg(source,x,y){

    context.drawImage(imageSet[source],x,y);
}

function drawImgZoom(source,x,y,width,height){
    context.drawImage(imageSet[source],x,y,width,height);
}
function drawImgCut(source,sx,sy,swidth,sheight,x,y){

    context.drawImage(imageSet[source],sx,sy,swidth,sheight,x,y);
}

function drawMesh(){
    context.strokeStyle="#bbbbbb";
    context.lineWidth=2;
    context.beginPath();
    for(let i=0;i<=15;i++){
        context.moveTo(0,i*50);
        context.lineTo(1500,i*50);
        context.stroke();
    }
    for(let i=0;i<=30;i++){
        context.moveTo(i*50,0);
        context.lineTo(i*50,750);
        context.stroke();
    }
    context.moveTo(1500,260);
    context.lineTo(2050,260);
    context.stroke();
    context.moveTo(1500,560);
    context.lineTo(2050,560);
    context.stroke();
    context.moveTo(1500,750);
    context.lineTo(1500,1000);
    context.stroke();
    context.closePath();
}

function clearCanvas(){
    context.clearRect(0,0,canvas.width,canvas.height);
}

function clearBattlefield(){
    context.clearRect(0,0,1500,750);
}

function drawEnemy1(emy){
    if(!emy.isDefeat){
        drawImgZoom(emy.source,emy.X*50+5,emy.Y*50+5,40,40);
    }
}

function drawEnemy(){
    enemy.forEach(emy=>{
        drawEnemy1(emy);
    })
}

function drawPlayerStat(){
    context.clearRect(1502,0,548,150);
    context.font="30px Arial";
    context.fillStyle="black";
    context.fillText(`HP: ${floor(player.hp)}/${floor(player.mhp)}`,1860,80);
    context.fillRect(1548,48,304,34);
    context.fillText(`MP: ${floor(player.mp)}/${floor(player.mmp)}`,1860,150);
    context.fillRect(1548,118,304,34);

    context.fillStyle="white";
    context.fillRect(1550,50,300,30);
    context.fillRect(1550,120,300,30);

    context.fillStyle="red";
    context.fillRect(1550,50,player.hp/player.mhp*300,30);

    context.fillStyle="blue";
    context.fillRect(1550,120,player.mp/player.mmp*300,30);
}
function drawRect(lineWidth,style,x,y,w,h){
    context.lineWidth=lineWidth;
    context.strokeStyle=style;
    context.beginPath();
    context.rect(x,y,w,h);
    context.stroke();
    context.closePath();
}
function drawEnemyStat1(emy){
    if(!emy.isDefeat){
        if(emy.state=="attack"){
            drawRect(2,"red",emy.X*50+5,emy.Y*50+5,40,40);
        }
        else if(emy.state=="warning"){
            drawRect(2,"orange",emy.X*50+5,emy.Y*50+5,40,40);
        }
        context.fillStyle="#000000";
        context.fillRect(emy.X*50,emy.Y*50,50,5);
        context.fillStyle="white";
        context.fillRect(emy.X*50+1,emy.Y*50+1,48,3);
        context.fillStyle="red";
        context.fillRect(emy.X*50+1,emy.Y*50+1,48*emy.hp/emy.mhp,3);
    }
}

function drawEnemyStat(){
    enemy.forEach(emy=>{
        drawEnemyStat1(emy);
    })
}



function drawProjectile(){
    projectile.forEach(proj=>{
        // context.rotate(projectile[i].direction);
        drawImgZoom(proj.source,proj.X*50+10,proj.Y*50+10,30,30);
        // context.rotate(-projectile[i].direction);
    })
}

function drawSkillStat(){
    context.clearRect(0,755,1155,110); //(0,750,1100,100)
    let i=0;
    for(let [id,skil] of skill){

        

        skil.selector.update(i);
        if(!skil.cdt){
            drawImgZoom(skil.source,110*i+50,760,80,80);
        }
        else{
            drawImgZoom(skil.sourceCD,110*i+50,760,80,80);
                context.fillStyle="black";
                context.font="60px Arial";
                context.fillText(`${skil.cdt}`,110*i+25+50,820);

        }
        if(skil.cost>player.mp){
            context.fillStyle="red";
        }
        else{
            context.fillStyle="blue";
        }
        context.font="20px Arial";
        context.fillText(`${skil.cost}`,110*i+80+50,860);
        if(skil.isSelected){
            drawSelectSkill(i);
            skil.drawSelector();
        }
        i++;
    }
}

function drawSelectSkill(num){

        context.beginPath();
        context.strokeStyle="red";
        context.rect(110*num+50,760,100,100);
        context.stroke();
        context.closePath();

}

function drawPlayerAttackRange(){
    let r=player.atkR;

    // context.beginPath();
    // context.lineWidth=3;
    // context.strokeStyle="green";
    // let x=player.X-r;
    // let y=player.Y;
    // context.moveTo(x,y);
    // for(let i=1;i<=r;i++){
    //         y+=1;
    //         context.lineTo(x,y);
    //         x+=1;
    //         context.lineTo(x,y);
    // }
    
    // // if(isPosLegal(x,y)){
    // //     x+=1;
    // //     context.lineTo(x,y);
    // // }
    // // else{
    // //     x+=1;
    // //     context.moveTo(x,y);
    // // }
    // context.stroke();
    // context.closePath();
    for(let i=-r;i<=r;i++){

            if(isPosLegal(player.X+i,player.Y+r-Math.abs(i)))drawBlockSelector(player.X+i,player.Y+r-Math.abs(i),"#11eeee");
            if(isPosLegal(player.X+i,player.Y-r+Math.abs(i)))drawBlockSelector(player.X+i,player.Y-r+Math.abs(i),"#11eeee");

        
    }
}
function drawBlockSelector(x,y,color){
        context.beginPath();
        context.strokeStyle=color;
        context.lineWidth=2;
        context.rect(x*50,y*50,50,50);
        context.stroke();
        context.closePath();
}

function sacriStrikeSelector(){
    for(let i=-6;i<=6;i++){
        for(let j=Math.abs(i)-6;j<=6-Math.abs(i);j++){
            if(i||j){
                if(isPosLegal(player.X+i,player.Y+j))drawBlockSelector(player.X+i,player.Y+j,"#0000ff");
            }
            
        }
    }
}

function drawBlocks(){
    block.forEach(bloc=>{
        drawImgZoom(bloc.source,bloc.X*50,bloc.Y*50,50,50);
    })
}

function drawText(text,x,y,color,font,maxWidth,lineHeight,isChinese){
    let word;
    let seperator;
    let line="";
    context.fillStyle=color;
    context.font=font;
    if(isChinese){
        word=text.split("");
        seperator="";
    }else{
        word=text.split(" ");
        seperator=" ";
    }
    for(let i=0;i<word.length;i++){
        let tempLine=line+word[i]+seperator;
        let measure=context.measureText(tempLine);
        let tempWidth=measure.width;
        if(tempWidth>maxWidth&&i>0){
            context.fillText(line,x,y);
            line=word[i]+seperator;
            y+=lineHeight;
        }else{
            line=tempLine;
        }
    }
    context.fillText(line,x,y);
}
//快速绘制计量条
function drawStatBar(x,y,length,height,point,maxPoint,color,id){
    context.fillStyle="black";
    context.font=`${height}px Arial`;
    context.fillRect(x,y,length,height);
    context.fillText(`${id} ${floor(point)}/${floor(maxPoint)}`,x+length+5,y+height);
    context.fillStyle="white";
    context.fillRect(x+2,y+2,length-4,height-4);
    context.fillStyle=color;
    context.fillRect(x+2,y+2,(length-4)*point/maxPoint,height-4);
}
function displayDescription(target){
    if(target.isSelectable){
        switch(target.selector.type){
            case "troop":
                drawText(target.selector.description.id,1530,295,"black","30px 黑体",490,35,true);
                drawStatBar(1710,265,180,30,target.hp,target.mhp,"red","");
                drawImgZoom(target.selector.description.icon,1530,300,100,100);
                drawText(`ATK: ${floor(target.atk)}`,1650,340,"black","30px 黑体",500,40,false);
                drawText(`DEF: ${floor(target.def)}`,1840,340,"black","30px 黑体",500,40,false);
                drawText(`MAT: ${floor(target.mat)}`,1650,400,"black","30px 黑体",500,40,false);
                drawText(`MDF: ${floor(target.mdf)}`,1840,400,"black","30px 黑体",500,40,false);
                drawText(target.selector.description.text,1530,600,"black","30px 宋体",490,40,true);
                break;
            case "skill":
            case "block":
            case "effect":
                drawText(target.selector.description.id,1650,320,"black","50px 微软雅黑",490,55,false);
                drawImgZoom(target.selector.description.icon,1530,270,100,100);
                drawText(target.selector.description.text,1530,600,"black","30px 宋体",490,40,true);
                break;
            case "character":
                drawText(target.selector.description.id,1530,295,"black","30px 黑体",490,35,true);
                drawStatBar(1710,265,180,30,target.mhp,target.mhp,"red","");
                drawImgZoom(target.selector.description.icon,1530,300,100,100);
                drawStatBar(1710,300,180,30,target.mmp,target.mmp,"blue","");
                drawText(`ATK: ${floor(target.atk)}`,1700,380,"black","30px 黑体",500,40,false);
                drawText(`DEF: ${floor(target.def)}`,1890,380,"black","30px 黑体",500,40,false);
                drawText(`MAT: ${floor(target.mat)}`,1700,440,"black","30px 黑体",500,40,false);
                drawText(`MDF: ${floor(target.mdf)}`,1890,440,"black","30px 黑体",500,40,false);
                drawText(target.selector.description.text,1530,600,"black","30px 宋体",490,40,true);
                break;
            default:
                break;
        }
    }
}

function drawKeys(){
    key.forEach(k=>{
        drawImgZoom(k.source,k.selector.offsetX,k.selector.offsetY,k.selector.width,k.selector.height);
    })
}
function drawChoiceSlot(){
    choiceSlot.forEach(slot=>{
        context.fillStyle="white";
        context.fillRect(slot.selector.offsetX,slot.selector.offsetY,slot.selector.width,slot.selector.height);
        drawRect(2,"black",slot.selector.offsetX,slot.selector.offsetY,slot.selector.width,slot.selector.height);
        drawText(slot.selector.description.text,slot.selector.offsetX+5,slot.selector.offsetY+150,"black","30px 微软雅黑",slot.selector.width-10,35,true);
    })
}
function drawCharacterChoice(){
    for(let [id,slot] of character){
        if(slot.isSelectable)
        drawImgZoom(slot.source,slot.selector.offsetX,slot.selector.offsetY,slot.selector.width,slot.selector.height);
    }
}

function drawPlayerEffects(){
    let order=0;
    context.clearRect(1505,155,545,100);
    player.effect.forEach(eff=>{
        if(eff.isSelectable){
            eff.selector.offsetX=1510+50*order;
            eff.selector.offsetY=160+50*floor(order/10);
            drawImgZoom(eff.selector.description.icon,eff.selector.offsetX,eff.selector.offsetY,eff.selector.width,eff.selector.height);
            drawRect(2,"grey",eff.selector.offsetX,eff.selector.offsetY,eff.selector.width,eff.selector.height)
            order++;
        }
    })
}
function drawTrace(trace){
    for(let [x,y] of trace){
        drawImgZoom("tracker.png",x*50,y*50,50,50);
    }
}