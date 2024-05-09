'use strict';

let canvas, engine, scene, camera;

window.addEventListener('DOMContentLoaded', () => {
    // il tag canvas che visualizza l'animazione
    canvas = document.getElementById('c');
    // la rotella del mouse serve per fare zoom e non per scrollare la pagina
    canvas.addEventListener('wheel', evt => evt.preventDefault(), {passive:false});
    
    // engine & scene
    engine = new BABYLON.Engine(canvas, true);
    scene = new BABYLON.Scene(engine);
    scene.ambientColor.set(0.75,0.75,0.75)

    // camera
    camera = new BABYLON.ArcRotateCamera('cam', 
            -2.43, 1.22,
            20, 
            new BABYLON.Vector3(0,0,0), 
            scene);
    camera.attachControl(canvas,true);
    camera.wheelPrecision = 50;
    camera.lowerRadiusLimit = 3;
    camera.upperRadiusLimit = 13*2;  
    camera.fov = 0.5;          
    
    // luce
    let light1 = new BABYLON.PointLight('light1',new BABYLON.Vector3(0,1,0), scene);
    light1.parent = camera;
    
    // aggiungo i vari oggetti
    populateScene(scene);
    
    // main loop
    engine.runRenderLoop(()=>scene.render());

    // resize event
    window.addEventListener("resize", () => engine.resize());

});

function populateScene() {
    createGrid(scene);
    let R = 4.0;

    let ring = BABYLON.MeshBuilder.CreateTorus('a', {
        diameter:R*2,
        thickness:0.1,
        tessellation:70
    })
    ring.material = new BABYLON.StandardMaterial('a'); 
    ring.material.diffuseColor.set(0.8,0.4,0.03)
    let ring2 = ring.createInstance('a');
    ring2.rotation.x = Math.PI/2;

    let box = BABYLON.MeshBuilder.CreateBox('a', {size:1})
    let material = new BABYLON.StandardMaterial('a');
    box.material = material;
    material.diffuseColor.set(0.4,0.6,0.7);
    material.specularColor.set(0.02,0.02,0.02);


    let boxes = [box];
    let m = 50;
    for(let i=1;i<m;i++) boxes.push(box.createInstance('i'+i));
    for(let i=0;i<m;i++)
    {
        let x = -R + 2*R*(1+i)/(m+1);
        let dx = 0.3*2*R/(m+1);
        let dz = 2.0*Math.sqrt(R*R-x*x);
        let b = boxes[i];
        b.scaling.set(dx,dz,dz);
        b.position.set(x,0,0);
    } 
}

