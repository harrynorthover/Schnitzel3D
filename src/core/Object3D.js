/**
 *
 * @project skyline
 * @author Harry
 * @time 14:48 21/04/2013
 *
 */

SKYLINE.Object3D = function()
{
    this.DEFAULT_EULER_ORDER                    = "xyz";

    /*
     * Euler rotation orders.
     */
    this.EULER_ORDER_XYZ                        = "xyz";
    this.EULER_ORDER_YXZ                        = "yxz";
    this.EULER_ORDER_ZXY                        = "zxy";
    this.EULER_ORDER_ZYX                        = "zyx";
    this.EULER_ORDER_YZX                        = "yzx";
    this.EULER_ORDER_XZY                        = "xzy";

    this.name                                   = "";
    this.visible                                = true;
    this.eulerOrder                             = "";

    this.parent                                 = undefined;
    this.children                               = [];
    this.numOfChildren                          = 0;

    this.up                                     = new SKYLINE.Vector3(0, 1, 0);
    this.position                               = new SKYLINE.Vector3(0, 0, 0);
    this.scale                                  = new SKYLINE.Vector3(1, 1, 1);
    this.rotation                               = new SKYLINE.Vector3(0, 0, 0);

    /*
     * Transformation transformationMatrix.
     */
    this.transformationMatrix                   = new SKYLINE.Matrix4();
    this.transformationMatrixInverse            = new SKYLINE.Matrix4();

    /*
     * Matrix used to transform local coords -> world coords.
     */
    this.worldMatrix                            = new SKYLINE.Matrix4();

    this.autoUpdateMatrix                       = true;
    this.autoUpdateWorldMatrix                  = true;
    this.worldMatrixOutOfDate                   = false;

    /*
     * Internal
     */
    this.__webGLInit                            = false;

    function init( scope )
    {
        /*
         * Set the Euler order to DEFAULT_EULER_ORDER.
         */
        scope.eulerOrder = scope.DEFAULT_EULER_ORDER;
    }

    /*
     * Add/remove objects to the scene.
     */

    this.addChild = function(object)
    {
        if( object instanceof  SKYLINE.Object3D )
        {
            if( object.parent !== undefined )
            {
                object.parent = null;
            }

            object.parent = this;

            this.children.push(object);
            this.numOfChildren++;
        }
        else
        {
            console.error("[SKYLINE.Object3D].addChild - To add an object it must be an instance of SKYLINE.Object3D");
        }
    }

    this.removeChild = function(object)
    {
        for(var i = 0; i < this.children.length; ++i)
        {
            if(this.children[i] == object)
            {
                this.children.splice(i, 1);

                return true;
            }
        }

        return false;
    }

    this.removeChildAt = function(index)
    {
        if(this.children.length >= index - 1)
        {
            this.children.splice(index, 1);
        }
        else
        {
            console.error("[SKYLINE.Object3D] removeChildAt index is out of bounds!");
        }
    }

    /*
     * Utils
     */

    this.applyMatrix = function( matrix )
    {
        if( matrix instanceof SKYLINE.Matrix4 || matrix instanceof SKYLINE.Matrix3 )
        {
            /*
             * Multiply the transformationMatrix to apply the transformation.
             */
            this.transformationMatrix.multiply(matrix);

            /*
             * Extract the position and scale as vectors.
             */
            this.position.getPositionFromMatrix( matrix );
            this.scale.getScaleFromMatrix( matrix );

            /*
             * Extract the rotation from the transformationMatrix as a Euler angle.
             * TODO: Implement Quaternions and use them instead of Euler angles.
             * TODO: Euler angles are not tested.
             */
            this.rotation = matrix.makeEulerFromMatrix( matrix, this.eulerOrder );

            this.worldMatrixOutOfDate = true;

            this.updateWorldMatrix();
        }
    }

    this.updateMatrix = function()
    {
        this.transformationMatrix.makeFromPositionRotationScale( this.position, this.rotation, this.eulerOrder, this.scale );
        this.transformationMatrixInverse.copy( this.transformationMatrix.getInverse() );

        this.worldMatrixOutOfDate = true;

        this.updateWorldMatrix();
    }

    this.updateWorldMatrix = function()
    {
        if( this.autoUpdateMatrix )
        {
            this.updateMatrix();
        }

        if( this.autoUpdateWorldMatrix || this.worldMatrixOutOfDate )
        {
            if( this.parent !== undefined )
            {
                this.worldMatrix.multiply( this.parent.worldMatrix );
            }
            else
            {
                this.worldMatrix.copy( this.transformationMatrix );
            }

            this.onWorldMatrixUpdated();
        }
    }

    this.onWorldMatrixUpdated = function()
    {
        this.worldMatrixOutOfDate = false;
    }

    this.localToWorld = function( v )
    {
        v.applyMatrix4( this.worldMatrix );
    }

    this.worldToLocal = function( v )
    {
        v.applyMatrix4( this.worldMatrix.getInverse() );
    }

    /*
     * Display
     */

    this.show = function()
    {
        this.visible = true;
    }

    this.hide = function()
    {
        this.visible = false;
    }

    /*
     * Utils
     */

    this.copy = function( obj )
    {
        /*
         * TODO: Test Object3D copy function.
         */

        this.name                                   = obj.name;
        this.visible                                = obj.visible;
        this.eulerOrder                             = obj.eulerOrder;

        this.parent                                 = obj.parent;
        this.children                               = obj.children;
        this.numOfChildren                          = obj.numOfChildren;

        this.autoUpdateMatrix                       = obj.autoUpdateMatrix;
        this.autoUpdateWorldMatrix                  = obj.autoUpdateWorldMatrix;
        this.worldMatrixOutOfDate                   = obj.worldMatrixOutOfDate;

        this.up.copy(obj.up);
        this.position.copy(obj.position);
        this.scale.copy(obj.scale);
        this.rotation.copy(obj.rotation);

        /*
         * Transformation transformationMatrix.
         */
        this.transformationMatrix.copy(obj.transformationMatrix);
        this.transformationMatrixInverse.copy(obj.transformationMatrixInverse);

        /*
         * Matrix used to transform local coords -> world coords.
         */
        this.worldMatrix.copy(obj.worldMatrix);

        return this;
    }

    init( this );
}