#version 330 core

in vec3 vColor;
in vec3 pos;

out vec4 FragColor;

uniform vec2 res;
uniform float uTime;

vec3 palette(float t) {
  vec3 a = vec3(0.938, 0.328, 0.718);
  vec3 b = vec3(0.659, 0.438, 0.328);
  vec3 c = vec3(0.388, 0.388, 0.296);
  vec3 d = vec3(2.538, 2.478, 0.168);

  return a + b * cos(6.28318*(c*t+d));
}

void main() {
  // Convert from clip space (-1..1) to 0..1 UV
  vec2 uv = (pos.xy * 0.5) + 0.5;

  // makes 1,1,1 the center 
  // (idk why this works but just importing the value normally doesn't cuz we are techincally undoing the first op on uv)
  uv = uv - 0.5;
  uv = uv * 2.0;

  vec2 uv0 = uv;
  vec3 finalColor = vec3(0.0);

  // fix stretch issue
  uv.x *= res.x / res.y;
  
  //                       ^ will add layers to fractal pattern
  for (float i = 0.0; i < 3.5; i++) {
    // pattern
    uv *= 2.0;
    //              zoom
    uv = fract(uv * 0.75);
    uv -= 0.5;

    float d = length(uv) * exp(-length(uv0));

    // set colors (disco)
    vec3 col = palette(length(uv0) + i * 0.4 + uTime * 2.0);

    //                       ^ anim speed
    d = sin(d*8.0 + uTime * 1.5)/8.0;
    d = abs(d);

    // contrast
    //       ^ light intensity
    d = pow(0.01 / d, 1.2);

    // d = 0.01 / d; // neon colors

    finalColor += col * d;
  }
  
  FragColor = vec4(finalColor, 1.0);
}
