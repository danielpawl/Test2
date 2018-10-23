//============================ Declaration ==========================================

var scene, render, renderer, dollyCam, camera, controller1, controller2, controller3, clock, cube, floor;
var manager;
var tutorialWindows = new THREE.Object3D();
var dragCube = false;
var firstTimePressed = false;
var tempMatrix = new THREE.Matrix4();
var intersected = [];
var lastIntersected;
var arrow;
var gamepads, aha;
var IDdistributed = false;
var rotateObjXArray = [];

var input;
var twoSec = false;
var twoSecTimer = new THREE.Clock();
var twoSecStarted = false;
var twoSecObj;


var robotest;


var rayGeo, raycaster;
var rayGroup = [];
var excludeGroup = [];

var pickObj = new THREE.Object3D();
var copyObj = new THREE.Object3D();
var alreadyCopied = false;
var toggleTrigger2 = false;
var positioningModeOn = false;
var createdRobo = [];
var createdRoboCounter = 0;
var roboState = 0;
var createdCNC = [];
var createdCNCCounter = 0;
var CNCState = 0;
var createdWorkpiece = [];
var createdWorkpieceCounter = 0;
var workpieceState = 0;
var createdConveyor = [];
var createdConveyorCounter = 0;
var conveyorState = 0;



var roundPositions = [];
var robo = [];
var roboCounter = 0;
var CNC = [];
var CNCCounter = 0;
var workpiece = [];
var conveyor = [];
var conveyorCounter = 0;
var PCD = [];
var PCDCounter = 0;


//_________Simulation___________________
var t;
var simulateStatus = false;
var started = false;
var simulateObj = [];
var simulateObjCounter = 0;


var menuStep = 0;
var prevMenuStep = 0;
var text;
var tooltip = new THREE.Object3D();
var tooltip2 = new THREE.Object3D();
var symbol = [];
var symbolCounter = [0,0,0,0,0,0];
var menuLevel = [];
var menuCreated = false;

var targetNo = 0;
var prevTarget = 0;
var prevLevel = 1;



var axisX;
var axisY;
var trackpadTrackerInit = true;
var tracker;

//====================== for paint mode ===========================================

var vector1 = new THREE.Vector3();
var vector2 = new THREE.Vector3();
var vector3 = new THREE.Vector3();
var vector4 = new THREE.Vector3();
var up = new THREE.Vector3( 0, 1, 0 );

var point4 = new THREE.Vector3();
var point5 = new THREE.Vector3();

var pivot;                                      //painting is created from this point
var shapes = {};
var paintLine;
var toggleState = true;
var paintState = true;
var lastPainted;


init();
render();
        
//================================= Init Function ==========================================================
function init(){
            
    //_____________________________ Loading Manager _______________________________________________ 

        manager = new THREE.LoadingManager( () => {									//KUDOS MUGEN87
            const loadingScreen = document.getElementById( 'loading-screen' );
            loadingScreen.classList.add( 'fade-out' );
            // optional: remove loader from DOM via event listener
            //loadingScreen.addEventListener( 'transitionend', onTransitionEnd );
        } );

    //______________________________ Basic Setup ___________________________________________________________
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x80d4ff); //0xd8d3cb

        renderer = new THREE.WebGLRenderer({antialias:true});
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.vr.enabled = true;
        renderer.vr.standing = true;
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        document.body.appendChild(renderer.domElement);
        
        document.body.appendChild(WEBVR.createButton(renderer));    //WEBVR BUTTON

        camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 1000);
        dollyCam = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 1000);
        dollyCam.add(camera);
        scene.add(dollyCam);

        clock = new THREE.Clock(); 

       

        //var hemi =  new THREE.HemisphereLight( 0x888877, 0x777788, 0.5 );
        //hemi.position.set(0, 10, 0);
        //scene.add(hemi ); 

        var pointLight = [];

          
        var x = -100;
        var z = -100;

        scene.add(new THREE.AmbientLight(0x404040, 0.3));
        scene.add(new THREE.HemisphereLight(0x909090, 0x404040));

        pointLight[0] = new THREE.PointLight(0xffffff, 1, 15, 2);
        pointLight[0].position.set(-15 , 10, 0);
       /*pointLight[1] = new THREE.PointLight(0xffffff, 1, 300, 2);
        pointLight[1].position.set(100 , 100, 0);
        pointLight[2] = new THREE.PointLight(0xffffff, 1, 300, 2);
        pointLight[2].position.set(0 , 100, 100);
        pointLight[3] = new THREE.PointLight(0xffffff, 1, 300, 2);
        pointLight[3].position.set(0, 100, -100);
        scene.add(pointLight[0], pointLight[1], pointLight[2], pointLight[3],) */
      
        
       
       var point = new THREE.DirectionalLight(0xffffff, 0.5);
        point.castShadow = true;
        point.shadow.camera.top = 2;
        point.shadow.camera.bottom = -2;
        point.shadow.camera.right = 2;
        point.shadow.camera.left = -2;
        point.shadow.mapSize.set( 4096, 4096 );
        point.shadow.mapSize.set( 4096, 4096 );
        point.shadow.bias = -0.0001;
        scene.add(point);
        point.position.set(0, 100, 0);
        
        
        var cubeGeo = new THREE.BoxBufferGeometry(2,2,2);
        var cubeMat = new THREE.MeshStandardMaterial({
            color: 0x00ff00,
            roughness: 0
        });
        cube = new THREE.Mesh(cubeGeo, cubeMat);
        cube.position.set(camera.position.x, 1, camera.position.z -5);
        cube.castShadow = true;
        cube.receiveShadow = true;
        //scene.add(cube);
        cube.scale.z = 1.5;

       // rayGroup.push(cube); 

        initFactory();
        excludeGroup.push('floor', 'frame');
    
       

        
    
        

        
    //====================== Controller ============================================

        

      
           // if (gamepads[i].id === 'OpenVR Tracker') 
                controller3 = new THREE.ViveTracker()
                controller3.standingMatrix = renderer.vr.getStandingMatrix();
                controller3.userData.points = [ new THREE.Vector3(), new THREE.Vector3() ];
                controller3.userData.matrices = [ new THREE.Matrix4(), new THREE.Matrix4() ];
                dollyCam.add(controller3);
    
            
                controller1 = new THREE.ViveController();
                controller1.standingMatrix = renderer.vr.getStandingMatrix();
                controller1.userData.points = [ new THREE.Vector3(), new THREE.Vector3() ];
                controller1.userData.matrices = [ new THREE.Matrix4(), new THREE.Matrix4() ];
                dollyCam.add(controller1);
           
                controller2 = new THREE.ViveController();
                controller2.standingMatrix = renderer.vr.getStandingMatrix();
                controller2.userData.points = [ new THREE.Vector3(), new THREE.Vector3() ];
                controller2.userData.matrices = [ new THREE.Matrix4(), new THREE.Matrix4() ];
                dollyCam.add(controller2);
            
        
        

        

        
    


        loadController();
        createTutorial();
        

        

    
    //====================== RayCaster ============================================

        rayGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, -1, -1)]);
        var material = new THREE.LineBasicMaterial({color: 0x00ff00});
        line = new THREE.Line(rayGeo,material);
        line.name = 'line';
        line.scale.set(0, 0.1, 0.1);
        //controller2.add(line.clone());
        raycaster = new THREE.Raycaster();
        arrow = new THREE.ArrowHelper( raycaster.ray.direction, raycaster.ray.origin, 100, Math.random() * 0xffffff );
        scene.add( arrow );

    //===================== Functions ================================================
    
    initRobo();
    initCNC();
    initWorkpiece();
    initConveyor();
    createTracker();
    initGeometry();
    initMenu();
    initPCD();


    //===================== DAT GUI =======================================================
   
    input = dat.GUIVR.addInputObject(controller2);
    scene.add(input);

    
    

    


}
//=========================== Init End===================================================

//================================ Render ===============================================

function render(){

    distributeID();
    controller1.update();
    controller2.update();
    controller3.update();
    
    if (controller3.children[0] !== undefined){
        controller3.children[0].position.z = 1;
    }
    
    renderer.setAnimationLoop(render);
    renderer.render(scene, camera);
    
    
    if(clock.getElapsedTime() >= 30 || firstTimePressed === true){
        controller1.remove(tutorialWindows);
    };
    

    intersectObjects(controller2);
    //cleanIntersected();

    if(clock.getElapsedTime() >= 5){
        for (var i = 0; i <= robo.length -1 ; i++){
            if (robo[i] !== undefined){
                if (robo[i].userData.axis === 'y'){
                    robo[i].rotation.y += 0.01;
                } else {
                    robo[i].rotation.z += 0.01;
                }
                
            }
        }

        for (var i = 0; i <= workpiece.length -1 ; i++){
            if (workpiece[i] !== undefined){
                workpiece[i].rotation.y += 0.01;
                
            }
        }

        for (var i = 0; i <= conveyor.length -1 ; i++){
            if (conveyor[i] !== undefined){
                if (conveyor[i].userData.axis === 'y'){
                    conveyor[i].rotation.y += 0.01;
                } else {
                    conveyor[i].rotation.z += 0.01;
                }
                
            }
        }


        CNC[0].rotation.z += 0.01;
        workpiece[0].rotation.y += 0.01;
    };

    var count = paintLine.geometry.drawRange.count;
    handleController(controller1);
    updateGeometry( count, paintLine.geometry.drawRange.count );
    positioningMode();

    twoSeconds();

    rotateObjX();
  
    handleSimulation();
    

    
}

function rotateObjX(){
    for (var i = 0; i < rotateObjXArray.length ; i++){
        rotateObjXArray[i].rotation.x += 0.01;
    }
    
}

var t, dt;

function handleSimulation(){
    for ( var i = 0 ; i < simulateObj.length ; i++){
        if (simulateObj[i].userData.simulate.status === true){
            if ( started === false){
                started = true;
                t = 0;
                dt = 0.001;
                console.log('started');
            } else  {   //if ( t <= 1)
                var newX = lerp(simulateObj[i].userData.simulate.start.x, simulateObj[i].userData.simulate.end.x, ease(t));   // interpolate between a and b where
                var newY = lerp(simulateObj[i].userData.simulate.start.y, simulateObj[i].userData.simulate.end.y, ease(t));   // t is first passed through a easing
                var newZ = lerp(simulateObj[i].userData.simulate.start.z, simulateObj[i].userData.simulate.end.z, ease(t));   // function in this example.
                simulateObj[i].position.set(newX, newY, newZ);  // set new position
                console.log('ding');
                t += dt;
                if (t <= 0 || t >=1) dt = -dt;        // ping-pong for demo
            } /* else {
                started === false;
                simulateObj[i].userData.simulate.status = false;
                t = 0;
                console.log('ended');
            } */
            
        }
    }



        

    
}

