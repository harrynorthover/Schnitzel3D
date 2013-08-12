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

var plane = new SKYLINE.PlaneGeometry( 200, 200, 4, 4 );

/*
 * Create a new mesh.
 */
var mat = new SKYLINE.ShaderMaterial( { fragement:getShader('shader-fs'), vertex:getShader('shader-vs') } );
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

camera.position.z = 3;

setInterval(function() {
    loop();
}, 100 );

renderer.render( scene );
renderer.render( scene );

function loop()
{
    //renderer.render( scene );
}