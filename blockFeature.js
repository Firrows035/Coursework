var blockType={};
var block=[];

var blockTypeCount=0;
var blockCount=0;
function addBlockType(name,source,isPassable,isProjectilePassable,stepOnEffect,effectDuration){
    blockTypeCount++;
    blockType[name]={
        name:name,
        source:source,
        isPassable,isPassable,
        isProjectilePassable:isProjectilePassable,
        stepOnEffect:stepOnEffect,
        effectDuration:effectDuration,
    }
}
addBlockType("wall","wall.png",false,false,"void",0);
addBlockType("poisonArea","poisonBlock.png",true,true,"poison",2);

function addBlock(name,x,y){
    blockCount++;
    block.push({
        type:name,
        source:blockType[name].source,
        X:x,
        Y:y,
        isOnField:1,
        isEnemyPlacable:false,
        isPassable:blockType[name].isPassable,
        isProjectilePassable:blockType[name].isProjectilePassable,
        stepOnEffect:blockType[name].stepOnEffect,
        effectDuration:blockType[name].effectDuration,
    });
}
function clearBlocks(){
    block=[];
}

function isPosEnemyPlacable(x,y){
    let sign=1;
    block.forEach(bloc=>{
        if(bloc.X==x&&bloc.Y==y&&bloc.isEnemyPlacable==0&&bloc.isOnField){
            sign=0;
        }
    })
    return sign;
}

function activateBlockEffect(entity){
    block.forEach(bloc=>{
        if(bloc.X==entity.X&&bloc.Y==entity.Y&&bloc.isOnField){
            giveEffect(entity,bloc.stepOnEffect,bloc.effectDuration);
        }
    })
}
function activateBlockEffectAll(){
    enemy.forEach(emy=>activateBlockEffect(emy));
    activateBlockEffect(player);
}