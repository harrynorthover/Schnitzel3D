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

/*
 * Create a new mesh.
 */
var mat = new SKYLINE.BasicColorMaterial( new SKYLINE.Color(0, 100, 255, 1) );
var mesh = new SKYLINE.Mesh( plane, mat );

scene.add( mesh );

/*
 * Set the camera.
 */
scene.setCamera( camera );

/*
 * For some reason, camera z positions need to be
 * positive where as 3D objects need to be negative.
 */

camera.position.z = -1;

mesh.position.z = -50;

mesh.position.x = -100;
mesh.position.y = -100;

setInterval(function() {
    loop();
}, 1000 / 60 );

function loop()
{
    mesh.rotation.z += .01;

    camera.position.z -= 1;

    renderer.render( scene );
}