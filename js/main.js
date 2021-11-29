// ページの読み込みを待つ
window.addEventListener('load', init);

function init() {
  // サイズを指定
  const width = 800;
  const height = 400;

  // マウス座標管理用のベクトルを作成
  const mouse = new THREE.Vector2();

  // canvas 要素の参照を取得する
  const canvas = document.querySelector('#canvas');

  // レンダラーを作成
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);

  // シーンを作成
  const scene = new THREE.Scene();

  // カメラを作成
  const camera = new THREE.PerspectiveCamera(45, width / height);
  camera.position.set(0, 0, +500);

  const geometry = new THREE.BoxBufferGeometry(50, 50, 50);

  // マウスとの交差を調べたいものは配列に格納する
  const meshList = [];

   // マテリアルを作成
  // const material = new THREE.MeshBasicMaterial({color: 0x44aa88});
  // const material = new THREE.MeshPhongMaterial({color: 0x44aa88});
  async function fetchData() {
    const response = await fetch('data.json');
    const data = await response.json();
    return data;
  }
  function createMash(data){
    for (let i = 0; i < data.length; i++) {
        const material = new THREE.MeshStandardMaterial({ color: (data[i].color) });
    
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = data[i].x;
        mesh.position.y = data[i].y;
        mesh.position.z = data[i].z;
        // mesh.rotation.x = Math.random() * 2 * Math.PI;
        // mesh.rotation.y = Math.random() * 2 * Math.PI;
        // mesh.rotation.z = Math.random() * 2s* Math.PI;
        scene.add(mesh);

        // 配列に保存
        meshList.push(mesh);
        // 配列に名前をつける
        mesh.name = "mesh-" + data[i].id;
        console.log(mesh.name);
      }
    }
    async function pushData() {
        // json情報取得
        const data = await fetchData();
        // Mesh作成
        createMash(data);
      }
    pushData();
//   fetch('data.json')
//   .then(response => response.json())
//   .then(data => {
//     for (let i = 0; i < data.length; i++) {
//         const material = new THREE.MeshStandardMaterial({ color: (data[i].color) });
    
//         const mesh = new THREE.Mesh(geometry, material);
//         mesh.position.x = data[i].x;
//         mesh.position.y = data[i].y;
//         mesh.position.z = data[i].z;
//         // mesh.rotation.x = Math.random() * 2 * Math.PI;
//         // mesh.rotation.y = Math.random() * 2 * Math.PI;
//         // mesh.rotation.z = Math.random() * 2s* Math.PI;
//         scene.add(mesh);

//         // 配列に保存
//         meshList.push(mesh);
//         // 配列に名前をつける
//         mesh.name = "mesh-" + data[i].id;
//       }
//       console.log(data);
//   },);


  // 平行光源
  const directionalLight = new THREE.DirectionalLight(0xffffff);
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);

  // 環境光源
  const ambientLight = new THREE.AmbientLight(0x666666);
  scene.add(ambientLight);

  // レイキャストを作成
  const raycaster = new THREE.Raycaster();


  canvas.addEventListener('click', handleMouseMove);
  
  // マウスを動かしたときのイベント
  function handleMouseMove(event) {
    const element = event.currentTarget;
    // canvas要素上のXY座標
    const x = event.clientX - element.offsetLeft;
    const y = event.clientY - element.offsetTop;
    // canvas要素の幅・高さ
    const w = element.offsetWidth;
    const h = element.offsetHeight;

    // -1〜+1の範囲で現在のマウス座標を登録する
    mouse.x = (x / w) * 2 - 1;
    mouse.y = -(y / h) * 2 + 1;

    // レイキャスト = マウス位置からまっすぐに伸びる光線ベクトルを生成
    raycaster.setFromCamera(mouse, camera);

    // その光線とぶつかったオブジェクトを得る
    const intersects = raycaster.intersectObjects(meshList);
    meshList.map((mesh) => {
      // 交差しているオブジェクトが1つ以上存在し、
      // 交差しているオブジェクトの1番目(最前面)のものだったら
      if (intersects.length > 0 && mesh === intersects[0].object) {
        console.log( mesh.name );
      } 
    });

  }

  tick();

  // 毎フレーム時に実行されるループイベントです
  function tick() {
    // レンダリング
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }
  
}