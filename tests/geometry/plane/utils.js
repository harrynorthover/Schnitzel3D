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