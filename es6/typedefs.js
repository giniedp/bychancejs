var Bychance;
(function (Bychance) {
    class Anchor {
        constructor(index, position, tag, chunk = null) {
            this.index = index;
            this.position = position;
            this.tag = tag;
            this.chunk = chunk;
        }
        createForChunk(chunk) {
            return new Anchor(this.index, this.position, this.tag, chunk);
        }
        get absolutePosition() {
            if (this.chunk) {
                return Bychance.Vec2.add(this.chunk.position, this.position);
            }
            else {
                return Bychance.Vec2.clone(this.position);
            }
        }
    }
    Bychance.Anchor = Anchor;
})(Bychance || (Bychance = {}));

var Bychance;
(function (Bychance) {
    class Chunk {
        constructor(template) {
            this.template = template;
            this.contexts = [];
            this.anchors = [];
            this.position = Bychance.Vec2.create();
            // Copy contexts from template.
            for (let context of template.contexts) {
                this.contexts.push(context.createForChunk(this));
            }
            // Copy anchors from template.
            for (let anchor of template.anchors) {
                this.anchors.push(anchor.createForChunk(this));
            }
        }
        getAlignedContextCount() {
            let targetCount = 0;
            for (let context of this.contexts) {
                if (context.target)
                    targetCount++;
            }
            return targetCount;
        }
    }
    Bychance.Chunk = Chunk;
})(Bychance || (Bychance = {}));

var Bychance;
(function (Bychance) {
    var ChunkLibrary;
    (function (ChunkLibrary) {
        function process(data) {
            let builder = new Builder();
            for (let item of data) {
                builder.beginTemplate(item);
                for (let context of item.contexts) {
                    builder.context(context);
                }
                for (let anchor of item.anchors) {
                    builder.anchor(anchor);
                }
                builder.endTemplate();
            }
            return builder.finish();
        }
        ChunkLibrary.process = process;
        class Builder {
            constructor() {
                this.current = null;
                this.templates = [];
            }
            beginTemplate(options) {
                this.endTemplate();
                this.current = new Bychance.ChunkTemplate(options.width, options.height, options.weight, options.tag, !!options.allowRotation);
                this.current.index = this.templates.length;
            }
            context(options) {
                this.current.contexts.push(new Bychance.Context(this.current.contexts.length, { x: options.x, y: options.y }, options.tag));
            }
            anchor(options) {
                this.current.anchors.push(new Bychance.Anchor(this.current.anchors.length, { x: options.x, y: options.y }, options.tag));
            }
            endTemplate() {
                if (this.current) {
                    this.templates.push(this.current);
                }
                this.current = null;
            }
            finish() {
                this.endTemplate();
                let result = { chunks: this.templates };
                this.templates = [];
                return result;
            }
        }
        ChunkLibrary.Builder = Builder;
    })(ChunkLibrary = Bychance.ChunkLibrary || (Bychance.ChunkLibrary = {}));
})(Bychance || (Bychance = {}));

var Bychance;
(function (Bychance) {
    class ChunkTemplate {
        constructor(width = 0, height = 0, weight = 0, tag = null, allowRotation = false) {
            this.width = width;
            this.height = height;
            this.weight = weight;
            this.tag = tag;
            this.allowRotation = allowRotation;
            this.contexts = [];
            this.anchors = [];
            this.index = 0;
        }
    }
    Bychance.ChunkTemplate = ChunkTemplate;
})(Bychance || (Bychance = {}));

var Bychance;
(function (Bychance) {
    class Context {
        constructor(index, position, tag, chunk = null) {
            this.index = index;
            this.position = position;
            this.tag = tag;
            this.chunk = chunk;
            this.target = null;
            this.blocked = false;
        }
        get absolutePosition() {
            return Bychance.Vec2.add(this.chunk.position, this.position);
        }
        createForChunk(chunk) {
            return new Context(this.index, this.position, this.tag, chunk);
        }
        ;
        alignTo(context) {
            this.target = context;
            context.target = this;
        }
        ;
        clearTarget() {
            if (this.target) {
                this.target.target = null;
                this.target = null;
            }
        }
        ;
        isAdjacentTo(otherContext, offset) {
            var distance = Bychance.Vec2.distanceSquared(otherContext.absolutePosition, this.absolutePosition);
            return distance <= offset * offset;
        }
    }
    Bychance.Context = Context;
})(Bychance || (Bychance = {}));

