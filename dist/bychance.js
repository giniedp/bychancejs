var Bychance;
(function (Bychance) {
    var Anchor = (function () {
        function Anchor(index, position, tag, chunk) {
            if (chunk === void 0) { chunk = null; }
            this.index = index;
            this.position = position;
            this.tag = tag;
            this.chunk = chunk;
        }
        Anchor.prototype.createForChunk = function (chunk) {
            return new Anchor(this.index, this.position, this.tag, chunk);
        };
        Object.defineProperty(Anchor.prototype, "absolutePosition", {
            get: function () {
                if (this.chunk) {
                    return Bychance.Vec2.add(this.chunk.position, this.position);
                }
                else {
                    return Bychance.Vec2.clone(this.position);
                }
            },
            enumerable: true,
            configurable: true
        });
        return Anchor;
    }());
    Bychance.Anchor = Anchor;
})(Bychance || (Bychance = {}));

var Bychance;
(function (Bychance) {
    var Chunk = (function () {
        function Chunk(template) {
            this.template = template;
            this.contexts = [];
            this.anchors = [];
            this.position = Bychance.Vec2.create();
            // Copy contexts from template.
            for (var _i = 0, _a = template.contexts; _i < _a.length; _i++) {
                var context = _a[_i];
                this.contexts.push(context.createForChunk(this));
            }
            // Copy anchors from template.
            for (var _b = 0, _c = template.anchors; _b < _c.length; _b++) {
                var anchor = _c[_b];
                this.anchors.push(anchor.createForChunk(this));
            }
        }
        Chunk.prototype.getAlignedContextCount = function () {
            var targetCount = 0;
            for (var _i = 0, _a = this.contexts; _i < _a.length; _i++) {
                var context = _a[_i];
                if (context.target)
                    targetCount++;
            }
            return targetCount;
        };
        return Chunk;
    }());
    Bychance.Chunk = Chunk;
})(Bychance || (Bychance = {}));

var Bychance;
(function (Bychance) {
    var ChunkLibrary;
    (function (ChunkLibrary) {
        function process(data) {
            var builder = new Builder();
            for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
                var item = data_1[_i];
                builder.beginTemplate(item);
                for (var _a = 0, _b = item.contexts; _a < _b.length; _a++) {
                    var context = _b[_a];
                    builder.context(context);
                }
                for (var _c = 0, _d = item.anchors; _c < _d.length; _c++) {
                    var anchor = _d[_c];
                    builder.anchor(anchor);
                }
                builder.endTemplate();
            }
            return builder.finish();
        }
        ChunkLibrary.process = process;
        var Builder = (function () {
            function Builder() {
                this.current = null;
                this.templates = [];
            }
            Builder.prototype.beginTemplate = function (options) {
                this.endTemplate();
                this.current = new Bychance.ChunkTemplate(options.width, options.height, options.weight, options.tag, !!options.allowRotation);
                this.current.index = this.templates.length;
            };
            Builder.prototype.context = function (options) {
                this.current.contexts.push(new Bychance.Context(this.current.contexts.length, { x: options.x, y: options.y }, options.tag));
            };
            Builder.prototype.anchor = function (options) {
                this.current.anchors.push(new Bychance.Anchor(this.current.anchors.length, { x: options.x, y: options.y }, options.tag));
            };
            Builder.prototype.endTemplate = function () {
                if (this.current) {
                    this.templates.push(this.current);
                }
                this.current = null;
            };
            Builder.prototype.finish = function () {
                this.endTemplate();
                var result = { chunks: this.templates };
                this.templates = [];
                return result;
            };
            return Builder;
        }());
        ChunkLibrary.Builder = Builder;
    })(ChunkLibrary = Bychance.ChunkLibrary || (Bychance.ChunkLibrary = {}));
})(Bychance || (Bychance = {}));

var Bychance;
(function (Bychance) {
    var ChunkTemplate = (function () {
        function ChunkTemplate(width, height, weight, tag, allowRotation) {
            if (width === void 0) { width = 0; }
            if (height === void 0) { height = 0; }
            if (weight === void 0) { weight = 0; }
            if (tag === void 0) { tag = null; }
            if (allowRotation === void 0) { allowRotation = false; }
            this.width = width;
            this.height = height;
            this.weight = weight;
            this.tag = tag;
            this.allowRotation = allowRotation;
            this.contexts = [];
            this.anchors = [];
            this.index = 0;
        }
        return ChunkTemplate;
    }());
    Bychance.ChunkTemplate = ChunkTemplate;
})(Bychance || (Bychance = {}));

