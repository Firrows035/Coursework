var player={
    id:"player",
    source:"Lagrange.jpg",
    baseMhp:150,
    baseMmp:80,
    baseDef:5,
    baseAtk:20,
    baseMat:20,
    baseMdf:5,
    baseAtkR:2,
    hp:9999,
    mhp:150,
    mp:9999,
    mmp:80,
    def:5,
    atk:20,
    mat:20,
    mdf:5,
    dmgBoost:1,    
    atkR:2,
    X:10,//0-29, 0px-1500px
    Y:6,//0-14, 0px-750px
    effect:[],
    isSelectable:true,
    selector:{
        type:"troop",
        color:"red",
        offsetX:500,
        offsetY:300,
        width:50,
        height:50,
        description:{
            id:"You",
            icon:"Lagrange.jpg",
            text:"undefined",
        },
        
    },
    action(act,target){
        switch(act){
            case "move":
                return playerMove(target);
            case "halt":
                return 1;
            case "skill":
                return playerPlaySkill(target);
            case "attack":
                return this.attack(target);
        }
    },
    attack(target){
        if(distanceBetweenEntity(this,target)<=this.atkR&&!isPathBlocked(this.X,this.Y,target.X,target.Y)){
            this.dealDamageTo(target,this.atk,false);
            return 1;
        }
        else return 0;
    },
    updateSelector(){
        this.selector.offsetX=this.X*50;
        this.selector.offsetY=this.Y*50;
    },
    onMouseOver(){
        displayDescription(this);
    },
    onClick(){
        playerTurn("halt");
    },
    dealDamageTo(target,damage,isMagic){
        if(isMagic){
            target.hp=max(0,target.hp-max(damage*0.05,damage*(1-target.mdf/100))*this.dmgBoost);
        }else{
            target.hp=max(0,target.hp-max(damage*0.05,damage-target.def)*this.dmgBoost);
        }
    }
}
function playerPlaySkill(target){
    if(skillReady){
        let skil=skill.get(skillReady);
        if(skil.spell(target)){
            player.mp-=skil.cost;
            skil.cdt=skil.cd;
            skil.isSelected=0;
            skillReady=0;
            return 1;
        }
        skillReady=0;
    }
    return 0;
}
function playerMove(direction){
    if(currentStage!="battle"){
        return 0;
    }
    if(actionCooldown){
        return 0;
    }
    actionCooldown=1;
    setTimeout(()=>{actionCooldown=0;},100);
    let xtemp=player.X;
    let ytemp=player.Y;
    switch(direction){
        case "w":
            player.Y=Math.max(player.Y-1,0);
            break;
        case "a":
            player.X=Math.max(player.X-1,0);
            break;
        case "s":
            player.Y=Math.min(player.Y+1,14);
            break;
        case "d":
            player.X=Math.min(player.X+1,29);
            break;
        case " ":
            break;
        default:
            break;
    }
    if(!isPosAvaliableLE1(player.X,player.Y)){
        player.X=xtemp;
        player.Y=ytemp;
    }
    return 1;
}

function playerHeal(hp){
    player.hp=Math.min(player.hp+hp,player.mhp);
}
function dealDamage(emy,dmg,isMagic){
    if(isMagic){
        emy.hp=max(0,emy.hp-max(dmg*0.05,dmg*(1-emy.mdf/100))*(1+boost.player.dmg/100))
    }
    else{
        emy.hp=max(0,emy.hp-max(dmg*0.05,dmg-emy.def)*(1+boost.player.dmg/100));
    }
}
function takeDamage(dmg,isMagic){
    if(isMagic){
        player.hp=max(0,player.hp-max(dmg*0.05,dmg*(1-player.mdf/100))*(1+boost.enemy.dmg/100))
    }
    else{
        player.hp=max(0,player.hp-max(dmg*0.05,dmg-player.def)*(1+boost.enemy.dmg/100));
    }
}
function checkPlayerStat(){
    player.hp=min(player.hp,player.mhp);
    player.mp=min(player.mp,player.mmp);
    if(player.hp<=0){
        currentStage="failure";
        projectile=[];
        audio.pause();
        requestAnimationFrame(failurePage);
    }
}
function updatePlayerStat(){
    player.mhp=player.baseMhp*(1+boost.player.mhp/100);
    player.mmp=player.baseMmp*(1+boost.player.mmp/100);
    player.def=player.baseDef*(1+boost.player.def/100);
    player.atk=player.baseAtk*(1+boost.player.atk/100);
    player.mat=player.baseMat*(1+boost.player.mat/100);
    player.mdf=player.baseMdf*(1+boost.player.mdf/100);
    player.dmgBoost=1+boost.player.dmg/100;
    player.atkR=player.baseAtkR+boost.player.atkR;
}
function updateEnemyStat(){
    for(let emy of enemy){
        emy.mhp=emy.baseMhp*(1+boost.emy.mhp/100);
        emy.mmp=emy.baseMmp*(1+boost.emy.mmp/100);
        emy.def=emy.baseDef*(1+boost.emy.def/100);
        emy.atk=emy.baseAtk*(1+boost.emy.atk/100);
        emy.mat=emy.baseMat*(1+boost.emy.mat/100);
        emy.mdf=emy.baseMdf*(1+boost.emy.mdf/100);
        emy.dmgBoost=1+boost.emy.dmg/100;
        emy.atkR=emy.baseAtkR+boost.emy.atkR;
    }
}