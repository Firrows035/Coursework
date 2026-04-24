var button=[];
button.push({
    id:"start",
    attendance:["startReady"],
    isDisplayed(){
        if(this.attendance.find((atd)=>atd==currentStage)!=undefined){
            return 1;
        }else{
            return 0;
        }
    },
    selector:{
        offsetX:800,
        offsetY:700,
        width:200,
        height:60,
        color:"blue",
        description:{
            id:"Sstart",
            icon:"None",
            text:"Start"
        },
        onMouseMove(){
             drawRect(2,this.selector.color,this.selector.offsetX+2,this.selector.offsetY+2,this.selector.width-4,this.selector.height-4);
        },
        onClick(){
            if(currentStage=="startReady"){
                if(imageReady){
                    currentStage="prologue";
                    characterPage();  
                    return 1;      
                }else{
                    console.log(`Loading resources. Please wait...`);
                    return 0;
                }
            }
        }
    }
})