function lerp(a , b , t){
    return a + (b - a) * t;
}

function ease(t) { return t<0.5 ? 2*t*t : -1+(4-2*t)*t}

function twoSeconds(){
    if( twoSec === true){
        if ( twoSecStarted === false){
            twoSecTimer.start();
            twoSecStarted = true;
            controller2.setVibe('twoSec').set(0.01).wait(100).set(0.02).wait(100).set(0.03).wait(100).set(0.05).wait(100).set(0.03).wait(100).set(0.02).wait(100).set(0.01).wait(100).set(0).wait(500).set(0.05).wait(100).set(0.1).wait(100).set(0.15).wait(100).set(0.2).wait(100).set(0.15).wait(100).set(0.1).wait(100).set(0.05).wait(100).set(0);
        }
        
        if (twoSecTimer.getElapsedTime() >= 2){
            showGUI(twoSecObj);
            twoSecStarted = false;
            twoSec = false;
        }
    } else if (twoSec === false){
        twoSecTimer.stop()
        twoSecStarted = false;
        controller2.setVibe('twoSec').set(0);
        twoSecObj = 0;
    }
}

function showGUI(obj){
    if(obj.userData.gui.visible){
        obj.userData.gui.visible = false;
        obj.userData.gui.position.y = -100;
        menuStep = prevLevel;
        menu();
        twoSec = false;
    } else if (!obj.userData.gui.visble){
        obj.userData.gui.visible = true;
        obj.userData.gui.position.y = 0.1;
        prevLevel = menuStep;
        menuStep = 0;
        menu();
    } 
}

//================================= Render End ================================================


//================================= Controller Load ============================================
function loadController() {

    var loader = new THREE.OBJLoader();
    var gltfLoader = new THREE.GLTFLoader();
    loader.setPath('models/obj/vive-controller/');
    loader.load('vr_controller_vive_1_5.obj', function(object) {
            object.name = 'Controller1';
            var loader = new THREE.TextureLoader();
            loader.setPath('models/obj/vive-controller/');
            var controller = object.children[0];
            controller.material.map = loader.load('onepointfive_texture.png');
            controller.material.specularMap = loader.load('onepointfive_spec.png');
            controller.castShadow = true;
            controller1.add(object.clone());
        });

    loader.load('vr_controller_vive_1_5.obj', function(object) {
        var loader = new THREE.TextureLoader();
        loader.setPath('models/obj/vive-controller/');
        var controller = object.children[0];
        controller.material.map = loader.load('onepointfive_texture2.png');
        controller.material.specularMap = loader.load('onepointfive_spec.png');
        controller.castShadow = true;
        controller2.add(object.clone());
    }); 
    /* gltfLoader.load('models/gltf/controller1/scene.gltf', 
				function(gltf){
					gltf.scene.traverse(function(node){
						if(node instanceof THREE.Mesh){
							node.castShadow = true;
						}
					});
                    controller2.add(gltf.scene);
                    controller2.scale.set(0.01, 0.01, 0.01);
                }); */


        controller1.name = 'Controller1';
        controller1.add(tutorialWindows);

    var geometry = new THREE.BoxBufferGeometry(0.1, 0.1, 0.1);
    var material = new THREE.MeshStandardMaterial({color: 0x00ff00});
    var mesh = new THREE.Mesh(geometry, material);
    controller3.add(mesh);

 
    }

function distributeID(){
    if (IDdistributed === false){
        gamepads = navigator.getGamepads();
        aha = gamepads.length;
        var a;
        for ( var i = 0;  i < gamepads.length ; i++){
            if (gamepads[i].id === 'OpenVR Tracker'){
                controller3.giveID(i);
                a = i;
            }
        }
        if ( a === 0){
            controller1.giveID(1);
            controller2.giveID(2);
            IDdistributed = true;
        } else if ( a === 2){
            controller1.giveID(0);
            controller2.giveID(1);
            IDdistributed = true;
        } else if ( a === undefined){
            controller1.giveID(0);
            controller2.giveID(1);
        }
    }
    
}

//================================ Controller 1 ===================================================

controller1.addEventListener('triggerdown', onTriggerDown1);
controller1.addEventListener('triggerup', onTriggerUp1);
controller1.addEventListener('axischanged', onAxisChanged1);
controller1.addEventListener('thumbpaddown', onThumbpadDown1);
controller1.addEventListener('thumbpadup', onThumbpadUp1);
controller1.addEventListener('gripsdown', onGripsDown1);
controller1.addEventListener('gripsup', onGripsUp1);
controller1.addEventListener('menudown', onMenuDown1);
controller1.addEventListener('menuup', onMenuUp1);


function onTriggerDown1(){
        if(firstTimePressed == false){
            firstTimePressed = true;
        } 
        if (createdWorkpiece[0] !== undefined){
            createdWorkpiece[0].position.y += 0.01;
        }
        controller1.setVibe('bam').set(0.4).wait(30).set(0.1).wait(30).set(0); 
}

function onTriggerUp1(){
        dragCube = false;
        if (paintState === false){
            paintState = true;
        }
 
    
}
 
function onAxisChanged1(a){
    axisX = a.axes[0];
    axisY = -a.axes[1];

    tracker.visible = true;
    
    trackpadTracker(axisX, axisY);


}

function onThumbpadDown1(){
}

function onThumbpadUp1(){
    toggleState = true;
}

function onGripsDown1(){
    if (menuStep !== 0){
        menuStep -= 1;
        if(menuStep === 0){targetNo = 0};
        if(menuStep === 1){targetNo = 0};
        menu();
    }
  
}

function onGripsUp1(){

}

function onMenuDown1(){
    menuStep = 1;
    menu();
}

function onMenuUp1(){

}

//============================= Controller 2 =========================================================
controller2.addEventListener('triggerdown', onTriggerDown2);
controller2.addEventListener('triggerup', onTriggerUp2);
controller2.addEventListener('axischanged', onAxisChanged2);
controller2.addEventListener('thumbpaddown', onThumbpadDown2);
controller2.addEventListener('thumbpadup', onThumbpadUp2);
controller2.addEventListener('gripsdown', onGripsDown2);
controller2.addEventListener('gripsup', onGripsUp2);
controller2.addEventListener('menudown', onMenuDown2);
controller2.addEventListener('menuup', onMenuUp2);

function onTriggerDown2(){
    input.pressed(true);
    handleIntersections();
}

function onTriggerUp2(){
    input.pressed(false);
    toggleTrigger2 = true;
    twoSec = false;
}

function onAxisChanged2(a){

}

function onThumbpadDown2(){
    var intersections = getIntersections(controller2);
    if (intersections.length > 0) {
        var intersection = intersections[0];
        var object = intersection.object;
        var point = intersection.point;

        if (object.name === "floor"){
            teleport(point);
            return;
        }
    }
}

function onThumbpadUp2(){

}

function onGripsDown2(){

}

function onGripsUp2(){

}

function onMenuDown2(){

}

function onMenuUp2(){

}
//============================= Trackpad position =====================================================
function createTracker(){
    if (trackpadTrackerInit == true){
    var geometry = new THREE.CircleBufferGeometry(0.002 , 32);
    var material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.8
    });
    tracker = new THREE.Mesh(geometry, material);
    controller1.add(tracker)
    tracker.position.set(0, 0.01 , 0.05);
    tracker.rotateX(-90* Math.PI/ 180);
    trackpadTrackerInit = false;
    tracker.visible = false;
    }
}

function trackpadTracker(x, y){

        tracker.position.set(x/50 , 0.01 , y/50 + 0.05);

}


//============================= RayCaster =============================================================

function getIntersections(controller) {

    tempMatrix.identity().extractRotation(controller.matrixWorld);
    raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld); 
    raycaster.ray.direction.set(0, -1.5, -1).applyMatrix4(tempMatrix).normalize();
    arrow.position.copy(raycaster.ray.origin);
    arrow.setDirection(raycaster.ray.direction);
    return raycaster.intersectObjects(rayGroup, true); 					// recursive true, to hit all object.child !

}

function intersectObjects(controller) {

    if (positioningModeOn === true) return;

    // Do not highlight when already selected
    if (controller.userData.selected !== undefined) return;

    var line = controller.getObjectByName('line');
    var intersections = getIntersections(controller);

    if (intersections.length > 0) {
        
        var intersection = intersections[0];
        var object = intersection.object;
        if(object.name === 'exclude') {

            return;
        }

        if(object.name !== 'floor' && lastIntersected.name !== object.name){
            controller2.setVibe('bam').set(0.05).wait(50).set(0);
            
            
        }
        if(object.name !== 'floor' && object.name !== 'exclude' ){
            if (object.material.emissive !== undefined){
                object.material.emissive.r = 100/255;
                object.material.emissive.g = 200/255;
            }
            
            if ( object.name.substring(0,3) !== 'box' && object.name.substring(0,3) !== 'rob') {
                object.scale.set(1.3, 1.3, 1);
            }
            
        }
        
        

        
        if(object.children !== undefined){
            //object.children.scale.set(1.3, 1.3, 1);
        }
        
        //symbol[l][n].children[0].material.color.setHex(0x00ffc2);

        //object.material.emissive.r = 1;
        if( lastIntersected !== object && object.name !== 'floor' && object.name !== 'exclude'){
            tooltip.remove(text);
            createText(object.name);
        } 

       
        intersected.push(object);
        //line.scale.y = intersection.distance;
        //line.scale.z = intersection.distance;
        
        cleanIntersected();
        lastIntersected = object;
    }
    else {
        //line.scale.set(0, 0.1 ,0.1);
    }
    
}

