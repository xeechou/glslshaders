uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

const int NUM_STEPS = 8;
const float PI		= 3.141592;
const float EPSILON	= 1e-3;
#define EPSILON_NRM (0.1 / u_resolution.x)


/**
 * Signed distance function for a sphere centered at the origin with radius 1.0;
 */
float sphereSDF(vec3 samplePoint) {
    return length(samplePoint) - 1.0;
}


float raymarching(vec3 orig, vec3 dir, out vec3 p)
{
	float depth = 0.0;
	float max_dist = 1000.0;
	for (int i = 0; i < NUM_STEPS; i++) {
		float dist = sphereSDF(orig + dir * depth);
		depth += dist;
		p = orig + dir * depth;

		if (dist < 0.0)
			return depth;
		if (depth > max_dist)
			return max_dist;
	}
	return max_dist;
}


void main(void)
{
	vec2 uv = gl_FragCoord.xy / u_resolution.xy;
	uv = uv * 2.0 - 1.0;
	uv.x *= u_resolution.x / u_resolution.y;

	vec3 eye = vec3(0.0, 0.0, 3.5);
	vec3 dir = vec3(uv, -2.0);
	//okay, this is our fov
	// dir.z += length(uv) * 0.15;
	vec3 p;
	float dist = raymarching(eye, dir, p);
	if (dist > 1000.0 - 0.001) {
		gl_FragColor = vec4(vec3(0.0), 1.0);
	}
	else
		gl_FragColor = vec4(1.0);
}
