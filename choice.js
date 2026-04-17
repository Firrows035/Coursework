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

addChoice(`atk+`,
    ()=>{
        boost.player.atk+=100;
        boost.player.mhp-=80;
        boost.player.atkR+=2;
        updatePlayerStat();
    },
    `物理攻击力+100%,hp上限-80%, 攻击距离+3`,1,1);
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
        boost.player.mat+=5;
        updatePlayerStat();
    },
    `法术攻击力+5%`,1,-1);    
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
    boost.enemy.atk+=20;
    updatePlayerStat();
},
"物理攻击力+40%，敌人攻击力+20%",4,5);



function randChoice(){
    let c1=random(1,choiceCount);
    if(random(1,choice[c1].weight)>1||choice[c1].selectableTime==0) return randChoice();
    else return c1;
}
var c1,c2,c3,p1,p2,p3;
function setChoice(){
    if(intermisson){
        c1=randChoice();
        p1=document.createElement("p");;
        choiceSet[0].appendChild(p1);
        p1.appendChild(document.createTextNode(choice[c1].description));

        c2=randChoice();
        p2=document.createElement("p");
        choiceSet[1].appendChild(p2);
        p2.appendChild(document.createTextNode(choice[c2].description));

        c3=randChoice();
        p3=document.createElement("p");
        choiceSet[2].appendChild(p3);
        p3.appendChild(document.createTextNode(choice[c3].description));

        changeClassStyle("choice",{display:"flex"});
    }
}