// ====== LOGS ======
console.log("[INIT] exploradorIFC.js cargado");

// IMPORTS por CDN (sin import maps)
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/OrbitControls.js";
// 👉 Usamos el IFCLoader de web-ifc-three (evita el 404 de three/examples)
import { IFCLoader } from "https://cdn.jsdelivr.net/npm/web-ifc-three@0.0.130/IFCLoader.js";

// ---------- DOM ----------
const canvas = document.getElementById("three-canvas");
const fileInput = document.getElementById("file-input");
const dropZone = document.getElementById("drop-zone");
const modelsList = document.getElementById("models-list");
const propsRoot = document.getElementById("props");
const treeRoot = document.getElementById("tree");

const btnFit = document.getElementById("btn-fit");
const btnIsolate = document.getElementById("btn-isolate");
const btnClearIso = document.getElementById("btn-clear-iso");
const btnClearSel = document.getElementById("btn-clear");
const btnHideSelected = document.getElementById("btn-hide-selected");
const btnShowAll = document.getElementById("btn-show-all");

// ---------- THREE ----------
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0b0f17);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(dropZone.clientWidth, dropZone.clientHeight);

const camera = new THREE.PerspectiveCamera(50, dropZone.clientWidth / dropZone.clientHeight, 0.1, 1e9);
camera.position.set(12, 10, 12);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const ambient = new THREE.AmbientLight(0xffffff, 0.6);
const dir = new THREE.DirectionalLight(0xffffff, 0.6); dir.position.set(10, 20, 12);
scene.add(ambient, dir);

const grid = new THREE.GridHelper(200, 200); grid.material.opacity = 0.15; grid.material.transparent = true;
scene.add(grid);
scene.add(new THREE.AxesHelper(2));

// ---------- STATE ----------
const modelsGroup = new THREE.Group(); scene.add(modelsGroup);
let worldOffset = null;
const models = []; // { id, name, object3d, bbox, visible, ifcModelID }
const highlightMat = new THREE.MeshPhongMaterial({ color: 0x6aa3ff, transparent: true, opacity: 0.8, depthTest: true });
let selectionSubset = null;
let selected = { modelID: null, expressID: null };

// ---------- IFC ----------
const ifcLoader = new IFCLoader();
// WASM local
const WASM_BASE = "./wasm/";
ifcLoader.ifcManager.setWasmPath(WASM_BASE);
ifcLoader.ifcManager.useWebWorkers(false);
console.log("[IFC] WASM path:", WASM_BASE);

// ---------- CARGA ----------
fileInput.addEventListener("change", async (e) => {
  const files = Array.from(e.target.files || []);
  for (const f of files) await loadIFCFile(f);
  fileInput.value = "";
});

setupDnD(dropZone);

function setupDnD(el){
  ["dragenter","dragover","dragleave","drop"].forEach(ev => {
    el.addEventListener(ev, (e)=>{ e.preventDefault(); e.stopPropagation(); }, false);
  });
  ["dragenter","dragover"].forEach(ev => el.addEventListener(ev, ()=> el.classList.add("dragover")));
  ["dragleave","drop"].forEach(ev => el.addEventListener(ev, ()=> el.classList.remove("dragover")));
  el.addEventListener("drop", async (e)=>{
    const files = Array.from(e.dataTransfer.files || []).filter(f => f.name.toLowerCase().endsWith(".ifc"));
    for (const f of files) await loadIFCFile(f);
  });
}

async function loadIFCFile(file){
  try{
    console.time(`[IFC] ${file.name}`);
    console.log("[IFC] Cargando:", { name:file.name, size:file.size });

    // 👉 Con web-ifc-three usamos loadAsync(URL)
    const url = URL.createObjectURL(file);
    const modelMesh = await ifcLoader.loadAsync(url);
    URL.revokeObjectURL(url);

    if(!modelMesh){ throw new Error("loadAsync() devolvió null/undefined"); }
    console.log("[IFC] loadAsync OK:", { modelID: modelMesh.modelID });

    const modelRoot = new THREE.Group(); modelRoot.name = file.name;
    modelMesh.traverse(o => { if (o.isMesh) o.renderOrder = 2; });
    modelRoot.add(modelMesh);

    const bbox = new THREE.Box3().setFromObject(modelRoot);
    const center = bbox.getCenter(new THREE.Vector3());

    if(!worldOffset){ worldOffset = center.clone(); console.log("[IFC] worldOffset:", worldOffset); }
    modelRoot.position.sub(worldOffset);

    const bbox2 = new THREE.Box3().setFromObject(modelRoot);

    modelsGroup.add(modelRoot);
    const entry = { id: crypto.randomUUID(), name:file.name, object3d:modelRoot, bbox:bbox2, visible:true, ifcModelID:modelMesh.modelID };
    models.push(entry);

    addModelRow(entry);
    await buildSpatialTree(entry);
    fitToAllModels();

    console.timeEnd(`[IFC] ${file.name}`);
  }catch(err){
    console.error("[IFC] Error al cargar", file?.name, err);
    alert("No se pudo cargar el IFC. Revisa la consola.");
  }
}

