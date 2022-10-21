/// <reference path="index.d.ts" />
import * as glm from 'gl-matrix'
import materialVsSrc from './material.vs.glsl';
import materialFsSrc from './material.fs.glsl';
import { Brick } from './Brick';
import { ProgramBuilder } from './core/Program';

export default {
    launch: launch
};

interface IMaterialShader {
    program: WebGLProgram;
    input: {
        position: number,
        modelViewMatrix: WebGLUniformLocation,
        projectionMatrix: WebGLUniformLocation,
        color: WebGLUniformLocation,
    },
}

interface IVertexArray {
    tag: string;
    vao: WebGLVertexArrayObject;
    vertexCount: number;
}

interface IBrick {
    position: glm.vec3;
    color: glm.vec3;
    value: number;
}

interface IPaddle {
    position: glm.vec3;
    color: glm.vec3;
}

let wgl: WebGL2RenderingContext = null;

/**
 * Initializes game resources using the canvas context 
 * and begins the render loop displaying the game.
 * @param elementId ID of the html canvas element
 */
function launch(elementId: string) {
    wgl = getContext(elementId);
    const materialShader = buildMaterialShader();
    const vertexArrays = new Array<IVertexArray>();
    const bricks = createBricks();
    const paddle: IPaddle = {
        position: [0.0, -5.0, -1.0],
        color: [1.0, 1.0, 1.0],
    };
    vertexArrays.push(buildSquareVAO(materialShader.input.position));
    const square = vertexArrays[vertexArrays.map(i => i.tag).indexOf('square')];

    const progBuilder = new ProgramBuilder();
    progBuilder
        .attachShader({ type: wgl.VERTEX_SHADER, source: materialVsSrc })
        .attachShader({ type: wgl.FRAGMENT_SHADER, source: materialFsSrc })
        .build(wgl)
        .then((program) => {
            program.enableProperty(square.vao, 'aVertexPosition', { size: 3, type: wgl.FLOAT });
        })
        .catch((err) => {
            console.log(err);
        });

    // Time of last render
    let then = 0;

    function render(now: number) {
        now *= 0.001; // Current time in seconds
        // Difference in time since last render
        const deltaTime = now - then;
        then = now;
        drawScene(vertexArrays, bricks, paddle, materialShader, deltaTime);

        requestAnimationFrame(render);
    }

    // Begin render loop
    requestAnimationFrame(render);
}

function drawScene(
    vertexArrays: IVertexArray[],
    bricks: IBrick[],
    paddle: IPaddle,
    matShader: IMaterialShader, 
    deltaTime: number
) {
    wgl.clearColor(0.0, 0.0, 0.0, 1.0);
    wgl.clearDepth(1.0);
    wgl.enable(wgl.DEPTH_TEST);
    wgl.depthFunc(wgl.LEQUAL);
    wgl.clear(wgl.COLOR_BUFFER_BIT | wgl.DEPTH_BUFFER_BIT);

    // Projection Matrix (Camera)
    const projectionMatrix = glm.mat4.create();
    const fov = 90 * Math.PI / 180;
    //glm.mat4.perspective(projectionMatrix, fov, 600 / 800, 0.1, 100);
    glm.mat4.ortho(projectionMatrix, -1.0, 1.0, -1.0, 1.0, 0.1, 100);

    // Square Model Matrix
    const square = vertexArrays[vertexArrays.map(i => i.tag).indexOf('square')];

    wgl.useProgram(matShader.program);
    wgl.bindVertexArray(square.vao);
    wgl.uniformMatrix4fv(matShader.input.projectionMatrix, false, projectionMatrix);

    // Draw bricks
    for (const brick of bricks) {
        const modelViewMatrix = glm.mat4.create();
        const position = glm.vec3.create();
        const posOffset: glm.vec3 = [-6.5, 20.4, -1.0];
        glm.vec3.add(position, posOffset, brick.position);
        glm.mat4.scale(modelViewMatrix, modelViewMatrix, [1.0 / 7, 1.0 / (7*3), 1.0]);
        glm.mat4.translate(modelViewMatrix, modelViewMatrix, position);
        wgl.uniformMatrix4fv(matShader.input.modelViewMatrix, false, modelViewMatrix);
        wgl.uniform3fv(matShader.input.color, brick.color);
        wgl.drawElements(wgl.TRIANGLES, square.vertexCount, wgl.UNSIGNED_SHORT, 0);
    }

    // Draw paddle
    const modelViewMatrix = glm.mat4.create();
    glm.mat4.scale(modelViewMatrix, modelViewMatrix, [1.0 /  7, 1.0 / (7*3), 1.0]);
    glm.mat4.translate(modelViewMatrix, modelViewMatrix, paddle.position);
    wgl.uniformMatrix4fv(matShader.input.modelViewMatrix, false, modelViewMatrix);
    wgl.uniform3fv(matShader.input.color, paddle.color);
    wgl.drawElements(wgl.TRIANGLES, square.vertexCount, wgl.UNSIGNED_SHORT, 0);
}

