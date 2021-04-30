return {
  parameters: [
    {name: "length", default: 100},
    {name: "assemblies", default: [{length: 30, width:5, position:0},
                                  {length: 40, width:3, position:32}]},
    {name: "color", default: "red"},
  ],
  
  func: function (sketch, length, assemblies, color) {
    const sketches =[];
    const EdgeHatch = sketch.rectangle(0,0,length,20)
    .fill(color)
    .stroke("transparent",0);
    const Edge = sketch.polycurve(
    [0,0],[length,0]).name("edge");
    sketches.push(EdgeHatch);
    sketches.push(Edge);
    
    if(assemblies.length > 0){
       assemblies.forEach(assembly =>{
       const Assembly = sketch.user.assembly(
         assembly.length, 
         assembly.width, 
         assembly.left, 
         assembly.right).translate(assembly.position,-assembly.width-1)
       sketches.push(Assembly);
      })
    }
    else{
    const Placeholder = sketch.rectangle(0,-6,length,-1)
    .fill("transparent")
    sketches.push(Placeholder);
    }
    return sketch.add(...sketches);
  }
}