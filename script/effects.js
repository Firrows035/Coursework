function giveEffect(entity,effectId,duration,isCrossRound){
    let type=effectType.get(effectId);
    let i=entity.effect.findIndex(eff=>eff.id==type.id);
    if(i!=-1){
        entity.effect[i].duration=min(type.maxDuration,entity.effect[i].duration+duration);
    }else{
        let e=entity.effect.push({
            id:type.id,
            source:type.source,
            gain:type.gain,
            cache:[],
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
        entity.effect[e-1].gain(entity,entity.effect[e-1]);
    }

}
function activateEnemyEffects(turn,timing){
    enemy.forEach(emy=>activateEffects(emy,turn,timing));
}

function activateEffects(entity,turn,timing){
    for(let eff of entity.effect){
        switch(turn+timing){
            case "playerTurnStart":
                if(eff.duration>0&&eff.playerTurnStart(entity,eff)) eff.duration--;
                break;
            case "playerTurnMiddle":
                if(eff.duration>0&&eff.playerTurnMiddle(entity,eff)) eff.duration--;
                break;
            case "playerTurnEnd":
                if(eff.duration>0&&eff.playerTurnEnd(entity,eff)) eff.duration--;
                break;
            case "neutralTurnStart":
                if(eff.duration>0&&eff.neutralTurnStart(entity,eff)) eff.duration--;
                break;
            case "neutralTurnMiddle":
                if(eff.duration>0&&eff.neutralTurnMiddle(entity,eff)) eff.duration--;
                break;
            case "neutralTurnEnd":
                if(eff.duration>0&&eff.neutralTurnEnd(entity,eff)) eff.duration--;
                break;
            case "enemyTurnStart":
                if(eff.duration>0&&eff.enemyTurnStart(entity,eff)) eff.duration--;
                break;
            case "enemyTurnMiddle":
                if(eff.duration>0&&eff.enemyTurnMiddle(entity,eff)) eff.duration--;
                break;
            case "enemyTurnEnd":
                if(eff.duration>0&&eff.enemyTurnEnd(entity,eff)) eff.duration--;
                break;
            default:
                break;
        }        
        if(eff.duration==0){
            eff.expire(entity,eff);
        }
    }
    entity.effect=entity.effect.filter((eff)=>eff.duration!=0);

}

function giveVoidEffect(entity){
    giveEffect(entity,"void",1);
}

function clearEffect(isLongLastingEffectCleared){
    player.effect.forEach(eff=>{
        if(!eff.isCrossRound||isLongLastingEffectCleared){
            player.effect.splice(player.effect.findIndex(eff1=>eff1==eff),1);
        }
    })
}


