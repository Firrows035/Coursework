var enemy=[];
function addEnemy(typeId){
    let type;
    if(typeof typeId=="object")type=typeId;
    else if(typeof typeId=="string")type=enemyType.get(typeId);
    else return 0;
    enemyCount++;
    enemyAlive++;
    enemy.push({
        id:type.id,
        number:enemyCount,
        source:type.source,
        atk:type.atk*(1+boost.enemy.atk/100),
        hp:type.mhp*(1+boost.enemy.mhp/100),
        mhp:type.mhp*(1+boost.enemy.mhp/100),
        def:type.def*(1+boost.enemy.def/100),
        mat:type.mat*(1+boost.enemy.mat/100),
        mdf:type.mdf*(1+boost.enemy.mdf/100),
        dmgBoost:1+boost.enemy.dmg/100,
        damageR:type.damageR,
        atkR:type.atkR+boost.enemy.atkR,
        warnR:type.warnR,
        attackTarget:[0,0],
        atktype:type.atktype,
        X:-1,
        Y:-1,
        isDefeat:0,
        state:type.state,
        navigatePosition:[0,0],
        warnedTime:0,
        haltTime:0,
        effect:[],
        isSelectable:true,
        selector:{
            type:"troop",
            color:"red",
            offsetX:0,
            offsetY:0,
            width:50,
            height:50,
            description:{
                id:type.id,
                icon:type.selector.description.icon,
                text:type.selector.description.text
            },
        },
        updateState:type.updateState,
        action:type.action,
        attack:type.attack,
        updateSelector(){
            this.selector.offsetX=this.X*50;
            this.selector.offsetY=this.Y*50;
        },    
        onMouseOver(){
            if(!this.isDefeat){
                displayDescription(this);
                drawRect(2,this.selector.color,this.selector.offsetX,this.selector.offsetY,this.selector.width,this.selector.height);
            }    
        },
        onClick(){
            if(distanceBetweenEntity(this,player)<=player.atkR&&!isPathBlocked(this.X,this.Y,player.X,player.Y)){
                playerTurn("attack",this);
            }
        }   
    })
    return type;
}

function summonEnemy(Id,quantity){
    for(let i=0;i<quantity;i++){
        addEnemy(Id);
    }
    enemyInround+=quantity;
    for(let emy of enemy){
        if(emy.X==-1) placeEnemy(emy,10);
    }
}
function placeEnemy(emy,attempt){
    let xtemp=Math.floor(Math.random()*1000)%21;
    let ytemp=Math.floor(Math.random()*1000)%12;
    emy.X=xtemp;
    emy.Y=ytemp;
    if(!isPosAvaliableLE1(xtemp,ytemp)||distanceBetweenEntity(emy,player)<=max(6,emy.atkR)||!isPosEnemyPlacable(xtemp,ytemp)){
        if(attempt>0){
            placeEnemy(emy,attempt-1);
        }
        else{
            emy.isDefeat=1;
            enemy.splice(enemy.findIndex(emy1=>emy1.id==emy.id));
            enemyInround--;
            return 0;
        }
    }
    return 1;
}

