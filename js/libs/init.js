//============================ Declaration ==========================================

var scene, render, renderer, dollyCam, camera, controller1, controller2, clock, cube, floor;
var manager;
var tutorialWindows = new THREE.Object3D();
var dragCube = false;
var firstTimePressed = false;
var tempMatrix = new THREE.Matrix4();
var intersected = [];
var lastIntersected;
var arrow;



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


var roundPositions = [];
var robo = [];
var roboCounter = 0;
var CNC = [];
var CNCCounter = 0;



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

        camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 1000);
        dollyCam = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 1000);
        dollyCam.add(camera);
        scene.add(dollyCam);

        clock = new THREE.Clock(); 

        var loader = new THREE.TextureLoader();
        var floorGeo = new THREE.PlaneBufferGeometry(200, 200, 20, 20);
        var floorMat = new THREE.MeshStandardMaterial({
            map: loader.load('images/textures/floor/floor1.jpg', function(map){
                map.wrapS = THREE.RepeatWrapping;
                map.wrapT = THREE.RepeatWrapping;
                map.anisotropy = 4;
                map.repeat.set( 600, 600 )
            }),
            color: 0x222222,
            roughness: 0.5,
            metalness: 1.0
        });
        floor = new THREE.Mesh(floorGeo, floorMat);
        floor.position.set(0,0,0);
        floor.rotateX(-90* Math.PI/180);
        floor.receiveShadow = true;
        floor.name = 'floor';
        

        rayGroup.push(floor);
        scene.add(floor);

      
        scene.add( new THREE.HemisphereLight( 0x888877, 0x777788 ) );

        var x = -100;
        var z = -100;
        
       
            var point = new THREE.DirectionalLight(0xffffff, 1.5);
            point.castShadow = true;
            point.shadow.camera.top = 2;
            point.shadow.camera.bottom = -2;
            point.shadow.camera.right = 2;
            point.shadow.camera.left = -2;
            point.shadow.mapSize.set( 4096, 4096 );
            point.shadow.mapSize.set( 4096, 4096 );
            scene.add(point);
            point.position.set(0, 10, 0);
        

        var cubeGeo = new THREE.BoxBufferGeometry(2,2,2);
        var cubeMat = new THREE.MeshStandardMaterial({color: 0x00ff00});
        cube = new THREE.Mesh(cubeGeo, cubeMat);
        cube.position.set(camera.position.x, camera.position.y, camera.position.z -5);
        cube.castShadow = true;
        cube.receiveShadow = true;
        scene.add(cube);

        rayGroup.push(cube);


        excludeGroup.push('floor', 'frame');
    
       

        
    
        

        
    //====================== Controller ============================================

        controller1 = new THREE.ViveController(0);
        controller1.standingMatrix = renderer.vr.getStandingMatrix();
        controller1.userData.points = [ new THREE.Vector3(), new THREE.Vector3() ];
		controller1.userData.matrices = [ new THREE.Matrix4(), new THREE.Matrix4() ];
        scene.add(controller1);

        controller2 = new THREE.ViveController(1);
        controller2.standingMatrix = renderer.vr.getStandingMatrix();
        controller2.userData.points = [ new THREE.Vector3(), new THREE.Vector3() ];
		controller2.userData.matrices = [ new THREE.Matrix4(), new THREE.Matrix4() ];
        scene.add(controller2);


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
    createTracker();
    initGeometry();
    initMenu();
    


}
//=========================== Init End===================================================

//================================ Render ===============================================

function render(){

    controller1.update();
    controller2.update();
    renderer.setAnimationLoop(render);
    renderer.render(scene, camera);
    
    if(dragCube == true){
        cube.position.y += 0.05;
    }
    if(clock.getElapsedTime() >= 30 || firstTimePressed === true){
        controller1.remove(tutorialWindows);
    };
    
    intersectObjects(controller2);
    //cleanIntersected();
    if(clock.getElapsedTime() >= 2){
        robo[0].rotation.z += 0.01;
        robo[1].rotation.z += 0.01;
        robo[2].rotation.z += 0.01;
    };

    var count = paintLine.geometry.drawRange.count;
    handleController(controller1);
    updateGeometry( count, paintLine.geometry.drawRange.count );
    positioningMode();
    
}

