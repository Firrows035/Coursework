var skill=new Map();
var skillCount=0;
var skillReady=0;
var skillType=new Map();
skillType.set("fireball",{
    id:"fireball",
    spell:fireball,
    cost:5,
    cd:1,
    source:"fireball.png",
    sourceCD:"fireball-cd.png",
    targetSelector(){
        return;
    },
    isSelectable:true,
    selector:{
        type:"skillSlot",
        color:"red",
        offsetX:0,
        offsetY:0,
        width:0,
        height:0,
        description:{
            id:"fireball",
            icon:"fireball.png",
            text:"能对一定范围内敌人造成伤害的火球。"
        }
    },
    onMouseOver(){
        ;
    },
    onClick(){
        ;
    }
});
skillType.set("flashmove",{
    id:"flashmove",
    spell:flashmove,
    cost:5,
    cd:2,
    source:"flash.png",
    sourceCD:"flash-cd.png",
    targetSelector(){
        return;
    },
    isSelectable:true,
    selector:{
        type:"skillSlot",
        color:"red",
        offsetX:0,
        offsetY:0,
        width:0,
        height:0,
        description:{
            id:"flashmove",
            icon:"flash.png",
            text:"瞬间移动到任意合法位置！"
        }
    },
    onMouseOver(){
        ;
    },
    onClick(){
        ;
    }
});
skillType.set("sacriStrike",{
    id:"sacriStrike",
    spell:sacrificialStrike,
    cost:0,
    cd:9,
    source:"sacriPunch.png",
    sourceCD:"sacriPunch-cd.png",
    targetSelector:sacriStrikeSelector,
    isSelectable:true,
    selector:{
        type:"skillSlot",
        color:"red",
        offsetX:0,
        offsetY:0,
        width:0,
        height:0,
        description:{
            id:"sacrificialStrike",
            icon:"sacriPunch.png",
            text:"以20%的hp为代价，对周围所有敌人造成大额伤害。"
        }
    },
    onMouseOver(){
        ;
    },
    onClick(){
        ;
    }
});
skillType.set("heal",{
    id:"heal",
    spell:heal,
    cost:10,
    cd:5,
    source:"heal.png",
    sourceCD:"heal-cd.png",
    targetSelector(){
        return;
    },
    isSelectable:true,
    selector:{
        type:"skillSlot",
        color:"red",
        offsetX:0,
        offsetY:0,
        width:0,
        height:0,
        description:{
            id:"heal",
            icon:"heal.png",
            text:"恢复你的hp"
        }
    },
    onMouseOver(){
        ;
    },
    onClick(){
        ;
    }
});
function addSkill(typeName){
    let type=skillType.get(typeName);
    if(skillCount<9){
        skillCount++;
        skill.set(skillCount,{
            id:type.id,
            number:skillCount,
            spell:type.spell,
            cost:type.cost,
            cd:type.cd,
            cdt:0,
            source:type.source,
            sourceCD:type.sourceCD,
            isSelected:0,
            drawSelector:type.targetSelector,
            isSelectable:true,
            selector:{
                type:"skill",
                color:"blue",
                offsetX:110*skillCount-60,
                offsetY:760,
                width:100,
                height:100,
                description:{
                    id:type.selector.description.id,
                    icon:type.selector.description.icon,
                    text:type.selector.description.text,
                },
                update(i){
                    this.offsetX=110*i+50;
                }
            },
            onMouseOver(){
                drawRect(2,this.selector.color,this.selector.offsetX+2,this.selector.offsetY+2,this.selector.width-4,this.selector.height-4);
                displayDescription(this);
            },
            onClick(){
                prepareSkill(this);
            }
        })
        return 1;
    }
    return 0;
}

function prepareSkill(skillId){
    if(skillReady!=0){
       skill.get(skillReady).isSelected=0;
       skillReady=0;    
    }
    
    let skil;
    if(typeof skillId=="number"&&skillId>=1&&skillId<=9){
        for(let [id,item] of skill){
            skillId--;
            if(skillId==0){
                skil=item;
                break;
            }
        }
    }
    else if(typeof skillId=="object") skil=skillId;
    else return 0;
    if(actionCooldown){
        return 0;
    }
    if(player.hp==0){
        return 0;
    }
    if(skil.cdt>0){
        return 0;
    }
    if(skil.cost>player.mp){
        console.log("No Enough MP");
        return 0;
    }
    else{
        actionCooldown=1;
        setTimeout(()=>{actionCooldown=0;},100);
        skillReady=skil.number;
        skil.isSelected=1;
        drawBattlefieldStatic();
        skil.drawSelector(mouseX,mouseY);
        return skillReady;
    }
} 
function cdDown(t){
    for(let [id,skil] of skill){
        skil.cdt=max(skil.cdt-t,0);
    }
}
//skills
function flashmove(event){
    if(currentStage=="battle"){
        let x=Math.floor(event.offsetX*scaleX/50);
        let y=Math.floor(event.offsetY*scaleY/50);
        if(x==player.X&&y==player.Y){
            return 0;
        }
        let xtemp=player.X;
        let ytemp=player.Y;
        player.X=x;
        player.Y=y;
        if(isPosAvaliableLE1(x,y)&&isPosLegal(x,y)){
            playerTurn();
            return 1;
        }
        else{
            player.X=xtemp;
            player.Y=ytemp;
            return 0;
        }
    }
}
function fireball(event){
    if(currentStage=="battle"){
        let x=Math.floor(event.offsetX*scaleX/50);
        let y=Math.floor(event.offsetY*scaleY/50);
        console.log(x,y);
        let dx=x-player.X;
        let dy=y-player.Y;
        if(dx==0&&dy==0){
            return 0;
        }
        createProjectile("fireball",player.X,player.Y,dx,dy,player.mat*2,true);
        playerTurn();
        return 1;
    }
    else{
        return 0;
    }
}
function sacrificialStrike(event){
    if(currentStage=="battle"){
        if(player.hp<=player.mhp*0.1){
            return 0;
        }
        player.hp=max(1,player.hp-player.mhp*0.2);
        enemy.forEach(emy=>{
            if(emy.isDefeat==0&&distanceBetweenEntity(emy,player)<=6){
                dealDamage(emy,player.atk*5.5,false);
            }
        })
        playerTurn();
        return 1;
    }
}
function heal(event){
    if(player.hp==player.mhp) return 0;
    player.hp=min(player.mhp,player.hp+1.2*player.mat);
    return 1;
}