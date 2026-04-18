var info;
var canvas;
var context;
var rect;
var scaleX;
var scaleY;

var mouseX=0;
var mouseOffsetX=0;
var mouseY=0;
var mouseOffsetY=0;

var block=[];
var enemyCount=0;
var enemyDefeated=0;
var enemyAlive=0;
var enemyInround=0;



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
var currentStage="initiate";

var choice={};


//due to the fukin' delay.. Now no delays but we need to restrict game speed
var actionCooldown=0;


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
//i guess it might be useful...
var seed=""+Math.floor(Math.random()*Math.pow(10,16))+Math.floor(Math.random()*Math.pow(10,16));
var mouseMoveCd=0;
function changeClassStyle(className,styles){
    let c=Array.from(document.getElementsByClassName(`${className}`));
    c.forEach(ce=>{
        Object.assign(ce.style,styles);
    });
}
function isPosAvaliableLE1(x,y){
    let c=0;
    enemy.forEach(emy=>{
        if(emy.X==x&&emy.Y==y&&emy.isDefeat==0){
            c++;
        }
    })
    if(player.X==x&&player.Y==y){
        c++;
    }
    block.forEach(bloc=>{
        if(bloc.X==x&&bloc.Y==y&&bloc.isOnField&&!bloc.isPassable){
            c++;
        }
    })
    return c<=1;
}
function isPosAvailableL1(x,y){
    let c=0;
    enemy.forEach(emy=>{
        if(emy.X==x&&emy.Y==y&&emy.isDefeat==0){
            c++;
        }
    })
    if(player.X==x&&player.Y==y){
        c++;
    }
    block.forEach(bloc=>{
        if(bloc.X==x&&bloc.Y==y&&bloc.isOnField&&!bloc.isPassable){
            c++;
        }
    })
    return c<1;
}

function checkPosition(x,y){
    if(player.X==x&&player.Y==y){
        return ["player",0];
    }
    for(let i=enemyCount-enemyInround+1;i<=enemyCount;i++){
        if(enemy[i].X==x&&enemy[i].Y==y&&enemy[i].isDefeat==0){
            return ["enemy",i];
        }
    }
    return ["empty",0];
}
function distanceEnemyToPlayer(count){
    return Math.abs(player.X-enemy[count].X)+Math.abs(player.Y-enemy[count].Y);
}
function directionEnemyToPlayer(count){
    return [player.X-enemy[count].X,player.Y-enemy[count].Y];
}
function directionToPosition(p0,p1){
    return [p1[0]-p0[0],p1[1]-p0[1]];
}
function distanceBetweenPosition(x1,y1,x2,y2){
    return Math.abs(x1-x2)+Math.abs(y1-y2);
}
function distanceEnemyToProjectile(Ecount,Pcount){
    return Math.sqrt((enemy[Ecount].X-projectileSet[Pcount].X)**2+(enemy[Ecount].Y-projectileSet[Pcount].Y)**2);
}
function distanceBetweenEntity(entity1,entity2){
    return Math.sqrt((entity1.X-entity2.X)**2+(entity1.Y-entity2.Y)**2);
}
function isPosLegal(x,y){
    if(x<=20&&x>=0&&y<=12&&y>=0)return 1;
    else return 0;
}
function isPathBlocked(x1,y1,x2,y2){
    let sign=0;
    if(isPosLegal(x1,y1)&&isPosLegal(x2,y2)){
        block.forEach(bloc=>{
            if(sign) return;
            let bx1=bloc.X-0.5,bx2=bloc.X+0.5;
            let by1=bloc.Y-0.5,by2=bloc.Y+0.5;

            if(!bloc.isPassable&&(x1-bloc.X)*(x2-bloc.X)<=0&&(y1-bloc.Y)*(y2-bloc.Y)<=0){
                let j1=lineRelation(x1,y1,x2,y2,bx1,by1,bx2,by2);
                if(j1[0]=="overlap"){
                    sign=1;
                }
                else if(j1[0]=="intersect"){
                    if(j1[1]){
                        sign=2;
                    }
                }
                let j2=lineRelation(x1,y1,x2,y2,bx1,by2,bx2,by1);
                if(j2[0]=="overlap"){
                    sign=3;
                }
                else if(j2[0]=="intersect"){
                    if(j2[1]){
                        sign=4;
                    }
                }
            }            
        })
    }
    return sign;
}
function lineRelation(x1,y1,x2,y2,x3,y3,x4,y4){
    let D0=(x3-x4)*(y2-y1)-(x2-x1)*(y3-y4);
    if(D0!=0){
        let D1=(y3-y1)*(x3-x4)-(x3-x1)*(y3-y4);
        let D2=(y2-y1)*(x3-x1)-(x2-x1)*(y3-y1);
        let t1=D1/D0;
        let t2=D2/D0;
        return ["intersect",t1>0&&t1<1&&t2>0&&t2<1,[(x2-x1)*t1+x1,(y2-y1)*t1+y1]];
    }
    else if(y3-y1==x3-x1){
        return ["overlap"];
    }
    else{
        return ["parallel"];
    }
}



