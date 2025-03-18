// -------------------------------------------------------------------------------------------------------------------
// This file is accompanied by its explanation file in the explanations folder. (EarthController.txt)
// I would recommend reading that file along side this one to get a complete understanding of the code.
// -------------------------------------------------------------------------------------------------------------------


export class EarthController {
 
    OnAnyCountryClicked = new EventTarget();

    constructor(canvas) {

        if (canvas == undefined) {
            return;
        }

        this.earthScene = new THREE.Scene();
        this.sceneCamera = new THREE.PerspectiveCamera(75, canvas.width/canvas.height);
        this.webGLRenderer = new THREE.WebGLRenderer({canvas : canvas, antialias: true, alpha: true});
        this.webGLRenderer.setSize(canvas.width, canvas.height);


        this.sceneCamera.position.set(0, 1, 2);  
        
        this.orbitControls = new THREE.OrbitControls(this.sceneCamera, this.webGLRenderer.domElement);
        this.orbitControls.enableDamping = true;
        this.orbitControls.dampingFactor = 0.12;
        this.orbitControls.autoRotate = true;
        this.orbitControls.autoRotateSpeed = 0.3;
        this.orbitControls.rotateSpeed = 0.25
        this.orbitControls.enableZoom = false;

        this.countries = [
            new Country("United States", [37.7749, -95.7129]),
            new Country("France",[46.603354,1.888334]),
            new Country("Japan", [36.2048, 138.2529]),
            new Country("Australia", [-25.2744, 133.7751]),
            new Country("Venezuela", [6.4238, -66.5897]),
            new Country("Italy", [41.87, 12.56])
        ];

        
        this.raycaster = new THREE.Raycaster();
        this.mousePosition = new THREE.Vector2();

        canvas.addEventListener("mousedown", this.HandleMouseClickOnMarker.bind(this));

        this.CreateEarthModel();
        this.CreateMarkersForEachCountry();
        this.Update();
    }

    HandleMouseClickOnMarker(event) {       

        this.mousePosition.x = (event.offsetX / this.webGLRenderer.domElement.clientWidth) * 2 - 1;
        this.mousePosition.y = -(event.offsetY /this.webGLRenderer.domElement.clientHeight) * 2 + 1;
        this.raycaster.setFromCamera(this.mousePosition, this.sceneCamera);


        let collisionInfo = this.raycaster.intersectObjects(this.earthScene.children);

        if (collisionInfo.length > 0) {
            let country = collisionInfo[0].object.userData.name;

            if (country == null) return;

            this.OnAnyCountryClicked.dispatchEvent(new CustomEvent("country", {detail: country.toLowerCase()}))
        }
    }

    CreateMarkersForEachCountry() {

        for (let country of this.countries) {
            this.CreateMarker(country);
        }   

    }

    CreateMarker(country) {

        let markerGeometry = new THREE.SphereGeometry(0.02, 16, 16);
        let markerMat = new THREE.MeshBasicMaterial({ color: 0xff0000 })
        let marker = new THREE.Mesh(markerGeometry, markerMat);

        marker.position.copy(country.GetPosition());
        this.earthScene.add(marker);
        marker.userData = { name: country.GetName() };

        console.log(country.GetName(), country.GetPosition())

    } 

    Update() {
        this.sceneCamera.aspect = this.webGLRenderer.domElement.clientWidth/this.webGLRenderer.domElement.clientHeight;
        this.sceneCamera.updateProjectionMatrix();
        this.webGLRenderer.setSize(this.webGLRenderer.domElement.clientWidth, this.webGLRenderer.domElement.clientHeight);
        this.webGLRenderer.render(this.earthScene, this.sceneCamera);
        this.orbitControls.update();

        window.requestAnimationFrame(this.Update.bind(this));
    }

    CreateEarthModel() {

        let textureLoader = new THREE.TextureLoader();
        let earthTexture = textureLoader.load("https://threejs.org/examples/textures/land_ocean_ice_cloud_2048.jpg");
        let earthGeometry = new THREE.SphereGeometry(1, 64, 64);
        let earthMaterial = new THREE.MeshBasicMaterial({ map: earthTexture });
        let earth = new THREE.Mesh(earthGeometry, earthMaterial);
        this.earthScene.add(earth);

    }


    GetRenderingCanvas() {
        return this.webGLRenderer.domElement;
    }

}

export class Country {

    constructor(name, latLong) {
        this.name = name;
        this.latLong = latLong;
    }

    GetName() {
        return this.name;
    }

    GetPosition(radius = 1.01) {

        let fi = (90 - this.latLong[0]) * (Math.PI / 180);
        let Theta = (this.latLong[1] + 180) * (Math.PI / 180);

        return new THREE.Vector3(
            -(radius * Math.sin(fi) * Math.cos(Theta)),
            radius * Math.cos(fi),
            radius * Math.sin(fi) * Math.sin(Theta)
        );

    }

}

