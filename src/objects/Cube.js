/**
 * @project:
 * @author: harry.northover
 * @time: 18:13 03/05/2013
 */

SKYLINE.Cube = function( width, height, length, wSegments, hSegments, material )
{
    function init( width, height, length, wSegments, hSegments, material, scope )
    {
        SKYLINE.Mesh.call( this, new SKYLINE.CubeGeometry( width, height, length, wSegments, hSegments ), material );
    }

    this.getWidth = function()
    {
        return this.geometry.width;
    }

    this.getHeight = function()
    {
        return this.geometry.height;
    }

    this.getLength = function()
    {
        return this.geometry.length;
    }

    init( width, height, length, wSegments, hSegments, material ,this );
}

SKYLINE.Cube.prototype = new SKYLINE.Mesh();