/**
 *
 * @project skyline
 * @author harry.northover
 * @time 20:46 30/05/2013
 *
 * Various utils for shader creation/management. Used only in SKYLINE.WebGLRenderer.
 *
 */

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

    glPositionTag = (scope.__redrawNeeded) ? "gl_Position = " + scope.__projectionMatrixShaderRef + " * " + scope.__modelViewMatrixShaderRef + " * vec4(" + scope.__positionShaderRef + ", 1.0); " : "gl_Position = vec4(" + scope.__positionShaderRef + ", 1.0);";

    vertex = [
        "attribute vec3 " + scope.__positionShaderRef + ";",
        "attribute vec4 " + scope.__colorShaderRef + ";",

        "uniform mat4 " + scope.__projectionMatrixShaderRef + ";" ,
        "uniform mat4 " + scope.__modelViewMatrixShaderRef + ";",

        "varying vec4 vColor;",

        "void main(void) {" +
            glPositionTag +
            "vColor = " + scope.__colorShaderRef + ";" +
            "}"
    ].join(" ");

    fragment = [
        "precision " + _precision + " float;",

        "varying vec4 vColor;",

        "void main(void) { " +
            "gl_FragColor = vColor;" +
            " }"
    ].join(" ");

    return {
        vertex: vertex,
        fragment: fragment
    };
}

function setProgram( shaderDetail, redraw, gl )
{
    program = createProgramFromShaderMaterial( shaderDetail.vertex, shaderDetail.fragment, redraw, gl );

    /*
     * Tell WebGL to use the newly created program.
     */
    gl.useProgram( program );

    return program;
}

/**
 * Creates & returns a shader program.
 *
 * @param material  - A SKYLINE.ShaderMaterial. This is required to get the data from the fragment & vertex shaders.
 * @param gl        - WebGL context.
 */
function createProgramFromShaderMaterial( vertexShader, fragmentShader, redraw, gl )
{
    if(vertexShader === undefined || fragmentShader != fragmentShader || gl === undefined)
    {
        console.warn("[SKYLINE.WebGLRenderer].createProgramFromShaderMaterial - Parameters are either not specified or are null [Material:", material, '] [GLContext:', gl, ']');

        return false;
    }

    /*
     * Create a new program.
     */
    var program     = gl.createProgram();

    /*
     * Compile both the vertex and fragment shader.
     */
    var vertex      = compileShader( gl.VERTEX_SHADER, vertexShader, gl );
    var fragment    = compileShader( gl.FRAGMENT_SHADER, fragmentShader, gl );

    /*
     * Attach shaders to the newly created program.
     */
    gl.attachShader( program, vertex );
    gl.attachShader( program, fragment );

    /*
     * Link Program.
     */
    gl.linkProgram( program );

    /*
     * Set the projection and modelView matrices.
     * TODO: Move matrices to generic uniform parser.
     */

    if(redraw)
    {
        program.projectionMatrix = gl.getUniformLocation(program, "projectionMatrix");
        program.modelViewMatrix = gl.getUniformLocation(program, "modelViewMatrix");
    }

    /*
     * Check the status of the program.
     */
    if( ! gl.getProgramParameter( program, gl.LINK_STATUS ) )
    {
        console.error('[SKYLINE.WebGLRenderer].setProgramFromShaderMaterial: Could not link shader program "' + material + '"!')
    }

    return program;
}

/**
 * Compiles a shader.
 *
 * @param type  - gl.VERTEX_SHADER / gl.FRAGMENT_SHADER
 * @param data  - shader text
 * @param gl    - WebGL context.
 */
function compileShader( type, data, gl )
{
    /*
     * Check that there is enough parameters to proceed with.
     */
    if(!gl || !type || !data)
    {
        var error = '[SKYLINE.WebGLRenderer].compileShader : Not app parameters are specified, cannot continue. [Type:' + type + '] [Data:' + data + '] [GLContext:' + gl + ']';

        console.warn(error);

        return false;
    }

    /*
     * Create an empty shader program.
     */
    var shader = gl.createShader( type );

    /*
     * Set shader source then compile.
     */
    gl.shaderSource( shader, data );
    gl.compileShader( shader );

    /*
     * Check that the shader compiled successfully.
     */
    if ( !gl.getShaderParameter( shader, gl.COMPILE_STATUS ) )
    {
        alert('Shader Compile Error: ' + gl.getShaderInfoLog(shader));

        return false;
    }

    return shader;
}

/**
 * Sets the matrix uniform variables in the shader.
 *
 * @param camera - An instance of SKYLINE.Camera
 * @param program - A precompiled shader program. This must have the uniforms 'uPMatrix' & 'uMVMatrix' defined in the vertex shader
 * @param gl - The WebGL Context.
 */
function setMatrixUniforms( camera, program, gl )
{
    /*
     * Check that there is enough parameters to proceed with.
     */
    if(!gl || !camera || !program)
    {
        var error = '[SKYLINE.WebGLRenderer].setMatrixUniforms : No app parameters are specified, cannot continue. [Type:' + type + '] [Data:' + data + '] [GLContext:' + gl + ']';

        console.warn(error);

        return false;
    }

    var pUniform = gl.getUniformLocation(program, "uPMatrix");
    gl.uniformMatrix4fv(pUniform, false, new Float32Array(camera.projectionMatrix.entries));

    var mvUniform = gl.getUniformLocation(program, "uMVMatrix");
    gl.uniformMatrix4fv(mvUniform, false, new Float32Array(camera.modelViewMatrix.entries));
}

/**
 *
 * @project skyline
 * @author Harry
 * @time 17:28 27/05/2013
 *
 */

function getShader( id )
{
    var shaderScript, theSource, currentChild;

    shaderScript    = document.getElementById(id);

    if (!shaderScript)
    {
        return null;
    }

    theSource       = "";
    currentChild    = shaderScript.firstChild;

    while(currentChild) {
        if (currentChild.nodeType == currentChild.TEXT_NODE) {
            theSource += currentChild.textContent;
        }

        currentChild = currentChild.nextSibling;
    }

    return theSource;
}