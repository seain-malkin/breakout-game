#version 300 es
in mediump vec3 position;

uniform mat4 modelView;
uniform mat4 projection;
uniform vec3 color;

out mediump vec4 fragColor;

void main() {
    vec3 resolution = vec3(1.2, 0.6, 1.0);

    // 0.0 to 1.0
    vec3 zeroToOne = position / resolution;
    // 0.0 to 2.0
    vec3 zeroToTwo = zeroToOne * 2.0;
    // -1.0 to 1.0
    vec3 clipspace = zeroToTwo - 1.0;

    gl_Position =   modelView * vec4(clipspace, 1.0);
    fragColor = vec4(color, 1.0);
}