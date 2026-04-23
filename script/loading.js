var imageSet={};
var imageCount=0;
var imageOnload=0;
var imageReady=0;
function loadImg(path,source){
    if(!imageSet[source]){
        imageCount++;
        let img=new Image;
        img.src=`${path+source}`;
        imageSet[source]=img;
        imageSet[source].onload=()=>{
            console.log("resource loaded successfully");
            imageOnload++;
        }
    }
    
    return imageSet[source];

}
var loadResource=new function(){

    loadImg("image/character/","Lagrange.jpg");
    loadImg("image/character/","Enemy1.jpg");
    loadImg("image/character/","Tairitsu.png");
    loadImg("image/character/","Hikari.png");
    loadImg("image/character/","TairitsuTempest.png");
    loadImg("image/character/","Nene.png");
    loadImg("image/status/","poison.png");
    loadImg("image/status/","revival.png");
    loadImg("image/status/","immortal.png");
    loadImg("image/skill/","fireball.png");
    loadImg("image/skill/","fireball-cd.png");
    loadImg("image/skill/","flash.png");
    loadImg("image/skill/","flash-cd.png");
    loadImg("image/skill/","sacriPunch.png");
    loadImg("image/skill/","sacriPunch-cd.png");
    loadImg("image/skill/","heal.png");
    loadImg("image/skill/","heal-cd.png");
    loadImg("image/color/","colorRed.png");
    loadImg("image/color/","colorBlue.png");
    loadImg("image/color/","colorWhite.png");
    loadImg("image/color/","colorBlack.png");
    loadImg("image/color/","colorGreen.png");
    loadImg("image/block/","wall.png");
    loadImg("image/block/","poisonBlock.png");
    loadImg("image/block/","tracker.png");
    loadImg("image/block/","warning2.png");
    loadImg("image/key/","arrowUp.png");
    loadImg("image/key/","arrowDown.png");
    loadImg("image/key/","arrowLeft.png");
    loadImg("image/key/","arrowRight.png");
    checkResource();
}

function checkResource(){
    srcCheck=setInterval(() => {
        if(imageCount=imageOnload){
            imageReady=1;
            console.log(`images loaded!`)
            clearInterval(srcCheck);
        }
    }, 50);
}


