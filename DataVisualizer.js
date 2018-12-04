class DataVisualizer {
    constructor(config) {
        this.baseMapUrl = "https://i.imgur.com/E8vbaRC.png";
        this.dataMapUrl = "https://i.imgur.com/MtBe8P6.png";
        this.width = 100;
        this.height = 100;
        this.dataDepth = 10;

    }

    init() {
        this.scene = new THREE.Scene();

        // camera
        const aspect = window.innerWidth / window.innerHeight;
        this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
        this.camera.position.set(0, 50, 50);

        const rendererOptions = {
            antialias: true
        };
        this.renderer = new THREE.WebGLRenderer(rendererOptions);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        this.setupLights();

        const material = new THREE.MeshPhongMaterial();

        for(let i = 0; i<10; i++){
            const cubeGeometry = new THREE.CubeGeometry(10, 10, 10);
            const cube = new THREE.Mesh(cubeGeometry, material);
            cube.applyMatrix(new THREE.Matrix4().makeTranslation());
            this.scene.add(cube);
        }

        const cubeGeometry = new THREE.CubeGeometry(10, 10, 10);
        const cube = new THREE.Mesh(cubeGeometry, material);

        this.scene.add(cube);

        this.control = new THREE.OrbitControls(this.camera, this.renderer.domElement);

        this.animate();
    }

    setupLights() {
        const lights = [];
        const light1 = new THREE.PointLight(0xffffff, 0.5, 0);
        const light2 = new THREE.PointLight(0xffffff, 0.5, 0);
        const light3 = new THREE.PointLight(0xffffff, 0.5, 0);

        light1.position.set(0, 200, 0);
        light2.position.set(100, 200, 100);
        light3.position.set(-100, -200, -100);
        lights.push(light1, light2, light3);

        lights.forEach((light) => {
            this.scene.add(light);
        });
    }

    animate() {
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(() => {
            this.animate();
        })
    }
}