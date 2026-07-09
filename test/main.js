import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const statusBar = document.getElementById("status-bar");
function updateStatus(msg) {
    statusBar.innerText = msg;
}

/* ========== Three 初始化 ========== */

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.set(0, 3, 10);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

/* ========== Shader ========== */

const vertexShader = `
uniform float uTime;
uniform float uProgress;
attribute vec3 aRandom;
varying float vAlpha;

void main(){
    vec3 pos = position;

    pos += aRandom * uProgress * 4.0;
    pos.y += uProgress * 1.5;

    vec4 mvPosition = modelViewMatrix * vec4(pos,1.0);

    gl_PointSize = 6.0 * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;

    vAlpha = 1.0 - uProgress;
}
`;

const fragmentShader = `
varying float vAlpha;

void main(){
    float d = length(gl_PointCoord - 0.5);
    if(d > 0.5) discard;

    gl_FragColor = vec4(0.3,0.8,1.0,vAlpha);
}
`;

/* ========== GLB加载（关键：同级路径） ========== */

let particleSystem;
let targetProgress = 0;

const loader = new GLTFLoader();

loader.load('./building.glb', (gltf) => {

    const vertices = [];

    gltf.scene.traverse((child) => {
        if (child.isMesh) {
            const pos = child.geometry.attributes.position;

            for (let i = 0; i < pos.count; i++) {
                vertices.push(
                    pos.getX(i),
                    pos.getY(i),
                    pos.getZ(i)
                );
            }
        }
    });

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(vertices, 3)
    );

    const random = new Float32Array(vertices.length);
    for (let i = 0; i < random.length; i++) {
        random[i] = (Math.random() - 0.5);
    }

    geometry.setAttribute(
        'aRandom',
        new THREE.Float32BufferAttribute(random, 3)
    );

    const material = new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0 },
            uProgress: { value: 0 }
        },
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });

    particleSystem = new THREE.Points(geometry, material);

    // 居中
    const box = new THREE.Box3().setFromObject(particleSystem);
    const center = box.getCenter(new THREE.Vector3());
    particleSystem.position.sub(center);

    scene.add(particleSystem);

    updateStatus("模型加载成功 ✅");

}, undefined, () => {
    updateStatus("GLB加载失败 ❌（检查路径）");
});

/* ========== ml5 手势 ========== */

const video = document.getElementById("video");
let hands = [];

navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream;

        updateStatus("AI加载中...");

        const handpose = ml5.handpose(video, () => {
            updateStatus("就绪：捏手控制");
        });

        handpose.on("predict", results => {
            hands = results;
        });
    })
    .catch(() => {
        updateStatus("摄像头失败 ❌");
    });

function handleGesture() {
    if (hands.length > 0) {
        const lm = hands[0].landmarks;

        const d = Math.hypot(
            lm[4][0] - lm[8][0],
            lm[4][1] - lm[8][1]
        );

        targetProgress = THREE.MathUtils.clamp(d / 150, 0, 1);

    } else {
        targetProgress = 0;
    }
}

/* ========== 动画 ========== */

const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);

    const t = clock.getElapsedTime();

    handleGesture();

    if (particleSystem) {
        particleSystem.material.uniforms.uTime.value = t;

        particleSystem.material.uniforms.uProgress.value =
            THREE.MathUtils.lerp(
                particleSystem.material.uniforms.uProgress.value,
                targetProgress,
                0.08
            );

        particleSystem.rotation.y += 0.002;
    }

    controls.update();
    renderer.render(scene, camera);
}

animate();

/* ========== resize ========== */

window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});