// ---------- UI lista de modelos ----------
function addModelRow(entry){
  const row = document.createElement("div"); row.className="model-row";
  const info = document.createElement("div"); info.className="info";
  const title = document.createElement("div"); title.className="title"; title.textContent = entry.name;
  const meta = document.createElement("div"); meta.className="meta"; meta.textContent = `ID: ${entry.id.slice(0,8)}...`;
  info.append(title, meta);

  const toggles = document.createElement("div"); toggles.className="toggles";
  const vis = document.createElement("label"); vis.className="switch"; vis.innerHTML = `<input type="checkbox" checked /> Visible`;
  vis.querySelector("input").addEventListener("change", (e)=>{ entry.visible = e.target.checked; entry.object3d.visible = entry.visible; });
  const isoBtn = document.createElement("button"); isoBtn.className="btn"; isoBtn.textContent="Aislar";
  isoBtn.addEventListener("click", ()=> isolateModel(entry));
  toggles.append(vis, isoBtn);

  row.append(info, toggles); modelsList.appendChild(row);
}
function isolateModel(entry){ for(const m of models) m.object3d.visible = (m.id === entry.id); }

// ---------- Árbol ----------
async function buildSpatialTree(entry){
  try{
    const spatial = await ifcLoader.ifcManager.getSpatialStructure(entry.ifcModelID, true);
    const c = document.createElement("div"); c.style.marginTop="6px";
    c.appendChild(renderTreeNode(spatial, entry.ifcModelID));
    treeRoot.appendChild(c);
  }catch(e){ console.error("[TREE] Error", e); }
}
function renderTreeNode(node, modelID){
  const w = document.createElement("div"); const li = document.createElement("div"); li.className="node";
  const badge = document.createElement("span"); badge.className="badge"; badge.textContent=node.type||"Node";
  const label = document.createElement("span"); label.textContent=node.name || `(id: ${node.expressID})`;
  li.append(badge, label);
  li.addEventListener("click", async (e)=>{ e.stopPropagation(); if(node.expressID) await pickById(modelID, node.expressID, true); });
  w.appendChild(li);

  if(node.children?.length){
    const ul=document.createElement("ul");
    node.children.forEach(ch => { const li=document.createElement("li"); li.appendChild(renderTreeNode(ch, modelID)); ul.appendChild(li); });
    w.appendChild(ul);
  }
  return w;
}

// ---------- Picking ----------
const ray = new THREE.Raycaster(); const mouse = new THREE.Vector2();
renderer.domElement.addEventListener("pointerdown", async (ev)=>{
  const r = renderer.domElement.getBoundingClientRect();
  mouse.x = ((ev.clientX - r.left) / r.width) * 2 - 1;
  mouse.y = -((ev.clientY - r.top) / r.height) * 2 + 1;
  ray.setFromCamera(mouse, camera);

  const meshes=[]; modelsGroup.traverse(o=>{ if(o.isMesh) meshes.push(o); });
  const hit = ray.intersectObjects(meshes, false)[0];
  if(!hit){ clearSelection(); return; }

  const expressID = ifcLoader.ifcManager.getExpressId(hit.object.geometry, hit.faceIndex);
  const modelID = getModelIDForObject(hit.object); if(modelID==null) return;
  await selectItem(modelID, expressID, { zoom:false });
});
function getModelIDForObject(o){ while(o){ if(o.modelID!==undefined) return o.modelID; o=o.parent; } return null; }

async function pickById(modelID, expressID, zoom=false){ await selectItem(modelID, expressID, { zoom }); }
async function selectItem(modelID, expressID, { zoom } = { zoom:false }){
  if(selectionSubset){ ifcLoader.ifcManager.removeSubset(modelID, highlightMat); selectionSubset=null; }
  selectionSubset = ifcLoader.ifcManager.createSubset({ modelID, ids:[expressID], scene, material: highlightMat, removePrevious:true });
  await showProperties(modelID, expressID);
  if(zoom) focusSubset(selectionSubset);
}
function clearSelection(){
  if(selectionSubset){ try{ ifcLoader.ifcManager.removeSubset(selectionSubset.modelID, highlightMat);}catch{} selectionSubset=null; }
  propsRoot.innerHTML = `<div class="empty">Selecciona un elemento para ver sus propiedades.</div>`;
}

