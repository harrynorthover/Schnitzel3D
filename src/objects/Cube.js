/**
 * @project:
 * @author: harry.northover
 * @time: 18:13 03/05/2013
 */

SKYLINE.Cube = function( width, height, length, wSegments, hSegments, dSegments, material )
{
    this.width = 100;
    this.height = 100;
    this.depth = 100;

    this.widthSegments = 10;
    this.heightSegments = 10;
    this.depthSegments = 10;

    function init( width, height, depth, wSegments, hSegments, dSegments, material, scope )
    {
        if( width !== null && height !== null && length !== null )
        {
            scope.buildCube( width, height, depth, wSegments, hSegments, dSegments, scope );
            scope.setMaterial( material );

            SKYLINE.Mesh.call( this );
        }
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

    this.buildCube = function( w, h, d, wS, hS, dS, scope )
    {
        var top,
            bottom,
            back,
            front,
            left,
            right;

        console.log('Building cube');

        top = new SKYLINE.Mesh( new SKYLINE.PlaneGeometry( w, d, wS, dS ), material );
        bottom = new SKYLINE.Mesh( new SKYLINE.PlaneGeometry( w, d, wS, dS ), material );

        back = new SKYLINE.Mesh( new SKYLINE.PlaneGeometry( w, h, wS, hS ), material );
        front = new SKYLINE.Mesh( new SKYLINE.PlaneGeometry( w, h, wS, hS ), material );

        left = new SKYLINE.Mesh( new SKYLINE.PlaneGeometry( h, d, hS, dS ), material );
        right = new SKYLINE.Mesh( new SKYLINE.PlaneGeometry( h, d, hS, dS ), material );

        top.position.y = h/2;
        bottom.position.y = -(h/2);

        left.rotation.y = 90;
        right.rotation.y = 90;

        left.position.x = -(w/2);
        right.position.x = (w/2);

        top.updateGeometry();
        bottom.updateGeometry();

        left.updateGeometry();
        right.updateGeometry();

        back.updateGeometry();
        front.updateGeometry();

        this.geometry.add( left.geometry );
        this.geometry.add( right.geometry );
        this.geometry.add( top.geometry );
        this.geometry.add( bottom.geometry );
        this.geometry.add( back.geometry );
        this.geometry.add( front.geometry );
    }

    init( width, height, length, wSegments, hSegments, dSegments, material, this );
}

SKYLINE.Cube.prototype = new SKYLINE.Mesh();