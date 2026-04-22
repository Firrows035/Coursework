function checkScene(){
    if(currentStage=="battle"&&enemy.length==0){
        currentStage="intermission";
        setChoice();
        projectile=[];
        setTimeout(()=>{requestAnimationFrame(intermissonPage)},50);
    }
}