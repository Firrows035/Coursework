var effectType=new Map();

effectType.set("poison",{
    id:"poison",
    source:"poison.png",
    cache:[],
    gain(target,self){
        return 0;
    },
    playerTurnStart(target,self){
        if(target==player) target.hp=max(1,target.hp-target.mhp*0.05);
        else target.hp=max(1,target.hp-1);
        return 1;
    },
    playerTurnMiddle(target,self){
        return 0;
    },
    playerTurnEnd(target,self){
        return 0;
    },
    neutralTurnStart(target,self){
        return 0;
    },
    neutralTurnMiddle(target,self){
        return 0;
    },
    neutralTurnEnd(target,self){
        return 0;
    },
    enemyTurnStart(target,self){
        return 0;
    },
    enemyTurnMiddle(target,self){
        return 0;
    },
    enemyTurnEnd(target,self){
        return 0;
    },
    expire(target,self){
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
effectType.set("weakened",{
    id:"weakened",
    source:"poison.png",
    cache:[],
    gain(target,self){
        self.cache.push(target.atk,target.mat);
        target.atk-=target.atk*0.8;
        target.mat-=target.mat*0.8;
        return 0;
    },
    playerTurnStart(target,self){

        return 0;
    },
    playerTurnMiddle(target,self){
        return 0;
    },
    playerTurnEnd(target,self){
        return 0;
    },
    neutralTurnStart(target,self){
        return 0;
    },
    neutralTurnMiddle(target,self){
        return 0;
    },
    neutralTurnEnd(target,self){
        return 0;
    },
    enemyTurnStart(target,self){
        return 0;
    },
    enemyTurnMiddle(target,self){
        return 0;
    },
    enemyTurnEnd(target,self){
        return 1;
    },
    expire(target,self){
        target.atk+=self.cache[0]*0.8;
        target.mat+=self.cache[1]*0.8;
        return 0;
    },
    maxDuration:30,
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
    cache:[],
    gain(target,self){
        return 0;
    },
    playerTurnStart(target,self){  //不影响伤害结算
        return 0;
    },
    playerTurnMiddle(target,self){
        target.hp=max(target.hp,1);
        return 0;
    },
    playerTurnEnd(target,self){
        return 0;
    },
    neutralTurnStart(target,self){
        return 0;
    },
    neutralTurnMiddle(target,self){
        target.hp=max(target.hp,1);
        return 0;
    },
    neutralTurnEnd(target,self){
        return 0;
    },
    enemyTurnStart(target,self){
        return 0;
    },
    enemyTurnMiddle(target,self){
        target.hp=max(target.hp,1);
        return 1;
    },
    enemyTurnEnd(target,self){
        return 0;
    },
    expire(target,self){
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
            text:"hp不会低于1。"
        }
    }
});
effectType.set("revival",{
    id:"revival",
    source:"revival.png",
    cache:[],
    gain(target,self){
        return 0;
    },
    playerTurnStart(target,self){
        self.duration=round;
        return 0;
    },
    playerTurnMiddle(target,self){
        if(target.hp<=0){
            target.hp=target.mhp*0.5;
            giveEffect(target,"immortal",5,false);
            self.duration=0;
            return 0;
        }
        return 0;
    },
    playerTurnEnd(target,self){
        return 0;
    },
    neutralTurnStart(target,self){
        return 0;
    },
    neutralTurnMiddle(target,self){
        if(target.hp<=0){
            target.hp=target.mhp*0.5;
            giveEffect(target,"immortal",5,false);
            self.duration=0;
            return 0;
        }
        return 0;
    },
    neutralTurnEnd(target,self){
        return 0;
    },
    enemyTurnStart(target,self){
        return 0;
    },
    enemyTurnMiddle(target,self){
        if(target.hp<=0){
            target.hp=target.mhp*0.5;
            giveEffect(target,"immortal",5,false);
            self.duration=0;
            return 0;
        }
        return 0;
    },
    enemyTurnEnd(target,self){
        return 0;
    },
    expire(target,self){
        setCharacter("Tairitsu-Tempest");
        target.baseAtk*=(1+round**2/100);
        target.baseMat*=(1+round**2/100);
        target.baseMhp*=(1+round**2/100);
        target.baseMmp*=(1+round**2/100);
        return 0;
    },
    maxDuration:99,
    isSelectable:true,
    selector:{
        type:"effectType",
        color:"red",
        offsetX:0,
        offsetY:0,
        width:0,
        height:0,
        description:{
            id:"生存的意志",
            icon:"revival.png",
            text:"活下去，直到······"
        }
    }
});
effectType.set("void",{
    id:"void",
    source:"poison.png",
    cache:[],
    gain(target,self){
        return 0;
    },
    playerTurnStart(target,self){
        return 0;
    },
    playerTurnMiddle(target,self){
        return 0;
    },
    playerTurnEnd(target,self){
        return 0;
    },
    neutralTurnStart(target,self){
        return 0;
    },
    neutralTurnMiddle(target,self){
        return 0;
    },
    neutralTurnEnd(target,self){
        return 0;
    },
    enemyTurnStart(target,self){
        return 0;
    },
    enemyTurnMiddle(target,self){
        return 0;
    },
    enemyTurnEnd(target,self){
        return 0;
    },
    expire(target,self){
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
            text:"如果你在游戏里看到这段文字，说明你卡到bug了"
        }
    }
});