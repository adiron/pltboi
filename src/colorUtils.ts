// Modified version of Flexoki by Steph Ango, licensed under MIT.

import { clamp } from "./utils";

// OKLCH conversion functions
function sRGBToLinear(x: number) {
	if (x <= 0.0031308) return x * 12.92;
	return 1.055 * Math.pow(x, 1/2.4) - 0.055;
}

function linearTosRGB(x: number) {
	if (x <= 0.04045) return x / 12.92;
	return Math.pow((x + 0.055) / 1.055, 2.4);
}

function OKLABToLRGB(L: number, a: number, b: number) : [number, number, number] {
	const l = L + 0.3963377774 * a + 0.2158037573 * b;
	const m = L - 0.1055613458 * a - 0.0638541728 * b;
	const s = L - 0.0894841775 * a - 1.2914855480 * b;

	return [
		Math.pow(l, 3),
		Math.pow(m, 3),
		Math.pow(s, 3)
	];
}

function LRGBToOKLAB(L: number, M: number, S: number): [number, number, number] {
	const l = Math.cbrt(L);
	const m = Math.cbrt(M);
	const s = Math.cbrt(S);

	return [
		0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s,
		1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s,
		0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s
	];
}

function OKLCHToOKLAB(L: number, C: number, h: number): [number, number, number] {
	const hRad = h * Math.PI / 180;
	return [L, C * Math.cos(hRad), C * Math.sin(hRad)];
}

function OKLABToOKLCH(L: number, a: number, b: number): [number, number, number] {
	const C = Math.sqrt(a * a + b * b);
	let h = Math.atan2(b, a) * 180 / Math.PI;
	if (h < 0) h += 360;
	return [L, C, h];
}

function hexToRGB(hex: string) : [number, number, number] {
	const r = parseInt(hex.slice(1, 3), 16) / 255;
	const g = parseInt(hex.slice(3, 5), 16) / 255;
	const b = parseInt(hex.slice(5, 7), 16) / 255;
	return [r, g, b];
}

function RGBToHex(r: number, g: number, b: number) {
	const toHex = (x: number) => Math.round(x * 255).toString(16).padStart(2, '0');
	return '#' + toHex(r) + toHex(g) + toHex(b);
}

export function hexToOKLCH(hex: string) {
	const [r, g, b] = hexToRGB(hex).map(linearTosRGB);
	const [L, a, b_] = LRGBToOKLAB(r, g, b);
	return OKLABToOKLCH(L, a, b_);
}

export function OKLCHToHex(L: number, C: number, h: number) {
	const [l, a, b] = OKLCHToOKLAB(L, C, h);
	const [r, g, b_] = OKLABToLRGB(l, a, b);
	const rgb = [r, g, b_].map(sRGBToLinear).map(e => clamp(e, 0, 1)) as [number, number, number];
	return RGBToHex(...rgb);
}