function cleanIntersected() {
    while (intersected.length) {
        var object = intersected.pop();
        if (lastIntersected === object) return;
        if (object.material.emissive !== undefined){
            object.material.emissive.r = 0;
            object.material.emissive.g = 0;
        }
        if ( object.name.substring(0,3) !== 'box' && object.name.substring(0,3) !== 'rob') {
            object.scale.set(1, 1, 1);
        }
    
        if ( lastIntersected !== undefined){
            if (lastIntersected.material.emissive !== undefined){
                lastIntersected.material.emissive.r = 0;
                lastIntersected.material.emissive.g = 0;
            }
            if ( lastIntersected.name.substring(0,3) !== 'box' && lastIntersected.name.substring(0,3) !== 'rob') {
                lastIntersected.scale.set(1, 1, 1);
            }
            tooltip.remove(text)
        }
        
        
        
    }
}

function handleIntersections(){
    var intersections = getIntersections(controller2);

		if (intersections.length > 0) {
			var intersection = intersections[0];
			var object = intersection.object;
			var point = intersection.point;

			if (object.name === "Paint"){
                controller1.paintOn();
                menuStep = 0;
                menu();
                return;
            }
            
			else if (object.name === "Configurator") {
                menuStep = 2;
                menu();
                return;
            } else if (object.name === "PCD") {
                menuStep = 0;
                menu();
                PCD[0].visible = true;
                return;
            } else if (object.name === "Simulate") {
                menuStep = 6;
                menu();
               /* var simulate = {
                    status: false,
                    start: {x: 0, y: 0, z: 0},
                    end: {x: 2, y: 1, z:-10}
                }
                if (createdWorkpiece[0].userData.simulate === undefined){
                    createdWorkpiece[0].userData.simulate = simulate;
                }
                createdWorkpiece[0].userData.simulate.status = true;
                simulateObj.push(createdWorkpiece[0]);
                simulateObj[0].userData.simulate.status = true; */

                return;
            }else if (object.name === "Robot") {
                menuStep = 2;
                menu();
                return;
            } else if (object.name === "CNC") {
                menuStep = 3;
                menu();
                return;
            } else if (object.name === "Workpiece") {
                menuStep = 4;
                menu();
                return;
            } else if (object.name === "Conveyor") {
                menuStep = 5;
                menu();
                return;
            } else if (object.name === 'next'){
                if (menuStep === 2){
                    roboState++;
                } if (menuStep === 3){
                    CNCState++;
                } if ( menuStep === 4){
                    workpieceState++;
                } if ( menuStep === 5){
                    conveyorState++;
                } 
                    
                switchPick();

                return;

            } else if (object.name === 'previous'){
                roboState--;
                switchPick();

                return;

            } else if (object.name === 'pick'){
                controller2.add(pickObj);
                pickObj.position.set(roundPositions[1].position.x, roundPositions[1].position.y, roundPositions[1].position.z);
                pickObj.traverse( function ( node ) {
                    if ( node instanceof THREE.Mesh){
                        if (node.material.length > 0){
                            for (var i = 0; i <= node.material.length -1 ; i++){
                                node.material[i].transparent = true;
                                node.material[i].opacity = 0.5;
                            }
                        } else {
                            node.material.transparent = true;
                            node.material.opacity = 0.5;
                        }
                    }
                });

                positioningModeOn = true;
                toggleTrigger2 = false;
                return;
            } else if (object.name === 'data'){
                if (robo[0].userData.data.visible){
                    robo[0].userData.data.visible = false;
                } else {
                robo[0].userData.data.visible = true;
                }
                return;
            } else if (object.name.substring(0, 3) === 'box' || object.name.substring(0, 3) === 'rob'){
                twoSec = true;
                twoSecObj = object;
                }
            } else if (object.name === "Choose object"){
                
            }
}

function positioningMode(){
    if (positioningModeOn === true){
        var intersections = getIntersections(controller2);
        if (intersections.length > 0){
            var intersection = intersections[0];
            var object = intersection.object;

            var position = new THREE.Vector3(0, 0, 0);
            position = intersection.point;

            if (alreadyCopied === false){
                copyObj = pickObj.clone();
                if(pickObj.userData.factor !== undefined){
                    copyObj.scale.set(1 * pickObj.userData.factor, 1 * pickObj.userData.factor, 1 * pickObj.userData.factor);
                } else {
                    copyObj.scale.set(1 , 1 , 1 );
                }
                
                copyObj.lookAt(0, 0, 1);
                scene.add(copyObj);
                alreadyCopied = true;
            }
            if (object.name !== 'floor') return;
            if (object.name === 'floor'){
                copyObj.position.set(position.x, position.y, position.z);
            }
            
            if( controller2.getButtonState( 'trigger') === true && toggleTrigger2 === true ){
                copyObj.traverse( function ( node ) {
                    if ( node instanceof THREE.Mesh){
                        if (node.material.length > 0){
                            for (var i = 0; i <= node.material.length -1 ; i++){
                                node.material[i].transparent = false;
                                node.material[i].opacity = 1
                            }
                        } else {
                            node.material.transparent = false;
                            node.material.opacity = 1;
                        }
                    }
                });
                controller2.remove(pickObj);
                if (menuStep === 2){
                    createdRobo[createdRoboCounter] = copyObj;
                    createdRobo[createdRoboCounter].name = 'robo' + createdRoboCounter.toString();
                    createGUI(createdRobo[createdRoboCounter]);
                    rayGroup.push( createdRobo[createdRoboCounter]);
                    createdRoboCounter++;
                    alreadyCopied = false;
                } else if ( menuStep === 3){
                    createdCNC[createdCNCCounter] = copyObj;
                    createdCNCCounter++;
                    alreadyCopied = false;
                } else if ( menuStep === 4){
                    createdWorkpiece[createdWorkpieceCounter] = copyObj;
                    createdWorkpiece[createdWorkpieceCounter].name = 'box' + createdWorkpieceCounter.toString();
                    if ( createdWorkpiece[createdWorkpieceCounter].geometry.type.substring(0,3) === 'Box' || createdWorkpiece[createdWorkpieceCounter].geometry.type.substring(0,3) === 'Cyl'){
                        createdWorkpiece[createdWorkpieceCounter].position.y += (createdWorkpiece[createdWorkpieceCounter].geometry.parameters.height/2) * createdWorkpiece[createdWorkpieceCounter].scale.x;
                    } else if (createdWorkpiece[createdWorkpieceCounter].geometry.type.substring(0,3) === 'Sph'){
                        createdWorkpiece[createdWorkpieceCounter].position.y += (createdWorkpiece[createdWorkpieceCounter].geometry.parameters.radius) * createdWorkpiece[createdWorkpieceCounter].scale.x;
                    }
                    
                    
                    createGUI(createdWorkpiece[createdWorkpieceCounter]);
                    rayGroup.push(createdWorkpiece[createdWorkpieceCounter]);
                    createdWorkpieceCounter++;
                    alreadyCopied = false;
                } else if ( menuStep === 5){
                    createdConveyor[createdConveyorCounter] = copyObj;
                    createdConveyorCounter++;
                    alreadyCopied = false;
                } 
                positioningModeOn = false; 
            } 
            
        }
    }
    
    
}

function createGUI(obj){

    obj.userData.gui = dat.GUIVR.create(obj.name);

    obj.userData.gui.scale.set(0.2, 0.2, 0.2);
    obj.userData.gui.position.set(-0.1, -100, 0);
    obj.userData.gui.rotateX(-60 * Math.PI / 180);
    obj.userData.gui.visible = false;
    
    

    


    var options = {
        position: {
            x: obj.position.x,
            y: obj.position.y,
            z: obj.position.z,
        },
        rotation: {
            x: obj.rotation.x,
            y: obj.rotation.y,
            z: obj.rotation.z
        },
        window: {
            x: -0.1,
            y: 0.1,
            z: 0
        },
        color: [0, 128, 255],
        reposition: function(){ repositionWindow(obj.userData.gui)},
        rotateX: function(){rotatex(obj)},
        close: function() {showGUI(obj)},
        
    }

    if( menuStep === 2){
        
        obj.userData.gui.add(obj.position, 'x', -floor.geometry.parameters.width/2,  floor.geometry.parameters.width/2).step(0.25).name('Position x').listen();
        obj.userData.gui.add(obj.position, 'y', 0, 10).step(0.25).name('Position y').listen();
        obj.userData.gui.add(obj.position, 'z', -floor.geometry.parameters.height/2,  floor.geometry.parameters.height/2).step(0.25).name('Position z').listen();
        obj.userData.gui.add(obj.rotation, 'x', 0 , 2* Math.PI).step(1/360).name('Rotation x');
        obj.userData.gui.add(obj.rotation, 'y', 0 , 2* Math.PI).step(1/360).name('Rotation y');
        obj.userData.gui.add(obj.rotation, 'z', 0 , 2* Math.PI).step(1/360).name('Rotation z');
  
        obj.userData.gui.add(options, 'reposition').name('Reposition window');
        obj.userData.gui.traverse( function(child){
            if (child instanceof THREE.Mesh){
                child.name = 'exclude';
            }
        });

        controller1.add(obj.userData.gui);
        obj.userData.gui.name = 'exclude';
   
        rayGroup.push(obj.userData.gui);
        

        
    }
    if (menuStep === 4){



        obj.userData.gui.add(obj.position, 'x').min(-floor.geometry.parameters.width/2).max(floor.geometry.parameters.width/2).step(0.25).name('Position x').listen();
        obj.userData.gui.add(obj.position, 'y').min(0).max(10).step(0.25).name('Position y').listen();
        obj.userData.gui.add(obj.position, 'z').min(-floor.geometry.parameters.height/2).max(floor.geometry.parameters.height/2).step(0.25).name('Position z').listen();
        obj.userData.gui.add(obj.rotation, 'x', 0 , 2* Math.PI).step(1/360).name('Rotation x');
        obj.userData.gui.add(obj.rotation, 'y', 0 , 2* Math.PI).step(1/360).name('Rotation y');
        obj.userData.gui.add(obj.rotation, 'z', 0 , 2* Math.PI).step(1/360).name('Rotation z');
        obj.userData.gui.add(obj.scale, 'x', 0.1, 5).name('Scale x');
        obj.userData.gui.add(obj.scale, 'y', 0.1, 5).name('Scale y');
        obj.userData.gui.add(obj.scale, 'z', 0.1, 5).name('Scale z');
        obj.userData.gui.add(options, 'reposition').name('Reposition window');
        obj.userData.gui.add(options, 'rotateX').name('Rotation x axis');
        obj.userData.gui.add(options, 'close').name('Close window');
        obj.userData.gui.traverse( function(child){
            if (child instanceof THREE.Mesh){
                child.name = 'exclude';
            }
        });

        controller1.add(obj.userData.gui);
        obj.userData.gui.name = 'exclude';
   
        rayGroup.push(obj.userData.gui);
    }

   function repositionWindow(gui){
        gui.position.set(options.window.x, options.window.y, options.window.z);
   }

   function rotatex(obj){
       rotateObjXArray.push(obj);
   }
    
}


