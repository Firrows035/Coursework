function checkScene(){
    if(currentStage=="battle"&&enemy.length==0){
        currentStage="intermission";
        setChoice();
        clearProjectile();
        setTimeout(()=>{requestAnimationFrame(intermissonPage)},50);
    }
}