
var scene, render, renderer, dollyCam, camera, viveController, clock, cube;
var tutorialWindows = new THREE.Object3D();
var dragCube = false;
var firstTimePressed = false;
var tempMatrix = new THREE.Matrix4();
var intersected = [];
var rayGeo, raycaster;
var rayGroup = new THREE.Group();
var robo;
var manager;

init();
render();
        
//=================================Init=Function==========================================================
function init(){
            
    //======================= Loading Manager ==================================================== 

        manager = new THREE.LoadingManager( () => {									//KUDOS MUGEN87
            const loadingScreen = document.getElementById( 'loading-screen' );
            loadingScreen.classList.add( 'fade-out' );
            // optional: remove loader from DOM via event listener
            //loadingScreen.addEventListener( 'transitionend', onTransitionEnd );
        } );

    //====================== Basic Setup =========================================================
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x000000); //0xd8d3cb

        renderer = new THREE.WebGLRenderer({antialias:true});
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.vr.enabled = true;
        renderer.vr.standing = true;
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        document.body.appendChild(renderer.domElement);
        
        document.body.appendChild(WEBVR.createButton(renderer));    //WEBVR BUTTON

        camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
        dollyCam = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
        dollyCam.add(camera);
        scene.add(dollyCam);

        clock = new THREE.Clock(); 

        var floorGeo = new THREE.PlaneBufferGeometry(200, 200, 20, 20);
        var floorMat = new THREE.MeshStandardMaterial({color: 0xd6eaad});
        var floor = new THREE.Mesh(floorGeo, floorMat);
        floor.position.set(0,0,0);
        floor.rotateX(-90* Math.PI/180);
        floor.receiveShadow = true;
        rayGroup.add(floor);

        var ambi = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambi);
        var point = new THREE.PointLight(0xffffff, 0.5);
        scene.add(point);
        point.position.set(0,10,0);
        point.castShadow = true;

        var cubeGeo = new THREE.BoxBufferGeometry(2,2,2);
        var cubeMat = new THREE.MeshStandardMaterial({color: 0x00ff00});
        cube = new THREE.Mesh(cubeGeo, cubeMat);
        cube.position.set(camera.position.x, camera.position.y, camera.position.z -5);
        cube.castShadow = true;
        cube.receiveShadow = true;
        rayGroup.add(cube);
        
        scene.add(rayGroup);

        robo();
    
        

        
    //====================== Controller ============================================

        viveController = new THREE.ViveController(0);
        viveController.standingMatrix = renderer.vr.getStandingMatrix();
        scene.add(viveController);
        loadController();

        createTutorial();
    
    //====================== RayCaster ============================================

        rayGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -1)]);
        line = new THREE.Line(rayGeo);
        line.name = 'line';
        line.scale.z = 5;
        viveController.add(line.clone());
        raycaster = new THREE.Raycaster();

         
}
//=========================== Init End===================================================

//================================ Render ===============================================

function render(){
    renderer.setAnimationLoop(render);
    renderer.render(scene, camera);
    viveController.update();
    if(dragCube == true){
        cube.position.y += 0.05;
    }
    if(clock.getElapsedTime() >= 30 || firstTimePressed === true){
        viveController.remove(tutorialWindows);
    };
    cleanIntersected();
    intersectObjects(viveController);
    if(clock.getElapsedTime() >= 2){
        robo.rotation.z += 0.01;
    };  
}

//================================= Render End ================================================


//================================= Controller Load ============================================
function loadController() {

    var loader = new THREE.OBJLoader();
    loader.setPath('models/obj/vive-controller/');
    loader.load('vr_controller_vive_1_5.obj', function(object) {
            var loader = new THREE.TextureLoader();
            loader.setPath('models/obj/vive-controller/');
            var controller = object.children[0];
            controller.material.map = loader.load('onepointfive_texture.png');
            controller.material.specularMap = loader.load('onepointfive_spec.png');
            viveController.add(object.clone());
        });
        viveController.add(tutorialWindows);
    }
    
viveController.addEventListener('triggerdown', onTriggerDown);
viveController.addEventListener('triggerup', onTriggerUp);
viveController.addEventListener('thumbpaddown', onThumbpadDown);
viveController.addEventListener('thumbpadup', onThumbpadUp);
viveController.addEventListener('gripsdown', onGripsDown);
viveController.addEventListener('gripsup', onGripsUp);

function onTriggerDown(){
    if (viveController.getButtonState('trigger') === true){
        dragCube = true;
        if(firstTimePressed == false){
            firstTimePressed = true;
            console.log('bam');
        }
    }   
}

function onTriggerUp(){
    if (viveController.getButtonState('trigger') === false){
        dragCube = false;
        console.log('bam');
    }
}

function onThumbpadDown(){
    robo.visible = true;
}

//============================= RayCaster =============================================================

function getIntersections(controller) {

    tempMatrix.identity().extractRotation(controller.matrixWorld);
    raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
    raycaster.ray.direction.set(0, 0, -1).applyMatrix4(tempMatrix);
    return raycaster.intersectObjects(rayGroup.children, true); 					// recursive true, to hit all object.child !

}

function intersectObjects(obj) {

    // Do not highlight when already selected
    if (obj.userData.selected !== undefined) return;

    var line = obj.getObjectByName('line');
    var intersections = getIntersections(obj);

    if (intersections.length > 0) {
        var intersection = intersections[0];
        var object = intersection.object;

        object.material.emissive.r = 1;
        intersected.push(object);
        line.scale.z = intersection.distance;
    }
    else {
        line.scale.z = 5;
    }
}

