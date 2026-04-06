var info;
var canvas;
var context;
var imageSet={};

var enemySet={};
var enemyCount=0;
var enemyDefeated=0;
var enemyAlive=0;
var enemyInturn=0;

var skillSet={};
var skillCount=0;
var skillReady=0;

var projectileSet={};
var projectileCount=0;

var turn=0;

var boost={
    enemy:{
        atk:0,
        def:0,
        mat:0,
        mdf:0,
        mhp:0,
        dmg:0,
    },
    player:{
        atk:0,
        def:0,
        mat:100,
        mdf:0,
        mmp:0,
        mhp:0,
        dmg:0,
    }
}

var onBattle=0;
var startReady=0;
var intermisson=0;

//due to the fukin' delay..
var actionCooldown=0;

var player={
    hp:100+boost.player.mhp,
    mhp:100+boost.player.mhp,
    mp:50+boost.player.mmp,
    mmp:50+boost.player.mmp,
    def:0+boost.player.def,
    atk:15*(1+boost.player.atk/100),
    mat:15*(1+boost.player.mat/100),
    mdf:0+boost.player.mdf,
    dmgBoost:1+boost.player.dmg/100,    

    
    X:10,//0-20, 0px-1000(1050)px
    Y:6,//0-12, 0px-600(650)px
}
var enemySpawnPoint=[];
for(let i=3;i<=20;i+=3){
    for(let j=2;j<=12;j+=3){
        enemySpawnPoint[(i-3)/3*4+(j+1)/3]=[i,j];
    }
}


var time=new Date();

//i guess it might be useful...
var seed=""+Math.floor(Math.random()*Math.pow(10,16))+Math.floor(Math.random()*Math.pow(10,16));



function Click(event){
    if(startReady===1){
        startReady=-1;
        onBattle=1;
        turn++;
        beginTurn();
        return;
    }
    if(skillReady){
        if(skillSet[skillReady].skill(event)){
            skillSet[skillReady].cdt=skillSet[skillReady].cd+1;
            player.mp-=skillSet[skillReady].cost;
        }
        skillReady=0;
    }
    if(intermisson===1){
        intermisson=0;
        onBattle=1;
        recoverHP(Math.max((player.mhp-player.hp)*0.8,player.mhp*0.2));
        recoverMP(Math.max((player.mmp-player.mp)*0.5,player.mmp*0.2));
        turn++;
        beginTurn();
    }
}