//================================= Render End ================================================


//================================= Controller Load ============================================
function loadController() {

    var loader = new THREE.OBJLoader();
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


        controller1.name = 'Controller1';
        controller1.add(tutorialWindows);

 
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
        /*
        if (robo[0].visible === true){
            robo[0].visible = false;
            robo[1].visible = true;
        } else if(robo[1].visible === true){
            robo[1].visible = false;
            robo[2].visible = true;
        } else if(robo[2].visible === true){
            robo[2].visible = false;
            robo[0].visible = true;
        }*/

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
    var border = 0.3

    switch(menuStep){
        case 1:
            if ( axisX <= -border && targetNo !== symbol[menuStep][0].value ){ 
                targetNo -= 1; 
                menu();
                return;
            } 
            if ( axisX >= border && targetNo !== symbol[menuStep][1].value){
                targetNo += 1; 
                menu();
                return;
            }
            
            if ( axisX <= border && axisX >= -border && axisY <= border && axisY >= -border){

                if( targetNo === symbol[menuStep][0].value) {
                    controller1.paintOff();
                    menuStep = 2;
                    targetNo = symbol[menuStep][0].value;
                    menu();
                    return;
                }    
                if ( targetNo === symbol[menuStep][1].value) {
                    controller1.paintOn();
                    menuStep = 0;
                    menu();
                    return;
                }
            }
            break;

        case 2: 
                                                                                                                            // if( axisY >= border && menuStep < symbol[menuStep][symbolCounter[menuStep]-1].value){
             if( axisY >= border){              
                menuStep++;
                targetNo = symbol[menuStep][0].value;
                menu();
                return;
            } 
            if ( axisX <= border && axisX >= -border && axisY <= border && axisY >= -border){

                if( targetNo === 2) {
                   
                    if (axisX <= border) {
                        robo[1].position.set(-0.1, -0.05, -0.1);
                        robo[1].scale.set(0.05, 0.05, 0.05);
                        robo[2].position.set(0.1, -0.05, -0.1);
                        robo[2].scale.set(0.05, 0.05, 0.05);
                    }
                    return;
                }
            } 
            break;
        
        case 3:
            if( axisY >= border){              
                menuStep++;
                targetNo = symbol[menuStep][0].value;
                menu();
                return;
            }
            if( axisY <= border){
                menuStep--;
                targetNo = symbol[menuStep][0].value;
                menu();
                return;
            }
        
        case 4:
            if( axisY >= border){              
                menuStep++;
                targetNo = symbol[menuStep][0].value;
                menu();
                return;
            }
            if( axisY <= border){
                menuStep--;
                targetNo = symbol[menuStep][0].value;
                menu();
                return;
            }
        
        case 5:

            if( axisY >= border){              
                menuStep++;
                targetNo = symbol[menuStep][0].value;
                menu();
                return;
            }
            if( axisY <= border){
                menuStep--;
                targetNo = symbol[menuStep][0].value;
                menu();
                return;
            }
    } 

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
    handleIntersections();
}

function onTriggerUp2(){
    toggleTrigger2 = true;
}

function onAxisChanged2(){

}

function onThumbpadDown2(){

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

    // Do not highlight when already selected
    if (controller.userData.selected !== undefined) return;

    var line = controller.getObjectByName('line');
    var intersections = getIntersections(controller);

    if (intersections.length > 0) {
        
        var intersection = intersections[0];
        var object = intersection.object;
        if(object.name === 'frame') return;

        if(object.name !== 'floor' && lastIntersected !== object){
            controller2.setVibe('pick').set(0.05).wait(10).set(0);
            
            
        }
        if(object.name !== 'floor' && object.name !== 'frame'){
            object.scale.set(1.3, 1.3,1);
            object.material.emissive.b = 1;
        }
        
        

        
        if(object.children !== undefined){
            //object.children.scale.set(1.3, 1.3, 1);
        }
        
        //symbol[l][n].children[0].material.color.setHex(0x00ffc2);

        //object.material.emissive.r = 1;
        if( lastIntersected !== object && object.name !== 'floor' && object.name !== 'frame'){
            tooltip.remove(text);
            createText(object.name);
        } 

       
        intersected.push(object);
        //line.scale.y = intersection.distance;
        //line.scale.z = intersection.distance;
        
    }
    else {
        //line.scale.set(0, 0.1 ,0.1);
    }
    cleanIntersected();
    lastIntersected = object;
}

