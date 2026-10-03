import { useEffect, useRef, useState } from "react";

// Schwarzschild-style ray bending: each ray is integrated with the
// a = -1.5 h² r̂ / r⁴ approximation, then shaded by the accretion disk
// (where it crosses y = 0) or a procedural starfield (where it escapes).
const FRAG = /* glsl */ `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uCenter;
uniform float uZoom;
uniform int uSteps;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y);
}

vec3 stars(vec3 d) {
  vec2 uv = vec2(atan(d.x, d.z), asin(clamp(d.y, -1.0, 1.0)));
  vec3 col = vec3(0.0);
  for (float i = 0.0; i < 3.0; i++) {
    vec2 g = uv * (14.0 + i * 11.0);
    vec2 id = floor(g);
    vec2 f = fract(g) - 0.5;
    float h = hash(id + i * 7.13);
    vec2 o = vec2(hash(id + 1.3), hash(id + 2.7)) - 0.5;
    float s = step(0.9, h) * smoothstep(0.08, 0.0, length(f - o * 0.7));
    float tw = 0.65 + 0.35 * sin(uTime * 1.7 + h * 50.0);
    col += s * tw * mix(vec3(0.65, 0.75, 1.0), vec3(1.0, 0.85, 0.7), hash(id + 5.1));
  }
  // faint nebula haze
  col += vec3(0.05, 0.03, 0.08) * noise(uv * 2.5) + vec3(0.02, 0.025, 0.05);
  return col;
}

vec3 disk(vec3 q, vec3 v) {
  float r = length(q.xz);
  float inner = 2.6, outer = 9.5;
  if (r < inner || r > outer) return vec3(0.0);
  float ang = atan(q.z, q.x);
  float x = (r - inner) / (outer - inner);
  // Swirling bands, faster near the hole.
  float swirl = ang + uTime * (0.9 / (r * 0.35));
  float bands = noise(vec2(swirl * 3.0, r * 1.6)) * 0.6 + noise(vec2(swirl * 9.0, r * 5.0)) * 0.4;
  float intensity = pow(1.0 - x, 2.2) * (0.45 + 0.9 * bands);
  intensity *= smoothstep(0.0, 0.08, x) * smoothstep(1.0, 0.75, x);
  // Relativistic beaming: the side moving toward the camera is brighter.
  vec3 orbit = normalize(vec3(-q.z, 0.0, q.x));
  float doppler = 1.0 + 0.85 * dot(orbit, -normalize(v));
  vec3 hot = vec3(1.0, 0.92, 0.75), warm = vec3(1.0, 0.55, 0.18), cool = vec3(0.55, 0.12, 0.05);
  vec3 c = mix(hot, warm, smoothstep(0.0, 0.35, x));
  c = mix(c, cool, smoothstep(0.35, 1.0, x));
  return c * intensity * doppler * doppler * 2.2;
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
  uv = (uv - uCenter) / uZoom;

  vec3 ro = vec3(0.0, 1.6, -18.0);
  vec3 fw = normalize(vec3(0.0, 0.0, 0.0) - ro);
  vec3 rt = normalize(cross(vec3(0.0, 1.0, 0.0), fw));
  vec3 up = cross(fw, rt);
  vec3 v = normalize(fw * 1.9 + uv.x * rt + uv.y * up);
  vec3 p = ro;
  vec3 hv = cross(p, v);
  float h2 = dot(hv, hv);

  vec3 col = vec3(0.0);
  float trans = 1.0;
  bool captured = false;

  for (int i = 0; i < 400; i++) {
    if (i >= uSteps) break;
    float r2 = dot(p, p);
    float r = sqrt(r2);
    if (r < 1.0) { captured = true; break; }
    if (r > 40.0 && dot(p, v) > 0.0) break;
    float dt = clamp(0.06 * r, 0.03, 1.2);
    vec3 a = -1.5 * h2 * p / (r2 * r2 * r);
    vec3 nv = v + a * dt;
    vec3 np = p + nv * dt;
    if (p.y * np.y < 0.0) {
      vec3 q = mix(p, np, p.y / (p.y - np.y));
      vec3 d = disk(q, nv);
      float alpha = clamp(length(d) * 0.9, 0.0, 0.95);
      col += trans * d;
      trans *= 1.0 - alpha;
    }
    // Soft glow hugging the photon sphere.
    col += trans * vec3(1.0, 0.6, 0.3) * 0.004 * dt / max(r2 - 2.0, 0.15);
    p = np;
    v = nv;
  }

  if (!captured) col += trans * stars(normalize(v));
  col = 1.0 - exp(-col * 1.3);
  col = pow(col, vec3(0.92));
  gl_FragColor = vec4(col, 1.0);
}
`;

