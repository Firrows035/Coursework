var effectType=new Map();

effectType.set("poison",{
    id:"poison",
    source:"poison.png",
    gain(target){
        return 0;
    },
    playerTurnStart(target){
        target.hp=max(1,target.hp-target.mhp*0.05);
        console.log("poison damage");
        return 1;
    },
    playerTurnMiddle(target){
        return 0;
    },
    playerTurnEnd(target){
        return 0;
    },
    neutralTurnStart(target){
        return 0;
    },
    neutralTurnMiddle(target){
        return 0;
    },
    neutralTurnEnd(target){
        return 0;
    },
    enemyTurnStart(target){
        return 0;
    },
    enemyTurnMiddle(target){
        return 0;
    },
    enemyTurnEnd(target){
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
});
effectType.set("immortal",{
    id:"immortal",
    source:"immortal.png",
    gain(target){
        return 0;
    },
    playerTurnStart(target){  //不影响伤害结算
        return 0;
    },
    playerTurnMiddle(target){
        target.hp=max(target.hp,1);
        return 0;
    },
    playerTurnEnd(target){
        return 0;
    },
    neutralTurnStart(target){
        return 0;
    },
    neutralTurnMiddle(target){
        target.hp=max(target.hp,1);
        return 0;
    },
    neutralTurnEnd(target){
        return 0;
    },
    enemyTurnStart(target){
        return 0;
    },
    enemyTurnMiddle(target){
        target.hp=max(target.hp,1);
        return 1;
    },
    enemyTurnEnd(target){
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
            id:"immortal",
            icon:"immortal.png",
            text:"immortal"
        }
    }
});
effectType.set("revival",{
    id:"revival",
    source:"revival.png",
    gain(target){
        return 0;
    },
    playerTurnStart(target){
        return 0;
    },
    playerTurnMiddle(target){
        if(target.hp<=0){
            target.hp=target.mhp*0.5;
            giveEffect(target,"immortal",5,false);
            return 1;
        }
        return 0;
    },
    playerTurnEnd(target){
        return 0;
    },
    neutralTurnStart(target){
        return 0;
    },
    neutralTurnMiddle(target){
        if(target.hp<=0){
            target.hp=target.mhp*0.5;
            giveEffect(target,"immortal",5,false);
            return 1;
        }
        return 0;
    },
    neutralTurnEnd(target){
        return 0;
    },
    enemyTurnStart(target){
        return 0;
    },
    enemyTurnMiddle(target){
        if(target.hp<=0){
            target.hp=target.mhp*0.5;
            giveEffect(target,"immortal",5,false);
            return 1;
        }
        return 0;
    },
    enemyTurnEnd(target){
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
});
effectType.set("void",{
    id:"void",
    source:"poison.png",
    gain(target){
        return 0;
    },
    playerTurnStart(target){
        return 0;
    },
    playerTurnMiddle(target){
        return 0;
    },
    playerTurnEnd(target){
        return 0;
    },
    neutralTurnStart(target){
        return 0;
    },
    neutralTurnMiddle(target){
        return 0;
    },
    neutralTurnEnd(target){
        return 0;
    },
    enemyTurnStart(target){
        return 0;
    },
    enemyTurnMiddle(target){
        return 0;
    },
    enemyTurnEnd(target){
        return 0;
    },
    expire(target){
        return 0;
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
});
function giveEffect(entity,effectId,duration,isCrossRound){
    let type=effectType.get(effectId);
    let i=entity.effect.findIndex(eff=>eff.id==type.id);
    if(i!=-1){
        entity.effect[i].duration=min(type.maxDuration,entity.effect[i].duration+duration);
    }else{
        entity.effect.push({
            id:type.id,
            source:type.source,
            gain:type.gain,
            playerTurnStart:type.playerTurnStart,
            playerTurnMiddle:type.playerTurnMiddle,
            playerTurnEnd:type.playerTurnEnd,
            neutralTurnStart:type.neutralTurnStart,
            neutralTurnMiddle:type.neutralTurnMiddle,
            neutralTurnEnd:type.neutralTurnEnd,
            enemyTurnStart:type.enemyTurnStart,
            enemyTurnMiddle:type.enemyTurnMiddle,
            enemyTurnEnd:type.enemyTurnEnd,
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
function activateEnemyEffects(turn,timing){
    enemy.forEach(emy=>activateEffects(emy,turn,timing));
}

function activateEffects(entity,turn,timing){
    for(let eff of entity.effect){
        switch(turn+timing){
            case "playerTurnStart":
                if(eff.duration>0&&eff.playerTurnStart(entity)) eff.duration--;
                break;
            case "playerTurnMiddle":
                if(eff.duration>0&&eff.playerTurnMiddle(entity)) eff.duration--;
                break;
            case "playerTurnEnd":
                if(eff.duration>0&&eff.playerTurnEnd(entity)) eff.duration--;
                break;
            case "neutralTurnStart":
                if(eff.duration>0&&eff.neutralTurnStart(entity)) eff.duration--;
                break;
            case "neutralTurnMiddle":
                if(eff.duration>0&&eff.neutralTurnMiddle(entity)) eff.duration--;
                break;
            case "neutralTurnEnd":
                if(eff.duration>0&&eff.neutralTurnEnd(entity)) eff.duration--;
                break;
            case "enemyTurnStart":
                if(eff.duration>0&&eff.enemyTurnStart(entity)) eff.duration--;
                break;
            case "enemyTurnMiddle":
                if(eff.duration>0&&eff.enemyTurnMiddle(entity)) eff.duration--;
                break;
            case "enemyTurnEnd":
                if(eff.duration>0&&eff.enemyTurnEnd(entity)) eff.duration--;
                break;
            default:
                break;
        }        
        if(eff.duration==0){
            eff.expire(entity);
            entity.effect.splice(entity.effect.findIndex((eff1)=>eff1==eff),1);
        }
    }
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