// ---------- Propiedades ----------
async function showProperties(modelID, expressID){
  const m = ifcLoader.ifcManager;
  const base = await m.getItemProperties(modelID, expressID, true);
  const type = await m.getTypeProperties(modelID, expressID, true);
  const psets = await m.getPropertySets(modelID, expressID, true);
  propsRoot.innerHTML=""; propsRoot.appendChild(renderPropGroup("Identidad", flattenProps(base)));
  if (type && Object.keys(type).length) propsRoot.appendChild(renderPropGroup("Tipo", flattenProps(type)));
  if (Array.isArray(psets)){
    for(const ps of psets){
      const dict={};
      if (Array.isArray(ps.HasProperties)){
        for(const p of ps.HasProperties){
          dict[valueToString(p.Name)] = valueToString(p.NominalValue ?? p.Description ?? p);
        }
      }
      propsRoot.appendChild(renderPropGroup(`PSet: ${ps.Name?.value || ps.Name || "Propiedades"}`, dict));
    }
  }
}
function renderPropGroup(title, dict){
  const det=document.createElement("details"); det.className="prop-group"; det.open=true;
  const sum=document.createElement("summary"); sum.textContent=title; det.appendChild(sum);
  const list=document.createElement("div"); list.className="prop-list";
  const keys=Object.keys(dict);
  if(!keys.length){ const e=document.createElement("div"); e.className="empty"; e.textContent="Sin propiedades."; list.appendChild(e); }
  else { for(const k of keys){ const item=document.createElement("div"); item.className="prop-item";
    const n=document.createElement("div"); n.className="prop-name"; n.textContent=k;
    const v=document.createElement("div"); v.className="prop-val"; v.textContent=dict[k];
    item.append(n,v); list.appendChild(item); } }
  det.appendChild(list); return det;
}
function flattenProps(obj){ const out={}; if(!obj) return out; for(const [k,v] of Object.entries(obj)){ if(k==="psets"||k==="mats"||k==="type") continue; out[k]=valueToString(v); } return out; }
function valueToString(v){ if(v==null) return ""; if(typeof v==="object"){ if("value" in v) return String(v.value); if("Value" in v) return String(v.Value); if("expressID" in v && Object.keys(v).length===1) return String(v.expressID); return JSON.stringify(v);} return String(v); }

// ---------- Fit / Cámara ----------
function fitToAllModels(){ if(!models.length) return; const bb=new THREE.Box3(); for(const m of models){ if(m.object3d.visible) bb.union(m.bbox); } if(bb.isEmpty()) return; focusAABB(bb); }
function focusSubset(obj){ focusAABB(new THREE.Box3().setFromObject(obj)); }
function focusAABB(bb){
  const size=new THREE.Vector3(), center=new THREE.Vector3(); bb.getSize(size); bb.getCenter(center);
  const maxDim=Math.max(size.x,size.y,size.z), fitDist=maxDim*1.5, dir=new THREE.Vector3(1,1,1).normalize();
  camera.position.copy(center.clone().add(dir.multiplyScalar(fitDist))); camera.near=Math.max(0.1,maxDim/1000);
  camera.far=Math.max(2000,maxDim*10); camera.updateProjectionMatrix(); controls.target.copy(center); controls.update();
}

// ---------- Botones ----------
btnFit.addEventListener("click", fitToAllModels);
btnIsolate.addEventListener("click", ()=>{ if(!selectionSubset) return; modelsGroup.traverse(o=>{ if(o.visible && o!==selectionSubset) o.visible=false; }); selectionSubset.visible=true; });
btnClearIso.addEventListener("click", ()=> modelsGroup.traverse(o=> o.visible=true));
btnClearSel.addEventListener("click", clearSelection);
btnHideSelected.addEventListener("click", clearSelection);
btnShowAll.addEventListener("click", ()=> modelsGroup.traverse(o=> o.visible=true));

// ---------- Resize & Loop ----------
window.addEventListener("resize", onResize);
function onResize(){ const w=dropZone.clientWidth, h=dropZone.clientHeight; camera.aspect=w/h; camera.updateProjectionMatrix(); renderer.setSize(w,h); }
onResize();
(function animate(){ requestAnimationFrame(animate); controls.update(); renderer.render(scene, camera); })();
