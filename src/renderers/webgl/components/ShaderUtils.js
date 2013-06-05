/**
 *
 * @project skyline
 * @author harry.northover
 * @time 20:46 30/05/2013
 *
 * Various utils for shader creation/management. Used only in SKYLINE.WebGLRenderer.
 *
 */

function setProgram( object, scene, camera, gl )
{
    var mat = object.material,
        program = null;

    if( mat instanceof SKYLINE.ShaderMaterial )
    {
        program = createProgramFromShaderMaterial(mat, gl);
    }
    else
    {
        console.warn('[SKYLINE.WebGLRenderer].setProgram - Material supplied is not supported!');

        return false;
    }

    /*
     * Tell WebGL to use the newly created program.
     */
    gl.useProgram( program );

    console.log('SetProgram: ', program);

    return program;
}

/**
 * Creates & returns a shader program.
 *
 * @param material  - A SKYLINE.ShaderMaterial. This is required to get the data from the fragment & vertex shaders.
 * @param gl        - WebGL context.
 */
function createProgramFromShaderMaterial( material, gl )
{
    if(material === undefined || gl === undefined)
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
    var vertex      = compileShader( gl.VERTEX_SHADER, material.vertexShader, gl );
    var fragment    = compileShader( gl.FRAGMENT_SHADER, material.fragmentShader, gl );

    console.log('Vertex: ', fragment, ' Fragment: ', fragment);

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
     * Check the status of the program.
     */
    if( ! gl.getProgramParameter( program, gl.LINK_STATUS ) )
    {
        console.error('[SKYLINE.WebGLRenderer].setProgramFromShaderMaterial: Could not link shader program "' + material + '"!')
    }

    return program;
}

/**
 * Compiles are shader.
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
     * Check that the shader compiled sucessfully.
     */
    if ( !gl.getShaderParameter( shader, gl.COMPILE_STATUS ) )
    {
        alert('Shader Compile Error: ' + gl.getShaderInfoLog(shader));

        return false;
    }

    return shader;
}