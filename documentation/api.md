# JSDraft API

## Sketch features

Sketch instances have a number of built-in feature functions that can be used to add or modify entities. These are categorized according to their function:

* [Geometric features](#geometric-features)
* [Annotations](#annotations)
* [Operations](#operations)
* [Transformations](#transformations)
* [Style features](#style-features)
* [Meta features](#meta-features)


## Geometric features

### _point( x, y )_

Adds a point entity.

```js
const ptSketch = sketch.point(1, 2);
```


### _segment( point, point )_
### _segment( segment, point )_

Adds a segment to a sketch.

```js
// Construction: from two points
const ptSketch = sketch.segment(ptA, ptB);

// Construction: perpendicular to a segment
const ptSketch = sketch.segment(segment, pt);
```


### _arc( point, number, number, number[, boolean] )_
### _arc( point, number, number[, boolean] )_
### _arc( point, point, point )_
### _arc( point, number, point )_
### _arc( segment, segment, number[, boolean] )_

Adds an arc to a sketch.

```js
// Construction: center, radius, start, end, counterclockwise
const arcSketch = sketch.arc([0, 0], 20, 0, Math.PI / 2, true);

// Construction: center, start, angle, counterclockwise
const arcSketch = sketch.arc([0, 0], [10, 0], Math.PI / 2, true);

// Construction: start, through, end
const arcSketch = sketch.arc([0, 0], [5, 5], [10, 10]);

// Construction: start, bulge, end
const arcSketch = sketch.arc([0, 0], 1, [10, 10]);

// Construction: tangent segment, tangent segment, radius, counterclockwise
const arcSketch = sketch.arc([[5, 0], [0, 0]], [[0, 5], [0, 0]], 2, false)
```


### _polycurve( value, value[, value[, ...[, value]]] )_
### _polycurve( [seg[, seg[, ...[, seg]]]] )_

Adds a polycurve (an open chain of segments and arcs) to a sketch.

```js
// Construction: a series of points, bulge values, or fillet points
const polycurveSketch = sketch.polycurve(
  [0, 0],       // An array defining a point
  [3, 3],
  1,            // "bulge" values define an arc between the previous and subsequent points
  [5, 4],
  [10, 2],
  [[15, 8], 1], // An array of [point, radius] can define a vertex with a fillet
  [10, 8],
);

// Construction: a series of segments or arcs
const polycurveSketch = sketch.polycurve(
  [[0, 0], [1, 1]],
  [[1, 1], [2, 0]],
  [[2, 0], [5, 5]],
);
```


### _polyface( value, value, value[, value[, ...[, value]]] )_
### _polyface( [seg[, seg[, ...[, seg]]]] )_
### _polyface( polycurve[, bulge] )_

Adds a polyface (a closed chain of segments and arcs) to a sketch. A polyface can consist of multiple chains, which allows for the definition of void faces.

```js
// Construction: a series of point, bulge values, or fillet points
const polyfaceSketch = sketch.polyface(
  [0, 0],       // An array defining a point
  [3, 3],
  1,            // "bulge" values define an arc between the previous and subsequent points
  [5, 4],
  [10, 2],
  [[15, 8], 1], // An array of [point, radius] can define a vertex with a fillet
  [10, 8],
);

// Construction: a series of segments or arcs
const polyfaceSketch = sketch.polyface(
  [[0, 0], [1, 1]],
  [[1, 1], [2, 0]],
  [[2, 0], [5, 5]],
);

// Construction: create a polyface from a polycurve
const polyfaceSketch = sketch.polyface(
  polycurve,
  1 // An optional bulge value can be provided if the closing segment should be an arc
);
```


### _rectangle( number, number, number, number[, number] )_
### _rectangle( point, number, number[, number] )_
### _rectangle( point, point[, number] )_
### _rectangle( segment, number[, number] )_

Adds a rectangle to a sketch. A rectangle is a "polyface"--a closed chain of segments and arcs.

```js
// Construction: xmin, ymin, xmax, ymax, radius
const rectSketch = sketch.rectangle(1, 1, 11, 6, 1);

// Construction: origin, width, height, radius
const rectSketch = sketch.rectangle([1, 1], 10, 5, 1);

// Construction: corner1, corner2, radius
const rectSketch = sketch.rectangle([1, 1], [11, 6], 1);

// Construction: segment, height, radius
const rectSketch = sketch.rectangle([[1, 1], [11, 1]], 5, 1);
```


### _circle( point, number )_
### _circle( point, point )_
### _circle( point, point, point )_
### _circle( segment, segment, number )_

Adds a circle to a sketch. A circle is a "polyface"--a closed chain of segments and arcs.

```js
// Construction: center, radius
const circSketch = sketch.circle([0, 0], 5);

// Construction: center, point
const circSketch = sketch.circle([0, 0], [5, 0]);

// Construction: three points on circle
const circSketch = sketch.circle([0, 0], [5, 0], [2, 6]);

// Construction: two tangent segments and radius
const circSketch = sketch.circle(
  [[0, -10], [10, 0]],
  [[0, 10], [10, 0]],
  7
);
```


## Annotations

### _text( string, point[, number] )_

Adds a text annotation to a sketch.

```js
// Construction: text, point, rotation
const textSketch = sketch.text("Hello, world!", [0, 0], 25);
// Places the text "Hello, world!" at the sketch's origin.
```


### _aligned_dim( point, point[, string] )_

Places an aligned dimension between two points.

```js
const dimSketch = sketch.aligned_dim([0, 0], [4, 3]);
// Places an aligned dimension string traveling from the origin to [4, 3],
// with a distance label of "5".

const dimSketch = sketch.aligned_dim([0, 0], [4, 3], "right");
// Places the same aligned dimension string, but offset to the opposite side
// as in the previous example.
```


## Operations

### _add_face( polyface, polyface )_

Adds a new polyface to the sketch, created by adding one polyface to another. Useful for creating polyfaces with voids.

```js
const pfaceSketch = sketch.add_face(polyface, face)
```


### _explode()_

Returns a new sketch with all polycurves and polyfaces converted to arcs and segments.

```js
const exploded = sketch.explode();
```


### _fillet( number, polycurve, polycurve )_

Adds a new polycurve to a sketch; the polycurve is created by taking two other polycurves and joining them with an arc of the defined radius.

```js
const pcurveA = new Polycurve([0, 0], [10, 10]);
const pcurveB = new Polycurve([10, 10], [20, 20]);

const filletedSketch = sketch.fillet(2, pcurveA, pcurveB);
```


### _interpolate( polycurve, point, point, array )_

Adds a new polycurve to a sketch; the polycurve is created by taking a polycurve, orienting it along the axis between two points, and connecting the endpoints of each polycurve into a single new polycurve.

```js
const pcurve = new Polycurve([-1, 0], [-1, 1], 1, [1, 1], [1, 0]);

const interpolatedSketch = sketch.interpolate(pcurve, [0, 0], [10, 10], [2, 5, 8]);
```


### _join()_

Returns a new sketch that joins the coincident endpoints of any segments, arcs, or polycurves.

```js
const result = sketch
  .segment([0, 0], [10, 10])
  .segment([50, 50], [40, 40])
  .segment([10, 10], [20, 0])
  .polycurve(
    [-20, -20],
    [-10, 0],
    [0, 0],
  )
  .segment([-20, -20], [20, 0])
  .join();
// Results in a sketch with two entities: a polyface and a segment
```


### _offset( entity, distance )_

Adds a new polycurve or polyface entity to the sketch (depending on the type of entity being offset), offset by the "distance" provided. Can also offset arcs and segments.

```js
const pcurve = new Sketch()
  .polycurve(
    [0, 0],
    1,
    [1, 1],
    -1,
    [3, 3],
  );

const result = sketch
  .offset(pcurve, 0.25);
// Results in a new sketch with the offset polycurve.
```


### _subtract( polyface, polyface )_

Performs a boolean subtraction: subtracts the second polyface from the first, and adds the resulting polyface to the sketch.

```js
const polyfaceA = new Rectangle([0, 0], 10, 5);
const polyfaceB = new Rectangle([8, 2], 5, 3);

const result = sketch.subtract(polyfaceA, polyfaceB);
```


### _union( polyface, polyface )_

Performs a boolean union of the provided polyfaces, and adds the resulting polyface to the sketch.

```js
const polyfaceA = new Rectangle([0, 0], 10, 5);
const polyfaceB = new Rectangle([8, 2], 5, 3);

const result = sketch.union(polyfaceA, polyfaceB);
```


## Transformations

### _orient( point, point, point, point )_

Orients all of the entities in a sketch by picking an origin and a direction point, and then aligning with a target origin and direction point.

```js
// origin, point, target_origin, target_point
const result = sketch.orient([0, 0], [1, 0], [5, 5], [5, 10]);
```


### _rotate( number[, string] )_

Rotates all of the entities in a sketch by a provided angle. The default units are degrees, pass "rad" to the optional second argument to use radians.

```js
const a = sketch.rotate(45);

const b = sketch.rotate(Math.PI / 4, "rad");
```


### _scale( number, number )_

Scales all of the entities in a sketch by the provided x- and y- values. NOTE: this will not correctly perform non-uniform scaling of arcs (i.e., by turning them into ellipses).

```js
const result = sketch.scale(4, 4);
```


### _translate( number, number )_

Translates all of the entities in a sketch by the provided x- and y- values.

```js
const result = sketch.translate(25, -5);
```


## Style features

### _fill( string )_

Applies the given fill color to all entities in a sketch.

```js
const result = sketch.fill("green");
```


### _stroke( string, number )_

Applies the given color and line thickness property to all entities in a sketch.

```js
const result = sketch.stroke("red", 3);
// Results in a red stroke of thickness 3.
```


## Meta features

## Sketch utility functions

### _add( ...args )_

Returns a new sketch with child sketches or entities added.

```js
const sketchC = sketch.add(sketchA, sketchB, entityA, entityB);
```


### _new_

Returns a new blank sketch with no entities or child nodes.

```js
const blank = sketch.new;
```


### _create( options )_

Creates a new blank sketch with optional properties

```js
const mySketch = sketch.create({
  entity,   // An entity associated with this node
  children, // An array of child nodes
});
```


### _clone()_

Returns a clone of a sketch

```js
const clone = sketch.clone();
```


### _shape_

Returns the first available geometric entity in a sketch

```js
const shape = sketch.shape;
```


## Entities

A sketch may contain entities of any of the following types and properties:

- `Point` - `x`, `y`
- `Segment` - `ps`, `pe`
- `Arc` - `pc`, `r`
- `Polycurve` - `vertices`
- `Polyface` - `vertices`
- `Circle` - `pc`, `r`
- `Rectangle` - `xmin`, `ymin`, `xmax`, `ymax`, `r`
- `Text` - `text`, `p`, `rotation`
- `AlignedDim` - `ps`, `pe`, `side`

## Draft

## Render