function switchPick(){
    if ( roboState <= -1) {
        roboState = 2;
    } else if (roboState >= 3){
        roboState = 0;
    }
    if (menuStep === 2){
        switch(roboState){

            case 0:
                
                getRoundPos('robo');
    
                getSmall(robo[0]);
                getBig(robo[1]);
                getSmall(robo[2]);
    
    
                pickObj = robo[1].clone();
                pickObj.userData = robo[1].userData;
                

    
                break;
    
            case 1:
                getRoundPos('robo');
    
                getSmall(robo[0]);
                getSmall(robo[1]);
                getBig(robo[2]);
    
                pickObj = robo[2].clone();
                pickObj.userData = robo[2].userData;
                
                break;
            
            case 2:
                getRoundPos('robo');
    
                getBig(robo[0]);
                getSmall(robo[1]);
                getSmall(robo[2]);
    
                pickObj = robo[0].clone();
                pickObj.userData = robo[0].userData;
              
    
                break;
        }
    } else if (menuStep === 3){
        if (CNCState === 1){
            CNCState = 0;
        }
        switch(CNCState){
            case 0:
                pickObj = CNC[0].clone();
        }
    } else if (menuStep === 4){
        if (workpieceState >= 3){
            workpieceState = 0;
        }
        switch(workpieceState){
            case 0:
                getRoundPos('workpiece');
                pickObj = workpiece[1].clone();
                break;
            case 1:
                getRoundPos('workpiece');
                pickObj = workpiece[2].clone();
                break;
            case 2:
                getRoundPos('workpiece');
                pickObj = workpiece[0].clone();
                break;
        } 
    }  else if (menuStep === 5){
        if (conveyorState >= 3){
            conveyorState = 0;
        }
        switch(conveyorState){
            case 0:
                getRoundPos('conveyor');
                pickObj = conveyor[1].clone();
                pickObj.userData = conveyor[1].userData;
                break;
            case 1:
                getRoundPos('conveyor');
                pickObj = conveyor[2].clone();
                pickObj.userData = conveyor[2].userData;
                break;
            case 2:
                getRoundPos('conveyor');
                pickObj = conveyor[0].clone();
                pickObj.userData = conveyor[0].userData;
                break;
        }
    }
    
    

    
    function getRoundPos(string){
        if (string === 'robo'){
            switch(roboState){
                case 0:
                    robo[0].position.x = roundPositions[0].position.x;
                    robo[0].position.y = roundPositions[0].position.y;
                    robo[0].position.z = roundPositions[0].position.z;
    
                    robo[1].position.x = roundPositions[1].position.x;
                    robo[1].position.y = roundPositions[1].position.y;
                    robo[1].position.z = roundPositions[1].position.z;
    
                    robo[2].position.x = roundPositions[2].position.x;
                    robo[2].position.y = roundPositions[2].position.y;
                    robo[2].position.z = roundPositions[2].position.z;
                    break;
    
                case 1: 
                    robo[0].position.x = roundPositions[2].position.x;
                    robo[0].position.y = roundPositions[2].position.y;
                    robo[0].position.z = roundPositions[2].position.z;
    
                    robo[1].position.x = roundPositions[0].position.x;
                    robo[1].position.y = roundPositions[0].position.y;
                    robo[1].position.z = roundPositions[0].position.z;
    
                    robo[2].position.x = roundPositions[1].position.x;
                    robo[2].position.y = roundPositions[1].position.y;
                    robo[2].position.z = roundPositions[1].position.z;
                    break;
                
                case 2:
                    robo[0].position.x = roundPositions[1].position.x;
                    robo[0].position.y = roundPositions[1].position.y;
                    robo[0].position.z = roundPositions[1].position.z;
    
                    robo[1].position.x = roundPositions[2].position.x;
                    robo[1].position.y = roundPositions[2].position.y;
                    robo[1].position.z = roundPositions[2].position.z;
    
                    robo[2].position.x = roundPositions[0].position.x;
                    robo[2].position.y = roundPositions[0].position.y;
                    robo[2].position.z = roundPositions[0].position.z;
                    break;  
            }
            return;
        } else if ( string === 'workpiece'){
            switch(workpieceState){
                case 0:
                    workpiece[0].position.x = roundPositions[0].position.x;
                    workpiece[0].position.y = roundPositions[0].position.y;
                    workpiece[0].position.z = roundPositions[0].position.z;
                    workpiece[0].scale.set(0.05 , 0.05, 0.05);
        
                    workpiece[1].position.x = roundPositions[1].position.x;
                    workpiece[1].position.y = roundPositions[1].position.y+0.04;
                    workpiece[1].position.z = roundPositions[1].position.z -0.04;
                    workpiece[1].scale.set(0.12 , 0.12, 0.12);
        
                    workpiece[2].position.x = roundPositions[2].position.x;
                    workpiece[2].position.y = roundPositions[2].position.y;
                    workpiece[2].position.z = roundPositions[2].position.z;
                    workpiece[2].scale.set(0.05 , 0.05, 0.05);
                        break;
        
                case 1: 
                    workpiece[0].position.x = roundPositions[2].position.x;
                    workpiece[0].position.y = roundPositions[2].position.y;
                    workpiece[0].position.z = roundPositions[2].position.z;
                    workpiece[0].scale.set(0.05 , 0.05, 0.05);
        
                    workpiece[1].position.x = roundPositions[0].position.x;
                    workpiece[1].position.y = roundPositions[0].position.y;
                    workpiece[1].position.z = roundPositions[0].position.z;
                    workpiece[1].scale.set(0.05 , 0.05, 0.05);
        
                    workpiece[2].position.x = roundPositions[1].position.x;
                    workpiece[2].position.y = roundPositions[1].position.y+0.04;
                    workpiece[2].position.z = roundPositions[1].position.z-0.04;
                    workpiece[2].scale.set(0.12 , 0.12, 0.12);
                    break;
                
                case 2:
                    workpiece[0].position.x = roundPositions[1].position.x;
                    workpiece[0].position.y = roundPositions[1].position.y+0.04;
                    workpiece[0].position.z = roundPositions[1].position.z-0.04;
                    workpiece[0].scale.set(0.12 , 0.12, 0.12);
        
                    workpiece[1].position.x = roundPositions[2].position.x;
                    workpiece[1].position.y = roundPositions[2].position.y;
                    workpiece[1].position.z = roundPositions[2].position.z;
                    workpiece[1].scale.set(0.05 , 0.05, 0.05);
        
                    workpiece[2].position.x = roundPositions[0].position.x;
                    workpiece[2].position.y = roundPositions[0].position.y;
                    workpiece[2].position.z = roundPositions[0].position.z;
                    workpiece[2].scale.set(0.05 , 0.05, 0.05);
                    break;  
            }
            return;
        } else if ( string === 'conveyor'){
            switch(conveyorState){
                case 0:
                    conveyor[0].position.x = roundPositions[0].position.x;
                    conveyor[0].position.y = roundPositions[0].position.y;
                    conveyor[0].position.z = roundPositions[0].position.z;
                    conveyor[0].scale.set(0.05 * conveyor[0].userData.factor , 0.05 * conveyor[0].userData.factor, 0.05 * conveyor[0].userData.factor);
        
                    conveyor[1].position.x = roundPositions[1].position.x;
                    conveyor[1].position.y = roundPositions[1].position.y;
                    conveyor[1].position.z = roundPositions[1].position.z;
                    conveyor[1].scale.set(0.12 * conveyor[1].userData.factor, 0.12* conveyor[1].userData.factor, 0.12 * conveyor[1].userData.factor);
        
                    conveyor[2].position.x = roundPositions[2].position.x;
                    conveyor[2].position.y = roundPositions[2].position.y;
                    conveyor[2].position.z = roundPositions[2].position.z;
                    conveyor[2].scale.set(0.05 * conveyor[2].userData.factor, 0.05 * conveyor[2].userData.factor, 0.05 * conveyor[2].userData.factor);
                        break;
        
                case 1: 
                    conveyor[0].position.x = roundPositions[2].position.x;
                    conveyor[0].position.y = roundPositions[2].position.y;
                    conveyor[0].position.z = roundPositions[2].position.z;
                    conveyor[0].scale.set(0.05 * conveyor[0].userData.factor, 0.05* conveyor[0].userData.factor, 0.05* conveyor[0].userData.factor);
        
                    conveyor[1].position.x = roundPositions[0].position.x;
                    conveyor[1].position.y = roundPositions[0].position.y;
                    conveyor[1].position.z = roundPositions[0].position.z;
                    conveyor[1].scale.set(0.05 * conveyor[1].userData.factor, 0.05 * conveyor[1].userData.factor, 0.05 * conveyor[2].userData.factor);
        
                    conveyor[2].position.x = roundPositions[1].position.x;
                    conveyor[2].position.y = roundPositions[1].position.y;
                    conveyor[2].position.z = roundPositions[1].position.z;
                    conveyor[2].scale.set(0.12 * conveyor[2].userData.factor, 0.12 * conveyor[2].userData.factor, 0.12* conveyor[2].userData.factor);
                    break;
                
                case 2:
                    conveyor[0].position.x = roundPositions[1].position.x;
                    conveyor[0].position.y = roundPositions[1].position.y;
                    conveyor[0].position.z = roundPositions[1].position.z;
                    conveyor[0].scale.set(0.12* conveyor[0].userData.factor , 0.12* conveyor[0].userData.factor, 0.12* conveyor[0].userData.factor);
        
                    conveyor[1].position.x = roundPositions[2].position.x;
                    conveyor[1].position.y = roundPositions[2].position.y;
                    conveyor[1].position.z = roundPositions[2].position.z;
                    conveyor[1].scale.set(0.05* conveyor[1].userData.factor , 0.05 * conveyor[1].userData.factor, 0.05 * conveyor[1].userData.factor);
        
                    conveyor[2].position.x = roundPositions[0].position.x;
                    conveyor[2].position.y = roundPositions[0].position.y;
                    conveyor[2].position.z = roundPositions[0].position.z;
                    conveyor[2].scale.set(0.05 * conveyor[2].userData.factor, 0.05 * conveyor[2].userData.factor, 0.05 * conveyor[2].userData.factor);
                    break;  
            }
            return
        }
        
    }

    function getBig(robo){
        robo.scale.set(0.15 * robo.userData.factor, 0.15 * robo.userData.factor, 0.15 * robo.userData.factor);
        return;
    }

    function getSmall(robo){
        robo.scale.set(0.05 * robo.userData.factor, 0.05 * robo.userData.factor, 0.05 * robo.userData.factor);
        return;
    }
}