var Bychance;
(function (Bychance) {
    class Level {
        constructor(width, height) {
            this.width = width;
            this.height = height;
            this.chunks = [];
            if (!width || !height) {
                Bychance.Log.warn("width or height is not given or is 0");
            }
        }
        findProcessibleContext() {
            for (let chunk of this.chunks) {
                for (let context of chunk.contexts) {
                    if (!context.blocked)
                        return context;
                }
            }
            return null;
        }
        calculateRectangleByGivenContexts(existingContext, newContext) {
            var existingChunk = existingContext.chunk;
            var possibleChunk = newContext.chunk;
            var chunkPosition = Bychance.Vec2.clone(existingChunk.position);
            chunkPosition = Bychance.Vec2.add(chunkPosition, existingContext.position);
            chunkPosition = Bychance.Vec2.subtract(chunkPosition, newContext.position);
            return Bychance.Rectangle.create(chunkPosition.x, chunkPosition.y, possibleChunk.template.width, possibleChunk.template.height);
        }
        fitsLevelGeometry(existingContext, possibleContext) {
            var levelRectangle = Bychance.Rectangle.create(0, 0, this.width, this.height);
            var possibleChunkRectangle = this.calculateRectangleByGivenContexts(existingContext, possibleContext);
            // Check if possible context stays within level boundaries.
            if (!Bychance.Rectangle.contains(levelRectangle, possibleChunkRectangle)) {
                return false;
            }
            // Check if possible context overlaps with existing chunks.
            for (let chunk of this.chunks) {
                var chunkRectangle = Bychance.Rectangle.create(chunk.position.x, chunk.position.y, chunk.template.width, chunk.template.height);
                if (Bychance.Rectangle.intersects(chunkRectangle, possibleChunkRectangle)) {
                    return false;
                }
            }
            return true;
        }
        addChunk(freeContext, newContext) {
            // Calculate and set position for the new chunk.
            var newChunk = newContext.chunk;
            var newChunkRectangle = this.calculateRectangleByGivenContexts(freeContext, newContext);
            newChunk.position = Bychance.Vec2.clone(newChunkRectangle);
            Bychance.Log.debug(`Added chunk with ID ${newChunk.template.index} to the level at ${newChunk.position}`);
            // Block affected contexts.
            freeContext.blocked = true;
            newContext.blocked = true;
            freeContext.alignTo(newContext);
            // Add the new chunk to the level chunks.
            this.chunks.push(newChunk);
        }
        setStartingChunk(chunk, position) {
            chunk.position = position;
            this.chunks.push(chunk);
        }
        setRandomStartingChunk(chunk, random) {
            Bychance.Log.debug(random.next(), this.width, chunk.template.width);
            var startX = random.next() * (this.width - chunk.template.width);
            var startY = random.next() * (this.height - chunk.template.height);
            var startPosition = Bychance.Vec2.create(startX, startY);
            this.setStartingChunk(chunk, startPosition);
        }
    }
    Bychance.Level = Level;
})(Bychance || (Bychance = {}));

var Bychance;
(function (Bychance) {
    function generate(data, width, height, random = Bychance.Random.Naive) {
        if (data instanceof Array) {
            data = Bychance.ChunkLibrary.process(data);
        }
        let level = new Bychance.Level(width, height);
        let generator = new LevelGenerator();
        generator.generateLevel(data, level, random);
        return level;
    }
    Bychance.generate = generate;
    class LevelGenerator {
        canBeAligned(firstContext, secondContext) {
            return true;
        }
        ;
        getEffectiveWeight(firstContext, secondContext, occurrences) {
            return secondContext.chunk.template.weight;
        }
        ;
        generateLevel(lib, level, random) {
            if (!lib.chunks.length) {
                Bychance.Log.warn("Chunk library is empty");
                return;
            }
            var chunkQuantities = [];
            for (var i = 0; i < lib.chunks.length; i++) {
                chunkQuantities[i] = 0;
            }
            Bychance.Log.debug(`Chunk library has ${lib.chunks.length} chunk template(s).`);
            if (level.findProcessibleContext() == null) {
                Bychance.Log.warn("Level seems not to have a starting chunk. Generating one for you");
                level.setRandomStartingChunk(new Bychance.Chunk(lib.chunks[0]), random);
            }
            // Main level generation loop.
            while (true) {
                var freeContext = level.findProcessibleContext();
                if (freeContext == null) {
                    // TODO After finishing the level generation, start post-processing.
                    Bychance.Log.debug(`Generated level contains ${level.chunks.length} chunks:`);
                    for (i = 0; i < chunkQuantities.length; i++) {
                        Bychance.Log.debug(`  ${(chunkQuantities[i] * 100 / level.chunks.length) | 0}% of the chunks are instances of chunk ${i}`);
                    }
                    return;
                }
                var chunk = freeContext.chunk;
                Bychance.Log.debug("Expanding level at ", freeContext.absolutePosition);
                // Clear candidate lists after each iteration.
                let chunkCandidates = [];
                let contextCandidates = [];
                // Filter chunk library for compatible chunk candidates.
                for (let chunkTemplate of lib.chunks) {
                    let possibleChunk = new Bychance.Chunk(chunkTemplate);
                    for (let possibleContext of possibleChunk.contexts) {
                        if (this.canBeAligned(possibleContext, freeContext) && level.fitsLevelGeometry(freeContext, possibleContext)) {
                            chunkCandidates.push(possibleChunk);
                            contextCandidates.push(possibleContext.index);
                            break;
                        }
                    }
                }
                Bychance.Log.debug(`Found ${chunkCandidates.length} chunk candidates.`, chunkCandidates.map((it) => { return it.template.index; }).join(','));
                // If no candidates are available for the selected context, block and ignore it in further iterations.
                if (chunkCandidates.length == 0) {
                    freeContext.blocked = true;
                    Bychance.Log.debug("Blocked context for further iterations.");
                    continue;
                }
                // Compute effective weights for each chunk candidate.
                let effectiveWeights = [];
                for (let i in chunkCandidates) {
                    let chunk = chunkCandidates[i];
                    effectiveWeights.push(this.getEffectiveWeight(freeContext, chunk.contexts[contextCandidates[i]], chunkQuantities[chunk.template.index]));
                }
                // Compute the sum of all effective chunk weights.
                let totalWeight = 0;
                for (i = 0; i < effectiveWeights.length; i++) {
                    totalWeight += effectiveWeights[i];
                }
                Bychance.Log.debug(`Calculated total weight: ${totalWeight}`);
                // Pick a chunk at random.
                let randomWeight = Math.floor(random.next() * totalWeight);
                Bychance.Log.debug(`Calculated random weight: ${randomWeight}`);
                for (i = 0; i < chunkCandidates.length; i++) {
                    randomWeight -= effectiveWeights[i];
                    if (randomWeight < 0) {
                        // Integrate selected chunk into level.
                        let chunk = chunkCandidates[i];
                        let context = chunk.contexts[contextCandidates[i]];
                        level.addChunk(freeContext, context);
                        chunkQuantities[context.chunk.template.index] = chunkQuantities[context.chunk.template.index] + 1;
                        break;
                    }
                }
            }
        }
        ;
    }
    Bychance.LevelGenerator = LevelGenerator;
})(Bychance || (Bychance = {}));

