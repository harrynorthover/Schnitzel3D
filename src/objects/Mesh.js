/**
 *
 * Scene to test the use of SKYLINE.PlaneGeometry
 *
 * @class SKYLINE.PlaneGeometry
 * @constructor
 *
 */

SKYLINE.Mesh = function( geometry, material )
{
    SKYLINE.Object3D.call( this );

    this.geometry = geometry || null;
    this.material = material || null;

    this.a = false;
};

SKYLINE.Mesh.prototype = Object.create( SKYLINE.Object3D.prototype );

/*
 * setGeometry( SKYLINE.Geometry )
 *
 * Sets the mesh geometry object.
 */
SKYLINE.Mesh.prototype.setGeometry = function(g)
{
    if( g !== undefined )
    {
        this.geometry = g;

        g.computeFaceNormals();
        g.computeVertexNormals();
    }
    else
    {
        this.geometry = new SKYLINE.Geometry();
    }
};

/*
 * setMaterial( SKYLINE.Material )
 *
 * This sets the material of the mesh.
 */
SKYLINE.Mesh.prototype.setMaterial = function(m)
{
    if( m !== undefined )
    {
        this.material = m;
    }
    else
    {
        this.material = new SKYLINE.Color( 255, 0, 0 );
    }
};