function cleanIntersected() {
    while (intersected.length) {
        var object = intersected.pop();
        if (lastIntersected === object) return;
        object.scale.set(1, 1, 1);
        object.material.emissive.b = 0;
        if ( lastIntersected !== undefined){
            lastIntersected.scale.set(1, 1, 1);
            lastIntersected.material.emissive.b = 0;
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
            } else if (object.name === "Robot") {
                menuStep = 2;
                menu();
                return;
            } else if (object.name === "CNC") {
                menuStep = 3;
                menu();
                return;
            } else if (object.name === 'next'){
                if (menuStep === 2){
                    roboState++;
                } if (menuStep === 3){
                    CNCState++;
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
                        node.material.transparent = true;
                        node.material.opacity = 0.5;
                        
                    }
                });

                positioningModeOn = true;
                toggleTrigger2 = false;
                return;
            }
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
                copyObj.scale.set(3, 3, 3);
                copyObj.lookAt(0, 1, 0);
                scene.add(copyObj);
                alreadyCopied = true;
            }
            
            if (object.name === 'floor'){
                copyObj.position.set(position.x, position.y, position.z);
            }
            
            if( controller2.getButtonState( 'trigger') === true && toggleTrigger2 === true ){
                copyObj.traverse( function ( node ) {
                    if ( node instanceof THREE.Mesh){
                        node.material.transparent = false;
                        node.material.opacity = 1;
                    }
                });
                controller2.remove(pickObj);
                if (menuStep === 2){
                    createdRobo[createdRoboCounter] = copyObj;
                    createdRoboCounter++;
                    alreadyCopied = false;
                } else if ( menuStep === 3){
                    createdCNC[createdCNCCounter] = copyObj;
                    createdCNCCounter++;
                    alreadyCopied = false;
                }
                positioningModeOn = false; 
            } 
            
        }
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
                
                getRoundPos(1, robo[0]);
                getRoundPos(0, robo[1]);
                getRoundPos(2, robo[2]);
    
                getBig(robo[0]);
                getSmall(robo[1]);
                getSmall(robo[2]);
    
    
                pickObj = robo[0].clone();
                /*
                pickObj.position.set(0.1, 0.1, 0.1);
                controller1.add(pickObj);
                rayGroup.push(pickObj);*/
    
                break;
    
            case 1:
                getRoundPos(0, robo[0]);
                getRoundPos(2, robo[1]);
                getRoundPos(1, robo[2]);
    
                getSmall(robo[0]);
                getSmall(robo[1]);
                getBig(robo[2]);
    
                pickObj = robo[2].clone();
                
                break;
            
            case 2:
                getRoundPos(2, robo[0]);
                getRoundPos(1, robo[1]);
                getRoundPos(0, robo[2]);
    
                getSmall(robo[0]);
                getBig(robo[1]);
                getSmall(robo[2]);
    
                pickObj = robo[1].clone();
    
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
    }
    

    
    function getRoundPos(i , robo){
        robo.position.x = roundPositions[i].position.x;
        robo.position.y = roundPositions[i].position.y;
        robo.position.z = roundPositions[i].position.z;
        return;
    }

    function getBig(robo){
        robo.scale.set(0.15, 0.15, 0.15);
        return;
    }

    function getSmall(robo){
        robo.scale.set(0.05, 0.05, 0.05);
        return;
    }
}

//============================== Robo =================================================================
function initRobo(){
    loadRobo('kuka kr5 r650', 'models/dae/robo/kuka-kr5-r650.dae');
    loadRobo('kuka kr5 r850','models/dae/robo/kuka-kr5-r850.dae');
    loadRobo('UR5','models/dae/robo/UR5.dae')
    function loadRobo(name, path){
        var colladaLoader = new THREE.ColladaLoader(manager);
        var textureLoader = new THREE.TextureLoader(manager);
        var dae;
        var oldMat = new THREE.MeshPhongMaterial() ;
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
            dae.scale.set(0.15 , 0.15, 0.15);
            
            dae.position.set(0, -0.015, -0.045);
            dae.rotateX(-60* Math.PI/180);
            robo[roboCounter] = dae;
            robo[roboCounter].visible = false;
            robo[roboCounter].name = name;
            roboCounter++;



        },
        function ( xhr ) {
        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        },

        function ( error ) {
        console.log( 'An error happened' )
        })
    }
     
} 

