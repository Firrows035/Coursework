var enemy=[];
var enemyType=new Map();
enemyType.set("Kanade",{
    id:"Kanade",
    source:"Enemy1.jpg",
    mhp:80,
    atk:15,
    def:0,
    mat:15,
    mdf:0,
    atkR:1,
    warnR:10,
    atktype:1,
    state:"default",
    selector:{
        description:{
            id:"Kanade",
            icon:"Enemy1.jpg",
            text:`随处可见的小气走`
        },
    },
    updateState(){
        updateEnemyStateUsual(this);
    },
    action(){
        enemyActionUsual(this);
    }
});
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
        def:type.def+boost.enemy.def,
        mat:type.mat*(1+boost.enemy.mat/100),
        mdf:type.mdf+boost.enemy.mdf,
        dmgBoost:1+boost.enemy.dmg/100,
        atkR:type.atkR+boost.enemy.atkR,
        warnR:type.warnR,
        atktype:type.atktype,
        X:0,
        Y:0,
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
    for(let i=1;i<=quantity;i++){
        addEnemy(Id);
    }
    enemyInround+=quantity;
    enemy.forEach(emy=>{
        if(!emy.isDefeat) placeEnemy(emy,10);
    })
}
function placeEnemy(emy,attempt){
    let xtemp=Math.floor(Math.random()*1000)%21;
    let ytemp=Math.floor(Math.random()*1000)%12;
    emy.X=xtemp;
    emy.Y=ytemp;
    if(!isPosAvaliableLE1(xtemp,ytemp)||distanceBetweenEntity(emy,player)<=5||!isPosEnemyPlacable(xtemp,ytemp)){
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

//修改enemy的状态机。default：若索敌范围内不可见player，随机移动；attack：player在攻击范围内，跟随玩家并尝试攻击；navigate：1. 索敌范围内可见玩家，将玩家位置修改为寻路地点；2. 索敌范围内不可见玩家，但此前处于寻路状态，继续寻路至目标地点附近直到到达、发现玩家或过长时间（因为每回合check三次所以要翻三倍）未发现玩家。
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
            if(distanceBetweenEntity(emy,player)<=emy.atkR+1&&!isPathBlocked(emy.X,emy.Y,player.X,player.Y)){
                emy.state="attacking";
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
            if(distanceBetweenEntity(emy,player)<=emy.atkR+1&&!isPathBlocked(emy.X,emy.Y,player.X,player.Y)){
                emy.state="attacking";
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
            if(distanceBetweenEntity(emy,player)<=emy.atkR+1&&!isPathBlocked(emy.X,emy.Y,player.X,player.Y)){
                emy.state="attacking";
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
        case "attacking":
            if(distanceBetweenEntity(emy,player)<=emy.atkR+1&&!isPathBlocked(emy.X,emy.Y,player.X,player.Y)){
                emy.warnedTime=5;
            }else if(distanceBetweenEntity(emy,player)<=emy.warnR&&!isPathBlocked(emy.X,emy.Y,player.X,player.Y)){
                emy.state="warning";
                emy.warnedTime=10;
            }
            emy.navigatePosition=[player.X,player.Y];
            break;
        default:
            emy.state="default";
            break;
    }
}
function enemyActionUsual(emy){
    let targetPos=emy.navigatePosition;
    let dir=searchPath(emy.X,emy.Y,targetPos[0],targetPos[1]);
    switch(emy.state){
        case "default":
            break;
        case "wandering":
            if(dir==-1||!isPosAvailableL1(emy.X+dir[0],emy.Y+dir[1])){
                emy.haltTime++;
            }else{
                emy.X+=dir[0];
                emy.Y+=dir[1];
            }
            if(emy.haltTime>5){
                emy.navigatePosition=randPosUnblocked();
                emy.haltTime=0;
            }
            break;
        case "warning":
            if(dir==-1||!isPosAvailableL1(emy.X+dir[0],emy.Y+dir[1])){
                ;
            }else{
                emy.X+=dir[0];
                emy.Y+=dir[1];
            }
            break;
        case "attacking":
            if(dir==-1||!isPosAvailableL1(emy.X+dir[0],emy.Y+dir[1])){
                emy.haltTime++;
            }else{
                emy.X+=dir[0];
                emy.Y+=dir[1];
            }
            if(distanceBetweenEntity(emy,player)<=emy.atkR&&!isPathBlocked(emy.X,emy.Y,player.X,player.Y)){
                takeDamage(emy.atk,false);
            }
            break;
    }
}