var choiceSlot=[];
function addChoiceSlot(slotName,usage,x,y,width,height,description,font,color,onMouseOver,onClick){
    choiceSlot.push({
        slotName:slotName,
        usage:usage,
        X:x,
        Y:y,
        width:width,
        height:height,
        description:{
            content:description,
            font:font,
            color:color,
        },
        onClick:onClick,
        onMouseOver:onMouseOver,
    })
}