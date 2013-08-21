/**
 *
 * @project skyline
 * @author Harry
 * @time 17:17 27/05/2013
 *
 */

SKYLINE.ShaderMaterial = function( properties )
{
    this.fragmentShader = "void main() { precision mediump float; varying vec4 vColor; void main(void) { gl_FragColor = vColor; } }";
    this.vertexShader = "void main() { attribute vec3 aVertexPosition; attribute vec4 aVertexColor; uniform mat4 uPMatrix; uniform mat4 uMVMatrix; varying vec4 vColor; void main(void) { gl_Position = vec4(aVertexPosition, 1.0); vColor = aVertexColor; } }";

    function init( properties, scope )
    {
        var args = properties || {};

        scope.fragmentShader = ( args.fragement !== undefined ) ? args.fragement : scope.fragmentShader;
        scope.vertexShader = ( args.vertex !== undefined ) ? args.vertex : scope.vertexShader;

        SKYLINE.BaseMaterial.call( this );
    }

    init( properties, this );
}

SKYLINE.ShaderMaterial.prototype = new SKYLINE.BaseMaterial();
