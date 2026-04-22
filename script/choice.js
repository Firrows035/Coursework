//might be replaced in later version

var choiceCount=0;
function addChoice(name,buff,description,weight,selectableTime){
    choiceCount++;
    choice[choiceCount]={
        name:name,
        buff:buff,
        description:description,
        weight:weight,
        selectableTime:selectableTime,
    }
    return choice[choiceCount];
}

addChoice(`atk++mhp--`,
    ()=>{
        boost.player.atk+=150;
        player.baseMhp-=player.baseMhp*0.8;
        boost.player.atkR+=3;
        updatePlayerStat();
    },
    `物理攻击力+150%,基础hp-80%, 攻击距离+3`,1,1);
addChoice(`def+`,
    ()=>{
        player.baseDef+=5;
        updatePlayerStat();
    },
    `基础防御力+5`,1,4);
addChoice(`dmg+`,()=>{
        boost.player.dmg+=5;
        updatePlayerStat();
    },
    `造成伤害+10%`,2,-1);
addChoice(`mhp+`,()=>{
        boost.player.mhp+=10;
        updatePlayerStat();
    },
    `hp上限+10%`,1,-1);
addChoice(`mmp+`,()=>{
        boost.player.mmp+=10;
        updatePlayerStat();
    },  
    `mp上限+10%`,1,-1);
addChoice(`mat+`,()=>{
        boost.player.mat+=10;
        updatePlayerStat();
    },
    `法术攻击力+10%`,1,-1);    
addChoice(`atkR+`,()=>{
        boost.player.atkR+=1;
        updatePlayerStat();
    },
    `近战攻击距离+1`,5,2); 

addChoice(`mat++`,()=>{
        boost.player.mat+=200;
        boost.player.mmp-=50;
        choice[8].weight=999;
        updatePlayerStat();
},
`法术攻击力+200%,mp上限-50%`,5,1);
addChoice(`atk+`,()=>{
    boost.player.atk+=10;
    updatePlayerStat();
},
`物理攻击力+10%`,2,-1);
addChoice(`cd-`,()=>{
    cooldownPerTurn+=1;
    boost.player.mmp+=100;
    boost.player.dmg-=20;
    updatePlayerStat();
},
"技能冷却-50%，mp上限+100%，造成伤害-20%",3,1);
addChoice("atk++/Eatk+",()=>{
    boost.player.atk+=40;
    boost.player.mat+=40;
    boost.enemy.atk+=20;
    updatePlayerStat();
},
"物理攻击力+40%，法术攻击力+40%，敌人攻击力+20%",4,5);



function randChoice(){
    let c=random(1,choiceCount);
    if(random(1,choice[c].weight)>1||choice[c].selectableTime==0) return randChoice();
    else return c;
}
var c1;
var choiceChosen=1;
function setChoice(){
    if(currentStage=="intermission"){
        choiceSlot.forEach(slot=>{
            c1=randChoice();
            slot.selector.description.id=c1;
            slot.selector.description.text=choice[c1].description;
        })
    }
    choiceChosen=0;
}
function choose(c){
    if(currentStage!="intermission") return;
    choiceChosen=1;
    choice[c].buff();
    if(choice[c].selectableTime>0){
        choice[c].selectableTime--;
    }
    choiceChosen=1;
}