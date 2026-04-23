var block=[];
var blockCount=0;

function addBlock(id,x,y){
    blockCount++;
    block.push({
        type:blockType[id].id,
        source:blockType[id].source,
        X:x,
        Y:y,
        isOnField:1,
        isEnemyPlacable:false,
        isPassable:blockType[id].isPassable,
        isProjectilePassable:blockType[id].isProjectilePassable,
        stepOnEffect:blockType[id].stepOnEffect,
        effectDuration:blockType[id].effectDuration,
        isSelectable:true,
        selector:{
            type:"block",
            color:"red",
            offsetX:x*50,
            offsetY:y*50,
            width:50,
            height:50,
            description:{
                id:blockType[id].selector.description.id,
                icon:blockType[id].selector.description.icon,
                text:blockType[id].selector.description.text
            },
        },
        onMouseOver(){
            displayDescription(this);
        },
        onClick(){
            ;
        }
    });
}
function clearBlocks(){
    block=[];
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