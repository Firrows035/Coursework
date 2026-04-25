var skill=new Map();
var skillCount=0;
var skillReady=0;
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
        createProjectile("fireball",player.X,player.Y,x,y,player.mat*2,true);
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
        return 1;
    }
}
function heal(event){
    if(player.hp==player.mhp) return 0;
    player.hp=min(player.mhp,player.hp+1.2*player.mat);
    return 1;
}