//修改enemy的状态机。default：若索敌范围内不可见player，随机移动；attack：player在攻击范围内，跟随玩家并尝试攻击；navigate：1. 索敌范围内可见玩家，将玩家位置修改为寻路地点；2. 索敌范围内不可见玩家，但此前处于寻路状态，继续寻路至目标地点附近直到到达、发现玩家或过长时间未发现玩家。
function checkEnemyStat(){
    for(let i=0;i<enemy.length;i++){
        if(!enemy[i].isDefeat){
            if(enemy[i].hp<=0){
                enemy[i].isDefeat=1;
                enemyDefeated++;
                enemyAlive--;
                enemy.splice(i,1);
            }
        }
    }
}
function updateEnemyStateUsual(emy){
    switch(emy.state){
        case "default":
            if(distanceBetweenEntity(emy,player)<=emy.atkR&&!isPathBlocked(emy.X,emy.Y,player.X,player.Y)){
                emy.state="attackReady";
                emy.warnedTime=5;
            }else if(distanceBetweenEntity(emy,player)<=emy.warnR&&!isPathBlocked(emy.X,emy.Y,player.X,player.Y)){
                emy.state="warning";
                emy.warnedTime=10;
                emy.navigatePosition=[player.X,player.Y];
            }else{
                emy.state="wandering";
                emy.navigatePosition=randPosUnblocked();
            }
            break;
        case "wandering":
            if(distanceBetweenEntity(emy,player)<=emy.atkR&&!isPathBlocked(emy.X,emy.Y,player.X,player.Y)){
                emy.state="attackReady";
                emy.navigatePosition=[player.X,player.Y];
                emy.warnedTime=5;
            }else if(distanceBetweenEntity(emy,player)<=emy.warnR&&!isPathBlocked(emy.X,emy.Y,player.X,player.Y)){
                emy.state="warning";
                emy.warnedTime=10;
                emy.navigatePosition=[player.X,player.Y];
            }else if(distanceBetweenPosition(emy.X,emy.Y,emy.navigatePosition[0],emy.navigatePosition[1])<2){
                emy.navigatePosition=randPosUnblocked();
            }
            break;
        case "warning":
            if(distanceBetweenEntity(emy,player)<=emy.atkR&&!isPathBlocked(emy.X,emy.Y,player.X,player.Y)){
                emy.state="attackReady";
                emy.navigatePosition=[player.X,player.Y];
                emy.warnedTime=5;
            }else if(distanceBetweenEntity(emy,player)<=emy.warnR&&!isPathBlocked(emy.X,emy.Y,player.X,player.Y)){
                emy.navigatePosition=[player.X,player.Y];
                emy.warnedTime=10;
            }else if([emy.X,emy.Y]==emy.navigatePosition){
                emy.warnedTime--;
                emy.navigatePosition=randPosUnblocked();
            }else{
                emy.warnedTime--;
            }
            if(emy.warnedTime==0){
                emy.state="wandering";
                emy.navigatePosition=randPosUnblocked();
            }
            break;
        case "attackReady":
            if(distanceBetweenPosition(emy.attackTarget[0],emy.attackTarget[1],player.X,player.Y)<=emy.damageR&&!isPathBlocked(emy.X,emy.Y,player.X,player.Y)){
                emy.state="attacking";
            }else{
                emy.state="warning";
                emy.warnedTime=8;
            } 
            break;
        case "halt":
            break;
        default:
            emy.state="default";
            break;
    }
}
function enemyActionUsual(emy){
    let targetPos=emy.navigatePosition;
    let dir=searchPath(emy.X,emy.Y,targetPos[0],targetPos[1]);
    // let atmpt=10;
    // while(dir==-1&&atmpt>0){
    //     emy.navigatePosition=randPosUnblocked();
    //     targetPos=emy.navigatePosition;
    //     dir=searchPath(emy.X,emy.Y,targetPos[0],targetPos[1]);
    //     atmpt--;
    // }
    switch(emy.state){
        case "default":
        case "halt":
            break;
        case "wandering":
            if(dir==-1||!isPosAvailableL1(emy.X+dir[0],emy.Y+dir[1])){
                emy.haltTime++;
            }else{
                emy.X+=dir[0];
                emy.Y+=dir[1];
                emy.haltTime=0;
            }
            if(emy.haltTime>3){
                emy.navigatePosition=randPosUnblocked();
            }
            if(emy.haltTime>10){
                [emy.X,emy.Y]=randPosAvailable();
            }
            if(distanceBetweenEntity(emy,player)<=emy.atkR&&!isPathBlocked(emy.X,emy.Y,player.X,player.Y)){
                emy.state="attackReady";
                emy.attackTarget=[player.X,player.Y];
            }
            break;
        case "warning":
            if(dir==-1||!isPosAvailableL1(emy.X+dir[0],emy.Y+dir[1])){
                ;
            }else{
                emy.X+=dir[0];
                emy.Y+=dir[1];
                emy.haltTime=0;
            }
            if(distanceBetweenEntity(emy,player)<=emy.atkR&&!isPathBlocked(emy.X,emy.Y,player.X,player.Y)){
                emy.state="attackReady";
                emy.attackTarget=[player.X,player.Y];
            }
            break;
        case "attackReady":
            emy.attackTarget=[player.X,player.Y];
            emy.navigatePosition=[player.X,player.Y];
            break;
        case "attacking":
            emy.attack();
            emy.haltTime=0;
            emy.state="warning";
            break;
    }
}

