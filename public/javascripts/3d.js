var WIDTH = 800,
	HEIGHT = 600;
// camera attributes
var VIEW_ANGLE = 45,
	ASPECT = WIDTH / HEIGHT,
	NEAR = 0.1,
	FAR = 10000;


// get the DOM element to attach to
var $container = $('#canvas-wrap');

// create WebGL renderer, camera, and a scene

var renderer = new THREE.WebGLRenderer({alpha: true});

var camera = 
	new THREE.PerspectiveCamera(
		VIEW_ANGLE,
		ASPECT,
		NEAR,
		FAR );

var scene = new THREE.Scene();

// add the camera to the scene
scene.add(camera);
camera.position.z = 300;

renderer.setSize(WIDTH, HEIGHT);
$container.append(renderer.domElement);

// sphere

var radius = 50,
	segments = 16,
	rings = 16;

var sphereMaterial = 
	new THREE.MeshLambertMaterial(
		{ 
			color: 0xCC0000
		});

var sphere = new THREE.Mesh(
		new THREE.SphereGeometry(
			radius,
			segments,
			rings),
		sphereMaterial
	);

scene.add(sphere);

var pointLight = new THREE.PointLight(0xFFFFFF);
pointLight.position.x = 10;
pointLight.position.y = 50;
pointLight.position.z = 130;

scene.add(pointLight);

renderer.render(scene, camera);

updateFcts = [];
var keyboard	= new THREEx.KeyboardState(renderer.domElement);
	renderer.domElement.setAttribute("tabIndex", "0");
	renderer.domElement.focus();
	
	updateFcts.push(function(delta, now){
		if( keyboard.pressed('left') ){
			sphere.position.x -= 10 * delta;			
		}else if( keyboard.pressed('right') ){
			sphere.position.x += 10 * delta;
		}
		if( keyboard.pressed('down') ){
			sphere.rotation.y += 10 * delta;		
		}else if( keyboard.pressed('up') ){
			sphere.rotation.y -= 10 * delta;		
		}
	})

	updateFcts.push(function(){
		renderer.render( scene, camera );		
	})
	//////////////////////////////////////////////////////////////////////////////////
	//		loop runner							//
	//////////////////////////////////////////////////////////////////////////////////
	var lastTimeMsec= null
	requestAnimationFrame(function animate(nowMsec){
		// keep looping
		requestAnimationFrame( animate );
		// measure time
		lastTimeMsec	= lastTimeMsec || nowMsec-1000/60
		var deltaMsec	= Math.min(200, nowMsec - lastTimeMsec)
		lastTimeMsec	= nowMsec
		// call each update function
		updateFcts.forEach(function(updateFn){
			updateFn(deltaMsec/1000, nowMsec/1000)
		})
	})