/**
 *
 * @project skyline
 * @author Harry
 * @time 14:50 21/04/2013
 *
 */

SKYLINE.WebGLRenderer = function( parameters )
{
    this.defaults                       = new SKYLINE.WebGLRendererDefaultSettings();

    this.canvasElement                  = null;
    this.ctx                            = null;

    this.width                          = 0;
    this.height                         = 0;

    this.viewportWidth                  = 0;
    this.viewportHeight                 = 0;
    this.viewportX                      = 0;
    this.viewportY                      = 0;

    this.canRender                      = false;
    /*
     * Whether we are rendering into an existing DOM element.
     */
    this.usingExistingElement           = false;

    /*
     * Auto Clear
     */
    this.autoClear                      = true;
    this.autoClearColor                 = null;

    /*
     * Automatically call ctx.viewport when changing the canvas DOM element size.
     */
    this.autoUpdateViewportDimensions   = true;

    /*
     * Used when fullscreen and the dimensions update when the browser resizes.
     */
    this.fullscreen                     = false;
    this.autoResize                     = true;

    /*
     * Shader Settings
     */
    this.__projectionMatrixShaderRef    = "projectionMatrix";
    this.__modelViewMatrixShaderRef     = "modelViewMatrix";
    this.__colorShaderRef               = "aVertexColor";
    this.__positionShaderRef            = "aVertexPosition";

    function init( parameters, scope )
    {
        parameters                          = parameters || {};

        /*
         * Parse any parameters.
         */
        scope.width                         = ( parameters.width !== undefined )                        ? parameters.width : scope.defaults.width;
        scope.height                        = ( parameters.height !== undefined )                       ? parameters.height : scope.defaults.height;
        scope.usingExistingElement          = ( parameters.canvasElement !== undefined );
        scope.canvasElement                 = ( scope.usingExistingElement )                            ? parameters.canvasElement : document.createElement("canvas");
        scope.autoClear                     = ( parameters.autoClear !== undefined )                    ? parameters.autoClear : scope.defaults.autoClear;
        scope.autoClearColor                = ( parameters.autoClearColor !== undefined )               ? parameters.autoClearColor : scope.defaults.autoClearColor;
        scope.autoUpdateViewportDimensions  = ( parameters.autoUpdateViewportDimensions !== undefined ) ? parameters.autoUpdateViewportDimensions : scope.defaults.autoUpdateViewportDimensions;
        scope.fullscreen                    = ( parameters.fullscreen !== undefined )                   ? parameters.fullscreen : scope.defaults.fullscreen;
        scope.autoResize                    = ( parameters.autoResize !== undefined )                   ? parameters.autoResize : scope.defaults.autoResize;
        scope.depthTesting                  = ( parameters.depthTesting !== undefined )                 ? parameters.depthTesting : scope.defaults.depthTesting;

        if( scope.setup() )
        {
            scope.setDimensions( scope.width, scope.height );
            scope.setClearColor( scope.autoClearColor );
            scope.setDepthTesting( scope.depthTesting );
        }
    }

    /*
     * OpenGL Initialisation
     */

    this.setup = function()
    {
        this.getWebGLContext();

        if( !this.ctx )
        {
            /*
             * No WebGL support.
             */

            console.error("[SKYLINE.WebGLRenderer] No WebGL support! - Cannot proceed.");

            return false;
        }
        else
        {
            if( !this.usingExistingElement )
            {
                this.addDOMElementToPage();
            }

            if( this.fullscreen && this.autoResize )
            {
                var that = this;

                window.addEventListener( "resize", function( e ) {
                    that.onWindowResizeHandler( e );
                });
            }

            this.canRender = true;
        }

        return this.canRender;
    }

    /*
     * Setters for dimensions of the canvas element and the viewport.
     */

    this.setDimensions = function( width, height )
    {
        /*
         * Store the new width and height that have been specified.
         */
        this.width                      = width  || window.innerWidth;
        this.height                     = height || window.innerHeight;

        /*
         * Set the canvas DOM element width & height.
         */
        this.canvasElement.width        = this.width;
        this.canvasElement.height       = this.height;

        if(this.autoUpdateViewportDimensions)
        {
            /*
             * Update the WebGL context viewport dimensions.
             */
            this.setViewportDimensions( 0, 0, this.width, this.height );
        }
    }

    this.getDimensions = function()
    {
        return { object    : 'SKYLINE.WebGLRenderer',
                 width     : this.width,
                 height    : this.height };
    }

    this.setViewportDimensions = function( x, y, w, h )
    {
        this.viewportX          = x || 0;
        this.viewportY          = y || 0;

        this.viewportWidth      = w || this.canvasElement.width;
        this.viewportHeight     = h || this.canvasElement.height;

        this.ctx.viewport( this.viewportX ,this.viewportY, this.viewportWidth, this.viewportHeight);
    }

    /*
     * Assigns either a newly created canvas element or an existing one,
     * then retrieves the "webgl" context, which can be forced to be "experimental-webgl".
     */

    this.getWebGLContext = function(forceExperimental)
    {
        var force  = forceExperimental || false;
        this.ctx   = (force) ? this.canvasElement.getContext("experimental-webgl") : this.canvasElement.getContext("webgl") || this.canvasElement.getContext("experimental-webgl");
    }

    /*
     * Adds this.canvasElement to the page.
     */

    this.addDOMElementToPage = function()
    {
        document.body.appendChild( this.canvasElement );
    }

    /*
     * Rendering
     */

    this.render = function( scene, forceClear )
    {
        if( !this.canRender )
        {
            throw new Error("[SKYLINE.WebGLRenderer].render - Cannot render, no WebGL support perhaps?");

            return false;
        }

        var camera = scene.getCurrentCamera();

        /*
         * Check the set camera is of the correct type.
         */
        if( camera instanceof SKYLINE.Camera === false )
        {
            console.error("[SKYLINE.WebGLRenderer].render - The current camera in the scene is not an instance of SKYLINE.Camera. Cannot render scene. ");

            return false;
        }

        /*
         * Clear the canvas.
         */
        if( this.autoClear || forceClear )
        {
            this.clear();
        }

        /*
         * Create, initialise and set WebGL objects.
         */
        if( scene.autoUpdate || !scene.__webGLInit )
        {
            this.initWebGLObjects( scene, camera );
        }

        if( camera.projectionMatrixExpired )
        {
            camera.updateProjectionMatrix();
        }

        camera.updateViewMatrix();

        var i, len = scene.numChildren, obj;

        for( i = 0; i < len; ++i )
        {
            obj = scene.getObjectAt( i );

            if( obj instanceof SKYLINE.Mesh )
            {
                if( obj.visible )
                {
                    var program = this.setupMaterial( obj.material );

                    this.renderMesh( obj, scene, camera, program );
                }
            }
            else
            {
                console.warn("[SKYLINE.WebGLRenderer].render - Cannot render object: ", obj);
            }
        }
    }

    this.setupMaterial = function( material )
    {
        var type = "", program;

        if( material instanceof SKYLINE.BasicColorMaterial )
        {
            type = "basic";
        }

        if( type != "" )
        {
            program = buildProgram( this, type, [], [], [], "", "" );

            return setProgram( program, this.ctx );
        }
    }

    this.renderMesh = function( object, scene, camera, program )
    {
        var geometry = object.geometry;
        var material = object.material;

        vertexColorAttribute = this.ctx.getAttribLocation(program, this.__colorShaderRef);
        this.ctx.enableVertexAttribArray(vertexColorAttribute);

        vertexPositionAttribute = this.ctx.getAttribLocation(program, this.__positionShaderRef);
        this.ctx.enableVertexAttribArray(vertexPositionAttribute);

        this.drawMeshBuffers( material, geometry, scene, camera, program );
    }

    this.drawMeshBuffers = function( material, geometry, scene, camera, program )
    {
        var vertexBuffer    = geometry.__webGLVerticesBuffer;
        var indexBuffer     = geometry.__webGLVerticesIndexBuffer;
        var numVertices     = geometry.__vertexIndexArray.length;
        var colorBuffer     = geometry.__webGLColorBuffer;

        this.ctx.bindBuffer( this.ctx.ARRAY_BUFFER, colorBuffer );
        this.ctx.vertexAttribPointer( vertexColorAttribute, 4, this.ctx.FLOAT, false, 0, 0 );

        /*
         * Tell WebGL to bind the vertex position buffer for use.
         */
        this.ctx.bindBuffer( this.ctx.ARRAY_BUFFER, vertexBuffer );

        /*
         * Tell WebGL to bind the index element array buffer.
         */
        this.ctx.bindBuffer( this.ctx.ELEMENT_ARRAY_BUFFER, indexBuffer );
        this.ctx.vertexAttribPointer(vertexPositionAttribute, 3, this.ctx.FLOAT, false, 0, 0);

        setMatrixUniforms( camera, program, this.ctx );

        this.ctx.drawElements( this.ctx.TRIANGLES, numVertices, this.ctx.UNSIGNED_SHORT, 0 );
    }

    /*
     * WebGL Object Management
     */

    this.initWebGLObjects = function( scene, camera )
    {
        /*
         * Add any new objects to the pipeline.
         */
        for( var a = 0; a < scene.__numObjectsAdded; ++a )
        {
            var obj = scene.getObjectAt( a );
            this.addObject( obj, scene );
        }

        /*
         * Remove any new objects to the pipeline.
         */
        for( var r = 0; r < scene.__numObjectsRemoved; ++r )
        {
            var obj = scene.getObjectAt( r );
            this.removeObject( obj, scene );
        }

        /*
         * Update all the scene data.
         */
        for( var u = 0; u < scene.numChildren; ++u )
        {
            var obj = scene.getObjectAt( u );
            this.updateObject( obj, scene, camera );
        }

        scene.__webGLObjectsInit = true;
        scene.__clearRenderBuffers( true, true );
    }

    this.addObject = function( object, scene )
    {
        var geometry        = object.geometry;
        var material        = object.material;

        this.createGeometryBuffer( geometry );
        this.initGeometryBuffer( geometry );

        object.__webGLInit = true;
    }

    this.removeObject = function( object, scene )
    {
        var geometry        = object.geometry;
        var material        = object.material;

        /*
         * TODO: Finish implementing SKYLINE.WebGLRenderer.removeObject( object, scene ).
         */

        console.log('[SKYLINE.WebGLRenderer].render.removeObject[', object, ']');

        object.__webGLInit = false;
    }

    this.updateObject = function( object, scene, camera )
    {
        var geometry = object.geometry;
        var material = object.material;

        if(object.autoUpdateWorldMatrix || object.worldMatrixOutOfDate)
        {
            /*
             * Recalculate the transformation matrix to apply to all vertices in the geometry.
             */
            object.updateWorldMatrix();
            geometry.mergeGeometry();
        }

        if( geometry.verticesNeedUpdating || geometry.normalsNeedUpdating || geometry.facesNeedUpdating || geometry.textureUVNeedUpdaing || geometry.colorsNeedUpdating )
        {
            this.setGeometryBuffer( geometry, camera, object );
            this.setColorBuffers( material, geometry );

            console.log('OHA!');
        }

        geometry.verticesNeedUpdating = false;
        geometry.normalsNeedUpdating = false;
        geometry.facesNeedUpdating = false;
        geometry.textureUVNeedUpdaing = false;
        geometry.colorsNeedUpdating = false;
    }

    /*
     * Buffer creation
     */

    this.createGeometryBuffer = function( gObject )
    {
        gObject.__webGLVerticesBuffer       = this.ctx.createBuffer();
        gObject.__webGLVerticesIndexBuffer  = this.ctx.createBuffer();
        gObject.__webGLNormalsBuffer        = this.ctx.createBuffer();
        gObject.__webGLFacesBuffer          = this.ctx.createBuffer();
        gObject.__webGLColorBuffer          = this.ctx.createBuffer();
    }

    /*
     * This creates all Float32Arrays.
     */
    this.initGeometryBuffer = function( geometry )
    {
        var numFaces                            = geometry.faces.length;
        var numVertices                         = numFaces * 3; /* 3 Vertices per face */
        var numNormals                          = numVertices;
        var numColors                           = numVertices * 4;

        geometry.__vertexArray                  = new Float32Array( numVertices * 3 );

        geometry.__vertexArray.itemSize         = 3;
        geometry.__vertexArray.numItems         = numVertices;

        geometry.__vertexIndexArray             = new Uint16Array( numVertices );
        geometry.__vertexIndexArray.numItems    = numVertices;

        geometry.__normalsArray                 = new Float32Array( numNormals );
        geometry.__facesArray                   = new Float32Array( numVertices );

        geometry.__vertexColorsArray            = new Float32Array( numColors );
        geometry.__vertexColorsArray.itemSize   = 4;
    }

    this.setGeometryBuffer = function( geometry, camera, mesh )
    {
        var offset      = 0,
            f           = 0,
            cf          = 0,
            fl          = geometry.faces.length,
            v1,
            v2,
            v3,
            a,
            b,
            c;

        /*
         * Vertices have been updated since setGeometryBuffer has last been called.
         */
        if( geometry.verticesNeedUpdating )
        {
            var vertexData  = geometry.__vertexArray;

            this.ctx.bindBuffer( this.ctx.ARRAY_BUFFER, geometry.__webGLVerticesBuffer );

            for( f = 0; f < fl; ++f )
            {
                cf = geometry.faces[f];

                v1 = geometry.vertices[ cf.a ].position;
                v2 = geometry.vertices[ cf.b ].position;
                v3 = geometry.vertices[ cf.c ].position;

                a = this.applyProjectionViewMatrix( v1, camera, mesh );
                b = this.applyProjectionViewMatrix( v2, camera, mesh );
                c = this.applyProjectionViewMatrix( v3, camera, mesh );

                vertexData[ offset ]        = a.x;
                vertexData[ offset + 1 ]    = a.y;
                vertexData[ offset + 2 ]    = a.z;

                vertexData[ offset + 3 ]    = b.x;
                vertexData[ offset + 4 ]    = b.y;
                vertexData[ offset + 5 ]    = b.z;

                vertexData[ offset + 6 ]    = c.x;
                vertexData[ offset + 7 ]    = c.y;
                vertexData[ offset + 8 ]    = c.z;

                offset += 9;
            }

            this.ctx.bufferData( this.ctx.ARRAY_BUFFER, vertexData, this.ctx.DYNAMIC_DRAW );

            geometry.verticesNeedUpdating = false;
        }

        if( geometry.indexArrayNeedUpdating )
        {
            var indexData = geometry.__vertexIndexArray;

            this.ctx.bindBuffer( this.ctx.ELEMENT_ARRAY_BUFFER, geometry.__webGLVerticesIndexBuffer );

            offset = 0;

            for( f = 0; f < fl; ++f )
            {
                cf = geometry.faces[f];

                var a = cf.a;
                var b = cf.b;
                var c = cf.c;

                indexData[ offset ]         = a;
                indexData[ offset + 1 ]     = b;
                indexData[ offset + 2 ]     = c;

                offset += 3;
            }

            this.ctx.bufferData( this.ctx.ELEMENT_ARRAY_BUFFER, indexData, this.ctx.DYNAMIC_DRAW );

            geometry.indexArrayNeedUpdating = false;
        }
    }

    this.setColorBuffers = function( material, geometry )
    {
        var colorData,
            colorBuffer = geometry.__vertexColorsArray,
            c,
            cl = geometry.vertices.length,
            index = 0;

        if( material instanceof SKYLINE.BasicColorMaterial )
        {
            for( c = 0; c < cl; ++c )
            {
                colorBuffer[ index ] = material.color.r;
                colorBuffer[ index+1 ] = material.color.g;
                colorBuffer[ index+2 ] = material.color.b;

                colorBuffer[ index+3 ] = material.color.a;

                index += 4;
            }

            console.log('[WebGLRenderer].setColorBuffers - colorData: ', colorBuffer);

            this.ctx.bindBuffer( this.ctx.ARRAY_BUFFER, geometry.__webGLColorBuffer );
            this.ctx.bufferData( this.ctx.ARRAY_BUFFER, colorBuffer, this.ctx.DYNAMIC_DRAW );

            geometry.colorsNeedUpdating = false;
        }
    }

    function buildProgram( scope, type, attributes, variables, uniforms, vertex, fragment )
    {
        var components = [], _precision = "mediump";

        /*
         * Merge existing shader functionality.
         */

        if( vertex )
        {
            components.push( vertex );
        }

        if( fragment )
        {
            components.push( fragment );
        }

        for( var a = 0; a < attributes.length; ++a )
        {
            components.push( attributes[a] );
        }

        for( var v = 0; v < variables.length; ++v )
        {
            components.push( variables[v] );
        }

        for( var u = 0; u < uniforms.length; ++u )
        {
            components.push( uniforms[u] );
        }

        components.join();

        /*
         * Vertex Shader
         */

        vertex = [
            "attribute vec3 " + scope.__positionShaderRef + ";",
            "attribute vec4 " + scope.__colorShaderRef + ";",

            "uniform mat4 " + scope.__projectionMatrixShaderRef + ";" ,
            "uniform mat4 " + scope.__modelViewMatrixShaderRef + ";",

            "varying vec4 vColor;",

            "void main(void) {" +
                "gl_Position = vec4(" + scope.__positionShaderRef + ", 1.0);" +
                "vColor = " + scope.__colorShaderRef + ";" +
            "}"
        ];

        fragment = [
            "precision " + _precision + " float;",

            "varying vec4 vColor;",

            "void main(void) { " +
                "gl_FragColor = vColor;" +
            " }"
        ];

        var v = vertex.join(" ");
        var f = fragment.join(" ");

        console.log('Vertex: ', v);

        return {
            vertex: v,
            fragment: f
        };
    }

    /*
     * applyProjectionViewMatrix.
     *
     * This applies the camera's projection & modelViewMatrix to a vector.
     */
    this.applyProjectionViewMatrix = function( vector, camera, mesh )
    {
        var v = new SKYLINE.Vector3();

        v.copy(vector);

        v.applyMatrix4( mesh.transformationMatrix );
        v.applyMatrix4( camera.modelViewMatrix );
        v.applyProjectionMatrix( camera.projectionMatrix );

        return v;
    }

    /*
     * Shader Functionality
     * [ See "components/ShaderUtils.js" for shader code. ]
     */

    /*
     * Clearing the context.
     */

    this.setClearColor = function( color )
    {
        this.ctx.clearColor( color.r, color.g, color.b, color.a );
    }

    this.clear = function()
    {
        this.ctx.clear( this.ctx.COLOR_BUFFER_BIT );
    }

    /*
     * Depth testing
     */

    this.setDepthTesting = function( shouldEnable, depthFunction )
    {
        var depthFunction = depthFunction || this.ctx.LEQUAL;

        if( shouldEnable )
        {
            this.ctx.enable( this.ctx.DEPTH_TEST );
        }
        else
        {
            this.ctx.disable( this.ctx.DEPTH_TEST );
        }

        this.ctx.depthFunc( depthFunction );
    }

    /*
     * Event Handlers
     */

    /*
     * This is only activated if fullscreen and autoresize are set to
     * true in the initialisation parameters.
     */
    this.onWindowResizeHandler = function( e )
    {
        this.setDimensions();
    }

    /*
     * Set the WebGLRenderer up.
     */
    init( parameters, this );
}