const VERT = `attribute vec2 p; void main() { gl_Position = vec4(p, 0.0, 1.0); }`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type);
  if (!s) return null;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.warn(gl.getShaderInfoLog(s));
    gl.deleteShader(s);
    return null;
  }
  return s;
}

/** Static CSS stand-in used when WebGL is unavailable. */
function Fallback() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0"
      style={{
        background:
          "radial-gradient(circle at 70% 45%, #000 0 9%, rgba(255,214,150,.9) 10%, rgba(245,140,40,.55) 13%, rgba(120,30,10,.25) 22%, transparent 34%), radial-gradient(ellipse 60% 6% at 70% 47%, rgba(255,190,110,.6), transparent 70%), #06060a",
      }}
    />
  );
}

export function BlackHole({ reduceMotion }: { reduceMotion: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = (canvas.getContext("webgl", { antialias: false, powerPreference: "low-power" }) ??
      canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
    if (!gl) {
      setFailed(true);
      return;
    }

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    const prog = gl.createProgram();
    if (!vs || !fs || !prog) {
      setFailed(true);
      return;
    }
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      setFailed(true);
      return;
    }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "uRes");
    const uTime = gl.getUniformLocation(prog, "uTime");
    const uCenter = gl.getUniformLocation(prog, "uCenter");
    const uZoom = gl.getUniformLocation(prog, "uZoom");
    const uSteps = gl.getUniformLocation(prog, "uSteps");

    let phone = false;
    function resize() {
      if (!canvas || !gl) return;
      const rect = canvas.getBoundingClientRect();
      phone = rect.width < 768 || window.matchMedia("(pointer: coarse)").matches;
      // Phones render at roughly half resolution; desktop caps DPR at 1.
      const scale = phone ? 0.5 : Math.min(window.devicePixelRatio || 1, 1) * 0.85;
      const w = Math.max(1, Math.round(rect.width * scale));
      const h = Math.max(1, Math.round(rect.height * scale));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, w, h);
      gl.uniform2f(uRes, w, h);
      const wide = rect.width / rect.height > 1.1;
      gl.uniform2f(uCenter, wide ? 0.42 * (rect.width / rect.height) - 0.25 : 0, wide ? 0.04 : 0.17);
      gl.uniform1f(uZoom, wide ? 0.7 : 0.55);
      gl.uniform1i(uSteps, phone ? 160 : 280);
    }

    const draw = (t: number) => {
      gl.uniform1f(uTime, t);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    let raf = 0;
    let visible = true;
    let start = performance.now();
    let elapsed = 0;

    const loop = (now: number) => {
      draw(elapsed + (now - start) / 1000);
      raf = requestAnimationFrame(loop);
    };
    const play = () => {
      if (reduceMotion || raf || !visible || document.hidden) return;
      start = performance.now();
      raf = requestAnimationFrame(loop);
    };
    const pause = () => {
      if (!raf) return;
      cancelAnimationFrame(raf);
      raf = 0;
      elapsed += (performance.now() - start) / 1000;
    };

    resize();
    // Reduced motion: one still frame, no loop.
    if (reduceMotion) draw(12.0);

    const ro = new ResizeObserver(() => {
      resize();
      if (reduceMotion || !raf) draw(reduceMotion ? 12.0 : elapsed);
    });
    ro.observe(canvas);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) play();
      else pause();
    });
    io.observe(canvas);

    const onVisibility = () => (document.hidden ? pause() : play());
    document.addEventListener("visibilitychange", onVisibility);

    const onLost = (e: Event) => {
      e.preventDefault();
      pause();
      setFailed(true);
    };
    canvas.addEventListener("webglcontextlost", onLost);

    play();

    return () => {
      pause();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("webglcontextlost", onLost);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buf);
    };
  }, [reduceMotion]);

  if (failed) return <Fallback />;
  return <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full" />;
}
