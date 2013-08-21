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

/*
 * Set the camera.
 */
scene.setCamera( camera );

camera.position.z = 0;
camera.position.x = -40;
camera.position.y = -10;

var g, v1, v2, v3, t, mat, mesh;

function createTriangle()
{
    g = new SKYLINE.Geometry();

    /*
     * Create the vertices that represent a triangle.
     */
    v1 = new SKYLINE.Vertex( new SKYLINE.Vector3( random(-200, 200), random(-200, 200), 0 ) );
    v2 = new SKYLINE.Vertex( new SKYLINE.Vector3( random(-200, 200), random(-200, 200), 0 ) );
    v3 = new SKYLINE.Vertex( new SKYLINE.Vector3( random(-200, 200), random(-200, 200), 0 ) );

    g.vertices.push( v1, v2, v3 );

    /*
     * Add a triangle with references to the vertices.
     */
    t = new SKYLINE.Triangle( 0, 1, 2 );

    g.faces.push( t );

    /*
     * Create a new mesh.
     */
    mat = new SKYLINE.ShaderMaterial( { fragement:getShader('shader-fs'), vertex:getShader('shader-vs') } );
    mesh = new SKYLINE.Mesh( g, mat );

    scene.add( mesh );

    mesh.position.z = random(-10, -1);
    mesh.position.x = random(-400, 400);
    mesh.position.y = random(-400, 400);
}

for( var i = 0; i < 20; ++i )
{
    createTriangle();
}

function loop()
{
    camera.position.z -= .1;

    renderer.render( scene );
}

function random(from,to)
{
    return Math.floor( Math.random() * ( to - from + 1 ) + from );
}

setInterval(function() {
    loop();
}, 1000/60 );