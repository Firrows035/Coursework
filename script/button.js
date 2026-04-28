var button=[];
var startB=new function(){
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
            type:"button",
            offsetX:925,
            offsetY:700,
            width:200,
            height:60,
            color:"blue",
            description:{
                id:"start",
                icon:"None",
                text:"Start"
            },
        },
        onMouseOver(){
            drawRect(2,this.selector.color,this.selector.offsetX+2,this.selector.offsetY+2,this.selector.width-4,this.selector.height-4);
        },
        onClick(){
            if(currentStage=="startReady"){
                if(imageReady){
                    currentStage="prologue";
                    audio.play();
                    characterPage();  
                    return 1;      
                }else{
                    console.log(`Loading resources. Please wait...`);
                    return 0;
                }
            }
        }
    })    
}
var restartB=new function(){
    button.push({
        id:"restart",
        attendance:["failure"],
        isDisplayed(){
            if(this.attendance.find((atd)=>atd==currentStage)!=undefined){
                return 1;
            }else{
                return 0;
            }
        },
        selector:{
            type:"button",
            offsetX:875,
            offsetY:700,
            width:300,
            height:60,
            color:"blue",
            description:{
                id:"restart",
                icon:"None",
                text:"Re-Start"
            },
        },
        onMouseOver(){
            drawRect(2,this.selector.color,this.selector.offsetX+2,this.selector.offsetY+2,this.selector.width-4,this.selector.height-4);
        },
        onClick(){
            if(currentStage=="failure"){
                initialize();
            }
        }
    })    
}
var continueB=new function(){
    button.push({
        id:"continue",
        attendance:["pause"],
        isDisplayed(){
            if(this.attendance.find((atd)=>atd==currentStage)!=undefined){
                return 1;
            }else{
                return 0;
            }
        },
        selector:{
            type:"button",
            offsetX:875,
            offsetY:700,
            width:300,
            height:60,
            color:"blue",
            description:{
                id:"continue",
                icon:"None",
                text:"continue"
            },
        },
        onMouseOver(){
            drawRect(2,this.selector.color,this.selector.offsetX+2,this.selector.offsetY+2,this.selector.width-4,this.selector.height-4);
        },
        onClick(){
            if(currentStage=="pause"){
                currentStage=lastStage;
                audio.play();
                onMouseMove();
            }
        }
    })    
}
var pauseB=new function(){
    button.push({
        id:"pause",
        attendance:["battle","intermission"],
        isDisplayed(){
            if(this.attendance.find((atd)=>atd==currentStage)!=undefined&&!skillReady){
                return 1;
            }else{
                return 0;
            }
        },
        selector:{
            type:"button",
            offsetX:1050,
            offsetY:950,
            width:100,
            height:40,
            color:"red",
            description:{
                id:"pause",
                icon:"None",
                text:"pause"
            },
        },
        onMouseOver(){
            drawRect(2,this.selector.color,this.selector.offsetX+2,this.selector.offsetY+2,this.selector.width-4,this.selector.height-4);
        },
        onClick(){
            lastStage=currentStage;
            currentStage="pause";
            audio.pause();
            onMouseMove();
        }
    })    
}
var optionsB=new function(){
    button.push({
        id:"options",
        attendance:["battle","intermission","prologue"],
        isDisplayed(){
            if(this.attendance.find((atd)=>atd==currentStage)!=undefined&&!skillReady){
                return 1;
            }else{
                return 0;
            }
        },
        selector:{
            type:"button",
            offsetX:940,
            offsetY:900,
            width:150,
            height:40,
            color:"blue",
            description:{
                id:"options",
                icon:"None",
                text:"options"
            },
        },
        onMouseOver(){
            drawRect(2,this.selector.color,this.selector.offsetX+2,this.selector.offsetY+2,this.selector.width-4,this.selector.height-4);
        },
        onClick(){
            // lastStage=currentStage;
            // currentStage="setting";
            // onMouseMove();
        }
    })
}
var nextStageB=new function(){
    button.push({
        id:"nextStage",
        attendance:["intermission"],
        isDisplayed(){
            if(this.attendance.find((atd)=>atd==currentStage)!=undefined&&choiceChosen){
                return 1;
            }else{
                return 0;
            }
        },
        selector:{
            type:"button",
            offsetX:550,
            offsetY:500,
            width:400,
            height:80,
            color:"blue",
            description:{
                id:"nextStage",
                icon:"None",
                text:"next stage"
            },
        },
        onMouseOver(){
            drawRect(2,this.selector.color,this.selector.offsetX+2,this.selector.offsetY+2,this.selector.width-4,this.selector.height-4);
        },
        onClick(){
            if(currentStage=="intermission"&&choiceChosen){
                currentStage="battle";
                beginRound();
            }
        }
    })    
}