function updateEnemyStateRanged(emy){
    switch(emy.state){
        case "default":
            if(distanceBetweenEntity(emy,player)<=emy.atkR&&!isPathBlocked(emy.X,emy.Y,player.X,player.Y)){
                emy.state="castReady";
                emy.warnedTime=5;
            }else if(distanceBetweenEntity(emy,player)<=emy.warnR&&!isPathBlocked(emy.X,emy.Y,player.X,player.Y)){
                emy.state="warning";
                emy.warnedTime=10;
                emy.navigatePosition=[player.X,player.Y];
            }else{
                emy.state="wandering";
                emy.navigatePosition=randPosUnblocked();
            }
            break;
        case "wandering":
            if(distanceBetweenEntity(emy,player)<=emy.atkR&&!isPathBlocked(emy.X,emy.Y,player.X,player.Y)){
                emy.state="castReady";
                emy.navigatePosition=[player.X,player.Y];
                emy.warnedTime=5;
            }else if(distanceBetweenEntity(emy,player)<=emy.warnR&&!isPathBlocked(emy.X,emy.Y,player.X,player.Y)){
                emy.state="warning";
                emy.warnedTime=10;
                emy.navigatePosition=[player.X,player.Y];
            }else if(distanceBetweenPosition(emy.X,emy.Y,emy.navigatePosition[0],emy.navigatePosition[1])<2){
                emy.navigatePosition=randPosUnblocked();
            }
            break;
        case "warning":
            if(distanceBetweenEntity(emy,player)<=emy.atkR&&!isPathBlocked(emy.X,emy.Y,player.X,player.Y)){
                emy.state="castReady";
                emy.navigatePosition=[player.X,player.Y];
                emy.warnedTime=5;
            }else if(distanceBetweenEntity(emy,player)<=emy.warnR&&!isPathBlocked(emy.X,emy.Y,player.X,player.Y)){
                emy.navigatePosition=[player.X,player.Y];
                emy.warnedTime=10;
            }else if([emy.X,emy.Y]==emy.navigatePosition){
                emy.warnedTime--;
                emy.navigatePosition=randPosUnblocked();
            }else{
                emy.warnedTime--;
            }
            if(emy.warnedTime==0){
                emy.state="wandering";
                emy.navigatePosition=randPosUnblocked();
            }
            break;
        case "castReady":
                emy.state="casting";
            break;
        case "halt":
            break;
        default:
            emy.state="default";
            break;
    }
}
function enemyActionRanged(emy){
    let targetPos=emy.navigatePosition;
    let dir=searchPath(emy.X,emy.Y,targetPos[0],targetPos[1]);
    console.log(`${emy.number} -> ${dir}`);
    switch(emy.state){
        case "default":
        case "halt":
            break;
        case "wandering":
            if(dir==-1||!isPosAvailableL1(emy.X+dir[0],emy.Y+dir[1])){
                emy.haltTime++;
            }else{
                emy.X+=dir[0];
                emy.Y+=dir[1];
                emy.haltTime=0;
            }
            if(emy.haltTime>3){
                emy.navigatePosition=randPosUnblocked();
            }
            if(emy.haltTime>10){
                [emy.X,emy.Y]=randPosAvailable();
            }
            if(distanceBetweenEntity(emy,player)<=emy.atkR&&!isPathBlocked(emy.X,emy.Y,player.X,player.Y)){
                emy.state="castReady";
                emy.attackTarget=[player.X,player.Y];
            }
            break;
        case "warning":
            if(dir==-1||!isPosAvailableL1(emy.X+dir[0],emy.Y+dir[1])){
                ;
            }else{
                emy.X+=dir[0];
                emy.Y+=dir[1];
                emy.haltTime=0;
            }
            if(distanceBetweenEntity(emy,player)<=emy.atkR&&!isPathBlocked(emy.X,emy.Y,player.X,player.Y)){
                emy.state="castReady";
                emy.attackTarget=[player.X,player.Y];
            }
            break;
        case "castReady":
            emy.attackTarget=[player.X,player.Y];
            emy.navigatePosition=[player.X,player.Y];
            break;
        case "casting":
            emy.attack();
            emy.haltTime=0;
            emy.state="warning";
            break;
    }
}
function updateEnemyStat(){
    for(let emy of enemy){
        emy.mhp=emy.baseMhp*(1+boost.emy.mhp/100);
        emy.mmp=emy.baseMmp*(1+boost.emy.mmp/100);
        emy.def=emy.baseDef*(1+boost.emy.def/100);
        emy.atk=emy.baseAtk*(1+boost.emy.atk/100);
        emy.mat=emy.baseMat*(1+boost.emy.mat/100);
        emy.mdf=emy.baseMdf*(1+boost.emy.mdf/100);
        emy.dmgBoost=1+boost.emy.dmg/100;
        emy.atkR=emy.baseAtkR+boost.emy.atkR;
    }
}