function cleanIntersected() {

    while (intersected.length) {
        var object = intersected.pop();
        object.material.emissive.r = 0;
    }
}

//==============================Robo=================================================================
function robo(){
    var colladaLoader = new THREE.ColladaLoader(manager);
    var textureLoader = new THREE.TextureLoader(manager);
    var dae;
    var oldMat = new THREE.MeshBasicMaterial() ;
    colladaLoader.load('models/dae/robo/kuka-kr5-r650.dae', function(collada){
        dae = collada.scene;
        dae.traverse( function ( node ) {
            if ( node instanceof THREE.Mesh){
                oldMat.color = node.material.color
                node.material = oldMat;
                node.castShadow = true;
                node.flatShading = true;
            } 
        }); 


        dae.scale.set(0.15 , 0.15, 0.15);
        scene.add(dae);
        viveController.add(dae);
        dae.position.set(0, -0.015, -0.045);
        dae.rotateX(-60* Math.PI/180);
        robo = dae;
        robo.visible = false;

    },
    function ( xhr ) {
    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    },

    function ( error ) {
    console.log( 'An error happened' )
    })
    
} 

//========================== Window for buttons ==========================================================

function createTutorial(){
    //Main menu
        var loader = new THREE.TextureLoader(manager);
        var textMainMenuGeo = new THREE.PlaneBufferGeometry(0.1, 0.05);
        var textMainMenuMat = new THREE.MeshBasicMaterial({
            map: loader.load('images/text/mainmenu.png'),
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.8
            });
        var textMainMenu = new THREE.Mesh(textMainMenuGeo, textMainMenuMat);

        tutorialWindows.add(textMainMenu);                                  //Add window to parent
        textMainMenu.position.set(0, 0.01 , -0.1 );                         //Position to parent
        textMainMenu.rotateX(-90 * Math.PI / 180);                          //Rotation for better view


    //Trigger
        var textTriggerGeo = new THREE.PlaneBufferGeometry(0.1, 0.05);
        var textTriggerMat = new THREE.MeshBasicMaterial({
            map: loader.load('images/text/trigger.png'),
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.8
        });
        var textTrigger = new THREE.Mesh(textTriggerGeo, textTriggerMat);

        tutorialWindows.add(textTrigger);
        textTrigger.position.set(-0.15 , -0.05, 0.05);
        textTrigger.rotateX(-90 * Math.PI / 180);


    //Trackpad
        var textTrackpadGeo = new THREE.PlaneBufferGeometry(0.1, 0.05);
        var textTrackpadMat = new THREE.MeshBasicMaterial({
            map: loader.load('images/text/trackpad.png'),
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.8
        });
        var textTrackpad = new THREE.Mesh(textTrackpadGeo, textTrackpadMat);

        tutorialWindows.add(textTrackpad);
        textTrackpad.position.set(0.15 , 0.02, 0.05);
        textTrackpad.rotateX(-90 * Math.PI / 180);
    

    //Grip

    //System


//Connection lines button to window
    var lineMat = new THREE.LineBasicMaterial({color: 0x00ffff});           //Material for all lines

    //Main menu
        var lineMainGeo = new THREE.Geometry();
        lineMainGeo.vertices.push(new THREE.Vector3(0, 0.01, -0.075), new THREE.Vector3(0, 0.007, 0.015));      //vertices for the line

        var lineMain = new THREE.Line(lineMainGeo, lineMat);
        tutorialWindows.add(lineMain);                                      //Add line to parent
    
    //Trigger
        var lineTriggerGeo = new THREE.Geometry();
        lineTriggerGeo.vertices.push(new THREE.Vector3(-0.1, -0.05, 0.05), new THREE.Vector3(0, -0.035, 0.05));

        var lineTrigger = new THREE.Line(lineTriggerGeo, lineMat);
        tutorialWindows.add(lineTrigger);
    
    //Trackpad
        var lineTrackpadGeo = new THREE.Geometry();
        lineTrackpadGeo.vertices.push(new THREE.Vector3(0.1, 0.02, 0.05), new THREE.Vector3(0, 0.005, 0.05));

        var lineTrackpad = new THREE.Line(lineTrackpadGeo, lineMat);
        tutorialWindows.add(lineTrackpad);

    //Grip

    //System
    
//Glowing tutorial windows
    var textGlowMat = new THREE.SpriteMaterial({                          //Material for all windows
            map: loader.load('images/textures/glow.png'),
            color: 0x0D3846,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        })
    
    //Main menu
        var textMainGlow = new THREE.Sprite(textGlowMat);               
        textMainGlow.scale.set(0.15, 0.15, 0.05);
        textMainMenu.add(textMainGlow);                                   //Add sprite to window
        textMainGlow.position.set(0, 0, -0.01);                           //Set position behind window (better performance)

    //Trigger
        var textTriggerGlow = new THREE.Sprite(textGlowMat);
        textTriggerGlow.scale.set(0.15, 0.15, 0.05);
        textTrigger.add(textTriggerGlow);
        textTriggerGlow.position.set(0, 0, -0.01);

    //Trackpad
        var textTrackpadGlow = new THREE.Sprite(textGlowMat);
        textTrackpadGlow.scale.set(0.15, 0.15, 0.05);
        textTrackpad.add(textTriggerGlow);
        textTrackpadGlow.position.set(0, 0, -0.01);

    //Grip

    //System

    return;
}       
    