/**
 *
 * Vertex.
 *
 * @class SKYLINE.Vertex
 * @constructor
 *
 */


SKYLINE.Vertex = function( pos, normal )
{
    SKYLINE.Object3D.call( this );

    this.position = pos || new SKYLINE.Vector3( 0, 1, 0 );
    this.normal = normal || new SKYLINE.Vector3( 0, 1, 0 );
}

SKYLINE.Vertex.prototype = Object.create( SKYLINE.Object3D.prototype );
SKYLINE.Vertex.prototype.constructor = SKYLINE.Vertex;

SKYLINE.Vertex.prototype.setPosition = function( x, y, z )
{
    this.position.x = x || 0;
    this.position.y = y || 0;
    this.position.z = z || 0;

    return this;
}

SKYLINE.Vertex.prototype.setNormal = function( vector, shouldNormalise )
{
    if(vector !== undefined)
    {
        this.normal = vector;

        if(shouldNormalise)
        {
            this.normal.normalize();
        }
    }
    else
    {
        console.warn('[SKYLINE.Vertex].setNormal parameter "vector" is undefined!');
    }
}

SKYLINE.Vertex.prototype.normalise = function()
{
    this.normal.normalize();
}

SKYLINE.Vertex.prototype.applyMatrix4 = function( matrix )
{
    this.position.applyMatrix4( matrix );
    this.normal.applyMatrix4( matrix );
}