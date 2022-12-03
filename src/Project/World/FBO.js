import * as THREE from 'three';
import Project from '../Project';
import fragmentSimulation from '../shaders/fragmentSimulation.glsl';
import vertex from '../shaders/vertexParticle.glsl';
import fragment from '../shaders/fragment.glsl';
import { GPUComputationRenderer } from 'three/examples/jsm/misc/GPUComputationRenderer.js';
import EventEmitter from '../Utils/EventEmitter';
import  Renderer  from '../Renderer.js';

let WIDTH = 32;

export default class FBO
{
    constructor()
    {
      
        
        this.project = new Project();
        this.scene = this.project.scene;
        this.renderer = this.project.renderer
        console.log(this.renderer);
        this.position = new THREE.Vector3();
        this.plane;
        this.initMesh();
        this.initGPGPU();

    }

    initMesh()
    {
       
        this.planMaterial = new THREE.ShaderMaterial(
            {
                extensions:{
                    derivatives: "#extension GL_OES_standard_derivatives : enable"
                },
                side: THREE.DoubleSide,
                uniforms : {
                    time : { value: 0},
                    positionTexture : { value: null},
                    resolution :  { value: new THREE.Vector4() }
                },

                vertexShader : vertex,
                fragmentShader : fragment
            });

        this.geometry = new THREE.BufferGeometry();
        let positions = new Float32Array(WIDTH * WIDTH * 3);
        let reference = new Float32Array(WIDTH * WIDTH * 2);
        for(let i=0; i < WIDTH * WIDTH; i++)
        {
            let x = Math.random();
            let y = Math.random();
            let z = Math.random();
            let xx = (i%WIDTH)/WIDTH;
            let yy = ~~(i/WIDTH)/WIDTH;
            positions.set([x,y,z], i*3);
            reference.set([xx,yy], i*2);
        }

        this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        this.geometry.setAttribute('reference', new THREE.BufferAttribute(reference, 2));
            
        this.plane = new THREE.Points(this.geometry, this.planMaterial);
        //this.plane.position.copy(this.position);
        this.scene.add(this.plane);
    }

    update()
    {
        this.scene.add(this.plane);
    }

    initGPGPU()
    {
        this.gpuCompute = new GPUComputationRenderer(WIDTH, WIDTH, this.renderer);
        // if ( this.renderer.capabilities.isWebGL2 === false && renderer.extensions.has( 'OES_texture_float' ) === false ) {

        //     return 'No OES_texture_float support for float textures.';
    
        //   }
    
        //   if ( this.renderer.capabilities.maxVertexTextures === 0 ) {
    
        //     return 'No support for vertex shader textures.';
    
        //   }
       // console.log(this.renderer.capabilities.isWebGL2);
        this.dtPosition = this.gpuCompute.createTexture();
        this.fillPositions(this.dtPosition);
        this.positionVariable = this.gpuCompute.addVariable('texturePosition', fragmentSimulation, this.dtPosition); 

        this.positionVariable.material.uniforms['time'] = { value: 0}

        this.positionVariable.wrapS = THREE.RepeatWrapping;
        this.positionVariable.wrapT = THREE.RepeatWrapping;
        this.gpuCompute.init();
    }

    fillPositions(texture)
    {
        let arr = texture.image.data;
        for(let i = 0; i < arr.length; i=i+4)
        {
            let x = Math.random();
            let y = Math.random();
            let z = Math.random();
            

            arr[i] = x;
            arr[i+1] = y;
            arr[i+2] = z;
            arr[i+3] = 1;
        }
       // console.log(arr);
    }
}