import * as _GL from 'webgl-constants';

class Geometry {
    usage: GLenum = _GL.GL_STATIC_DRAW;

    constructor(private buffer: ArrayBuffer, public type: number, usage?: GLenum) {
        if (usage != null) {
            this.usage = usage;
        }
    }

    

    compose(gl: WebGL2RenderingContext) {

    }

    decompose(gl: WebGL2RenderingContext) {

    }

    bind(gl: WebGL2RenderingContext) {
        
    }
}


export { 
    Geometry, 
    
};