var Bychance;
(function (Bychance) {
    var Log;
    (function (Log) {
        Log.Enabled = false;
        var consoleDelegate = function (name) {
            if (!self.console || !self.console[name]) {
                return function (msg, ...text) {
                    return "";
                };
            }
            return function (msg, ...text) {
                if (Log.Enabled) {
                    return self.console[name].apply(self.console, arguments);
                }
            };
        };
        Log.log = consoleDelegate('log');
        Log.info = consoleDelegate('info');
        Log.debug = consoleDelegate('debug');
        Log.warn = consoleDelegate('warn');
        Log.error = consoleDelegate('error');
    })(Log = Bychance.Log || (Bychance.Log = {}));
})(Bychance || (Bychance = {}));

var Bychance;
(function (Bychance) {
    var Random;
    (function (Random) {
        Random.Naive = {
            next: function () {
                return Math.random();
            }
        };
    })(Random = Bychance.Random || (Bychance.Random = {}));
})(Bychance || (Bychance = {}));

var Bychance;
(function (Bychance) {
    var Rectangle;
    (function (Rectangle) {
        function create(x, y, width, height) {
            return { x: x, y: y, width: width, height: height };
        }
        Rectangle.create = create;
        function intersects(a, b) {
            return (a.x < (b.x + b.width) &&
                a.y < (b.y + b.height) &&
                (a.x + a.width) > b.x &&
                (a.y + a.height) > b.y);
        }
        Rectangle.intersects = intersects;
        function contains(a, b) {
            return ((a.x <= b.x) &&
                (a.y <= b.y) &&
                (a.x + a.width) >= (b.x + b.width) &&
                (a.y + a.height) >= (b.y + b.height));
        }
        Rectangle.contains = contains;
    })(Rectangle = Bychance.Rectangle || (Bychance.Rectangle = {}));
})(Bychance || (Bychance = {}));

var Bychance;
(function (Bychance) {
    var Vec2;
    (function (Vec2) {
        function clone(other) {
            return { x: other.x, y: other.y };
        }
        Vec2.clone = clone;
        function create(x = 0, y = 0) {
            return { x: x, y: y };
        }
        Vec2.create = create;
        function distance(a, b) {
            var x = a.x - b.x;
            var y = a.y - b.y;
            return Math.sqrt(x * x + y * y);
        }
        Vec2.distance = distance;
        function distanceSquared(a, b) {
            var x = a.x - b.x;
            var y = a.y - b.y;
            return x * x + y * y;
        }
        Vec2.distanceSquared = distanceSquared;
        function add(a, b) {
            return create(a.x + b.x, a.y + b.y);
        }
        Vec2.add = add;
        function subtract(a, b) {
            return create(a.x - b.x, a.y - b.y);
        }
        Vec2.subtract = subtract;
    })(Vec2 = Bychance.Vec2 || (Bychance.Vec2 = {}));
})(Bychance || (Bychance = {}));

//# sourceMappingURL=typedefs.js.map
