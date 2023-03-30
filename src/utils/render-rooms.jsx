import * as THREE from 'three';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import gsap from 'gsap';

const renderRooms = async () => {
  const sizes = {
    // width: window.innerWidth/2,
    width: window.innerWidth,
    height: window.innerHeight,
  };

  const debugObject = {
    clearColor: '#e6f2ff',
    camera_pos_y: 0.4,
    camera_pos_z: 1,
    group_pos_x: -0.006,
    group_pos_y: 0.02,
    group_rot_x: -0.8,
  };

  const dat = await import('dat.gui');
  const gui = new dat.GUI({ autoPlace: false });
  const debugGui = document.getElementById('debug-gui');
  if (!debugGui.hasChildNodes()) {
    debugGui.appendChild(gui.domElement);
  }

  // Scene
  const scene = new THREE.Scene();

  // const axes_helper = new THREE.AxesHelper(3);
  // scene.add(axes_helper);

  const textureLoader = new THREE.TextureLoader();

  const room0_bakedTexture = textureLoader.load(
    '/static/roi-calculator/room0.jpg'
  );
  const room1_bakedTexture = textureLoader.load(
    '/static/roi-calculator/room1.jpg'
  );
  const room2_bakedTexture = textureLoader.load(
    '/static/roi-calculator/room2.jpg'
  );
  const room3_bakedTexture = textureLoader.load(
    '/static/roi-calculator/room3.jpg'
  );
  const room4_bakedTexture = textureLoader.load(
    '/static/roi-calculator/room4.jpg'
  );

  const mike_bakedTexture = textureLoader.load(
    '/static/roi-calculator/mike.jpg'
  );

  room0_bakedTexture.flipY = false;
  room1_bakedTexture.flipY = false;
  room2_bakedTexture.flipY = false;
  room3_bakedTexture.flipY = false;
  room4_bakedTexture.flipY = false;
  mike_bakedTexture.flipY = false;

  room0_bakedTexture.encoding = THREE.sRGBEncoding;
  room1_bakedTexture.encoding = THREE.sRGBEncoding;
  room2_bakedTexture.encoding = THREE.sRGBEncoding;
  room3_bakedTexture.encoding = THREE.sRGBEncoding;
  room4_bakedTexture.encoding = THREE.sRGBEncoding;
  mike_bakedTexture.encoding = THREE.sRGBEncoding;

  const room0_material = new THREE.MeshBasicMaterial({
    map: room0_bakedTexture,
  });
  const room1_material = new THREE.MeshBasicMaterial({
    map: room1_bakedTexture,
  });
  const room2_material = new THREE.MeshBasicMaterial({
    map: room2_bakedTexture,
  });
  const room3_material = new THREE.MeshBasicMaterial({
    map: room3_bakedTexture,
  });
  const room4_material = new THREE.MeshBasicMaterial({
    map: room4_bakedTexture,
  });
  const mike_material = new THREE.MeshBasicMaterial({
    map: mike_bakedTexture,
  });

  const gltfloader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
  gltfloader.setDRACOLoader(dracoLoader);

  const group = new THREE.Group();
  gltfloader.load('/static/roi-calculator/room0.glb', (gltf) => {
    gltf.scene.traverse((child) => {
      child.material = room0_material;
    });
    group.add(gltf.scene);
  });

  const vessel_group = new THREE.Group();
  gltfloader.load('/static/roi-calculator/room1.glb', (gltf) => {
    gltf.scene.traverse((child) => {
      child.material = room1_material;
    });
    vessel_group.add(
      gltf.scene.children.find((child) => child.name === 'vessel_Empty')
    );
    group.add(vessel_group);
    group.add(gltf.scene);
  });

  gltfloader.load('/static/roi-calculator/room2.glb', (gltf) => {
    gltf.scene.traverse((child) => {
      child.material = room2_material;
    });
    group.add(gltf.scene);
  });

  const rubics_cube = new THREE.Group();
  let rubics_cube_arr = [
    [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ],
    [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ],
    [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ],
  ];
  gltfloader.load('/static/roi-calculator/room3.glb', (gltf) => {
    gltf.scene.traverse((child) => {
      child.material = room3_material;
    });

    var l = 0;
    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        for (var k = 0; k < 3; k++) {
          rubics_cube_arr[i][j][k] = gltf.scene.children.find(
            (child) => child.name === 'rubics_cube_' + l
          );
          rubics_cube.add(rubics_cube_arr[i][j][k]);
          l++;
        }
      }
    }

    group.add(rubics_cube);
    group.add(gltf.scene);
  });

  let mike_r4_animation_mixer = null;
  let mike_r4_animation_action;
  gltfloader.load('/static/roi-calculator/mike_r4.glb', (gltf) => {
    mike_r4_animation_mixer = new THREE.AnimationMixer(gltf.scene);
    mike_r4_animation_action = mike_r4_animation_mixer.clipAction(
      gltf.animations[0]
    );
    mike_r4_animation_action.play();
    gltf.scene.traverse((child) => {
      child.material = mike_material;
    });
    group.add(gltf.scene);
  });

  let mike_r3_animation_mixer = null;
  let mike_r3_animation_action;
  gltfloader.load('/static/roi-calculator/mike_r3.glb', (gltf) => {
    mike_r3_animation_mixer = new THREE.AnimationMixer(gltf.scene);
    mike_r3_animation_action = mike_r3_animation_mixer.clipAction(
      gltf.animations[0]
    );
    mike_r3_animation_action.play();
    gltf.scene.traverse((child) => {
      child.material = mike_material;
    });
    group.add(gltf.scene);
  });

  let mike_r2_animation_mixer = null;
  let mike_r2_animation_action;
  gltfloader.load('/static/roi-calculator/mike_r2.glb', (gltf) => {
    mike_r2_animation_mixer = new THREE.AnimationMixer(gltf.scene);
    mike_r2_animation_action = mike_r2_animation_mixer.clipAction(
      gltf.animations[0]
    );
    mike_r2_animation_action.play();
    gltf.scene.traverse((child) => {
      child.material = mike_material;
    });
    group.add(gltf.scene);
  });

  const minute_hand = new THREE.Group();
  const hour_hand = new THREE.Group();
  const greywing_w = new THREE.Group();
  let mouse_animation_mixer = null;
  let mouse_animation_action;
  gltfloader.load('/static/roi-calculator/room4.glb', (gltf) => {
    gltf.scene.traverse((child) => {
      if (child.name === 'mouse') {
        mouse_animation_mixer = new THREE.AnimationMixer(gltf.scene);
        mouse_animation_action = mouse_animation_mixer.clipAction(
          gltf.animations[0]
        );
        mouse_animation_action.play();
      }
      child.material = room4_material;
    });
    minute_hand.add(
      gltf.scene.children.find((child) => child.name === 'minute_hand')
    );
    hour_hand.add(
      gltf.scene.children.find((child) => child.name === 'hour_hand')
    );
    greywing_w.add(
      gltf.scene.children.find((child) => child.name === 'greywing_w')
    );
    group.add(minute_hand);
    group.add(hour_hand);
    group.add(greywing_w);
    group.add(gltf.scene);
  });

  // add rooms to scene
  group.position.x = debugObject.group_pos_x;
  group.position.y = debugObject.group_pos_y;
  group.rotation.y = debugObject.group_rot_x;
  group.scale.set(0.06, 0.06, 0.06);
  scene.add(group);

  const scene_folder = gui.addFolder('Scene');
  scene_folder
    .add(group.position, 'x', -1, 1)
    .step(0.001)
    .onChange((value) => {
      group.position.x = value;
    })
    .name('Move X Axis');
  scene_folder
    .add(group.position, 'y', -1, 1)
    .step(0.001)
    .onChange((value) => {
      group.position.y = value;
    })
    .name('Move Y Axis');
  scene_folder
    .add(group.position, 'z', -1, 1)
    .step(0.001)
    .onChange((value) => {
      group.position.z = value;
    })
    .name('Move Z Axis');

  scene_folder
    .add(group.rotation, 'x', -1, 1)
    .step(0.001)
    .onChange((value) => {
      group.rotation.x = value;
    })
    .name('Rotate X Axis');
  scene_folder
    .add(group.rotation, 'y', -1, 1)
    .step(0.001)
    .onChange((value) => {
      group.rotation.y = value;
    })
    .name('Rotate Y Axis');
  scene_folder
    .add(group.rotation, 'z', -1, 1)
    .step(0.001)
    .onChange((value) => {
      group.rotation.z = value;
    })
    .name('Rotate Z Axis');
  scene_folder.addColor(debugObject, 'clearColor').onChange(() => {
    renderer.setClearColor(debugObject.clearColor);
  });

  // Camera
  const camera = new THREE.PerspectiveCamera(9, sizes.width / sizes.height);
  camera.position.y = debugObject.camera_pos_y;
  camera.position.z = debugObject.camera_pos_z;
  scene.add(camera);

  // Camera Dat Gui Folder
  const camera_folder = gui.addFolder('Camera');
  camera_folder
    .add(camera, 'fov', 1, 20)
    .step(1)
    .onChange(() => {
      camera.updateProjectionMatrix();
    })
    .name('Field of View');

  camera_folder
    .add(camera.position, 'x', -1, 1)
    .step(0.01)
    .onChange((value) => {
      camera.position.x = value;
    })
    .name('Move X Axis');
  camera_folder
    .add(camera.position, 'y', -1, 1)
    .step(0.01)
    .onChange((value) => {
      camera.position.y = value;
    })
    .name('Move Y Axis');
  camera_folder
    .add(camera.position, 'z', -1, 1)
    .step(0.01)
    .onChange((value) => {
      camera.position.z = value;
    })
    .name('Move Z Axis');

  // Renderer
  const canvas = document.getElementById('webgl');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.setClearColor(debugObject.clearColor);

  // Orbit Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  // controls.enableDamping = true;
  // controls.enablePan = false;
  // controls.maxAzimuthAngle = THREE.MathUtils.degToRad(45); // right
  // controls.minAzimuthAngle = THREE.MathUtils.degToRad(-45); // left
  // controls.maxPolarAngle = THREE.MathUtils.degToRad(80); // down
  // controls.minPolarAngle = THREE.MathUtils.degToRad(45); // up
  // controls.maxDistance = 1.8; // away from camera
  // controls.minDistance = 0.5; // closer to camera
  // controls.zoomSpeed = 0.25;
  // controls.rotateSpeed = 0.2;

  window.addEventListener('resize', () => {
    // sizes.width = window.innerWidth / 2;
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });

  canvas.addEventListener('dblclick', () => {
    const fullscreenElement =
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement;
    if (!fullscreenElement) {
      if (canvas.requestFullscreen) canvas.requestFullscreen();
      else if (canvas.webkitRequestFullscreen) canvas.webkitRequestFullscreen();
      else if (canvas.mozRequestFullscreen) canvas.mozRequestFullscreen();
      else if (canvas.msRequestFullscreen) canvas.msRequestFullscreen();
    } else if (document.exitFullscreen) document.exitFullscreen();
    else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
    else if (document.msExitFullscreen) document.msExitFullscreen();
  });

  let currentfloor = 0;

  const handleFloorChange = () => {
    if (currentfloor === 0) {
      gsap.to(group.position, { duration: 1, x: -0.006 });
      gsap.to(group.position, { duration: 1, y: 0.02 });
      controls.maxAzimuthAngle = THREE.MathUtils.degToRad(25); // right
      controls.minAzimuthAngle = THREE.MathUtils.degToRad(-25); // left
    }
    if (currentfloor === 1) {
      gsap.to(group.position, { duration: 1, x: -0.09 });
      gsap.to(group.position, { duration: 1, y: -0.14 });
      controls.maxAzimuthAngle = THREE.MathUtils.degToRad(15); // right
      controls.minAzimuthAngle = THREE.MathUtils.degToRad(-15); // left
    }
    if (currentfloor === 2) {
      gsap.to(group.position, { duration: 1, x: -0.006 });
      gsap.to(group.position, { duration: 1, y: -0.275 });
      controls.maxAzimuthAngle = THREE.MathUtils.degToRad(5); // right
      controls.minAzimuthAngle = THREE.MathUtils.degToRad(-5); // left
    }
    if (currentfloor === 3) {
      gsap.to(group.position, { duration: 1, x: -0.08 });
      gsap.to(group.position, { duration: 1, y: -0.42 });
      controls.maxAzimuthAngle = THREE.MathUtils.degToRad(5); // right
      controls.minAzimuthAngle = THREE.MathUtils.degToRad(-5); // left
    }
  };

  const movefloorup = document.getElementById('movefloorup');
  if (movefloorup) {
    movefloorup.addEventListener('click', () => {
      if (currentfloor < 4) {
        currentfloor++;
        handleFloorChange();
      }
    });
  }

  const movefloordown = document.getElementById('movefloordown');
  if (movefloordown) {
    movefloordown.addEventListener('click', () => {
      if (currentfloor > 0) {
        currentfloor--;
        handleFloorChange();
      }
    });
  }

  const vessel_position = vessel_group.position.x;
  const vessel_button = document.getElementById('vessel_button');
  if (vessel_button) {
    vessel_button.addEventListener('click', () => {
      gsap.to(vessel_group.position, {
        duration: 1,
        x: vessel_position + 1,
      });
      gsap.to(vessel_group.position, {
        delay: 1,
        duration: 0,
        x: vessel_position - 1,
      });
      gsap.to(vessel_group.position, {
        delay: 1,
        duration: 1,
        x: vessel_position,
      });
    });
  }

  const clock = new THREE.Clock();
  let previousTime = 0;
  function randomIntFromInterval(min, max) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  const tick = () => {
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - previousTime;
    previousTime = elapsedTime;

    minute_hand.children.forEach((child) => (child.rotation.z -= 0.01));
    hour_hand.children.forEach((child) => (child.rotation.z -= 0.001));
    greywing_w.children.forEach(
      (child) => (child.rotation.y = Math.cos(elapsedTime) * 0.5)
    );
    rubics_cube.children.forEach(
      (child) => (child.position.y += Math.cos(elapsedTime) * 0.001)
    );

    var rndInt = randomIntFromInterval(0, 2);
    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        if (rubics_cube_arr[i][rndInt][j]?.rotation)
          rubics_cube_arr[i][rndInt][j].rotation.x +=
            Math.cos(elapsedTime) * 0.1;
      }
    }

    // for (var i = 0; i < 3; i++) {
    //   for (var j = 0; j < 3; j++) {
    //     if (rubics_cube_arr[rndInt][i][j]?.rotation)
    //       rubics_cube_arr[rndInt][i][j].rotation.y +=
    //         Math.cos(elapsedTime) * 0.1;
    //   }
    // }

    if (mike_r4_animation_mixer !== null) {
      mike_r4_animation_mixer.update(deltaTime);
    }
    if (mike_r3_animation_mixer !== null) {
      mike_r3_animation_mixer.update(deltaTime);
    }
    if (mike_r2_animation_mixer !== null) {
      mike_r2_animation_mixer.update(deltaTime);
    }
    if (mouse_animation_mixer !== null) {
      mouse_animation_mixer.update(deltaTime);
      mouse_animation_action.syncWith(mike_r4_animation_action);
    }
    controls.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
  };
  tick();
};

export default renderRooms;
