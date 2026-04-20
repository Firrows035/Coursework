var effectType={};

effectType.poison={
    id:"poison",
    source:"poison.png",
    gain(target){

    },
    trigger(target){
        target.hp=max(1,target.hp-target.mhp*0.05);
    },
    expire(target){

    },
    maxDuration:10,
    isSelectable:false,
    selector:{
        type:"effectType",
        color:"red",
        offsetX:0,
        offsetY:0,
        width:0,
        height:0,
        description:{
            id:"poison",
            icon:"poison.png",
            text:"poisonous"
        }
    }
}
effectType.void={
    id:"void",
    source:"poison.png",
    trigger(entity){
        ;
    },
    maxDuration:10,
    isSelectable:false,
    selector:{
        type:"effectType",
        color:"red",
        offsetX:0,
        offsetY:0,
        width:0,
        height:0,
        description:{
            id:"void",
            icon:"poison.png",
            text:"void"
        }
    }
}

function giveEffect(entity,effectId,duration){
    let type=effectType[effectId];
    let i=entity.effect.findIndex(eff=>eff.id==type.id);
    if(i!=-1){
        entity.effect[i].duration=min(type.maxDuration,entity.effect[i].duration+duration);
    }else{
        entity.effect.push({
            id:type.id,
            source:type.source,
            trigger:type.trigger,
            duration:duration,
            isSelectable:true,
            selector:{
                type:"effect",
                color:"red",
                offsetX:0,
                offsetY:0,
                width:30,
                height:30,
                description:{
                    id:type.selector.description.id,
                    icon:type.selector.description.icon,
                    text:type.selector.description.text
                }
            },
        })
    }
}
function activateEffectsAll(){
    activateEffects(player);
    enemy.forEach(emy=>activateEffects(emy));
}

function activateEffects(entity){
    entity.effect.forEach(eff=>{
        eff.trigger(entity);
        eff.duration--;
        if(eff.duration<=0){
            entity.effect.splice(entity.effect.findIndex((eff1)=>eff1==eff),1);
        }
    })
}

function giveVoidEffect(entity){
    giveEffect(entity,"void",1);
}

function poison(entity){
    entity.hp=max(1,entity.hp-entity.mhp*0.05);
}