/**
 * Returns the WebGL context of a canvas element.
 * @param elementId ID of the html canvas element
 * @returns WebGL context of the canvas element
 */
function getContext(elementId: string): WebGL2RenderingContext {
    const canvas = <HTMLCanvasElement>document.querySelector(`#${elementId}`);
    if (canvas === null) {
        throw new Error(`Can't find element ${elementId}`);
    }

    const context = canvas.getContext("webgl2");
    if (context === null) {
        throw new Error(`WebGL2 not supported by browser`);
    }

    return context;
}

/**
 * Builds the material shader.
 * @returns Shader information
 */
function buildMaterialShader(): IMaterialShader {    
    const program = wgl.createProgram();

    // Compile, attach, and link vertex and fragment shaders
    wgl.attachShader(program, compileShader(materialVsSrc, wgl.VERTEX_SHADER));
    wgl.attachShader(program, compileShader(materialFsSrc, wgl.FRAGMENT_SHADER));
    wgl.linkProgram(program);

    if (!wgl.getProgramParameter(program, wgl.LINK_STATUS)) {
        throw new Error(wgl.getProgramInfoLog(program));
    }

    // Find shader attribute and uniform locations
    const vertexPosition = wgl.getAttribLocation(program, 'aVertexPosition');
    const modelViewMatrix = wgl.getUniformLocation(program, 'uModelViewMatrix');
    const projectionMatrix = wgl.getUniformLocation(program, 'uProjectionMatrix');
    const color = wgl.getUniformLocation(program, 'uColor');

    return {
        program: program,
        input: {
            position: vertexPosition,
            modelViewMatrix: modelViewMatrix,
            projectionMatrix: projectionMatrix,
            color: color,
        },
    };
}

function compileShader(source: string, type: GLenum): WebGLShader {
    const shader = wgl.createShader(type);
    wgl.shaderSource(shader, source);
    wgl.compileShader(shader);

    const success = wgl.getShaderParameter(shader, wgl.COMPILE_STATUS);
    if (!success) {
        const info = wgl.getShaderInfoLog(shader);
        wgl.deleteShader(shader);
        throw new Error(info);
    }

    return shader;
}

function buildSquareVAO(attribPosition: number): IVertexArray {
    const positions = [
        // Bottom Left
        -0.46, -0.46, 0.0,
        // Top Left
        -0.46,  0.46, 0.0,
        // Top Right
         0.46,  0.46, 0.0,
        // Bottom Right
         0.46, -0.46, 0.0,
    ];

    const indices = [
        0, 1, 2,
        0, 2, 3,
    ];

    const vao = wgl.createVertexArray();
    const positionBuffer = wgl.createBuffer();
    const indexBuffer = wgl.createBuffer();

    wgl.bindVertexArray(vao);

    // Bind vertex position array to position attribute
    wgl.bindBuffer(wgl.ARRAY_BUFFER, positionBuffer);
    wgl.bufferData(
        wgl.ARRAY_BUFFER,
        new Float32Array(positions),
        wgl.STATIC_DRAW
    );
    wgl.vertexAttribPointer(attribPosition, 3, wgl.FLOAT, true, 0, 0);
    wgl.enableVertexAttribArray(attribPosition);

    // Bind indice array
    wgl.bindBuffer(wgl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    wgl.bufferData(
        wgl.ELEMENT_ARRAY_BUFFER, 
        new Uint16Array(indices),
        wgl.STATIC_DRAW
    );

    // Unbind VAO to avoid accidental external binds
    wgl.bindVertexArray(null);

    return {
        tag: 'square',
        vao: vao,
        vertexCount: 6,
    };
}

function createBricks(): IBrick[] {
    const bricks = new Array<IBrick>();
    const rows = 8;
    const columns = 14;
    const colors: glm.vec3[] = [
        [0.85, 0.145, 0.066],
        [0.94, 0.392, 0.176],
        [0.152, 0.94, 0.215],
        [0.94, 0.92, 0.18],
    ];

    for (let j = 0; j < rows; j++) {
        for (let i = 0; i < columns; i++) {
            bricks.push({
                position: [i, j * -1, 0.0],
                color: colors[Math.floor(j / 2)],
                value: 1,
            });
        }
    }

    return bricks;
}