//============================== Robo =================================================================
function initRobo(){
    loadRobo('U3', 'models/js/robo/ur3.js', 2, 'y');
    loadRobo('TX200', 'models/js/robo/tx200.js', 2, 'z');
    loadRobo('Ts80','models/js/robo/ts80.js', 2, 'z' );
        

    function loadRobo(name, path, height, axis){
        var loader = new THREE.JSONLoader(manager);
    
        // load a resource
        loader.load(
            // resource URL
            path,
    
            // onLoad callback
            function ( geometry, material ) {
                for ( var i = 0; i <= material.length -1; i++){
                    material[i].morphTargets = true;
                }
                
                var materials = new THREE.MeshFaceMaterial(material );
                object = new THREE.Mesh(geometry, materials);
                scene.add( object);

                if ( axis === 'y'){
                    scaling(object, axis);
                    object.scale.set(height * object.userData.factor, height * object.userData.factor, height * object.userData.factor);
                } else if ( axis === 'z'){
                    scaling(object, axis);
                    object.scale.set(height * object.userData.factor, height * object.userData.factor, height * object.userData.factor);
                    object.rotateX(-90 * Math.PI / 180);
                }
                
                if (object.userData.axis === undefined){
                    object.userData.axis = axis;
                } if (object.userData.data === undefined){
                    object.userData.data = loadData();
                } 
                object.rotateX(-60* Math.PI/180);
                controller1.add(object);
                object.position.set(0, -0.015, -0.045);
                robo[roboCounter] = object;
                robo[roboCounter].visible = false;
                robo[roboCounter].name = name;
                roboCounter++;
                
                robotest = object;
            },
    
            // onProgress callback
            function ( xhr ) {
                console.log( (xhr.loaded / xhr.total * 100) + '% loaded JSON' );
            },
    
            // onError callback
            function( err ) {
                console.log( 'An error happened' );
            });
    };
     
} 

//========================== CNC =========================================================================
function initCNC(){
    loadCNC('CNC', 'models/dae/CNC/CNC.dae');
    function loadCNC(name, path){
        var colladaLoader = new THREE.ColladaLoader(manager);
        var dae;
        colladaLoader.load(path, function(collada){
            dae = collada.scene;
            dae.traverse( function ( node ) {
                if ( node instanceof THREE.Mesh){
                    node.castShadow = true;
                    node.material.flatShading = true;
                    
                } 
            }); 

            scene.add(dae);
            controller1.add(dae);
            dae.scale.set(0.05 , 0.05, 0.05);
            
            dae.position.set(0, -0.015, -0.045);
            dae.rotateX(-60* Math.PI/180);
            CNC[CNCCounter] = dae;
            CNC[CNCCounter].visible = false;
            CNC[CNCCounter].name = name;
            CNCCounter++;



        },
        function ( xhr ) {
        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        },

        function ( error ) {
        console.log( 'An error happened' )
        })
    }

}

//========================== Workpiece ===================================================================

function initWorkpiece(){
    var loader = new THREE.TextureLoader(manager);
    var geometry = new THREE.BoxBufferGeometry(0.5, 0.5, 0.5);
    
    var material = new THREE.MeshPhongMaterial({
        color: 0x207e27,
        metalness: 0.7,
        roughness: 0.0
    })
    workpiece[0] = new THREE.Mesh(geometry, material);
    controller1.add(workpiece[0]);
    workpiece[0].scale.set(0.1 , 0.1, 0.1);
    workpiece[0].position.set(0, -0.015, -0.06);
    workpiece[0].rotateX(-60 * Math.PI / 180);
    workpiece[0].visible = false;


    var geometry = new THREE.SphereBufferGeometry(0.3, 32, 32);
    workpiece [1] = new THREE.Mesh(geometry, material);
    controller1.add(workpiece[1]);
    workpiece[1].scale.set(0.1 , 0.1, 0.1);
    workpiece[1].position.set(0, -0.015, -0.06);
    workpiece[1].visible = false;


    var geometry = new THREE.CylinderBufferGeometry( 0.3, 0.3, 0.3, 32 );
    workpiece[2] = new THREE.Mesh( geometry, material );
    controller1.add(workpiece[2]);
    workpiece[2].scale.set(0.1 , 0.1, 0.1);
    workpiece[2].position.set(0, -0.015, -0.06);
    workpiece[2].visible = false;
    }
//============================== Conveyor ==============================================================

function initConveyor(){
    /*loadConveyor('CNC', 'models/dae/Conveyor/forder.dae');
    function loadConveyor(name, path){
        var colladaLoader = new THREE.ColladaLoader(manager);
        var dae;
        colladaLoader.load(path, function(collada){
            dae = collada.scene;
            dae.traverse( function ( node ) {
                if ( node instanceof THREE.Mesh){
                    //oldMat.color = node.material.color
                    //node.material = oldMat;
                    node.castShadow = true;
                    node.material.flatShading = true;
                    
                } 
            }); 
           
            scene.add(dae);
            controller1.add(dae);
            dae.scale.set(0.05 , 0.05, 0.05);
            
            dae.position.set(0, -0.015, -0.045);
            dae.rotateX(-60* Math.PI/180);
            conveyor[conveyorCounter] = dae;
            conveyor[conveyorCounter].visible = false;
            conveyor[conveyorCounter].name = name;
            conveyorCounter++;



        },
        function ( xhr ) {
        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        },

        function ( error ) {
        console.log( 'An error happened' )
        })
    } */

    loadConveyor2('FB-50', 'models/js/conveyor/fb-50-ku-500-1500-2-800.js', 2, 'y');
    loadConveyor2('FB-80', 'models/js/conveyor/fb-80-du-500-2000-3-800.js', 2, 'y');
    loadConveyor2('FB-80', 'models/js/conveyor/fb-80-du-500-2000-3-800.js', 2, 'y');
        

    function loadConveyor2(name, path, height, axis){
        var loader = new THREE.JSONLoader(manager);
    
        // load a resource
        loader.load(
            // resource URL
            path,
    
            // onLoad callback
            function ( geometry, material ) {
                for ( var i = 0; i <= material.length -1; i++){
                    material[i].morphTargets = true;
                }
                
                var materials = new THREE.MeshFaceMaterial(material );
                object = new THREE.Mesh(geometry, materials);
                scene.add( object);

                if ( axis === 'y'){
                    scaling(object, axis);
                    object.scale.set(height * object.userData.factor, height * object.userData.factor, height * object.userData.factor);
                } else if ( axis === 'z'){
                    scaling(object, axis);
                    object.scale.set(height * object.userData.factor, height * object.userData.factor, height * object.userData.factor);
                    object.rotateX(-90 * Math.PI / 180);
                }
                
                if (object.userData.axis === undefined){
                    object.userData.axis = axis;
                }

                object.rotateX(-60* Math.PI/180);
                controller1.add(object);
                object.position.set(0, -0.015, -0.045);
                conveyor[conveyorCounter] = object;
                conveyor[conveyorCounter].visible = false;
                conveyor[conveyorCounter].name = name;
                conveyorCounter++;
                
            },
    
            // onProgress callback
            function ( xhr ) {
                console.log( (xhr.loaded / xhr.total * 100) + '% loaded JSON' );
            },
    
            // onError callback
            function( err ) {
                console.log( 'An error happened' );
            });
    };

}

//========================== Envorinment ================================================================

