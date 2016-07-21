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

  describe("ChunkLibrary.Builder", function() {

    describe("process", function() {
      
      var lib = undefined;

      beforeEach(function() {
        lib = Bychance.ChunkLibrary.process(data);
      });

      it("should build chunk templates from data", function() {
        expect(lib.chunks.length).toBe(data.length);
      });

      it("should apply template attributes", function() {
        lib.chunks.forEach(function(it, index) {
          expect(it.width).toBe(data[index].width);
          expect(it.height).toBe(data[index].height);
          expect(it.weight).toBe(data[index].weight);
          expect(it.tag).toBe(data[index].tag);
          expect(it.allowRotation).toBe(data[index].allowRotation);
        })
      });

      it("should build contexts", function() {
        lib.chunks.forEach(function(chunk, chunkIndex) {
          expect(chunk.contexts.length).toBe(data[chunkIndex].contexts.length);
        });
      });

      it("should apply context attributes", function() {
        lib.chunks.forEach(function(chunk, index) {
          var chunkData = data[index];
          chunk.contexts.forEach(function(context, index) {
            var contextData = chunkData.contexts[index];
            expect(context.position.x).toBe(contextData.x);
            expect(context.position.y).toBe(contextData.y);
            expect(context.tag).toBe(contextData.tag);
          })
        });
      });

      it("should build anchors", function() {
        lib.chunks.forEach(function(chunk, chunkIndex) {
          expect(chunk.anchors.length).toBe(data[chunkIndex].anchors.length);
        });
      });

      it("should apply anchor attributes", function() {
        lib.chunks.forEach(function(chunk, index) {
          var chunkData = data[index];
          chunk.anchors.forEach(function(anchor, index) {
            var anchorData = chunkData.anchors[index];
            expect(anchor.position.x).toBe(anchorData.x);
            expect(anchor.position.y).toBe(anchorData.y);
            expect(anchor.tag).toBe(anchorData.tag);
          })
        });
      });
    });
  });
}());
