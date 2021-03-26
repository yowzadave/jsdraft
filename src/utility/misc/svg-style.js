const DEFAULT_ATTRIBUTES = {
  stroke: 'black',
  stroke_width: '1.5px',
  fill: 'white',
  vector_effect: 'non-scaling-stroke',
};

function style_to_svg(style) {
  return {
    ...(style.stroke?.width && { stroke_width: style.stroke.width }),
    ...(style.stroke?.color && { stroke: style.stroke.color }),
    ...(style.stroke?.scaled && { vector_effect: 'none' }),
    ...(style.stroke?.pattern && { stroke_dasharray: style.stroke.pattern }),
    ...(style.stroke?.opacity && { stroke_opacity: style.stroke.opacity }),
    ...(style.fill?.color && { fill: style.fill.color }),
    ...(style.fill?.opacity && { fill_opacity: style.fill.opacity }),
    ...(style.opacity && { opacity: style.opacity }),
  };
}

function svg_v_align(prop) {
  return {
    top: 'hanging',
    middle: 'central',
    bottom: 'baseline',
  }[prop];
}

function svg_h_align(prop) {
  return {
    center: 'middle',
    left: 'start',
    right: 'end',
  }[prop];
}

module.exports = { DEFAULT_ATTRIBUTES, style_to_svg, svg_v_align, svg_h_align };