function initFactory(){
    var loader = new THREE.TextureLoader();
    var floorGeo = new THREE.PlaneBufferGeometry(50, 50);
    var floorMat = new THREE.MeshStandardMaterial({
        map: loader.load('images/textures/floor/Metal_Plate_002_COLOR.jpg', function(map){
            map.wrapS = THREE.RepeatWrapping;
            map.wrapT = THREE.RepeatWrapping;
            map.repeat.set( 256, 256 )
        }),

        normalMap: loader.load('images/textures/floor/Metal_Plate_002_NORM.jpg', function(map){
            map.wrapS = THREE.RepeatWrapping;
            map.wrapT = THREE.RepeatWrapping;
            map.repeat.set( 256, 256 )
        }), 
        //normalScale: new THREE.Vector2( 0.1, 0.1),

        roughness: loader.load('images/textures/floor/Metal_Plate_002_ROUGH.jpg', function(map){
            map.wrapS = THREE.RepeatWrapping;
            map.wrapT = THREE.RepeatWrapping;
            map.repeat.set( 256, 256 )
        }),
    });
    floor = new THREE.Mesh(floorGeo, floorMat);
    floor.position.set(0,0,0);
    floor.rotateX(-90* Math.PI/180);
    floor.receiveShadow = true;
    floor.name = 'floor';
    

    rayGroup.push(floor);
    scene.add(floor);

    var shape = new THREE.Shape();
    shape.moveTo(floorGeo.parameters.width/2 , 0);
    shape.lineTo(floorGeo.parameters.width/2, 10);
    shape.lineTo(-floorGeo.parameters.width/2, 10);
    shape.lineTo(-floorGeo.parameters.width/2, 0);

    var extrudeSettings = {depth: 0.01, bevelEnabled: false};
    var geometry = new THREE.ExtrudeBufferGeometry(shape, extrudeSettings);
    var material = new THREE.MeshStandardMaterial({
        side: THREE.DoubleSide,
        map: loader.load('images/textures/plaster/Plaster_001_COLOR.jpg', function(map){
            map.wrapS = THREE.RepeatWrapping;
            map.wrapT = THREE.RepeatWrapping;
            map.anisotropy = 4;
            map.repeat.set( 2 , 2 )
        }),
        aoMap: loader.load('images/textures/plaster/Plaster_001_OCC.jpg', function(map){
            map.wrapS = THREE.RepeatWrapping;
            map.wrapT = THREE.RepeatWrapping;
            map.anisotropy = 4;
            map.repeat.set(2 , 2  )
        }),
        displacementMap: loader.load('images/textures/plaster/Plaster_001_DISP.png', function(map){
            map.wrapS = THREE.RepeatWrapping;
            map.wrapT = THREE.RepeatWrapping;
            map.anisotropy = 4;
            map.repeat.set(2 , 2  )
        }),
        normalMap: loader.load('images/textures/plaster/Plaster_001_NORM.jpg', function(map){
            map.wrapS = THREE.RepeatWrapping;
            map.wrapT = THREE.RepeatWrapping;
            map.anisotropy = 4;
            map.repeat.set( 2 , 2 )
        }),
        roughnessMap: loader.load('images/textures/plaster/Plaster_001_ROUGH.jpg', function(map){
            map.wrapS = THREE.RepeatWrapping;
            map.wrapT = THREE.RepeatWrapping;
            map.anisotropy = 4;
            map.repeat.set( 2 , 2 )
        }),
    });
    var wall = new THREE.Mesh(geometry, material);
    wall.receiveShadow = true;
    wall.castShadow = true;
    var copyWall1 = wall.clone();
    var copyWall2 = wall.clone();
    var copyWall3 = wall.clone();

    wall.position.set(0, 0, -floorGeo.parameters.width/2);
    copyWall1.position.set(0, 0, floorGeo.parameters.width/2);
    copyWall2.position.set(-floorGeo.parameters.width/2,0, 0);
    copyWall2.rotateY(-90 * Math.PI /180);
    copyWall3.position.set(floorGeo.parameters.width/2,0, 0);
    copyWall3.rotateY(-90 * Math.PI /180);

    scene.add(wall, copyWall1, copyWall2 , copyWall3);

    var material = new THREE.MeshStandardMaterial({
        side: THREE.DoubleSide,
        color: 0xccffff,
        transparent: true,
        opacity: 0.5
    })
    var ceiling = new THREE.Mesh(floorGeo, material);
    ceiling.rotateX(-90 * Math.PI / 180);
    ceiling.position.set(0, 10, 0);
    scene.add(ceiling);
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

//==================== Mode Menu ===================================================================

function menu(){

  
    switch(menuStep){                       //case for main menu button
        case 0:
            menuLevel[1].visible = false;   //mode menu
            menuLevel[2].visible = false;   //configurator menu
            menuLevel[3].visible = false;
            menuLevel[4].visible = false;
            menuLevel[5].visible = false;

            tooltip.visible = false;
            tooltip2.visible = false;

            for (var i = 0; i <= robo.length -1 ; i++){
                robo[i].visible = false;
            }

            workpiece[0].visible = false;
            workpiece[1].visible = false;
            workpiece[2].visible = false;
            conveyor[0].visible = false;
            conveyor[1].visible = false;
            conveyor[2].visible = false;

            break;

        case 1:
            menuLevel[1].visible = true;
            menuLevel[2].visible = false;
            menuLevel[3].visible = false;
            menuLevel[4].visible = false;
            menuLevel[5].visible = false;
            
            if('undefined' !== typeof text){
                tooltip.visible = true;
                tooltip2.visible = false;
            }
            
            controller1.paintOff();

            for (var i = 0; i <= robo.length -1 ; i++){
                robo[i].visible = false;
            }

            workpiece[0].visible = false;
            workpiece[1].visible = false;
            workpiece[2].visible = false;
            conveyor[0].visible = false;
            conveyor[1].visible = false;
            conveyor[2].visible = false;
                
            break;

        case 2:
            menuLevel[1].visible = false;
            menuLevel[2].visible = true;
            menuLevel[3].visible = true;
            menuLevel[4].visible = true;
            menuLevel[5].visible = true;

            tooltip.visible = true;
            tooltip2.visible = true;

            for (var i = 0; i <= robo.length -1 ; i++){
                robo[i].visible = true;
                robo[i].position.set(roundPositions[i].position.x, roundPositions[i].position.y, roundPositions[i].position.z);

                if ( i === 1){
                    robo[i].scale.set(0.10 * robo[i].userData.factor, 0.1 * robo[i].userData.factor, 0.1 * robo[i].userData.factor);
                } else {
                    robo[i].scale.set(0.05 * robo[i].userData.factor, 0.05 * robo[i].userData.factor, 0.05 * robo[i].userData.factor);
                }
            }

            CNC[0].visible = false;
            workpiece[0].visible = false;
            workpiece[1].visible = false;
            workpiece[2].visible = false;
            conveyor[0].visible = false;
            conveyor[1].visible = false;
            conveyor[2].visible = false;
            break;      
        
        case 3:
            menuLevel[1].visible = false;
            menuLevel[2].visible = true;
            menuLevel[3].visible = true;
            menuLevel[4].visible = true;
            menuLevel[5].visible = true;
            

            for (var i = 0; i <= robo.length -1 ; i++){
                robo[i].visible = false;
            }

            CNC[0].visible = true;
            workpiece[0].visible = false;
            workpiece[1].visible = false;
            workpiece[2].visible = false;
            conveyor[0].visible = false;
            conveyor[1].visible = false;
            conveyor[2].visible = false;
            break;

        case 4:
            menuLevel[1].visible = false;
            menuLevel[2].visible = true;
            menuLevel[3].visible = true;
            menuLevel[4].visible = true;
            menuLevel[5].visible = true;
            for (var i = 0; i <= robo.length -1 ; i++){
                robo[i].visible = false;
            }

            CNC[0].visible = false;
            conveyor[0].visible = false;
            conveyor[1].visible = false;
            conveyor[2].visible = false;

            workpiece[0].visible = true;
            workpiece[1].visible = true;
            workpiece[2].visible = true;

            for (var i = 0; i <= workpiece.length -1 ; i++){
                workpiece[i].visible = true;
                workpiece[i].position.set(roundPositions[i].position.x, roundPositions[i].position.y, roundPositions[i].position.z);
            }
        
            break;

        case 5:
            menuLevel[1].visible = false;
            menuLevel[2].visible = true;
            menuLevel[3].visible = true;
            menuLevel[4].visible = true;
            menuLevel[5].visible = true;
            for (var i = 0; i <= robo.length -1 ; i++){
                robo[i].visible = false;
            }

            CNC[0].visible = false;

            workpiece[0].visible = false;
            workpiece[1].visible = false;
            workpiece[2].visible = false;

            conveyor[0].visible = true;
            conveyor[1].visible = true;
            conveyor[2].visible = true;

            for (var i = 0; i <= workpiece.length -1 ; i++){
                conveyor[i].visible = true;
                conveyor[i].position.set(roundPositions[i].position.x, roundPositions[i].position.y, roundPositions[i].position.z);

                if ( i === 1){
                    conveyor[i].scale.set(0.10 *  conveyor[i].userData.factor, 0.1 *  conveyor[i].userData.factor, 0.1 *  conveyor[i].userData.factor);
                } else {
                    conveyor[i].scale.set(0.05 *  conveyor[i].userData.factor, 0.05 *  conveyor[i].userData.factor, 0.05 *  conveyor[i].userData.factor);
                }
            }
            break;

        case 6:
            for (var i = 1; i < 6 ; i++){
                menulevel[i].visible = false;
            }
            for (var i = 0; i < robo.length; i++){
                robo[i].visible = false;
            }
            for (var i = 0; i < CNC.length; i++){
                CNC[i].visible = false;
            }
            for (var i = 0; i < workpiece.length; i++){
                workpiece[i].visible = false;
            }
            for (var i = 0; i < conveyor.length; i++){
                conveyor[i].visible = false;
            }
            menulevel[6].visible = true;
            
    }





   
}

//===================================================== Configurator ===============================================================
    function initMenu(){
        controller1.add(pickObj);
        
        //____________________________________Tooltip window(without text)____________________________________________________
        var geometry = new THREE.PlaneBufferGeometry(0.08, 0.02);
        var material = new THREE.MeshBasicMaterial({
            color: 0x000000,
            transparent: true,
            opacity: 0.8
        });
        plane = new THREE.Mesh(geometry,material);
        plane.position.set(0, 0.015, 0);
        plane.rotateX(-90*Math.PI/180);
        tooltip.add(plane);
        tooltip.visible = false;
        //________________________________________Menu levels__________________________________________________


        menuLevel[0] = new THREE.Object3D();
        
        menuLevel[1] = new THREE.Object3D();                                                            //main menu for modes
        menuLevel[1].position.set(-0.05, 0.05, 0.05);
                                                      
        addSymbol('Configurator', 0.05, 0.05, 0.002, 0.005, 1, './images/symbols/mode_configurator.png');               //symbol[1][0]: configuration mode
        addSymbol('Paint', 0.05, 0.05, 0.005, 0.005, 1, './images/symbols/mode_paint.png');                      //symbol[1][1]: paint mode
        symbol[1][1].position.x += 0.1;
        addSymbol('PCD', 0.05, 0.05, 0.005, 0.005, 1, './images/symbols/pcd.png');
        symbol[1][2].position.z += 0.1;
        symbol[1][2].position.y -= 0.025;

        addSymbol('Simulate', 0.05, 0.05, 0.005, 0.005, 1, './images/symbols/simulate.png');
        symbol[1][3].position.x += 0.1;
        symbol[1][3].position.z += 0.1;
        symbol[1][3].position.y -= 0.025;

        
        controller1.add(menuLevel[1]);

        menuLevel[1].visible = false;
        




        menuLevel[2] = new THREE.Object3D();                                                            //menu for configuration mode
        menuLevel[2].position.set(-0.1, 0 ,-0,15);
        controller1.add(menuLevel[2]);
        menuLevel[2].visible = false;

        addSymbol('Robot', 0.04, 0.04, 0.002, 0.002, 2, './images/symbols/robot.png');                          //symbol[2][0]: Robot
        symbol[2][0].position.set(0.025, 0.03, -0.25);
        symbol[2][0].rotateX(30*Math.PI /180);



        addSymbol('pick', 0.05, 0.05, 0.002, 0.002, 2, './images/symbols/ok.png');
        symbol[2][1].position.set(0.1, 0.05, 0.05);
        addSymbol('data', 0.05, 0.05, 0.002, 0.002, 2, './images/symbols/data.png');
        symbol[2][2].position.set(0, 0.02, 0.05);
      
        

        //menuLevel[2].add(pick);
        
    
    

        /*
        var geometry = new THREE.PlaneBufferGeometry(0.2, 0.05);
        
        plane = new THREE.Mesh(geometry, material);
        plane.position.set(0, 0.015, 0.05);
        plane.rotateX(-90*Math.PI/180);
        tooltip2.add(plane);
        tooltip2.visible = false;
        addSymbol()
        controller1.add(tooltip2); */
        
        menuLevel[3] = new THREE.Object3D();                                                            //menu for configuration mode
        menuLevel[3].position.set(-0.1, 0 ,-0,15);
        controller1.add(menuLevel[3]);
        menuLevel[3].visible = false;

        addSymbol('CNC', 0.04, 0.04, 0.002, 0.002, 3, './images/symbols/cnc.png');                      //symbol[2][1]: CNC
        symbol[3][0].position.set(0.075, 0.03, -0.25);
        symbol[3][0].rotateX(30*Math.PI /180);

        

        menuLevel[4] = new THREE.Object3D();                                                            //menu for configuration mode
        menuLevel[4].position.set(-0.1, 0 ,-0,15);
        controller1.add(menuLevel[4]);
        menuLevel[4].visible = false;

        addSymbol('Workpiece', 0.04, 0.04, 0.002, 0.002, 4, './images/symbols/workpiece.png');          //symbol[2][2]: Workpiece
        symbol[4][0].position.set(0.125, 0.03,-0.25);
        symbol[4][0].rotateX(30*Math.PI /180);

        menuLevel[5] = new THREE.Object3D();                                                            //menu for configuration mode
        menuLevel[5].position.set(-0.1, 0 ,-0,15);
        controller1.add(menuLevel[5]);
        menuLevel[5].visible = false;

        addSymbol('Conveyor', 0.04, 0.04, 0.002, 0.002, 5, './images/symbols/conveyor.png');            //symbol[2][3]: Conveyor
        symbol[5][0].position.set(0.175, 0.03, -0.25);
        symbol[5][0].rotateX(30*Math.PI /180);
        
        
        for(var i = 0; i <= menuLevel.length -1 ; i++){
            rayGroup.push(menuLevel[i]);
        }


        //_____ for simulation mode _____
        menuLevel[6] = new THREE.Object3D();                                                            //menu for configuration mode
        menuLevel[6].position.set(-0.1, 0 ,-0,15);
        controller1.add(menuLevel[6]);
        menuLevel[6].visible = false;
        addSymbol('Choose object', 0.04, 0.04, 0.002, 0.002, 6, './images/symbols/conveyor.png');

        
        
        createArrowButtons();                                                                           //arrow symbols

        var geometry = new THREE.BoxBufferGeometry(0.01, 0.01, 0.01);
        var material = new THREE.MeshBasicMaterial({transparent: true, opacity: 0});
        roundPositions[0] = new THREE.Mesh(geometry, material);
        roundPositions[0].position.set(-0.1, -0.05, -0.1);

        roundPositions[1]= new THREE.Mesh(geometry, material);
        roundPositions[1].position.set(0, -0.015, -0.045);

        roundPositions[2] = new THREE.Mesh(geometry, material);
        roundPositions[2].position.set(0.1, -0.05, -0.1);
       
        

        roundPositions[0].visible = false;
        roundPositions[1].visible = false;
        roundPositions[2].visible = false;

        controller1.add(roundPositions[0], roundPositions[1], roundPositions[2]);



        
        



        
        



        


    }

//===================================================== Paint function ==============================================================


    function initGeometry() {
            pivot = new THREE.Mesh( new THREE.IcosahedronBufferGeometry( 0.01, 2 ) );           //Init for pivot
            pivot.name = 'pivot';
            pivot.position.y = -0.016;
            pivot.position.z = -0.043;
            pivot.rotation.x = Math.PI / 5.5;
            controller1.add( pivot );
            pivot.visible = false;
            pivot.material = pivot.material.clone();
        

            var geometry = new THREE.BufferGeometry();                                              
            var positions = new THREE.BufferAttribute( new Float32Array( 1000000 * 3 ), 3 );    //geometry for painted line
            positions.dynamic = true;
            geometry.addAttribute( 'position', positions );
            var normals = new THREE.BufferAttribute( new Float32Array( 1000000 * 3 ), 3 );
            normals.dynamic = true;
            geometry.addAttribute( 'normal', normals );
            var colors = new THREE.BufferAttribute( new Float32Array( 1000000 * 3 ), 3 );
            colors.dynamic = true;
            geometry.addAttribute( 'color', colors );
            geometry.drawRange.count = 0;
            //
        
            var material = new THREE.MeshStandardMaterial( {
                roughness: 0.9,
                metalness: 0.0,
                // envMap: reflectionCube,
                vertexColors: THREE.VertexColors,
                side: THREE.DoubleSide
            } );
            paintLine = new THREE.Mesh( geometry, material );
            paintLine.frustumCulled = false;
            paintLine.castShadow = true;
            paintLine.receiveShadow = true;
            scene.add( paintLine );
            // Shapes
            shapes[ 'tube' ] = getTubeShapes( 1.0 );                    //calles function for creating tube shape
    }

    function getTubeShapes( size ) {                                    //function for creating tube shape
        var PI2 = Math.PI * 2;
        var sides = 10;
        var array = [];
        var radius = 0.01 * size;
        for( var i = 0; i < sides; i ++ ) {
            var angle = ( i / sides ) * PI2;
            array.push( new THREE.Vector3( Math.sin( angle ) * radius, Math.cos( angle ) * radius, 0 ) );
        }
        return array;
    }




    function stroke( controller, point1, point2, matrix1, matrix2 ) {   //function to paint line in VR
        var color = controller.getColor();
        var shapes = getTubeShapes( controller.getSize() );
        var geometry = paintLine.geometry;
        var attributes = geometry.attributes;
        var count = geometry.drawRange.count;
        var positions = attributes.position.array;
        var normals = attributes.normal.array;
        var colors = attributes.color.array;
        for ( var j = 0, jl = shapes.length; j < jl; j ++ ) {
            var vertex1 = shapes[ j ];
            var vertex2 = shapes[ ( j + 1 ) % jl ];
            // positions
            vector1.copy( vertex1 );
            vector1.applyMatrix4( matrix2 );
            vector1.add( point2 );
            vector2.copy( vertex2 );
            vector2.applyMatrix4( matrix2 );
            vector2.add( point2 );
            vector3.copy( vertex2 );
            vector3.applyMatrix4( matrix1 );
            vector3.add( point1 );
            vector4.copy( vertex1 );
            vector4.applyMatrix4( matrix1 );
            vector4.add( point1 );
            vector1.toArray( positions, ( count + 0 ) * 3 );
            vector2.toArray( positions, ( count + 1 ) * 3 );
            vector4.toArray( positions, ( count + 2 ) * 3 );
            vector2.toArray( positions, ( count + 3 ) * 3 );
            vector3.toArray( positions, ( count + 4 ) * 3 );
            vector4.toArray( positions, ( count + 5 ) * 3 );
            // normals
            vector1.copy( vertex1 );
            vector1.applyMatrix4( matrix2 );
            vector1.normalize();
            vector2.copy( vertex2 );
            vector2.applyMatrix4( matrix2 );
            vector2.normalize();
            vector3.copy( vertex2 );
            vector3.applyMatrix4( matrix1 );
            vector3.normalize();
            vector4.copy( vertex1 );
            vector4.applyMatrix4( matrix1 );
            vector4.normalize();
            vector1.toArray( normals, ( count + 0 ) * 3 );
            vector2.toArray( normals, ( count + 1 ) * 3 );
            vector4.toArray( normals, ( count + 2 ) * 3 );
            vector2.toArray( normals, ( count + 3 ) * 3 );
            vector3.toArray( normals, ( count + 4 ) * 3 );
            vector4.toArray( normals, ( count + 5 ) * 3 );
            // colors
            color.toArray( colors, ( count + 0 ) * 3 );
            color.toArray( colors, ( count + 1 ) * 3 );
            color.toArray( colors, ( count + 2 ) * 3 );
            color.toArray( colors, ( count + 3 ) * 3 );
            color.toArray( colors, ( count + 4 ) * 3 );
            color.toArray( colors, ( count + 5 ) * 3 );
            count += 6;
        }
        geometry.drawRange.count = count;
    }

    function updateGeometry( start, end ) {             //render function: updating painted geometry
        if ( start === end ) return;
        var offset = start * 3;
        var count = ( end - start ) * 3;
        var geometry = paintLine.geometry;
        var attributes = geometry.attributes;
        attributes.position.updateRange.offset = offset;
        attributes.position.updateRange.count = count;
        attributes.position.needsUpdate = true;
        attributes.normal.updateRange.offset = offset;
        attributes.normal.updateRange.count = count;
        attributes.normal.needsUpdate = true;
        attributes.color.updateRange.offset = offset;
        attributes.color.updateRange.count = count;
        attributes.color.needsUpdate = true;
    }

    function handleController( controller ) {           //render function: handle controller for paint mode
        var pivot = controller.getObjectByName( 'pivot' );
        if (paintActive === true){
            pivot.visible = true;
            if ( pivot ) {
                pivot.material.color.copy( controller.getColor() );
                pivot.scale.setScalar(controller.getSize());
                var matrix = pivot.matrixWorld;
                var point1 = controller.userData.points[ 0 ];
                var point2 = controller.userData.points[ 1 ];
                var matrix1 = controller.userData.matrices[ 0 ];
                var matrix2 = controller.userData.matrices[ 1 ];
                point1.setFromMatrixPosition( matrix );
                matrix1.lookAt( point2, point1, up );
                if ( controller.getButtonState( 'trigger' ) ) {
                    if( controller.getColorUIState() === false && paintState === true){
                    stroke( controller, point1, point2, matrix1, matrix2 );
                    } if( controller.getColorUIState() === true){
                        controller.toggleColorUI();
                        paintState = false;
                    }
                }
                if (controller.getButtonState('thumbpad')){
                    if (toggleState === true && menuStep === 0){
                        controller.toggleColorUI();
                        toggleState = false;
                    }
                } 

                point2.copy( point1 );
                matrix2.copy( matrix1 );
                
            }
        } else {
            pivot.visible = false;
            
        }
    }

    function undoPaint() {

    }


    function addSymbol(name ,width, height, depth, frame, level, path){

        var loader = new THREE.TextureLoader(manager);
        var extrudeSettings = { bevelEnabled: false, depth: depth };


        var geometry = new THREE.PlaneBufferGeometry(width - (2 * frame), height - (2* frame));
        var material = new THREE.MeshPhongMaterial({
            map: loader.load(path),
            side: THREE.DoubleSide,
            transparent: true
        });

        if(symbol[level] === undefined){
            symbol[level] = [];
        }
        symbol[level][symbolCounter[level]] = new THREE.Mesh(geometry, material);
        symbol[level][symbolCounter[level]].name = name;
        //if('undefined' !== typeof symbol[level][symbolCounter[level]].value){
            symbol[level][symbolCounter[level]].value = symbolCounter[level];
        //}
        
        var geometry = new THREE.PlaneBufferGeometry( width, height);
        var material = new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide});
        var plane = new THREE.Mesh(geometry, material);
        plane.name = 'exclude';

        symbol[level][symbolCounter[level]].add(plane);
        plane.position.set(0, 0, -0.003);

        var shape = new THREE.Shape();
        shape.moveTo(0 , 0);
        shape.lineTo(0, height);
        shape.lineTo(width,height);
        shape.lineTo(width, 0);

        var hole = new THREE.Path();
        hole.moveTo(frame, frame);
        hole.lineTo(frame, height - frame);
        hole.lineTo(width - frame, height - frame);
        hole.lineTo(width - frame, frame);

        shape.holes.push(hole);

        var geometry = new THREE.ExtrudeBufferGeometry(shape, extrudeSettings);
        var material = new THREE.MeshBasicMaterial({color: 0xffffff, side: THREE.DoubleSide});
        var extrude = new THREE.Mesh(geometry, material);
        extrude.name = 'exclude';

        symbol[level][symbolCounter[level]].add(extrude);
        extrude.position.set(-width/2, -height/2, -depth/2);
        symbol[level][symbolCounter[level]].rotateX(-75* Math.PI /180);


        menuLevel[level].add(symbol[level][symbolCounter[level]]);

        symbolCounter[level]++;
        
            
         
    }

    function createText(string){
        var loader = new THREE.FontLoader(manager);
        loader.load('js/examples/fonts/helvetiker_regular.typeface.json', function(font){
            var geometry = new THREE.TextGeometry(string, {
                font: font,
                size: 0.01,
                height: 0.002,
                curveSegments: 12,
                /*bevelEnabled: true,
                bevelThickness: 0.001,
                bevelSize: 0.001,
                bevelSegments: 1 */
            });
            var material = new THREE.MeshStandardMaterial({color: 0xffffff});
            text = new THREE.Mesh(geometry, material);
            tooltip.add(text);
            text.position.set(-text.geometry.parameters.text.length/280, 0.015, 0.005);
            text.rotateX(-90 * Math.PI/180);
    
            controller1.add(tooltip);
        });
        
    }

    function createArrowButtons(){
        var extrudeSettings = {  bevelEnabled: false, depth: 0.005};

        var shape = new THREE.Shape();
        shape.moveTo(0 , 0);
        shape.lineTo(0, 0.025);
        shape.lineTo(0.025, 0.05);
        shape.lineTo(0, 0.075);
        shape.lineTo(0, 0.1);
        shape.lineTo(0.05, 0.05);
        shape.lineTo(0, 0);

        var material = new THREE.MeshPhongMaterial({color: 0xffffff});
        var geometry = new THREE.ExtrudeBufferGeometry(shape, extrudeSettings);
        var right = new THREE.Mesh(geometry, material);
        right.name = 'next';
        right.rotateX(-60*Math.PI / 180);
        right.position.set(0.20, 0, - 0.05);

        var left = new THREE.Mesh(geometry, material);
        left.name = 'previous';
        left.rotateX(-60*Math.PI / 180);
        left.rotateY(180 * Math.PI / 180);
        left.position.set(0, 0, right.position.z);
        menuLevel[2].add(right, left); 

        /*var geometry = new THREE.PlaneBufferGeometry(0.05, 0.05);
        var material = new THREE.MeshPhongMaterial({color: 0xffffff, side: THREE.DoubleSide, wireframe: true});

        var arrow = new THREE.Mesh(geometry, material);
        arrow.rotateX(-60 * Math.PI / 180);
        arrow.name = 'next'
        arrow.position.set(0.20, 0 , -0.05);
        menuLevel[2].add(arrow); */
    }

    function getDistance(mesh1, mesh2) { 
        var dx = mesh1.position.x - mesh2.position.x; 
        var dy = mesh1.position.y - mesh2.position.y; 
        var dz = mesh1.position.z - mesh2.position.z; 
        return sqrt(dx*dx+dy*dy+dz*dz); 
      }

    function getDistanceY(mesh1, mesh2){
        var dy = mesh1.position.y - mesh2.position.y; 
        return dy;
    }
      
    



