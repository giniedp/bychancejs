(function(){

  var data = [{
    width: 1500, height: 885, weight: 0, allowRotation: false, tag: "room_00",
    contexts: [{
      x: 800, y: 885, tag: "door"
    }],
    anchors: [{
      x: 750, y: 400, tag: "playerStart"
    }]
  }, {
    width: 1500, height: 885, weight: 1, allowRotation: false, tag: "room_01",
    contexts: [
      { x: 800, y:0, tag: "door" },
      { x: 800, y:885, tag: "door" },
      { x: 0, y:440, tag: "door" },
      { x: 1500, y:440, tag: "door" }
    ],
    anchors: [
      { x: 1100, y: 398, tag: "enemy" },
      { x: 120, y: 120, tag: "obstacle" },
      { x: 210, y: 120, tag: "obstacle" },
      { x: 390, y: 660, tag: "obstacle" },
      { x: 840, y: 390, tag: "obstacle" },
      { x: 1200, y: 390, tag: "obstacle" },
      { x: 548, y: 577, tag: "enemy" }
    ]
  }, {
    width: 1500, height: 885, weight: 1, allowRotation: false, tag: "room_02",
    contexts: [
      { x: 800, y: 0, tag: "door" },
      { x: 0, y: 440, tag: "door" },
      { x: 1500, y: 440, tag: "door" }
    ],
    anchors: [
      { x: 281, y: 325, tag: "enemy" },
      { x: 300, y: 210, tag: "obstacle" },
      { x: 660, y: 570, tag: "obstacle" },
      { x: 750, y: 570, tag: "obstacle" },
      { x: 1110, y: 300, tag: "obstacle" },
      { x: 1099, y: 671, tag: "enemy" },
      { x: 1286, y: 158, tag: "enemy" }
    ]
  }, {
    width: 1500, height: 885, weight: 1, allowRotation: false, tag: "room_03",
    contexts: [
      { x: 800, y: 0, tag: "door" },
      { x: 0, y: 440, tag: "door" }
    ],
    anchors: [
      { x: 536, y: 318, tag: "enemy" },
      { x: 300, y: 210, tag: "obstacle" },
      { x: 750, y: 390, tag: "obstacle" },
      { x: 1290, y: 300, tag: "obstacle" },
      { x: 1367, y: 709, tag: "enemy" }
    ]
  }, {
    width: 1500, height: 885, weight: 1, allowRotation: false, tag: "room_04",
    contexts: [
      { x: 800, y: 0, tag: "door" },
      { x: 800, y: 885, tag: "door" },
      { x: 0, y: 440, tag: "door" },
      { x: 1500, y: 440, tag: "door" }  
    ],
    anchors: [
      { x: 680, y: 333, tag: "enemy" },
      { x: 390, y: 210, tag: "obstacle" },
      { x: 480, y: 480, tag: "obstacle" },
      { x: 480, y: 570, tag: "obstacle" },
      { x: 480, y: 660, tag: "obstacle" },
      { x: 1020, y: 210, tag: "obstacle" },
      { x: 1110, y: 210, tag: "obstacle" },
      { x: 1110, y: 570, tag: "obstacle" },
      { x: 1200, y: 570, tag: "obstacle" },
      { x: 906, y: 337, tag: "enemy" },
      { x: 1016, y: 603, tag: "enemy" },
      { x: 296, y: 247, tag: "enemy" }
    ]
  }, {
    width: 1500, height: 885, weight: 1, allowRotation: false, tag: "room_05",
    contexts: [
      { x: 800, y: 0, tag: "door" },
      { x: 800, y: 885, tag: "door" },
      { x: 0, y: 440, tag: "door" },
      { x: 1500, y: 440, tag: "door" }
    ],
    anchors: [
      { x: 400, y: 400, tag: "enemy" },
      { x: 120, y: 120, tag: "obstacle" },
      { x: 390, y: 660, tag: "obstacle" },
      { x: 480, y: 570, tag: "obstacle" },
      { x: 570, y: 300, tag: "obstacle" },
      { x: 570, y: 390, tag: "obstacle" },
      { x: 570, y: 480, tag: "obstacle" },
      { x: 1020, y: 300, tag: "obstacle" },
      { x: 1110, y: 210, tag: "obstacle" },
      { x: 1110, y: 300, tag: "obstacle" },
      { x: 1200, y: 390, tag: "obstacle" },
      { x: 1290, y: 480, tag: "obstacle" }
    ]
  }, {
    width: 1500, height: 885, weight: 1, allowRotation: false, tag: "room_06",
    contexts: [
      { x: 0, y: 440, tag: "door" },
      { x: 1500, y: 440, tag: "door" },
      { x: 800, y: 885, tag: "door" }
    ],
    anchors: [
      { x: 267, y: 693, tag: "enemy" },
      { x: 300, y: 120, tag: "obstacle" },
      { x: 300, y: 210, tag: "obstacle" },
      { x: 300, y: 300, tag: "obstacle" },
      { x: 660, y: 210, tag: "obstacle" },
      { x: 660, y: 300, tag: "obstacle" },
      { x: 660, y: 390, tag: "obstacle" },
      { x: 660, y: 480, tag: "obstacle" },
      { x: 1110, y: 390, tag: "obstacle" },
      { x: 1110, y: 480, tag: "obstacle" },
      { x: 1110, y: 570, tag: "obstacle" },
      { x: 1110, y: 660, tag: "obstacle" },
      { x: 847, y: 153, tag: "enemy" },
      { x: 1351, y: 743, tag: "enemy" }
    ]
  }, {
    width: 1500, height: 885, weight: 100, allowRotation: false, tag: "room_07",
    contexts: [
      { x: 800, y: 885, tag: "door" }
    ],
    anchors: [
      { x: 620, y: 260, tag: "boss" },
    ]
  }];

  describe("LevelGenerator", function() {
    
    it("should simply run without errors ;)", function() {
      //Bychance.Log.Enabled = true
      var level = Bychance.generate(data, 10000, 10000);
      expect(level).not.toBe(null);
    });

  });
}());
