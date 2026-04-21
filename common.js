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

var enemyCount=0;
var enemyDefeated=0;
var enemyAlive=0;
var enemyInround=0;





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
    for(let i=0;i<enemy.length;i++){
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
    return Math.sqrt((enemy[Ecount].X-projectile[Pcount].X)**2+(enemy[Ecount].Y-projectile[Pcount].Y)**2);
}
function distanceBetweenEntity(entity1,entity2){
    return abs(entity1.X-entity2.X)+abs(entity1.Y-entity2.Y);
}
function isPosLegal(x,y){
    if(x<=29&&x>=0&&y<=14&&y>=0)return 1;
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
function isPosBlocked(x,y){
    for(let i=0;i<block.length;i++){
        if(block[i].X==x&&block[i].Y==y&&!block[i].isPassable) return true;
    }
    return false;
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
function searchPath(x0,y0,xEnd,yEnd){
    if(x0==xEnd&&y0==yEnd) return [x0,y0];
    let path=[[x0,y0,0]];
    let xtemp,ytemp;
    let pLength;
    let found=0;
    while(true){
        pLength=path.length;
        let p=random(0,1)*2-1
        let q=random(0,1)*2-1;
        for(let i=0;i<path.length;i++){
            xtemp=path[i][0]+p;
            ytemp=path[i][1];
            if(!isPosBlocked(xtemp,ytemp)&&isPosLegal(xtemp,ytemp)&&path.findIndex(key=>key[0]==xtemp&&key[1]==ytemp)==-1){
                path.push([xtemp,ytemp,i]);
            }
            if(xtemp==xEnd&&ytemp==yEnd){
                found=1;
                break;
            }
            xtemp=path[i][0];
            ytemp=path[i][1]+q;
            if(!isPosBlocked(xtemp,ytemp)&&isPosLegal(xtemp,ytemp)&&path.findIndex(key=>key[0]==xtemp&&key[1]==ytemp)==-1){
                path.push([xtemp,ytemp,i]);
            }
            if(xtemp==xEnd&&ytemp==yEnd){
                found=1;
                break;
            }
            xtemp=path[i][0];
            ytemp=path[i][1]-q;
            if(!isPosBlocked(xtemp,ytemp)&&isPosLegal(xtemp,ytemp)&&path.findIndex(key=>key[0]==xtemp&&key[1]==ytemp)==-1){
                path.push([xtemp,ytemp,i]);
            }
            if(xtemp==xEnd&&ytemp==yEnd){
                found=1;
                break;
            }
            xtemp=path[i][0]-p;
            ytemp=path[i][1];
            if(!isPosBlocked(xtemp,ytemp)&&isPosLegal(xtemp,ytemp)&&path.findIndex(key=>key[0]==xtemp&&key[1]==ytemp)==-1){
                path.push([xtemp,ytemp,i]);
            }
            if(xtemp==xEnd&&ytemp==yEnd){
                found=1;
                break;
            }
        }
        if(found){
            let tag=path[path.length-1][2];
            while(path[tag][2]!=0){
                tag=path[tag][2];
            }
            return [path[tag][0]-x0,path[tag][1]-y0];
        }
        if(pLength==path.length)  return -1;
    }
}

function randPosUnblocked(){
    let x=random(0,29),y=random(0,14);
    if(!isPosBlocked(x,y)) return [x,y];
    else return randPosUnblocked();
}
