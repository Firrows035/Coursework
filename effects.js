var effectType={};

effectType.poison={
    id:"poison",
    source:"poison.png",
    gain(target){
        return 0;
    },
    turnStart(target){
        target.hp=max(1,target.hp-target.mhp*0.05);
        return 1;
    },
    turnMiddle(target){
        return 0;
    },
    turnEnd(target){
        return 0;
    },
    expire(target){
        return 0;
    },
    maxDuration:10,
    isSelectable:true,
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
effectType.immortal={
    id:"immortal",
    source:"immortal.png",
    gain(target){
        return 0;
    },
    turnStart(target){  //不影响伤害结算
        
        return 0;
    },
    turnMiddle(target){
        target.hp=max(target.hp,1);
        return 0;
    },
    turnEnd(target){
        target.hp=max(target.hp,1);
        return 1;
    },
    expire(target){
        return 0;
    },
    maxDuration:10,
    isSelectable:true,
    selector:{
        type:"effectType",
        color:"red",
        offsetX:0,
        offsetY:0,
        width:0,
        height:0,
        description:{
            id:"immortal",
            icon:"immortal.png",
            text:"immortal"
        }
    }
}
effectType.revival={
    id:"revival",
    source:"revival.png",
    gain(target){
        return 0;
    },
    turnStart(target){
        return 0;
    },
    turnMiddle(target){
        if(target.hp<=0){
            target.hp=target.mhp*0.5;
            giveEffect(target,"immortal",5,false);
            return 1;
        }
        return 0;
    },
    turnEnd(target){
        if(target.hp<=0){
            target.hp=target.mhp*0.5;
            giveEffect(target,"immortal",5,false);
            return 1;
        }
        return 0;
    },
    expire(target){
        setCharacter("Tairitsu-Tempest");
        return 0;
    },
    maxDuration:10,
    isSelectable:true,
    selector:{
        type:"effectType",
        color:"red",
        offsetX:0,
        offsetY:0,
        width:0,
        height:0,
        description:{
            id:"revival",
            icon:"revival.png",
            text:"revive"
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
function giveEffect(entity,effectId,duration,isCrossRound){
    let type=effectType[effectId];
    let i=entity.effect.findIndex(eff=>eff.id==type.id);
    if(i!=-1){
        entity.effect[i].duration=min(type.maxDuration,entity.effect[i].duration+duration);
    }else{
        entity.effect.push({
            id:type.id,
            source:type.source,
            gain:type.gain,
            turnStart:type.turnStart,
            turnMiddle:type.turnMiddle,
            turnEnd:type.turnEnd,
            expire:type.expire,
            duration:duration,
            isSelectable:type.isSelectable,
            isCrossRound:isCrossRound,
            selector:{
                type:"effect",
                color:"orange",
                offsetX:0,
                offsetY:0,
                width:40,
                height:40,
                description:{
                    id:type.selector.description.id,
                    icon:type.selector.description.icon,
                    text:type.selector.description.text
                }
            },
            onMouseOver(){
                drawRect(2,this.selector.color,this.selector.offsetX,this.selector.offsetY,this.selector.width,this.selector.height);
                displayDescription(this);
            }
        });
        type.gain(entity);
    }

}
function activateEnemyEffects(timing){
    enemy.forEach(emy=>activateEffects(emy,timing));
}

function activateEffects(entity,timing){
    entity.effect.forEach(eff=>{
        switch(timing){
            case "turnStart":
                if(eff.duration>0&&eff.turnStart(entity)) eff.duration--;
                break;
            case "turnEnd":
                if(eff.duration>0&&eff.turnEnd(entity)) eff.duration--;
                break;
            default:
                break;
        }        
        if(eff.duration==0){
            eff.expire(entity);
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
function clearEffect(isLongLastingEffectCleared){
    player.effect.forEach(eff=>{
        if(!eff.isCrossRound||isLongLastingEffectCleared){
            player.effect.splice(player.effect.findIndex(eff1=>eff1==eff),1);
        }
    })
}


