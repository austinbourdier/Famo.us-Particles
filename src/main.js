define(function(require, exports, module) {
    // import dependencies
    var Transitionable = require('famous/transitions/Transitionable');
    var Surface = require("famous/core/Surface");
    var Engine = require('famous/core/Engine');
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var ImageSurface = require('famous/surfaces/ImageSurface');
    var StateModifier = require('famous/modifiers/StateModifier');
    var PhysicsEngine   = require('famous/physics/PhysicsEngine');
    var Body            = require('famous/physics/bodies/Body');
    var Circle          = require('famous/physics/bodies/Circle');
    var Wall            = require('famous/physics/constraints/Wall');
    var Collision            = require('famous/physics/constraints/Collision');
    var GridLayout = require("famous/views/GridLayout");
    var RenderNode = require('famous/core/RenderNode');
    var Easing = require('famous/transitions/Easing');
    var transitionable = new Transitionable(0);
    var mainContext = Engine.createContext();
    var PhysicsEngine = new PhysicsEngine();
    var node = new RenderNode();
    var physicsOrigin = [0.5, 0.5];
    var radius = 50;

    var ballCollision = new Collision();
    var dimX = window.innerWidth;
    var dimY = window.innerHeight;

    var leftWall = new Wall({
      normal: [1, 0, 0],
      distance: Math.round(dimX / 2.0),
      restitution: 0.5
    });
    var rightWall = new Wall({
      normal: [-1, 0, 0],
      distance: Math.round(dimX / 2.0),
      restitution: 0.5
    });
    var topWall = new Wall({
      normal: [0, 1, 0],
      distance: Math.round(dimY / 2.0),
      restitution: 0.5
    });
    var bottomWall = new Wall({
      normal: [0, -1, 0],
      distance: Math.round(dimY / 2.0),
      restitution: 0.5
    });

    var balls = [];

    var grid = new GridLayout({
     dimensions: [2, 1]
   });

    PhysicsEngine.attach([leftWall, rightWall, topWall, bottomWall], balls);
    var surfaces = [];
    var backgrounds = ['grey', '#FA5C4F'];
    var textColors = ['#FA5C4F', 'grey'];
    var content = ['Click the particles...', '...and become Famo.us!'];
    grid.sequenceFrom(surfaces);
    for(var i = 0; i < 2; i++) {
     surfaces.push(new Surface({
      content: '<h1>' + content[i] + '</h1>',
       properties: {
        textAlign: 'center',
         backgroundColor: backgrounds[i],
         color: textColors[i]
       }
     }));
   }

   function createBall(x, y) {
    var ball = new ImageSurface({
      content: 'http://code.famo.us/assets/famous_logo.svg',classes: ['double-sided'],
      size: [radius * 2, radius * 2],
      properties: {
        backgroundColor: 'grey'
      }
    })
    // ball.setTransform(rotate);
    ball.particle = new Circle({
      radius: radius,

      position: [2*Math.random()*window.innerWidth-window.innerWidth, 2*Math.random()*window.innerHeight-window.innerHeight, 0]
    });
    PhysicsEngine.addBody(ball.particle);
    PhysicsEngine.attach(ballCollision, balls);
    node.add(ball.particle).add(ball);
    balls.push(ball.particle);
    ball.on("click", function () {
      var currentColor = ball.properties.backgroundColor;
      if (currentColor == '#FA5c4F'){
        var nextColor = 'grey';
      } else if (currentColor == 'grey'){
        var nextColor = '#FA5c4F';
      }
      ball.setOptions({properties: {backgroundColor: nextColor, borderRadius: '50px'}});
      ball.particle.setVelocity([Math.random()*5, Math.random()*5, 0]);
    });
  }

  for(var numBalls = 0; numBalls < 10; numBalls++){
    createBall(dimX, dimY);
  }

  var modifier = new Modifier({
    transform: function() {
      var scale = transitionable.get();
      return Transform.scale(scale, scale, 1);
    },
    opacity: function() {
      return transitionable.get();
    },
    origin: physicsOrigin
  })

  mainContext.add(grid);
  mainContext.add(modifier).add(node);
  node.add(PhysicsEngine);
  transitionable.set(1, {
    duration: 2000, curve: Easing.outBack
  });
});

