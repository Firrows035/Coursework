function checkScene(){
    if(currentStage=="battle"&&enemyAlive==0){
        currentStage="intermission";
        clearProjectile();
        setTimeout(()=>{requestAnimationFrame(intermissonPage)},50);
    }
}