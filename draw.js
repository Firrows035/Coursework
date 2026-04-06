function loadImg(source){
    if(!imageSet[source]){
        let img=new Image;
        img.src=source;
        imageSet[source]=img;
        imageSet[source].onload=()=>{
            console.log("resource loaded successfully");
        }
    }
    
    return imageSet[source];

}

//these delays are essential but idk why
function drawImg(source,x,y){
    loadImg(source);
    setTimeout(()=>context.drawImage(loadImg(source),x,y),50);
}

function drawImgZoom(source,x,y,width,height){
    loadImg(source);
    setTimeout(()=>context.drawImage(loadImg(source),x,y,width,height),50);
}
function drawImgCut(source,sx,sy,swidth,sheight,x,y){
    loadImg(source);
    setTimeout(()=>context.drawImage(loadImg(source),sx,sy,swidth,sheight,x,y),50);
}

function drawMesh(){
    context.strokeStyle="#0000FF";
    for(let i=0;i<=13;i++){
        context.beginPath();
        context.moveTo(0,i*50);
        context.lineTo(1050,i*50);
        context.stroke();
        context.closePath();
    }
    for(let i=0;i<=21;i++){
        context.beginPath();
        context.moveTo(i*50,0);
        context.lineTo(i*50,650);
        context.stroke();
        context.closePath();
    }
}

function clearCanvas(){
    context.clearRect(0,0,canvas.width,canvas.height);
}

function clearBattlefield(){
    context.clearRect(0,0,1050,650);
}




function drawEnemy1(count){
    if(!enemySet[count].isDefeat){
        drawImgZoom(enemySet[count].appear,enemySet[count].X*50,enemySet[count].Y*50,50,50);
    }
}

function drawEnemy(){
    for(let i=1;i<=enemyCount;i++){
        drawEnemy1(i);
    }
}

function drawPlayerStat(){
    context.fillStyle="#000000";
    context.fillRect(1098,48,304,34);
    context.fillStyle="white";
    context.fillRect(1100,50,300,30);
    context.fillStyle="red";
    context.fillRect(1100,50,player.hp/player.mhp*300,30);
    context.fillStyle="#000000";
    context.fillRect(1098,118,304,34);
    context.fillStyle="white";
    context.fillRect(1100,120,300,30);
    context.fillStyle="blue";
    context.fillRect(1100,120,player.mp/player.mmp*300,30);
}

function drawEnemyStat1(count){
    if(!enemySet[count].isDefeat){
        context.fillStyle="#000000";
        context.fillRect(enemySet[count].X*50,enemySet[count].Y*50,50,5);
        context.fillStyle="white";
        context.fillRect(enemySet[count].X*50+1,enemySet[count].Y*50+1,48,3);
        context.fillStyle="red";
        context.fillRect(enemySet[count].X*50+1,enemySet[count].Y*50+1,48*enemySet[count].hp/enemySet[count].mhp,3);
    }
}

function drawEnemyStat(){
    for(let i=1;i<=enemyCount;i++){
        drawEnemyStat1(i);
    }
}

function createProjectile(source,sx,sy,dx,dy,spd,triggerR,dmg,isAOE,dmgR){
    loadImg(source);
    projectileCount++;
    projectileSet[projectileCount]={
        source:source,
        X:sx,
        Y:sy,
        direction:{
            X:dx/Math.sqrt(dx**2+dy**2),
            Y:dy/Math.sqrt(dx**2+dy**2)
        },
        speed:spd,
        triggerR:triggerR,
        isAOE:isAOE,
        damage:dmg,
        damageR:dmgR,
        isExpired:0,
    }
}

function drawProjectile(){
    for(let i=1;i<=projectileCount;i++){
        if(projectileSet[i].isExpired){
            continue;
        }
        // context.rotate(projectileSet[i].direction);
        drawImgZoom(projectileSet[i].source,projectileSet[i].X*50+10,projectileSet[i].Y*50+10,30,30);
        // context.rotate(-projectileSet[i].direction);
    }
}