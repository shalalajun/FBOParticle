import * as THREE from 'three';
import Project from '../Project';

export default class FBO
{
    constructor()
    {
      
        this.project = new Project();
        this.scene = this.project.scene;
        this.position = new THREE.Vector3();
        this.plane;
        this.initMesh();
    }

    initMesh()
    {
        this.planGeometry = new THREE.PlaneGeometry(4,4);
        this.planMaterial = new THREE.MeshStandardMaterial({color:'white'});
        this.plane = new THREE.Mesh(this.planGeometry, this.planMaterial);
        this.plane.position.copy(this.position);
        this.scene.add(this.plane);
    }

    update()
    {
        this.scene.add(this.plane);
    }
}