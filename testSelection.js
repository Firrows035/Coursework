var selection=[];
function addSelection(selectionName,x,y,width,height,description,font,color,onMouseOver,onClick){
    selection.push({
        selectionName:selectionName,
        offsetX:x,
        offsetY:y,
        width:width,
        height:height,
        description:{
            content:description,
            color:color,
            font:font,
        },
        onMouseOver:onMouseOver,
        onClick:onClick
    })
}

function highlightSelection(selec){
    drawRect(2,"red",selec.offsetX,selec.offsetY,selec.Width,selec.height);
}