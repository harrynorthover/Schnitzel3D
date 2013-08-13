/**
 *
 * Scene to test the use of SKYLINE.PlaneGeometry
 *
 */

var scene       = new SKYLINE.Scene();
var camera      = new SKYLINE.PerspectiveCamera( 45, window.innerWidth/window.innerHeight, 30, 1000 );
var renderer    = new SKYLINE.WebGLRenderer({
    autoClear: true,
    autoClearColor: new SKYLINE.Color(255, 0, 0, 0),
    fullscreen: false
});

var plane = new SKYLINE.PlaneGeometry( 200, 200, 10, 10 );
var plane2 = new SKYLINE.PlaneGeometry( 200, 200, 10, 10 );

/*
 * Create a new mesh.
 */
var mat = new SKYLINE.ShaderMaterial( { fragement:getShader('shader-fs'), vertex:getShader('shader-vs') } );
var mesh = new SKYLINE.Mesh( plane, mat );
var mesh2 = new SKYLINE.Mesh( plane2, mat );

//var cube = new SKYLINE.Cube( 100, 100, 100, 10, 10, 10, mat );

scene.add( mesh );
scene.add( mesh2 );
//scene.add( cube );

/*
 * Set the camera.
 */
scene.setCamera( camera );

/*
 * For some reason, camera z positions need to be
 * positive where as 3D objects need to be negative.
 */

camera.position.z = -13;

mesh.position.x -= 100;
mesh.position.y = 200;

//cube.position.y -= 100;

//cube.rotation.y = 10;

mesh2.position.y = -100;

console.log('MESH 1 POS: ', mesh.position);
console.log('MESH 2 POS: ', mesh2.position);

setInterval(function() {
    loop();
}, 1000 );

//renderer.render( scene );
renderer.render( scene );

function loop()
{
    //renderer.render( scene );
}