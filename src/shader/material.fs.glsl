#version 300 es
in mediump vec4 fragColor;
layout(location = 0) out mediump vec4 out_FragColor;

void main() {
    out_FragColor = fragColor;
}