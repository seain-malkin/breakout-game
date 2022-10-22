#version 300 es
in mediump vec4 position;

uniform mat4 modelView;
uniform mat4 projection;
uniform vec3 color;

out mediump vec4 fragColor;

void main() {
    gl_Position = projection * modelView * position;
    fragColor = vec4(color, 1.0);
}