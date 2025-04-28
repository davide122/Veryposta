"use client";

import { useState, useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default function PreventivoSpedizione() {
  const [peso, setPeso] = useState("");
  const [lunghezza, setLunghezza] = useState("");
  const [larghezza, setLarghezza] = useState("");
  const [altezza, setAltezza] = useState("");
  const [tipo, setTipo] = useState("nazionale");
  const [paese, setPaese] = useState("belgio");
  const [extra, setExtra] = useState("none"); // none, film, packing
  const [prezzo, setPrezzo] = useState(null);
  const [error, setError] = useState("");
  const canvasRef = useRef(null);
  const boxRef = useRef(null);
  const filmMeshRef = useRef(null);
  const packingMeshRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(
      50,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      1000
    );
    camera.position.set(4, 4, 4);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    scene.add(new THREE.HemisphereLight(0xfff8e7, 0x444444, 0.6));

    // Load textures
    const loader = new THREE.TextureLoader();
    const cardboardMap = loader.load("/texture.png", tex => (tex.encoding = THREE.sRGBEncoding));
    cardboardMap.wrapS = cardboardMap.wrapT = THREE.RepeatWrapping;
    cardboardMap.repeat.set(1, 1);

    const filmMap = loader.load("/newtexture.png", tex => (tex.encoding = THREE.sRGBEncoding));
    filmMap.wrapS = filmMap.wrapT = THREE.RepeatWrapping;
    filmMap.repeat.set(2, 2);

    // Materials
    const boxMat = new THREE.MeshStandardMaterial({
      map: cardboardMap,
      color: 0xf5e1a4,
      roughness: 0.6,
      metalness: 0.05,
      bumpMap: cardboardMap,
      bumpScale: 0.02,
    });
    const filmMat = new THREE.MeshPhysicalMaterial({
        map: filmMap,
        transparent: false,
        opacity: 0.9,        // puoi variare
        roughness: 1,      // plastica lucida
        transmission: 0,   // trasparenza “fisica”
        thickness: 0.1,      // spessore
        side: THREE.DoubleSide,
        depthWrite: false,   // evita conflitti di z‑buffer
      });
    const packingMat = new THREE.MeshStandardMaterial({
      map: cardboardMap,
      color: 0xf5e1a4,
      roughness: 0.7,
      metalness: 0,
    });

    // Geometry
    const geometry = new THREE.BoxGeometry(2, 2, 2);

    // Box
    const box = new THREE.Mesh(geometry, boxMat);
    boxRef.current = box;
    scene.add(box);

    // Film
    const filmMesh = new THREE.Mesh(geometry.clone(), filmMat);
    filmMesh.scale.set(1.02, 1.02, 1.02);
    filmMesh.visible = false;
    filmMeshRef.current = filmMesh;
    scene.add(filmMesh);

    // Packing
    const packingMesh = new THREE.Mesh(geometry.clone(), packingMat);
    packingMesh.scale.set(1.05, 1.05, 1.05);
    packingMesh.visible = false;
    packingMeshRef.current = packingMesh;
    scene.add(packingMesh);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.8;
    controls.target.copy(box.position);
    controls.update();

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Toggle extras
  useEffect(() => {
    if (filmMeshRef.current) filmMeshRef.current.visible = extra === "film";
    if (packingMeshRef.current) packingMeshRef.current.visible = extra === "packing";
  }, [extra]);

  // Calculate price
  const calcolaPreventivo = () => {
    setError("");
    const p = +peso, l = +lunghezza, w = +larghezza, h = +altezza;
    if ([p, l, w, h].some(v => !v || isNaN(v))) {
      setError("Inserisci valori validi in tutti i campi!");
      return;
    }
    const volumetrico = (l * w * h) / 5000;
    const effettivo = Math.max(p, volumetrico);

    // Scale meshes
    const sx = Math.max(w / 20, 0.1),
          sy = Math.max(h / 20, 0.1),
          sz = Math.max(l / 20, 0.1);
    boxRef.current.scale.set(sx, sy, sz);
    filmMeshRef.current.scale.set(sx * 1.02, sy * 1.02, sz * 1.02);
    packingMeshRef.current.scale.set(sx * 1.05, sy * 1.05, sz * 1.05);

    // Pricing
    const naz = { soglie: [2,5,10,15,25], prezzi: [10,15,18,20,25] };
    const intl = {
      belgio: [20,25,30,35,40,45],
      germania: [20,25,30,35,40,45],
      francia: [20,25,30,35,40,45],
      spagna: [22,27,35,40,45,45],
    };
    let price = 0;
    if (tipo === "nazionale") {
      naz.soglie.forEach((s,i) => { if (effettivo <= s && !price) price = naz.prezzi[i]; });
      if (!price) price = 30;
    } else {
      const arr = intl[paese];
      [2,5,10,15,20,25].forEach((s,i) => { if (effettivo <= s && !price) price = arr[i]; });
      if (!price) price = 50;
    }
    if (extra === "film") price += 3;
    if (extra === "packing") price += 5;

    setPrezzo(price);
  };

  return (
    <section className="py-16 px-4 max-w-6xl mx-auto text-[#1d3a6b]">
      <div className="flex flex-col lg:flex-row gap-12 items-start">
        {/* Form */}
        <div className="lg:w-1/2 bg-white p-8 rounded-2xl shadow-lg">
          <h2 className="text-3xl font-extrabold mb-6">
            Calcola il tuo <span className="text-[#ebd00b]">Preventivo</span>
          </h2>
          {error && <div className="text-red-600 bg-red-100 p-2 rounded mb-4">{error}</div>}
          <div className="space-y-4">
            {/* Peso */}
            <div>
              <label className="block text-sm mb-1">Peso (kg)</label>
              <input
                type="number"
                value={peso}
                onChange={e => setPeso(e.target.value)}
                placeholder="3.5"
                className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-[#ebd00b]"
              />
            </div>
            {/* Dimensioni */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">Lunghezza (cm)</label>
                <input
                  type="number"
                  value={lunghezza}
                  onChange={e => setLunghezza(e.target.value)}
                  placeholder="30"
                  className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-[#ebd00b]"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Larghezza (cm)</label>
                <input
                  type="number"
                  value={larghezza}
                  onChange={e => setLarghezza(e.target.value)}
                  placeholder="20"
                  className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-[#ebd00b]"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm mb-1">Altezza (cm)</label>
                <input
                  type="number"
                  value={altezza}
                  onChange={e => setAltezza(e.target.value)}
                  placeholder="15"
                  className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-[#ebd00b]"
                />
              </div>
            </div>
            {/* Spedizione */}
            <div className="flex gap-6 mt-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="tipo"
                  checked={tipo === "nazionale"}
                  onChange={() => setTipo("nazionale")}
                  className="form-radio"
                />
                Nazionale
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="tipo"
                  checked={tipo === "internazionale"}
                  onChange={() => setTipo("internazionale")}
                  className="form-radio"
                />
                Internazionale
              </label>
              {tipo === "internazionale" && (
                <select
                  value={paese}
                  onChange={e => setPaese(e.target.value)}
                  className="ml-auto px-4 py-2 border rounded focus:ring-2 focus:ring-[#ebd00b]"
                >
                  <option value="belgio">Belgio</option>
                  <option value="germania">Germania</option>
                  <option value="francia">Francia</option>
                  <option value="spagna">Spagna</option>
                </select>
              )}
            </div>
            {/* Extra imballaggio */}
            <fieldset className="mt-4">
              <legend className="text-sm font-medium mb-1">Extra imballaggio</legend>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="extra"
                    value="none"
                    checked={extra === "none"}
                    onChange={() => setExtra("none")}
                    className="form-radio"
                  />
                  Nessuno
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="extra"
                    value="film"
                    checked={extra === "film"}
                    onChange={() => setExtra("film")}
                    className="form-radio"
                  />
                  Pellicola (+3€)
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="extra"
                    value="packing"
                    checked={extra === "packing"}
                    onChange={() => setExtra("packing")}
                    className="form-radio"
                  />
                  Imballaggio (+5€)
                </label>
              </div>
            </fieldset>
            {/* Bottone */}
            <button
              onClick={calcolaPreventivo}
              className="w-full mt-6 bg-[#1d3a6b] text-white py-3 rounded-full hover:bg-[#16305b] transition focus:ring-2 focus:ring-[#ebd00b]"
            >
              Calcola Preventivo
            </button>
            {/* Risultato */}
            {prezzo !== null && (
              <div className="mt-6 text-2xl font-bold text-center">
                Prezzo stimato: <span className="text-[#ebd00b]">{prezzo.toFixed(2)} €</span>
              </div>
            )}
          </div>
        </div>
        {/* Canvas 3D affiancato */}
        <div className="lg:w-1/2 h-96">
          <canvas ref={canvasRef} className="w-full h-full rounded-2xl bg-[#f9f9f9]" />
        </div>
      </div>
    </section>
  );
}
