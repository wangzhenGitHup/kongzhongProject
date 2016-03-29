	//base64加密
	__Page.appEnv.Base64 = function(str)
	{
		var c1, c2, c3;
		var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";                
		var i = 0, len= str.length, string = '';

		while (i < len)
		{
			c1 = str.charCodeAt(i++) & 0xff;
			if (i == len){
				//取8位的前6位
				string += base64EncodeChars.charAt(c1 >> 2);
				string += base64EncodeChars.charAt((c1 & 0x3) << 4);
				string += "==";
				break;
			}
			c2 = str.charCodeAt(i++);
			if (i == len)
			{
				//取8位的前6位
				string += base64EncodeChars.charAt(c1 >> 2);
				string += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
				string += base64EncodeChars.charAt((c2 & 0xF) << 2);
				string += "=";
				break;
			}
			c3 = str.charCodeAt(i++);
			//将24位分成4组，每组6位
			//取前6位
			string += base64EncodeChars.charAt(c1 >> 2);
			//取第一个字符剩下的后2位和第二个字符的前4位
			string += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
			//取第二个的后4位以及第三个字符的前2位
			string += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
			//取第三个字符剩下的6位
			string += base64EncodeChars.charAt(c3 & 0x3F);
		}
		return string;
	};

	//base64解密
	__Page.appEnv.Base64_Decode = function(str)
	{
		var c1, c2, c3, c4;
		var base64DecodeChars = new Array(
				-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
				-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
				-1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57,
				58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0,  1,  2,  3,  4,  5,  6,
				7,  8,  9,  10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
				25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36,
				37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1,
				-1, -1
		);
		var i = 0, len = str.length, string = '';

		while (i < len)
		{
			do
			{
				c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
			} while (i < len && c1 == -1);

			if (c1 == -1)
			{
				break;
			}
			do
			{
				c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
			} while (i < len && c2 == -1);

			if (c2 == -1)
			{
				break;
			}
			string += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));

			do
			{
				c3 = str.charCodeAt(i++) & 0xff;
				if (c3 == 61)
				{
					return string;
				}
				c3 = base64DecodeChars[c3];
			} while (i < len && c3 == -1);

			if (c3 == -1)
			{
				break;
			}
			string += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));

			do
			{
				c4 = str.charCodeAt(i++) & 0xff;
				if (c4 == 61)
				{
					return string;
				}
				c4 = base64DecodeChars[c4];
			} while (i < len && c4 == -1);

			if (c4 == -1)
			{
				break;
			}
			string += String.fromCharCode(((c3 & 0x03) << 6) | c4);
		}
		return string;
	};
	
