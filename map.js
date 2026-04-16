var map=[];

map.push([
    ["block","wall",[
        [3,2],[3,3],[3,4],[3,5],[3,6],[12,11],[12,12]
    ]],
    ["spawnpoint",[6,6]],
    ["block","poisonArea",[
        [10,6],[10,7],[11,6],[11,7]
    ]]
])

function loadmap(i){
    clearBlocks();
    map[i].forEach(item=>{
        if(item[0]=="spawnpoint"){
            player.X=item[1][0];
            player.Y=item[1][1];
        }
        if(item[0]=="block"){
            let type=item[1];
            item[2].forEach(pos=>{
                addBlock(type,pos[0],pos[1]);
            })
        }
    })
}