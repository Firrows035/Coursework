function checkScene(){
    if(currentStage=="battle"&&enemyAlive==0){
        currentStage="intermission";
        setChoice();
        clearProjectile();
        setTimeout(()=>{requestAnimationFrame(intermissonPage)},50);
    }
}