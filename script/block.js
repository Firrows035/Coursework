var blockType={};
var block=[];


var blockCount=0;

blockType["wall"]={
    id:"wall",
    source:"wall.png",
    isPassable:false,
    isProjectilePassable:false,
    stepOnEffect:"void",
    effectDuration:0,
    isSelectable:false,
    selector:{
        type:"block",
        color:"red",
        offsetX:0,
        offsetY:0,
        width:50,
        height:50,
        description:{
            id:"wall",
            icon:"wall.png",
            text:"普通的墙"
        },
    },
}
blockType["poisonArea"]={
    id:"poisonArea",
    source:"poisonBlock.png",
    isPassable:true,
    isProjectilePassable:true,
    stepOnEffect:"poison",
    effectDuration:2,
    isSelectable:false,
    selector:{
        type:"block",
        color:"red",
        offsetX:0,
        offsetY:0,
        width:50,
        height:50,
        description:{
            id:"poisonArea",
            icon:"poisonBlock.png",
            text:"会使人中毒的区域。"
        },
    },
}

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