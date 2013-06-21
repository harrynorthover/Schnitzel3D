/**
 *
 * @project skyline
 * @author harry.northover
 * @time 14:02 05/05/2013
 *
 */

SKYLINE.Mesh = function( geometry, material, undefined )
{
    this.geometry = null;
    this.material = null;

    function init( geom, mat, scope )
    {
        SKYLINE.Object3D.call( this );

        scope.setGeometry( geom );
        scope.setMaterial( mat );

        scope.geometry.computeBoundingBox();
    }

    /*
     * setGeometry( SKYLINE.Geometry )
     *
     * Sets the mesh geometry object.
     */
    this.setGeometry = function( g )
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
    }

    /*
     * setMaterial( SKYLINE.Material )
     *
     * This sets the material of the mesh.
     */
    this.setMaterial = function( m )
    {
        if( m !== undefined )
        {
            this.material = m;
        }
        else
        {
            this.material = new SKYLINE.Color( 255, 0, 0 );
        }
    }

    /*
     * updateGeometry()
     *
     * This recalculates all the face normals, then applies the current object's
     * transformation matrix to the vector positions, ready for rendering.
     */
    this.updateGeometry = function()
    {
        this.geometry.computeFaceNormals();
        this.geometry.applyMatrix4( this.transformationMatrix );
    }

    init(geometry, material, this);
}

SKYLINE.Mesh.prototype = new SKYLINE.Object3D();