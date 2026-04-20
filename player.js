var player={
    source:"Lagrange.jpg",
    baseMhp:150,
    baseMmp:80,
    baseDef:5,
    baseAtk:20,
    baseMat:20,
    baseMdf:5,
    baseAtkR:2,
    hp:9999,
    mhp:150+boost.player.mhp,
    mp:9999,
    mmp:80+boost.player.mmp,
    def:5+boost.player.def,
    atk:20*(1+boost.player.atk/100),
    mat:20*(1+boost.player.mat/100),
    mdf:5+boost.player.mdf,
    dmgBoost:1+boost.player.dmg/100,    
    atkR:2+boost.player.atkR,
    X:10,//0-20, 0px-1000(1050)px
    Y:6,//0-12, 0px-600(650)px
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
        drawBattlefield();
    },
    dealDamageTo(target,damage,isMagic){
        if(isMagic){
            target.hp=max(0,target.hp-max(damage*0.05,damage*(1-target.mdf/100))*this.dmgBoost);
        }else{
            target.hp=max(0,target.hp-max(damage*0.05,damage-target.def)*this.dmgBoost);
        }
    }
}

function playerMove(direction){
    if(currentStage!="battle"){
        return;
    }
    if(actionCooldown){
        return;
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
            player.Y=Math.min(player.Y+1,12);
            break;
        case "d":
            player.X=Math.min(player.X+1,20);
            break;
        case " ":
            break;
        default:
            return;
    }
    if(!isPosAvaliableLE1(player.X,player.Y)){
        player.X=xtemp;
        player.Y=ytemp;
    }
    if(currentStage=="battle"){
        requestAnimationFrame(drawBattlefield);
    }
}
function playerMoveByClick(x,y){
    if(currentStage!="battle"){
        return;
    }
    if(actionCooldown){
        return;
    }
    actionCooldown=1;
    setTimeout(()=>{actionCooldown=0;},100);
    playerAttack();
    if(isPosAvailableL1(x,y)&&isPosLegal(x,y)){
        player.X=x;
        player.Y=y;
    }
    if(currentStage=="battle"){
        requestAnimationFrame(drawBattlefield);
    }
}

//已弃用
function playerAttack(){
    for(let i=1;i<=enemyCount;i++){
        if(enemy[i].isDefeat){
            continue;
        }
        if(distanceEnemyToPlayer(i)<=player.atkR&&!isPathBlocked(enemy[i].X,enemy[i].Y,player.X,player.Y)){
            dealDamage(i,player.atk,false);
        }
    }
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
        clearProjectile();
        setTimeout(()=>{requestAnimationFrame(failurePage)},50);
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