var Bychance;
(function (Bychance) {
    var Context = (function () {
        function Context(index, position, tag, chunk) {
            if (chunk === void 0) { chunk = null; }
            this.index = index;
            this.position = position;
            this.tag = tag;
            this.chunk = chunk;
            this.target = null;
            this.blocked = false;
        }
        Object.defineProperty(Context.prototype, "absolutePosition", {
            get: function () {
                return Bychance.Vec2.add(this.chunk.position, this.position);
            },
            enumerable: true,
            configurable: true
        });
        Context.prototype.createForChunk = function (chunk) {
            return new Context(this.index, this.position, this.tag, chunk);
        };
        ;
        Context.prototype.alignTo = function (context) {
            this.target = context;
            context.target = this;
        };
        ;
        Context.prototype.clearTarget = function () {
            if (this.target) {
                this.target.target = null;
                this.target = null;
            }
        };
        ;
        Context.prototype.isAdjacentTo = function (otherContext, offset) {
            var distance = Bychance.Vec2.distanceSquared(otherContext.absolutePosition, this.absolutePosition);
            return distance <= offset * offset;
        };
        return Context;
    }());
    Bychance.Context = Context;
})(Bychance || (Bychance = {}));

var Bychance;
(function (Bychance) {
    var Level = (function () {
        function Level(width, height) {
            this.width = width;
            this.height = height;
            this.chunks = [];
            if (!width || !height) {
                Bychance.Log.warn("width or height is not given or is 0");
            }
        }
        Level.prototype.findProcessibleContext = function () {
            for (var _i = 0, _a = this.chunks; _i < _a.length; _i++) {
                var chunk = _a[_i];
                for (var _b = 0, _c = chunk.contexts; _b < _c.length; _b++) {
                    var context = _c[_b];
                    if (!context.blocked)
                        return context;
                }
            }
            return null;
        };
        Level.prototype.calculateRectangleByGivenContexts = function (existingContext, newContext) {
            var existingChunk = existingContext.chunk;
            var possibleChunk = newContext.chunk;
            var chunkPosition = Bychance.Vec2.clone(existingChunk.position);
            chunkPosition = Bychance.Vec2.add(chunkPosition, existingContext.position);
            chunkPosition = Bychance.Vec2.subtract(chunkPosition, newContext.position);
            return Bychance.Rectangle.create(chunkPosition.x, chunkPosition.y, possibleChunk.template.width, possibleChunk.template.height);
        };
        Level.prototype.fitsLevelGeometry = function (existingContext, possibleContext) {
            var levelRectangle = Bychance.Rectangle.create(0, 0, this.width, this.height);
            var possibleChunkRectangle = this.calculateRectangleByGivenContexts(existingContext, possibleContext);
            // Check if possible context stays within level boundaries.
            if (!Bychance.Rectangle.contains(levelRectangle, possibleChunkRectangle)) {
                return false;
            }
            // Check if possible context overlaps with existing chunks.
            for (var _i = 0, _a = this.chunks; _i < _a.length; _i++) {
                var chunk = _a[_i];
                var chunkRectangle = Bychance.Rectangle.create(chunk.position.x, chunk.position.y, chunk.template.width, chunk.template.height);
                if (Bychance.Rectangle.intersects(chunkRectangle, possibleChunkRectangle)) {
                    return false;
                }
            }
            return true;
        };
        Level.prototype.addChunk = function (freeContext, newContext) {
            // Calculate and set position for the new chunk.
            var newChunk = newContext.chunk;
            var newChunkRectangle = this.calculateRectangleByGivenContexts(freeContext, newContext);
            newChunk.position = Bychance.Vec2.clone(newChunkRectangle);
            Bychance.Log.debug("Added chunk with ID " + newChunk.template.index + " to the level at " + newChunk.position);
            // Block affected contexts.
            freeContext.blocked = true;
            newContext.blocked = true;
            freeContext.alignTo(newContext);
            // Add the new chunk to the level chunks.
            this.chunks.push(newChunk);
        };
        Level.prototype.setStartingChunk = function (chunk, position) {
            chunk.position = position;
            this.chunks.push(chunk);
        };
        Level.prototype.setRandomStartingChunk = function (chunk, random) {
            Bychance.Log.debug(random.next(), this.width, chunk.template.width);
            var startX = random.next() * (this.width - chunk.template.width);
            var startY = random.next() * (this.height - chunk.template.height);
            var startPosition = Bychance.Vec2.create(startX, startY);
            this.setStartingChunk(chunk, startPosition);
        };
        return Level;
    }());
    Bychance.Level = Level;
})(Bychance || (Bychance = {}));

