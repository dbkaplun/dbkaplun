import React from 'react';

import * as THREE from 'three';
import FMath from 'fmath'; Object.assign(Math, new FMath()); // efficient sin, cos

import Layout from '../components/Layout';
import TelephoneLink from '../components/TelephoneLink';
import EmailLink from '../components/EmailLink';

import resume from '../resume.json';
import homeStyle from '../styles/pages/home.less';

export default class Home extends React.Component {
  static getInitialProps () {
    return {resume};
  }

  constructor (...args) {
    super(...args);
    this.state = {};
    ['updateDotMatrixSize', 'onDOMStylesLoaded'].forEach(method => {
      this[method] = this[method].bind(this);
    });
  }
  componentDidMount () {
    this.initDotMatrix();
    this.animateDotMatrix();
  }
  componentWillUnmount () {
    this.destroyDotMatrix();
  }
  initDotMatrix () {
    this.destroyDotMatrix();

    let {props: {dotMatrixOpts}, refs: {dotMatrix}} = this;

    this.scene = new THREE.Scene();

    let dims = 3;
    let length = dotMatrixOpts.xs * dotMatrixOpts.zs * dims;
    this.positions = new Float32Array(length);
    this.colors = new Float32Array(length);

    this.geometry = new THREE.BufferGeometry();
    this.geometry.addAttribute('position', new THREE.BufferAttribute(this.positions, dims));
    this.geometry.addAttribute('color', new THREE.BufferAttribute(this.colors, dims));

    this.points = new THREE.Points(this.geometry, dotMatrixOpts.material);
    this.scene.add(this.points);

    this.camera = new THREE.PerspectiveCamera(dotMatrixOpts.fov, dotMatrixOpts.aspect, dotMatrixOpts.near, dotMatrixOpts.far);
    this.camera.position.z = dotMatrixOpts.xs*2;
    this.camera.position.y = dotMatrixOpts.zs*2 * Math.PI/6;
    this.camera.lookAt(this.scene.position);

    this.renderer = new THREE.WebGLRenderer({antialias: true});
    this.renderer.setPixelRatio(window.devicePixelRatio);

    dotMatrix.appendChild(this.renderer.domElement);
    document.head.addEventListener('load', this.onDOMStylesLoaded, true); this.updateDotMatrixStyle();
    window.addEventListener('resize', this.updateDotMatrixSize, false); this.updateDotMatrixSize();
    this.isInitDotMatrix = true;
  }
  destroyDotMatrix () {
    document.head.removeEventListener('load', this.onDOMStylesLoaded);
    window.removeEventListener('resize', this.updateDotMatrixSize);
    if (this.renderer) this.refs.dotMatrix.removeChild(this.renderer.domElement);
    this.isInitDotMatrix = false;
  }
  animateDotMatrix () {
    if (!this.isInitDotMatrix) return;
    this.renderDotMatrix();
    requestAnimationFrame(() => {this.animateDotMatrix()});
  }
  onDOMStylesLoaded (evt) {
  	if ((evt.target || {}).nodeName !== 'STYLE') return;
    this.updateDotMatrixStyle();
  }
  updateDotMatrixStyle () {
    let {props: {dotMatrixOpts}} = this;
    this.bodyStyle = window.getComputedStyle(document.body);
    this.scene.fog = new THREE.Fog(new THREE.Color(this.bodyStyle['background-color']), dotMatrixOpts.near, dotMatrixOpts.far);
    this.renderer.setClearColor(this.scene.fog.color);
    this.updateDotMatrixGeometry();
  }
  updateDotMatrixSize () {
    let {props: {dotMatrixOpts}, refs: {dotMatrix}} = this;
    let w = dotMatrix.clientWidth;
    let h = w/dotMatrixOpts.aspect;
    let scissorTop = h*dotMatrixOpts.scissorFactor.top;
    let scissorBottom = h*dotMatrixOpts.scissorFactor.bottom;
    this.renderer.setSize(w, h - (scissorTop + scissorBottom));
    this.renderer.setViewport(0, -scissorBottom, w, h);
    this.renderer.setScissor(0, -scissorBottom, w, h);
  }
  getY (x, z) {
    let {props: {dotMatrixOpts}} = this;
    // return -z*dotMatrixOpts.yScale/(dotMatrixOpts.zs/2); // bounds testing
    let pd = dotMatrixOpts.programDuration;
    let id = dotMatrixOpts.interpolationDuration;
    let pl = dotMatrixOpts.programs.length;

    let t = Date.now() * 0.001; // seconds
    if (typeof this.programStart !== 'number') this.programStart = t;
    if (typeof this.programIndex !== 'number') this.programIndex = this.lastProgramIndex = randInt(pl);
    let elapsed = t - this.programStart;
    if (elapsed >= pd) {
      this.programStart += Math.floor(elapsed/pd)*pd;
      elapsed = mod(elapsed, pd);
      this.lastProgramIndex = this.programIndex;
      while (this.lastProgramIndex === this.programIndex) this.programIndex = randInt(pl);
    }

    let y = this.getDotMatrixProgram(this.programIndex).call(this, elapsed, x, z);

    let interp = elapsed / id;
    if (interp <= 1 && this.programIndex !== this.lastProgramIndex) {
      let lastY = this.getDotMatrixProgram(this.lastProgramIndex).call(this, pd, x, z);
      y = y*interp + lastY*(1 - interp);
    }

    return y;
  }
  getDotMatrixProgram (i) {
    return this.constructor.dotMatrixPrograms[this.props.dotMatrixOpts.programs[i]];
  }
  updateDotMatrixGeometry () {
    let {props: {dotMatrixOpts: {xs, zs, yScale}}, bodyStyle} = this;

    let foregroundColor = new THREE.Color(bodyStyle['color']);
    let xs2 = xs/2, zs2 = zs/2;
    let i = 0;
    for (let x = -xs2; x < xs2; x++) {
      for (let z = -zs2; z < zs2; z++) {
        let y = this.getY(x, z); // ideally in range [-1, 1]
        this.positions[i]     = x;
        this.positions[i + 1] = y*yScale;
        this.positions[i + 2] = z;
        // let c = (y + 1)/2; // ideally in range [0, 1]
        // this.colors[i]     = 1 - c;
        // this.colors[i + 1] = c;
        // this.colors[i + 2] = 1;
        this.colors[i]     = foregroundColor.r;
        this.colors[i + 1] = foregroundColor.g;
        this.colors[i + 2] = foregroundColor.b;
        i += 3;
      }
    }
    this.geometry.attributes.position.needsUpdate = true;
    this.geometry.attributes.color.needsUpdate = true;
    this.geometry.computeBoundingSphere();
  }
  renderDotMatrix () {
    this.updateDotMatrixGeometry();
    this.renderer.render(this.scene, this.camera);
  }
  render () {
    let {mounted} = this.state;
    let {resume} = this.props;
    return (
      <Layout title={`${resume.basics.name} • ${resume.basics.phone} • ${resume.basics.email}`} css={homeStyle} container={false}>
        <main className="home text-center jumbotron" itemScope itemType="http://schema.org/Person">
          <h1 className="text-nowrap" itemProp="name">{resume.basics.name}</h1>
          <dl className="dl-horizontal">
            <dt><i className="fa fa-envelope-o"></i></dt>
            <dd><EmailLink email={resume.basics.email} /></dd>
            <dt><i className="fa fa-phone"></i></dt>
            <dd><a href={`tel:${resume.basics.phone.replace(/[^\d#*]/g, '')}`} target="_blank" itemProp="telephone">{resume.basics.phone}</a></dd>
            {resume.basics.profiles.map(({network, username, url}, i) => [
              <dt key={`profile-${i}-dt`}><i className={`fa fa-${network.toLowerCase()}`}></i></dt>,
              <dd key={`profile-${i}-dd`}><a href={url} target="_blank" itemProp="sameAs">{username}</a></dd>
            ])}
            <dt><i className="fa fa-file-text-o"></i></dt>
            <dd><a href="resume.pdf" target="_blank">resume.pdf</a></dd>
          </dl>

          <div ref="dotMatrix"></div>
        </main>
      </Layout>
    );
  }
};
Home.dotMatrixPrograms = {
  planeBounce (t, x, z) {
    return Math.sin(Math.PI*t);
  },
  planeRotate (t, x, z) {
    let {props: {dotMatrixOpts: {xs, zs}}} = this;
    x /= xs/2;
    z /= zs/2;
    t *= Math.PI;
    return (Math.cos(t)*x - Math.sin(t)*z)/Math.SQRT2;
  },
  wobble (t, x, z) {
    let {props: {dotMatrixOpts: {xs, zs}}} = this;
    x /= xs/2;
    z /= zs/2;
    return Math.sin(Math.PI*(t + x*z));
  },
  valley (t, x, z) {
    let {props: {dotMatrixOpts: {zs}}} = this;
    z /= zs/2;
    return Math.sin(Math.PI*t)*Math.cos(Math.PI*z);
  },
  droplet (t, x, z) {
    let {props: {dotMatrixOpts: {xs, zs}}} = this;
    x /= xs/2;
    z /= zs/2;
    return Math.sin(Math.PI*t)*Math.cos(5*(x*x + z*z));
  }
};
Home.defaultProps = {
  dotMatrixOpts: {
    programs: Object.keys(Home.dotMatrixPrograms), // all of them by default
    programDuration: 2,
    interpolationDuration: .6,

    fov: 90,
    aspect: 1,
    scissorFactor: {
      top: 2/5,
      bottom: 2/5
    },
    near: 1,
    far: 80,
    xs: 20,
    zs: 20,
    yScale: 2,
    material: new THREE.PointsMaterial({size: 1, vertexColors: THREE.VertexColors})
  }
};


export function mod (n, d) { return ((n%d)+d)%d; }
export function randInt (max) { return Math.floor(Math.random()*max); }
