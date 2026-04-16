var info;
var canvas;
var context;

var choiceSet;

var mouseX=0;
var mouseY=0;

var enemy=[];
var block=[];
var enemyCount=0;
var enemyDefeated=0;
var enemyAlive=0;
var enemyInround=0;

var skillSet=[];
var skillCount=0;
var skillReady=0;

var projectileSet=[];
var projectileCount=0;

var round=0;

var description="";
var playerBio=``;

var boost={
    enemy:{
        atk:0,
        def:0,
        mat:0,
        mdf:0,
        mhp:0,
        dmg:0,
        atkR:0,
    },
    player:{
        atk:0,
        def:0,
        mat:0,
        mdf:0,
        mmp:0,
        mhp:0,
        dmg:0,
        atkR:0,
    }
};

var onBattle=0;
var startReady=0;
var intermisson=0;

var choice={};


//due to the fukin' delay.. Now no delays but we need to restrict game speed
var actionCooldown=0;

var player={
    baseMhp:100,
    baseMmp:80,
    baseDef:5,
    baseAtk:15,
    baseMat:15,
    baseMdf:5,
    baseAtkR:2,
    hp:100+boost.player.mhp,
    mhp:100+boost.player.mhp,
    mp:80+boost.player.mmp,
    mmp:80+boost.player.mmp,
    def:5+boost.player.def,
    atk:15*(1+boost.player.atk/100),
    mat:15*(1+boost.player.mat/100),
    mdf:5+boost.player.mdf,
    dmgBoost:1+boost.player.dmg/100,    
    atkR:2+boost.player.atkR,
    
    X:10,//0-20, 0px-1000(1050)px
    Y:6,//0-12, 0px-600(650)px
    effect:[],
}

function random(min,max){
    return Math.floor(Math.random()*(max-min+1)-Number.EPSILON)+min;
}
// function testRand(){
//     let sum=0;
//     for(let i=1;i<=1000000;i++){
//         if(random(0,10)>10){
//             console.log("problem!");
//         }
//         sum+=random(0,10);
//     }
//     sum=sum/1000000;
//     console.log(sum);
// }
function floor(x){
    return Math.floor(x);
}
function min(x,y){
    return Math.min(x,y);
}
function max(x,y){
    return Math.max(x,y);
}
function abs(x){
    return Math.abs(x);
}


var time=new Date();

//i guess it might be useful...
var seed=""+Math.floor(Math.random()*Math.pow(10,16))+Math.floor(Math.random()*Math.pow(10,16));



function Click(event){
    let X=floor(event.offsetX/50);
    let Y=floor(event.offsetY/50);
    if(startReady===1){
        if(imageReady){
            startReady=-1;
            onBattle=1;
            round++;
            beginTurn();            
        }
        else{
            console.log(`Loading resources. Please wait...`);
            return 0;
        }

    }
    if(skillReady){
        skillSet[skillReady].isSelected=0;
        if(skillSet[skillReady].skill(event)){
            skillSet[skillReady].cdt=skillSet[skillReady].cd+1;
            player.mp-=skillSet[skillReady].cost;
            skillReady=0;
        }
        else{
            skillReady=0;
            drawSkillStat();
        }
    }
    else if(distanceBetweenPosition(X,Y,player.X,player.Y)<=1){
        playerMoveByClick(X,Y);
    }
    if(intermisson===1&&choiceChosen){
        intermisson=0;
        onBattle=1;
        boost.enemy.atk+=5;
        boost.enemy.mhp+=5;
        recoverHP(Math.max((player.mhp-player.hp)*0.8,player.mhp*0.2));
        recoverMP(Math.max((player.mmp-player.mp)*0.5,player.mmp*0.2));
        round++;
        beginTurn();
    }
}
var mouseMoveCd=0;
function onMouseMove(event){
    if(mouseMoveCd||onBattle==0){
        return;
    }
    mouseMoveCd=1;
    setTimeout(()=>{
        mouseMoveCd=0;
    },50);
    // console.log(event);
    let mx=floor(event.offsetX/50);
    let my=floor(event.offsetY/50);
    mouseX=mx;
    mouseY=my;
    // console.log(`${mx}, ${my}`);
    if(isPosLegal(mx,my)){
        drawBattlefieldStatic();
        drawBlockSelector(mx,my,"#ee1111");
        if(skillReady){
            skillSet[skillReady].drawSelector(mx,my);
        }
    }
}
function keyPress(e){
        console.log(e.key);
        e.preventDefault();
    if(e.key=="w"||e.key=="a"||e.key=="s"||e.key=="d"||e.key==" "){
        
        if(skillReady){
            skillSet[skillReady].isSelected=0;
            skillReady=0;
            // drawSkillStat();
        }
        playerMove(e.key);
    }
    if(e.key>="1"&&e.key<="9"){
        playSkill(+e.key);
    }
}





function choose(c){
    choiceChosen=1;
    choice[c].buff();
    if(choice[c].isDisposable){
        choice[c].weight=999999;
    }
    changeClassStyle("choice",{display:"none"});
    p1.remove();
    p2.remove();
    p3.remove();

}


function changeClassStyle(className,styles){
    let c=Array.from(document.getElementsByClassName(`${className}`));
    c.forEach(ce=>{
        Object.assign(ce.style,styles);
    });
}



