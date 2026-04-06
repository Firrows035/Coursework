//maybe some console commands, to make your adventure easier(?)...

function setMaxHp(MHP){
    player.mhp=MHP;
    player.hp=MHP;
    drawPlayerStat();
}
function setMaxMP(MMP){
    player.mmp=MMP;
    player.mp=MMP;
    drawPlayerStat();
}
function recoverMP(x){
    player.mp=Math.min(player.mmp,player.mp+x);
    drawPlayerStat();
}
function recoverHP(x){
    player.hp=Math.min(player.mhp,player.hp+x);
    drawPlayerStat();
}
