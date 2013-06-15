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
    autoClearColor: new SKYLINE.Color(255, 0, 0, 1),
    fullscreen: false
});

var g = new SKYLINE.Geometry();

/*
 * Create the vertices that represent a triangle.
 */
var t_v1 = new SKYLINE.Vertex( new SKYLINE.Vector3( -.20, -.10, -1 ) );
var t_v2 = new SKYLINE.Vertex( new SKYLINE.Vector3( 0, -.10, -1 ) );
var t_v3 = new SKYLINE.Vertex( new SKYLINE.Vector3( 0, .5, -1 ) );
var t_v4 = new SKYLINE.Vertex( new SKYLINE.Vector3(.5, .5, -1 ) );

var v1 = new SKYLINE.Vertex( new SKYLINE.Vector3( t_v1.position.x, t_v1.position.y, t_v1.position.z ) );
var v2 = new SKYLINE.Vertex( new SKYLINE.Vector3( t_v2.position.x, t_v2.position.y, t_v2.position.z ) );
var v3 = new SKYLINE.Vertex( new SKYLINE.Vector3( t_v3.position.x, t_v3.position.y, t_v3.position.z ) );
var v4 = new SKYLINE.Vertex( new SKYLINE.Vector3( t_v4.position.x, t_v4.position.y, t_v4.position.z ) );

v1.position.toString();
v2.position.toString();
v3.position.toString();
v4.position.toString();

g.vertices.push( v1, v2, v3, v4 );

/*
 * Add a triangle with references to the vertices.
 */
var t = new SKYLINE.Triangle( 0, 1, 2 );

g.faces.push( t );

g.mergeGeometry();
g.computeVertexNormals();

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

setInterval(function() {
    loop();
}, 1000);

function loop()
{
/*    mesh.scale.x += .01;
    mesh.scale.y += .01;*/

    mesh.rotation.y += .001;
    mesh.rotation.z += .001;

    renderer.render( scene );
}