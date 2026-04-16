var effectType={};
function addEffectType(effectName,source,effectFunc,maxDuration){
    effectType[effectName]={
        source:source,
        effectFunc:effectFunc,
        maxDuration:maxDuration,
    }
}

function giveEffect(entity,effectName,duration){
    if(entity.effect.findIndex(eff=>eff.name==effectName)!=-1){
        entity.effect[entity.effect.findIndex(eff=>eff.name==effectName)].duration=min(duration+entity.effect[entity.effect.findIndex(eff=>eff.name==effectName)].duration,effectType[effectName].maxDuration);
    }
    else{
        entity.effect.push({
            name:effectName,
            effectFunc:effectType[effectName].effectFunc,
            duration:min(duration,effectType[effectName].maxDuration),
        })    
    }
    
}
function activateEffectsAll(){
    activateEffects(player);
    enemy.forEach(emy=>activateEffects(emy));
}

function activateEffects(entity){
    entity.effect.forEach(eff=>{
        eff.effectFunc(entity);
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

addEffectType("poison","poison.png",poison,10);
addEffectType("void","poison.png",()=>{},99);
