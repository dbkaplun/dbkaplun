var THREE = require('three');
var extend = require('extend');

DotMatrix.DEFAULT_OPTS = {
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
  material: new THREE.PointsMaterial({size: .75, vertexColors: THREE.VertexColors}),

  interpolationDuration: .6,
  programDuration: 2,
  programs: [
    function (t, x, z) {
      // wobbles
      var self = this;
      var opts = self.opts;
      x /= opts.xs/2;
      z /= opts.zs/2;
      return Math.sin(Math.PI*(t + x*z));
    },
    function (t, x, z) {
      // ripple
      var self = this;
      var opts = self.opts;
      x /= opts.xs/2;
      z /= opts.zs/2;
      return Math.sin(Math.PI*t)*Math.sin(4*(x*x + z*z));
    },
    function (t, x, z) {
      // plane tilt
      var self = this;
      var opts = self.opts;
      x /= opts.xs/2;
      z /= opts.zs/2;
      t *= Math.PI;
      return (Math.cos(t)*x - Math.sin(t)*z)/Math.SQRT2;
    }
  ]
};
function DotMatrix (opts) {
  this.opts = extend(true, null, DotMatrix.DEFAULT_OPTS, opts);
  this.init();
}
DotMatrix.prototype.init = function () {
  var self = this;

  self.scene = new THREE.Scene();
  self.scene.fog = new THREE.Fog(0xEEEEEE, self.opts.near, self.opts.far);

  var dims = 3;
  var length = self.opts.xs * self.opts.zs * dims;
  self.positions = new Float32Array(length);
  self.colors = new Float32Array(length);

  self.geometry = new THREE.BufferGeometry();
  self.geometry.addAttribute('position', new THREE.BufferAttribute(self.positions, dims));
  self.geometry.addAttribute('color', new THREE.BufferAttribute(self.colors, dims));

  self.points = new THREE.Points(self.geometry, self.opts.material);
  self.scene.add(self.points);

  self.camera = new THREE.PerspectiveCamera(self.opts.fov, self.opts.aspect, self.opts.near, self.opts.far);
  self.camera.position.z = self.opts.xs*2;
  self.camera.position.y = self.opts.zs*2 * Math.PI/6;
  self.camera.lookAt(self.scene.position);

  self.renderer = new THREE.WebGLRenderer({antialias: true});
  self.renderer.setClearColor(self.scene.fog.color);
  self.renderer.setPixelRatio(window.devicePixelRatio);
  self.updateSize();
  self.opts.el.appendChild(self.renderer.domElement);

  window.addEventListener('resize', self.updateSize.bind(self), false);
};
DotMatrix.prototype.updateSize = function () {
  var self = this;
  var opts = self.opts;
  var w = opts.el.clientWidth;
  var h = w/opts.aspect;
  var scissorTop = h*opts.scissorFactor.top;
  var scissorBottom = h*opts.scissorFactor.bottom;
  self.renderer.setSize(w, h - (scissorTop + scissorBottom));
  self.renderer.setViewport(0, -scissorBottom, w, h);
  self.renderer.setScissor(0, -scissorBottom, w, h);
};
DotMatrix.prototype.getY = function (x, z) {
  var self = this;
  var opts = self.opts;
  // return -z*opts.yScale/(opts.zs/2); // bounds testing
  var pd = opts.programDuration;
  var id = opts.interpolationDuration;
  var programs = opts.programs;
  var pl = programs.length;

  var t = Date.now() * 0.001; // seconds
  if (typeof self.programStart !== 'number') self.programStart = t;
  if (typeof self.programIndex !== 'number') self.programIndex = self.lastProgramIndex = randInt(pl);
  var elapsed = t - self.programStart;
  var elapsedPrograms = elapsed/pd;
  if (elapsedPrograms >= 1) {
    self.programStart = t; // FIXME: don't skip if elapsedPrograms >> 1
    elapsed = mod(elapsed, pd);
    self.lastProgramIndex = self.programIndex;
    self.programIndex = randInt(pl);
  }

  var y = programs[self.programIndex].call(self, t, x, z);

  var interp = elapsed / id;
  if (interp < 1) {
    var lastY = programs[self.lastProgramIndex].call(self, t, x, z);
    y = y*interp + lastY*(1 - interp);
  }

  return y;
};
DotMatrix.prototype.updateGeometry = function () {
  var self = this;
  var opts = self.opts;

  var xs = opts.xs, xs2 = xs/2;
  var zs = opts.zs, zs2 = zs/2;
  var i = 0;
  for (var x = -xs2; x < xs2; x++) {
    for (var z = -zs2; z < zs2; z++) {
      var y = self.getY.call(self, x, z); // ideally in range [-1, 1]
      self.positions[i]     = x;
      self.positions[i + 1] = y*opts.yScale;
      self.positions[i + 2] = z;
      // var c = (y + 1)/2; // ideally in range [0, 1]
      // self.colors[i]     = 1 - c;
      // self.colors[i + 1] = c;
      // self.colors[i + 2] = 1;
      self.colors[i]     = .5;
      self.colors[i + 1] = .5;
      self.colors[i + 2] = .5;
      i += 3;
    }
  }
  self.geometry.attributes.position.needsUpdate = true;
  self.geometry.attributes.color.needsUpdate = true;
  self.geometry.computeBoundingSphere();
};
DotMatrix.prototype.animate = function () {
  this.render();
  requestAnimationFrame(this.animate.bind(this));
};
DotMatrix.prototype.render = function () {
  this.updateGeometry();
  this.renderer.render(this.scene, this.camera);
};

function mod (n, d) { return ((n%d)+d)%d; }
function randInt (max) { return Math.floor(Math.random()*max); }

new DotMatrix({el: document.getElementById('dot-matrix')}).animate();