function scaling(obj, axis){
    var max = 0;
    var factor = 0;
    if (axis === 'y'){
        for (var i = 0; i <= obj.geometry.vertices.length -1 ; i++){   
            if (max < obj.geometry.vertices[i].y){
                max = obj.geometry.vertices[i].y;
            }
        }
        factor = 1/ max;
        if ( obj.userData.factor === undefined){
            obj.userData.factor = factor;
        }
        return obj.scale.set(factor, factor, factor);
    } else if (axis === 'z'){
        for (var i = 0; i <= obj.geometry.vertices.length -1 ; i++){   
            if (max < obj.geometry.vertices[i].z){
                max = obj.geometry.vertices[i].z;
            }
        }
        factor = 1/ max;
        if ( obj.userData.factor === undefined){
            obj.userData.factor = factor;
        }
        return obj.scale.set(factor, factor, factor);
    }
}

function teleport(point) {

	var newPos = THREE.Vector3(0, 0, 0);
	
	newPos = point; 													// target point = new destination
	newPos.y = 0;														// not to end in the Floor if s.th. went wrong
	dollyCam.position.set(newPos.x, newPos.y, newPos.z);				// moves scene instead of Camera
	
}


function initPCD(){
        // instantiate a loader
    var loader = new THREE.PCDLoader(manager);

    // load a resource
    loader.load(
        // resource URL
        'models/pcd/faps/table.pcd',
        // called when the resource is loaded
        function ( mesh ) {
            var oldMat = new THREE.MeshPhongMaterial();
            mesh.name = 'pcd';
           // mesh.position.set(-0.7 , -0.15 , 2.4);
            mesh.rotateX(-90*Math.PI / 180);
            controller3.add( mesh );
            mesh.visible = false;
            PCD[PCDCounter] = mesh;

            PCDCounter++;

        },
        // called when loading is in progresses
        function ( xhr ) {

            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

        },
        // called when loading has errors
        function ( error ) {

            console.log( 'An error happened' );

        }
    );
}

