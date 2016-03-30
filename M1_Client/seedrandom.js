(function (pool, math, width, chunks, significance, overflow, startdenom) {
math['seedrandom'] = function seedrandom(seed, use_entropy) {
  var key = [];
  var arc4;
  seed = mixkey(flatten(
    use_entropy ? [seed, pool] :
    arguments.length ? seed :
    [new Date().getTime(), pool, window], 3), key);

  arc4 = new ARC4(key);

  mixkey(arc4.S, pool);

  math['random'] = function random() {  
    var n = arc4.g(chunks);             
    var d = startdenom;                 
    var x = 0;                          
    while (n < significance) {          
      n = (n + x) * width;              
      d *= width;                       
      x = arc4.g(1);                    
    }
    while (n >= overflow) {             
      n /= 2;                           
      d /= 2;                           
      x >>>= 1;                         
    }
    return (n + x) / d;                 
  };

  // Return the seed that was used
  return seed;
};

function ARC4(key) {
  var t, u, me = this, keylen = key.length;
  var i = 0, j = me.i = me.j = me.m = 0;
  me.S = [];
  me.c = [];

  if (!keylen) { key = [keylen++]; }

  while (i < width) { me.S[i] = i++; }
  for (i = 0; i < width; i++) {
    t = me.S[i];
    j = lowbits(j + t + key[i % keylen]);
    u = me.S[j];
    me.S[i] = u;
    me.S[j] = t;
  }

  me.g = function getnext(count) {
    var s = me.S;
    var i = lowbits(me.i + 1); var t = s[i];
    var j = lowbits(me.j + t); var u = s[j];
    s[i] = u;
    s[j] = t;
    var r = s[lowbits(t + u)];
    while (--count) {
      i = lowbits(i + 1); t = s[i];
      j = lowbits(j + t); u = s[j];
      s[i] = u;
      s[j] = t;
      r = r * width + s[lowbits(t + u)];
    }
    me.i = i;
    me.j = j;
    return r;
  };
  me.g(width);
}

function flatten(obj, depth, result, prop, typ) {
  result = [];
  typ = typeof(obj);
  if (depth && typ == 'object') {
    for (prop in obj) {
      if (prop.indexOf('S') < 5) {
        try { result.push(flatten(obj[prop], depth - 1)); } catch (e) {}
      }
    }
  }
  return (result.length ? result : obj + (typ != 'string' ? '\0' : ''));
}

function mixkey(seed, key, smear, j) {
  seed += '';
  smear = 0;
  for (j = 0; j < seed.length; j++) {
    key[lowbits(j)] =
      lowbits((smear ^= key[lowbits(j)] * 19) + seed.charCodeAt(j));
  }
  seed = '';
  for (j in key) { seed += String.fromCharCode(key[j]); }
  return seed;
}

function lowbits(n) { return n & (width - 1); }
startdenom = math.pow(width, chunks);
significance = math.pow(2, significance);
overflow = significance * 2;

mixkey(math.random(), pool);
})(
  [],   // pool: entropy pool starts empty
  Math, // math: package containing random, pow, and seedrandom
  256,  // width: each RC4 output is 0 <= x < 256
  6,    // chunks: at least six RC4 outputs for each double
  52    // significance: there are 52 significant digits in a double
);