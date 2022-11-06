#version 300 es
in highp vec4 v_fragColor;
layout(location = 0) out highp vec4 out_FragColor;

void main() {
    out_FragColor = v_fragColor;
}