function loadData(){
    var loader = new THREE.TextureLoader(manager);
    var geometry = new THREE.PlaneBufferGeometry(0.21, 0.297);
    var material = new THREE.MeshBasicMaterial({
        map: loader.load('images/data/ur5.png')
    });
    var mesh = new THREE.Mesh(geometry, material);
    controller2.add(mesh);
   // mesh.position.set(-0.3, 0, -0.2);
   // mesh.rotateX(-60* Math.PI / 180);
    //mesh.rotateY(30* Math.PI / 180);

    mesh.position.set(0, 0.04, 0);
    mesh.rotateX(-75* Math.PI / 180);
    mesh.visible = false;
    return mesh;
}











/*
function loadFloor2(){
    var colladaLoader = new THREE.ColladaLoader(manager);
			
			var dae;
			colladaLoader.load('models/dae/robo/floor.dae', function(collada){
				dae = collada.scene;
				dae.traverse( function ( node ) {
					if ( node instanceof THREE.Mesh){
					} 
				}); 

                dae.position.set(0, 0.1, -1);
				scene.add(dae);
		
			},
			function ( xhr ) {
			console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
			},

			function ( error ) {
			console.log( 'An error happened' )
			})

} 

*/



/*
function loadTest3(){
    var objLoader = new THREE.OBJLoader(manager);
    var mtlLoader = new THREE.MTLLoader(manager);
   // mtlLoader.setTexturePath('models/obj/robo/')
    mtlLoader.load('models/obj/robo/ur3.mtl', function(materials){
        materials.isMultiMaterial = true;
        materials.preload();
        objLoader.setMaterials(materials);  
        objLoader.load('models/obj/robo/ur3.obj', function(obj){
            obj.traverse( function ( node ) {

            if ( node instanceof THREE.LineSegments){
                node.castShadow = true;
                node.material.wireframe = false;
                node.material.linecap = 'round';
                node.material.linejoin = 'round';
                node.material.linewidth = 2;
            } 
            obj.position.set(0.5, 0, -3.8);
        });

            obj.scale.set(0.001369, 0.001369, 0.001369);
            scene.add(obj);
            
        },
    function ( xhr ) {

    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

    },
    // called when loading has errors
    function ( error ) {

    console.log( 'An error happened' )
    })
    })
    
} */

/*function loadTest(){
        var colladaLoader = new THREE.ColladaLoader(manager);
        var dae;
        colladaLoader.load('models/dae/robo/ur3.dae', function(collada){
            dae = collada.scene;
            /*dae.traverse( function ( node ) {
                if ( node instanceof THREE.Mesh){
                    //oldMat.color = node.material.color
                    //node.material = oldMat;
                    node.castShadow = true;
                    node.material.flatShading = true;
                    
                } 
            }); 


            
            scene.add(dae);
            dae.scale.set(0.001 , 0.001, 0.001);
            dae.position.set(0, 1, -0.5);
        },
        function ( xhr ) {
        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        },

        function ( error ) {
        console.log( 'An error happened' )
        })
    } */