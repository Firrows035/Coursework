//might be replaced in later version

//已弃用
function addChoice(name,buff,description,weight,selectableTime){
    choiceCount++;
    choice[choiceCount]={
        name:name,
        buff:buff,
        description:description,
        weight:weight,
        selectableTime:selectableTime,
    }
    return choice[choiceCount];
}

function randChoice(){
    let c=random(0,choice.length-1);
    if(random(1,choice[c].weight)>1||choice[c].selectableTime==0) return randChoice();
    else return c;
}
var c1;
var choiceChosen=1;
function setChoice(){
    if(currentStage=="intermission"){
        for(let slot of choiceSlot){
            c1=randChoice();
            slot.choiceId=c1;
            slot.selector.description.id=choice[c1].name;
            slot.selector.description.text=choice[c1].description;
        }
    }
    choiceChosen=0;
}
function choose(c){
    if(currentStage!="intermission") return;
    choice[c].buff();
    if(choice[c].selectableTime>0){
        choice[c].selectableTime--;
    }
    choice=choice.filter((chc)=>chc.selectableTime!=0);
    choiceChosen=1;
}