import * as THREE from 'three';
import Sizes from "./Utils/Sizes.js";
import Time from "./Utils/Time.js";
import Camera from './Camera.js';
import Renderer from './Renderer.js';
import World from './World/World.js';
import Resources from './Utils/Resources.js';
import sources from './sources.js'
import Boid from './World/Boid.js'

import P5 from 'p5';

let instance = null;

export default class Project
{
    constructor(canvas)
    {

        if(instance)
        {
            return instance;
        }


       
        instance = this;

        window.project = this;
        this.canvas =canvas;
        this.sizes = new Sizes();
        this.time = new Time();
        this.scene = new THREE.Scene();
        this.resources = new Resources(sources);
        this.camera = new Camera();
        this.renderer = new Renderer();
        this.world = new World();
        this.boid = new Boid();
        this.boid2 = new Boid();
        this.boids = [];
        this.gravity = new THREE.Vector3(0, -0.01 * 2, 0);
        this.wind = new THREE.Vector3(0.002,0,0);
        this.wind2 = new THREE.Vector3(-0.001,0,0);

        for(let i =0; i < 100; i++)
        {
            this.boids[i] = new Boid(Math.random()*30,Math.random()*10,Math.random()*20);
        }


        this.sizes.on('resize',()=>
        {
            this.resize();
        })

        this.time.on('tick',()=>
        {
           this.update();
        })
    }

    resize()
    {
        this.camera.resize();
        this.renderer.resize();
        
    }

    update()
    {
        this.camera.update();
        this.renderer.update();
        const force = this.boid.calculateAttraction(this.boid2);
        this.boid2.applyForce(force);
        this.boid.applyForce(this.gravity);
        this.boid2.applyForce(this.gravity);
        this.boid2.applyForce(this.wind2);
        //window.addEventListener('mousedown', this.boid.applyForce(this.wind), false);
        this.boid.applyForce(this.wind);
        this.boid.update();
        this.boid.edges();
        this.boid2.update();
        this.boid2.edges();

        for(let i =0; i < 100; i++)
        {
            this.boids[i].update();
            this.boids[i].edges();
            this.boids[i].applyForce(this.gravity);
            //console.log(this.boids);
        }

    }
}