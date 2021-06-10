const hexToHSL = (hex) => {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  r = parseInt(result[1], 16);
  g = parseInt(result[2], 16);
  b = parseInt(result[3], 16);
  r /= 255, g /= 255, b /= 255;
  var max = Math.max(r, g, b), min = Math.min(r, g, b);
  var h, s, l = (max + min) / 2;
  if(max == min){
  h = s = 0; // achromatic
  }else{
  var d = max - min;
  s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  switch(max){
  case r: h = (g - b) / d + (g < b ? 6 : 0); break;
  case g: h = (b - r) / d + 2; break;
  case b: h = (r - g) / d + 4; break;
  }
  h /= 6;
  }
  var HSL = new Object();
  HSL['h']=h * 360;
  HSL['s']=s * 100;
  HSL['l']=l * 100;
  return HSL;
  }


  const hslToHex = (h, s, l) => {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  }

  const getHSL = () => {
    const colors = {}
    raw.split('colors.')
    .forEach(colorSet => {
      let hexes = colorSet.match(/#[A-Z0-9]+/g)
      if (!hexes?.length) return
      colors[colorSet.split('\n')[0]] = colorSet.match(/#[A-Z0-9]+/g).map(color => hexToHSL(color))
    })

    return colors
  }

  const calc = (hsls, key) => {
    let keys =Object.keys(hsls)
    let totalDiff = {};
    keys.forEach((set, index) => {
      let diff = 0;
      hsls[set].forEach((color, index) => {
        if(hsls[set][index + 1]) {
          diff += (color[key] - hsls[set][index + 1][key])
        }
        
      })
      totalDiff[set] = diff / 10
    })

    totalDiff.total = Object.values(totalDiff).reduce((a, b) => a + b) / 22
    totalDiff.start = Object.keys(hsls).map(set => hsls[set][0][key]).reduce((a, b) => a + b) / 22
    totalDiff.end = Object.keys(hsls).map(set => hsls[set][hsls[set].length - 1][key]).reduce((a, b) => a + b) / 22
    return totalDiff
  }

  const whereToStart = (value, type) => {
    if (type === 's') {
      let values = []
      let first = 97
      for (let i = 0; i < 10; i++) {
        if (i > 0) {
          first -= 7.4
        }
        values.push(first)
      }

      var closest = values.reduce(function(prev, curr) {
        return (Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev);
      });

      let start = values.indexOf(closest)


      return start
    }
  }

  const shade = (color, saturationFactor, lightFactor) => {
    let s = saturationFactor
    let l = lightFactor
    console.log(s, l)
    let hsl = hexToHSL(color)
    let start = whereToStart(hsl.l, 's')
    let currentS = hsl.s
    let currentL = hsl.l
    let globalCount = 0
    let final = []
    for (let i = 0; i < (10 - start); i++) {
      globalCount++
      if (i !== 0) {
        currentS -= s
        currentL -= l
      }
      final.push(hslToHex(hsl.h, currentS, currentL))
    }
    if (globalCount < 10) {
      let ogS = hsl.s
      let ogL = hsl.l 
      for (let i = 1; i < (11 - globalCount); i++) {
        if (ogS + s <= 100) ogS += s
        else ogS = 100
        if (ogL + l <= 100) ogL += l 
        else ogL = 100
        final.unshift(hslToHex(hsl.h, ogS, ogL))
      }
    }
    return final
  }

  module.exports = {
    shade
  }