/**
 *
 * @project skyline
 * @author harry.northover
 * @time 17:31 06/05/2013
 *
 * Basic setup test.
 *
 */

var scene       = new SKYLINE.Scene();
var camera      = new SKYLINE.PerspectiveCamera( 45, window.innerWidth/window.innerHeight, 30, 1000 );
var renderer    = new SKYLINE.WebGLRenderer({
    autoClear: true,
    autoClearColor: new SKYLINE.Color(255, 0, 0, .1),
    fullscreen: false
});

var g = new SKYLINE.Geometry();

/*
 * Create the vertices that represent a triangle.
 */
var v1 = new SKYLINE.Vertex( new SKYLINE.Vector3( 200, 100, 10 ) );
var v2 = new SKYLINE.Vertex( new SKYLINE.Vector3( 0, 100, 10 ) );
var v3 = new SKYLINE.Vertex( new SKYLINE.Vector3( 0, 50, 10 ) );

g.vertices.push( v1, v2, v3 );

/*
 * Add a triangle with references to the vertices.
 */
var t = new SKYLINE.Triangle( 0, 1, 2 );

g.faces.push( t );

/*
 * Create a new mesh.
 */
var mat = new SKYLINE.ShaderMaterial( { fragement:getShader('shader-fs'), vertex:getShader('shader-vs') } );
var mesh = new SKYLINE.Mesh( g, mat );

scene.add( mesh );

/*
 * Set the camera.
 */
scene.setCamera( camera );

/*
 * For some reason, camera z positions need to be
 * positive where as 3D objects need to be negative.
 */

camera.position.z = 10;

//mesh.scale.x += 1;
//mesh.scale.y += 1;

setInterval(function() {
    loop();
}, 500 );

function loop()
{
    //mesh.rotation.y += .0001;
    //mesh.rotation.z += .0001;

    //camera.lookAt( mesh );

    //mesh.position.x -= .001;

    //camera.position.x -= 1;
    //camera.rotation.x += .001;

    mesh.position.x += .1;

    renderer.render( scene );
}