//==========================试写新的MD5=======================
//======================原有的那个跟java、c#的对于汉字的散列码不一致=================
	__Page.appEnv.rotateLeft = function(lValue, iShiftBits)
	{
		return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
	};
	
	__Page.appEnv.addUnsigned = function(lX, lY)
	{
		var lX4, lY4, lX8, lY8, lResult;
		lX8 = (lX & 0x80000000);
		lY8 = (lY & 0x80000000);
		lX4 = (lX & 0x40000000);
		lY4 = (lY & 0x40000000);
		lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
		if (lX4 & lY4) return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
		if (lX4 | lY4) {
			if (lResult & 0x40000000) return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
			else return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
		} else {
			return (lResult ^ lX8 ^ lY8);
		}
	};

	__Page.appEnv.F = function(x, y, z)
	{
		return (x & y) | ((~ x) & z);
	}

	__Page.appEnv.G = function(x, y, z)
	{
		return (x & z) | (y & (~ z));
	};

	__Page.appEnv.H = function(x, y, z)
	{
		return (x ^ y ^ z);
	};

	__Page.appEnv.I = function(x, y, z)
	{
		return (y ^ (x | (~ z)));
	}

	__Page.appEnv.FF = function(a, b, c, d, x, s, ac)
	{
		a = this.addUnsigned(a, this.addUnsigned(this.addUnsigned(this.F(b, c, d), x), ac));
		return this.addUnsigned(this.rotateLeft(a, s), b);
	};

	__Page.appEnv.GG = function(a, b, c, d, x, s, ac)
	{
		a = this.addUnsigned(a, this.addUnsigned(this.addUnsigned(this.G(b, c, d), x), ac));
		return this.addUnsigned(this.rotateLeft(a, s), b);
	};

	__Page.appEnv.HH = function(a, b, c, d, x, s, ac)
	{
		a = this.addUnsigned(a, this.addUnsigned(this.addUnsigned(this.H(b, c, d), x), ac));
		return this.addUnsigned(this.rotateLeft(a, s), b);
	};

	__Page.appEnv.II = function(a, b, c, d, x, s, ac) {
		a = this.addUnsigned(a, this.addUnsigned(this.addUnsigned(this.I(b, c, d), x), ac));
		return this.addUnsigned(this.rotateLeft(a, s), b);
	};

	__Page.appEnv.convertToWordArray = function(string)
	{
		var lWordCount;
		var lMessageLength = string.length;
		var lNumberOfWordsTempOne = lMessageLength + 8;
		var lNumberOfWordsTempTwo = (lNumberOfWordsTempOne - (lNumberOfWordsTempOne % 64)) / 64;
		var lNumberOfWords = (lNumberOfWordsTempTwo + 1) * 16;
		var lWordArray = Array(lNumberOfWords - 1);
		var lBytePosition = 0;
		var lByteCount = 0;
		
		while (lByteCount < lMessageLength)
		{
			lWordCount = (lByteCount - (lByteCount % 4)) / 4;
			lBytePosition = (lByteCount % 4) * 8;
			lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
			lByteCount++;
		}
		lWordCount = (lByteCount - (lByteCount % 4)) / 4;
		lBytePosition = (lByteCount % 4) * 8;
		lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
		lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
		lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
		return lWordArray;
	};

	__Page.appEnv.wordToHex = function(lValue)
	{
		var WordToHexValue = "", WordToHexValueTemp = "", lByte, lCount;
		for (lCount = 0; lCount <= 3; lCount++)
		{
			lByte = (lValue >>> (lCount * 8)) & 255;
			WordToHexValueTemp = "0" + lByte.toString(16);
			WordToHexValue = WordToHexValue + WordToHexValueTemp.substr(WordToHexValueTemp.length - 2, 2);
		}
		return WordToHexValue;
	};

	__Page.appEnv.uTF8Encode = function(string)
	{
		string = string.replace(/\x0d\x0a/g, "\x0a");
		var output = "";
		for (var n = 0; n < string.length; n++) {
			var c = string.charCodeAt(n);
			if (c < 128) {
				output += String.fromCharCode(c);
			} else if ((c > 127) && (c < 2048)) {
				output += String.fromCharCode((c >> 6) | 192);
				output += String.fromCharCode((c & 63) | 128);
			} else {
				output += String.fromCharCode((c >> 12) | 224);
				output += String.fromCharCode(((c >> 6) & 63) | 128);
				output += String.fromCharCode((c & 63) | 128);
			}
		}
		return output;
	};

	__Page.appEnv.hex_md5 = function(string)
	{
		var x = Array();
		var k, AA, BB, CC, DD, a, b, c, d;
		var S11=7, S12=12, S13=17, S14=22;
		var S21=5, S22=9 , S23=14, S24=20;
		var S31=4, S32=11, S33=16, S34=23;
		var S41=6, S42=10, S43=15, S44=21;
		string = this.uTF8Encode(string);
		x = this.convertToWordArray(string);
		a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;
		for (k = 0; k < x.length; k += 16) 
		{
			AA = a; BB = b; CC = c; DD = d;
			a = this.FF(a, b, c, d, x[k+0],  S11, 0xD76AA478);
			d = this.FF(d, a, b, c, x[k+1],  S12, 0xE8C7B756);
			c = this.FF(c, d, a, b, x[k+2],  S13, 0x242070DB);
			b = this.FF(b, c, d, a, x[k+3],  S14, 0xC1BDCEEE);
			a = this.FF(a, b, c, d, x[k+4],  S11, 0xF57C0FAF);
			d = this.FF(d, a, b, c, x[k+5],  S12, 0x4787C62A);
			c = this.FF(c, d, a, b, x[k+6],  S13, 0xA8304613);
			b = this.FF(b, c, d, a, x[k+7],  S14, 0xFD469501);
			a = this.FF(a, b, c, d, x[k+8],  S11, 0x698098D8);
			d = this.FF(d, a, b, c, x[k+9],  S12, 0x8B44F7AF);
			c = this.FF(c, d, a, b, x[k+10], S13, 0xFFFF5BB1);
			b = this.FF(b, c, d, a, x[k+11], S14, 0x895CD7BE);
			a = this.FF(a, b, c, d, x[k+12], S11, 0x6B901122);
			d = this.FF(d, a, b, c, x[k+13], S12, 0xFD987193);
			c = this.FF(c, d, a, b, x[k+14], S13, 0xA679438E);
			b = this.FF(b, c, d, a, x[k+15], S14, 0x49B40821);
			a = this.GG(a, b, c, d, x[k+1],  S21, 0xF61E2562);
			d = this.GG(d, a, b, c, x[k+6],  S22, 0xC040B340);
			c = this.GG(c, d, a, b, x[k+11], S23, 0x265E5A51);
			b = this.GG(b, c, d, a, x[k+0],  S24, 0xE9B6C7AA);
			a = this.GG(a, b, c, d, x[k+5],  S21, 0xD62F105D);
			d = this.GG(d, a, b, c, x[k+10], S22, 0x2441453);
			c = this.GG(c, d, a, b, x[k+15], S23, 0xD8A1E681);
			b = this.GG(b, c, d, a, x[k+4],  S24, 0xE7D3FBC8);
			a = this.GG(a, b, c, d, x[k+9],  S21, 0x21E1CDE6);
			d = this.GG(d, a, b, c, x[k+14], S22, 0xC33707D6);
			c = this.GG(c, d, a, b, x[k+3],  S23, 0xF4D50D87);
			b = this.GG(b, c, d, a, x[k+8],  S24, 0x455A14ED);
			a = this.GG(a, b, c, d, x[k+13], S21, 0xA9E3E905);
			d = this.GG(d, a, b, c, x[k+2],  S22, 0xFCEFA3F8);
			c = this.GG(c, d, a, b, x[k+7],  S23, 0x676F02D9);
			b = this.GG(b, c, d, a, x[k+12], S24, 0x8D2A4C8A);
			a = this.HH(a, b, c, d, x[k+5],  S31, 0xFFFA3942);
			d = this.HH(d, a, b, c, x[k+8],  S32, 0x8771F681);
			c = this.HH(c, d, a, b, x[k+11], S33, 0x6D9D6122);
			b = this.HH(b, c, d, a, x[k+14], S34, 0xFDE5380C);
			a = this.HH(a, b, c, d, x[k+1],  S31, 0xA4BEEA44);
			d = this.HH(d, a, b, c, x[k+4],  S32, 0x4BDECFA9);
			c = this.HH(c, d, a, b, x[k+7],  S33, 0xF6BB4B60);
			b = this.HH(b, c, d, a, x[k+10], S34, 0xBEBFBC70);
			a = this.HH(a, b, c, d, x[k+13], S31, 0x289B7EC6);
			d = this.HH(d, a, b, c, x[k+0],  S32, 0xEAA127FA);
			c = this.HH(c, d, a, b, x[k+3],  S33, 0xD4EF3085);
			b = this.HH(b, c, d, a, x[k+6],  S34, 0x4881D05);
			a = this.HH(a, b, c, d, x[k+9],  S31, 0xD9D4D039);
			d = this.HH(d, a, b, c, x[k+12], S32, 0xE6DB99E5);
			c = this.HH(c, d, a, b, x[k+15], S33, 0x1FA27CF8);
			b = this.HH(b, c, d, a, x[k+2],  S34, 0xC4AC5665);
			a = this.II(a, b, c, d, x[k+0],  S41, 0xF4292244);
			d = this.II(d, a, b, c, x[k+7],  S42, 0x432AFF97);
			c = this.II(c, d, a, b, x[k+14], S43, 0xAB9423A7);
			b = this.II(b, c, d, a, x[k+5],  S44, 0xFC93A039);
			a = this.II(a, b, c, d, x[k+12], S41, 0x655B59C3);
			d = this.II(d, a, b, c, x[k+3],  S42, 0x8F0CCC92);
			c = this.II(c, d, a, b, x[k+10], S43, 0xFFEFF47D);
			b = this.II(b, c, d, a, x[k+1],  S44, 0x85845DD1);
			a = this.II(a, b, c, d, x[k+8],  S41, 0x6FA87E4F);
			d = this.II(d, a, b, c, x[k+15], S42, 0xFE2CE6E0);
			c = this.II(c, d, a, b, x[k+6],  S43, 0xA3014314);
			b = this.II(b, c, d, a, x[k+13], S44, 0x4E0811A1);
			a = this.II(a, b, c, d, x[k+4],  S41, 0xF7537E82);
			d = this.II(d, a, b, c, x[k+11], S42, 0xBD3AF235);
			c = this.II(c, d, a, b, x[k+2],  S43, 0x2AD7D2BB);
			b = this.II(b, c, d, a, x[k+9],  S44, 0xEB86D391);
			a = this.addUnsigned(a, AA);
			b = this.addUnsigned(b, BB);
			c = this.addUnsigned(c, CC);
			d = this.addUnsigned(d, DD);
		}
		var tempValue = this.wordToHex(a) + this.wordToHex(b) + this.wordToHex(c) + this.wordToHex(d);
		return tempValue.toLowerCase();
	};
	