var Bychance;
(function (Bychance) {
    function generate(data, width, height, random) {
        if (random === void 0) { random = Bychance.Random.Naive; }
        if (data instanceof Array) {
            data = Bychance.ChunkLibrary.process(data);
        }
        var level = new Bychance.Level(width, height);
        var generator = new LevelGenerator();
        generator.generateLevel(data, level, random);
        return level;
    }
    Bychance.generate = generate;
    var LevelGenerator = (function () {
        function LevelGenerator() {
        }
        LevelGenerator.prototype.canBeAligned = function (firstContext, secondContext) {
            return true;
        };
        ;
        LevelGenerator.prototype.getEffectiveWeight = function (firstContext, secondContext, occurrences) {
            return secondContext.chunk.template.weight;
        };
        ;
        LevelGenerator.prototype.generateLevel = function (lib, level, random) {
            if (!lib.chunks.length) {
                Bychance.Log.warn("Chunk library is empty");
                return;
            }
            var chunkQuantities = [];
            for (var i = 0; i < lib.chunks.length; i++) {
                chunkQuantities[i] = 0;
            }
            Bychance.Log.debug("Chunk library has " + lib.chunks.length + " chunk template(s).");
            if (level.findProcessibleContext() == null) {
                Bychance.Log.warn("Level seems not to have a starting chunk. Generating one for you");
                level.setRandomStartingChunk(new Bychance.Chunk(lib.chunks[0]), random);
            }
            // Main level generation loop.
            while (true) {
                var freeContext = level.findProcessibleContext();
                if (freeContext == null) {
                    // TODO After finishing the level generation, start post-processing.
                    Bychance.Log.debug("Generated level contains " + level.chunks.length + " chunks:");
                    for (i = 0; i < chunkQuantities.length; i++) {
                        Bychance.Log.debug("  " + ((chunkQuantities[i] * 100 / level.chunks.length) | 0) + "% of the chunks are instances of chunk " + i);
                    }
                    return;
                }
                var chunk = freeContext.chunk;
                Bychance.Log.debug("Expanding level at ", freeContext.absolutePosition);
                // Clear candidate lists after each iteration.
                var chunkCandidates = [];
                var contextCandidates = [];
                // Filter chunk library for compatible chunk candidates.
                for (var _i = 0, _a = lib.chunks; _i < _a.length; _i++) {
                    var chunkTemplate = _a[_i];
                    var possibleChunk = new Bychance.Chunk(chunkTemplate);
                    for (var _b = 0, _c = possibleChunk.contexts; _b < _c.length; _b++) {
                        var possibleContext = _c[_b];
                        if (this.canBeAligned(possibleContext, freeContext) && level.fitsLevelGeometry(freeContext, possibleContext)) {
                            chunkCandidates.push(possibleChunk);
                            contextCandidates.push(possibleContext.index);
                            break;
                        }
                    }
                }
                Bychance.Log.debug("Found " + chunkCandidates.length + " chunk candidates.", chunkCandidates.map(function (it) { return it.template.index; }).join(','));
                // If no candidates are available for the selected context, block and ignore it in further iterations.
                if (chunkCandidates.length == 0) {
                    freeContext.blocked = true;
                    Bychance.Log.debug("Blocked context for further iterations.");
                    continue;
                }
                // Compute effective weights for each chunk candidate.
                var effectiveWeights = [];
                for (var i_1 in chunkCandidates) {
                    var chunk_1 = chunkCandidates[i_1];
                    effectiveWeights.push(this.getEffectiveWeight(freeContext, chunk_1.contexts[contextCandidates[i_1]], chunkQuantities[chunk_1.template.index]));
                }
                // Compute the sum of all effective chunk weights.
                var totalWeight = 0;
                for (i = 0; i < effectiveWeights.length; i++) {
                    totalWeight += effectiveWeights[i];
                }
                Bychance.Log.debug("Calculated total weight: " + totalWeight);
                // Pick a chunk at random.
                var randomWeight = Math.floor(random.next() * totalWeight);
                Bychance.Log.debug("Calculated random weight: " + randomWeight);
                for (i = 0; i < chunkCandidates.length; i++) {
                    randomWeight -= effectiveWeights[i];
                    if (randomWeight < 0) {
                        // Integrate selected chunk into level.
                        var chunk_2 = chunkCandidates[i];
                        var context = chunk_2.contexts[contextCandidates[i]];
                        level.addChunk(freeContext, context);
                        chunkQuantities[context.chunk.template.index] = chunkQuantities[context.chunk.template.index] + 1;
                        break;
                    }
                }
            }
        };
        ;
        return LevelGenerator;
    }());
    Bychance.LevelGenerator = LevelGenerator;
})(Bychance || (Bychance = {}));

var Bychance;
(function (Bychance) {
    var Log;
    (function (Log) {
        Log.Enabled = false;
        var consoleDelegate = function (name) {
            if (!self.console || !self.console[name]) {
                return function (msg) {
                    var text = [];
                    for (var _i = 1; _i < arguments.length; _i++) {
                        text[_i - 1] = arguments[_i];
                    }
                    return "";
                };
            }
            return function (msg) {
                var text = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    text[_i - 1] = arguments[_i];
                }
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
        function create(x, y) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
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

//# sourceMappingURL=bychance.js.map