//========================== CNC =========================================================================
function initCNC(){
    loadCNC('CNC', 'models/dae/CNC/CNC.dae');
    function loadCNC(name, path){
        var colladaLoader = new THREE.ColladaLoader(manager);
        var textureLoader = new THREE.TextureLoader(manager);
        var dae;
        var oldMat = new THREE.MeshPhongMaterial() ;
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

            robo[0].visible = false;
            robo[1].visible = false;
            robo[2].visible = false;

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

            robo[0].visible = false;
            robo[1].visible = false;
            robo[2].visible = false;
                
            break;

        case 2:
            menuLevel[1].visible = false;
            menuLevel[2].visible = true;
            menuLevel[3].visible = true;
            menuLevel[4].visible = true;
            menuLevel[5].visible = true;

            tooltip.visible = true;
            tooltip2.visible = true;

            robo[0].visible = true;
            robo[1].visible = true;
            robo[2].visible = true;

            CNC[0].visible = false;
        
            robo[1].position.set(roundPositions[0].position.x, roundPositions[0].position.y, roundPositions[0].position.z);
            robo[1].scale.set(0.05, 0.05, 0.05);
            robo[2].position.set(roundPositions[2].position.x, roundPositions[2].position.y, roundPositions[2].position.z);
            robo[2].scale.set(0.05, 0.05, 0.05);

        
            

            break;      
        
        case 3:
            menuLevel[1].visible = false;
            menuLevel[2].visible = true;

            robo[0].visible = false;
            robo[1].visible = false;
            robo[2].visible = false;

            CNC[0].visible = true;



            break;

        case 4:

        
            break;

        case 5:

            break;
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

        
        controller1.add(menuLevel[1]);

        menuLevel[1].visible = false;
        




        menuLevel[2] = new THREE.Object3D();                                                            //menu for configuration mode
        menuLevel[2].position.set(-0.1, 0 ,-0,15);
        controller1.add(menuLevel[2]);
        menuLevel[2].visible = false;

        addSymbol('Robot', 0.02, 0.02, 0.002, 0.002, 2, './images/symbols/robot.png');                          //symbol[2][0]: Robot
        symbol[2][0].position.set(0, 0.05, -0.1);

        var geometry = new THREE.PlaneBufferGeometry(0.05, 0.05);
        var material = new THREE.MeshPhongMaterial({color: 0xffff00});
        var pick = new THREE.Mesh(geometry, material);
        pick.position.set(0, 0.05, 0.05);
        pick.rotateX(-90 * Math.PI /180);
        pick.name = "pick";

        menuLevel[2].add(pick);
        
    
    

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

        addSymbol('CNC', 0.02, 0.02, 0.002, 0.002, 3);                                                          //symbol[2][1]: CNC
        symbol[3][0].position.set(0, 0.04, -0.07);

        

        menuLevel[4] = new THREE.Object3D();                                                            //menu for configuration mode
        menuLevel[4].position.set(-0.1, 0 ,-0,15);
        controller1.add(menuLevel[4]);
        menuLevel[4].visible = false;

        addSymbol('Workpiece', 0.02, 0.02, 0.002, 0.002, 4);                                                    //symbol[2][2]: Workpiece
        symbol[4][0].position.set(0, 0.03, -0.04);

        menuLevel[5] = new THREE.Object3D();                                                            //menu for configuration mode
        menuLevel[5].position.set(-0.1, 0 ,-0,15);
        controller1.add(menuLevel[5]);
        menuLevel[5].visible = false;

        addSymbol('Line', 0.02, 0.02, 0.002, 0.002, 5);                                                         //symbol[2][3]: Lines
        symbol[5][0].position.set(0, 0.02, -0.01);
        
        
        
        for(var i = 0; i <= menuLevel.length -1 ; i++){
            rayGroup.push(menuLevel[i]);
        }

        
        
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
        var material = new THREE.MeshStandardMaterial({
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
        extrude.name = 'frame';

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
        var extrudeSettings = {  bevelEnabled: false, depth: 0.01};

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
