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
		p = orig + dir * depth;

		if (dist < EPSILON)
			return depth;
		if (depth >= max_dist)
			return max_dist;
		depth += dist;
	}
	return max_dist;
}



//this is the first thing we need to figure out. How to come up with the ray
//direction per pixel.

//This is the first way to do it:

//remember the glm::perspective(fovy, aspect, z_n, z_f):
//where tan(fovy/2) = (0.5 * t)/z_n, it is the frustum
//and the (r-l) = aspect * (t-b).
vec3 raydir(float fovy, vec2 imgsize, vec2 fragCoord)
{
	vec2 xy = fragCoord - imgsize / 2.0;
	float z = 0.5 * imgsize.y / tan(radians(fovy) / 2.0);
	return normalize(vec3(xy, -z));
}

//the second way using the NDC coordinates, which you will get the dir.xy as
// uv = 2.0 * gl_FragCoord.xy / u_Resolution.xy - 1.0. (-1.0, 1.0)

// the dir now equals (uv, z), z is any constant you want, if you make it 1.0,
// the fov/2 is 45.0.

//the third method is getting it from a projection matrix(which you will have to do it in the cityphi)

void main(void)
{
	vec2 uv = 2.0 * gl_FragCoord.xy / u_resolutiion.xy - 1.0;
	uv.x *= u_resolution.x / u_resolution.y;

	vec3 dir = raydir(45.0, u_resolution, gl_FragCoord.xy);
	vec3 eye = vec3(0.0, 0.0, 5.0);
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
