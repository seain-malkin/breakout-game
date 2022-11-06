#version 300 es
in highp vec2 a_position;

uniform mat4 u_model;
uniform mat4 u_view;
uniform mat4 u_projection;

uniform vec3 u_color;

out highp vec4 v_fragColor;

void main() {
    gl_Position = u_projection * u_view * u_model * vec4(a_position, 0.0, 1.0);
    v_fragColor = vec4(u_color, 1.0);
}