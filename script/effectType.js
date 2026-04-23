var effectType=new Map();

effectType.set("poison",{
    id:"poison",
    source:"poison.png",
    gain(target){
        return 0;
    },
    playerTurnStart(target){
        if(target==player) target.hp=max(1,target.hp-target.mhp*0.05);
        else target.hp=max(1,target.hp-1);
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