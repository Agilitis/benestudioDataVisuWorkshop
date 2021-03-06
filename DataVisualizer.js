class DataVisualizer {
    constructor(config) {
        this.baseMapUrl = "https://i.imgur.com/E8vbaRC.png";
        this.dataMapUrl = "https://i.imgur.com/MtBe8P6.png";
        this.width = 100;
        this.height = 100;
        this.dataDepth = 10;

    }

    async init() {
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
        function threshold(value, thresholdValue = 0.2){
            return (value < thresholdValue) ? undefined:value;
        }

        const imageData = await getImageData(this.dataMapUrl, 0.2);
        const data = imageData.map(row =>row.map(
            ([r,g,b,a]) => threshold(1-r/255)
        ));

        //arary of rows of values
        const dataWidth = data.length;
        const dataHeight = data[0] ? data[0].length : 0;

        const materials = DataVisualizer.createMaterialPalette(10);
        const mergedGeometry = new THREE.Geometry();
        for(let i = 0; i < data.length; i++){
            const row = data[i];
            for(let j = 0; row.length > j; j++){
                const value = row[j];
                const cubeGeometry = new THREE.CubeGeometry(1, 1, 1);
                const cube = new THREE.Mesh(cubeGeometry);
                cube.applyMatrix(new THREE.Matrix4().makeTranslation(
                    i - dataWidth/2,
                    0.5,
                    j-dataHeight/2
                ));
                let k = 0;
                cubeGeometry.faces.forEach(face=>{
                    face.materialIndex = Math.round((1-value)*(materials.length-1));
                    k++;
                });
                const y = value * this.dataDepth;
                cube.applyMatrix(new THREE.Matrix4().makeScale(1,y,1));
                mergedGeometry.merge(cubeGeometry, cube.matrix, 0);
            }
        }


        const mergedMesh = new THREE.Mesh(mergedGeometry, materials);
        this.scene.add(mergedMesh);


        const cubeGeometry = new THREE.CubeGeometry(1, 1, 1);
        const cube = new THREE.Mesh(cubeGeometry, materials);

        this.scene.add(cube);

        this.control = new THREE.OrbitControls(this.camera, this.renderer.domElement);

        this.animate();
    }

    static createMaterialPalette(count){
        const materials = [];
        for(let i =0; i<count; i++){
            const material = new THREE.MeshPhongMaterial();
            const colorComponent = Math.round(i/count*255);
            material.color = new THREE.Color(`rgb(255, ${colorComponent}, 0)`)
            materials.push(material);
        }
        return materials;
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