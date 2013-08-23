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

    this.name                                   = "";
    this.visible                                = true;
    this.eulerOrder                             = this.DEFAULT_EULER_ORDER;

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
    this.worldMatrixOutOfDate                   = true;

    /*
     * Internal
     */
    this.__webGLInit                            = false;
}

SKYLINE.Object3D.prototype = {
    constructor: SKYLINE.Object3D,

    addChild : function(object)
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
    },

    removeChild : function(object)
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
    },

    removeChildAt : function(index)
    {
        if(this.children.length >= index - 1)
        {
            this.children.splice(index, 1);
        }
        else
        {
            console.error("[SKYLINE.Object3D] removeChildAt index is out of bounds!");
        }
    },

    /*
     * Utils
     */

    applyMatrix : function( matrix )
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
            this.rotation = this.rotation.makeEulerFromMatrix( matrix, this.eulerOrder );

            this.worldMatrixOutOfDate = true;
        }
    },

    updateMatrix : function()
    {
        /*
         * TODO: Test makeFromPositonRotationScale.
         */
        this.transformationMatrix.makeFromPositionRotationScale( this.position, this.rotation, this.eulerOrder, this.scale );
        this.transformationMatrixInverse.copy( this.transformationMatrix.getInverse() );

        this.worldMatrixOutOfDate = true;
    },

    updateWorldMatrix : function( force )
    {
        /*
         * Update the objects own transformation matrix but taking position, rotation and scale vectors
         * and combining a new matrix.
         */
        if( this.autoUpdateMatrix )
        {
            this.updateMatrix();
        }

        /*
         * Take the newly created transformationMatrix and multiply it to the parent's world matrix.
         */
        if( this.autoUpdateWorldMatrix === true || this.worldMatrixOutOfDate === true || force === true )
        {
            if( this.parent !== undefined )
            {
                this.worldMatrix.multiply( this.parent.worldMatrix );
            }
            else
            {
                this.worldMatrix.copy( this.transformationMatrix );
            }

            force = true;
        }

        for( var i = 0, len = this.children.length; i < len; ++i )
        {
            this.children[i].updateWorldMatrix( force );
        }

        this.worldMatrixOutOfDate = false;
    },

    localToWorld : function( v )
    {
        v.applyMatrix4( this.worldMatrix );
    },

    worldToLocal : function( v )
    {
        v.applyMatrix4( this.worldMatrix.getInverse() );
    },

    /*
     * Display
     */

    show : function()
    {
        this.visible = true;
    },

    hide : function()
    {
        this.visible = false;
    },

    /*
     * Utils
     */

    copy : function( obj )
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
}

var EULER_ORDER_XYZ = "xyz";
var EULER_ORDER_YXZ = "yxz";
var EULER_ORDER_ZXY = "zxy";
var EULER_ORDER_ZYX = "zyx";
var EULER_ORDER_YZX = "yzx";
var EULER_ORDER_XZY = "xzy";
