# Changelog

## [0.2.3](https://github.com/decanTyme/chartjs-plugin-tailwindcss-colors/compare/v0.2.2...v0.2.3) (2024-08-10)


### Bug Fixes

* **utils:** Use regex `?:` for safari &lt;16.4 compatibility ([#37](https://github.com/decanTyme/chartjs-plugin-tailwindcss-colors/issues/37)) ([f35b3cf](https://github.com/decanTyme/chartjs-plugin-tailwindcss-colors/commit/f35b3cfd5f61c05e6fcb3bb047cf0ab2d4e5350d))

## [0.2.2](https://github.com/decanTyme/chartjs-plugin-tailwindcss-colors/compare/v0.2.1...v0.2.2) (2024-01-30)


### Bug Fixes

* **deps:** Remove `resolveConfig` from umd bundle ([#31](https://github.com/decanTyme/chartjs-plugin-tailwindcss-colors/issues/31)) ([3e040d8](https://github.com/decanTyme/chartjs-plugin-tailwindcss-colors/commit/3e040d8a30c1be1d3dce7d69ec1f91fcf38aa5e2))
* **package:** Incorrect exports ([#33](https://github.com/decanTyme/chartjs-plugin-tailwindcss-colors/issues/33)) ([c9f54c7](https://github.com/decanTyme/chartjs-plugin-tailwindcss-colors/commit/c9f54c71e397a15c5c85f1222cc7fe52129f626a))

## [0.2.1](https://github.com/decanTyme/chartjs-plugin-tailwindcss-colors/compare/v0.2.0...v0.2.1) (2024-01-22)


### Miscellaneous

* **deps:** Bump `semver` from 5.7.1 to 5.7.2 ([#22](https://github.com/decanTyme/chartjs-plugin-tailwindcss-colors/issues/22)) ([dfc4ee4](https://github.com/decanTyme/chartjs-plugin-tailwindcss-colors/commit/dfc4ee45fa5dd1c77d87f628c646e0e6f2504a4d))
* **deps:** Bump `tough-cookie` from 4.1.2 to 4.1.3 ([#21](https://github.com/decanTyme/chartjs-plugin-tailwindcss-colors/issues/21)) ([9cc51c9](https://github.com/decanTyme/chartjs-plugin-tailwindcss-colors/commit/9cc51c9b4b41a39d727af5df1a3f90f5624d773b))
* **deps:** Bump `word-wrap` from 1.2.3 to 1.2.5 ([#24](https://github.com/decanTyme/chartjs-plugin-tailwindcss-colors/issues/24)) ([b279d71](https://github.com/decanTyme/chartjs-plugin-tailwindcss-colors/commit/b279d719ae1a4e5ef506a135108f26fac4b86b57))
* Migrate to `rollup` ([#16](https://github.com/decanTyme/chartjs-plugin-tailwindcss-colors/issues/16))([#29](https://github.com/decanTyme/chartjs-plugin-tailwindcss-colors/issues/29)) ([8de5671](https://github.com/decanTyme/chartjs-plugin-tailwindcss-colors/commit/8de56710de55299bb6bc03178e8ee58ba495445c))

## [0.2.0](https://github.com/decanTyme/chartjs-plugin-tailwindcss-colors/compare/v0.1.1...v0.2.0) (2023-02-19)


### ⚠ BREAKING CHANGES

* named colors without a valid alpha are no longer parsed.
* **plugin:** hex values without a valid alpha channel are no longer parsed.

### Features

* Add initial support for scriptable options ([04b8533](https://github.com/decanTyme/chartjs-plugin-tailwindcss-colors/commit/04b853350442629287c12d71841c8bef77735a0b))


### Bug Fixes

* **deps:** Bump `json5` from 1.0.1 to 1.0.2 ([#7](https://github.com/decanTyme/chartjs-plugin-tailwindcss-colors/issues/7)) ([29ada4d](https://github.com/decanTyme/chartjs-plugin-tailwindcss-colors/commit/29ada4daf9c4a0ebd2180fd07bb37576dd03fa08))
* **deps:** Bump `semver-regex` from 3.1.3 to 3.1.4 ([#3](https://github.com/decanTyme/chartjs-plugin-tailwindcss-colors/issues/3)) ([ca4c88a](https://github.com/decanTyme/chartjs-plugin-tailwindcss-colors/commit/ca4c88ad184ea37b7325f50ec974932bd3e07318))
* **deps:** Update `caniuse-lite` ([22e10a4](https://github.com/decanTyme/chartjs-plugin-tailwindcss-colors/commit/22e10a4d5daa82bbbec39437b246ea114ad92010))
* **package:** Export a browser-friendly UMD build ([#18](https://github.com/decanTyme/chartjs-plugin-tailwindcss-colors/issues/18)) ([17d0b8d](https://github.com/decanTyme/chartjs-plugin-tailwindcss-colors/commit/17d0b8d3041d134d8cee99f8a1f389bb9e327bbf))
* **plugin:** Allow hex values (w/o alpha) to be returned as-is ([73b55cc](https://github.com/decanTyme/chartjs-plugin-tailwindcss-colors/commit/73b55cc73f15e5c7bcd03cce862b654deeb20a83))


### Documentation

* **readme:** Update badges and some minor edits ([5ab63e0](https://github.com/decanTyme/chartjs-plugin-tailwindcss-colors/commit/5ab63e01fe6e0fad5c875a3bc9b600c21056d2b7))


### Miscellaneous

* Convert the parser to a class ([#19](https://github.com/decanTyme/chartjs-plugin-tailwindcss-colors/issues/19)) ([534362e](https://github.com/decanTyme/chartjs-plugin-tailwindcss-colors/commit/534362e3788f00ee3d898fd12740469326c815ae))
* **deps:** Bump `terser` from 5.12.1 to 5.16.3 ([#12](https://github.com/decanTyme/chartjs-plugin-tailwindcss-colors/issues/12)) ([2ff1975](https://github.com/decanTyme/chartjs-plugin-tailwindcss-colors/commit/2ff19750edb315cd6e90e950c9a929258d35a41c))
* **deps:** Update parcel, jest and typescript, types ([8f12e1d](https://github.com/decanTyme/chartjs-plugin-tailwindcss-colors/commit/8f12e1de4e78f8af947809b1691e3e4d20e790e0))
* **package:** Update keywords ([c40c8e3](https://github.com/decanTyme/chartjs-plugin-tailwindcss-colors/commit/c40c8e32ab45f6c6cca23f9d216437a99daf93ad))
* Remove semantic-release, deps, config ([8be8dac](https://github.com/decanTyme/chartjs-plugin-tailwindcss-colors/commit/8be8dac948d393217d0d3ed284ff12f3b58e83e3))

## [0.1.1](https://github.com/decanTyme/chartjs-plugin-tailwindcss-colors/compare/v0.1.0...v0.1.1) (2023-02-15)


### Features

* Add `fill` multi-color support ([7b2e0fc](https://github.com/decanTyme/chartjs-plugin-tailwindcss-colors/commit/7b2e0fcc142ea21bbf5eeaaddcb1cbdb07490aa5))


### Bug Fixes

* Add missing parsable options ([8b156bc](https://github.com/decanTyme/chartjs-plugin-tailwindcss-colors/commit/8b156bcb88f57181cb9fcdc1b1b092e5a3d1adb3))
* **color-parser:** Remove wrong import ([33c56b7](https://github.com/decanTyme/chartjs-plugin-tailwindcss-colors/commit/33c56b70bd1fd99c484d41fec8c16de8a7fd0c55))
* **color-validator:** Improve handling of non-strings ([d07665c](https://github.com/decanTyme/chartjs-plugin-tailwindcss-colors/commit/d07665c2a26d1a5ad3bdd56ea16bbadd0d81da65))
* **deps:** Update `canvas` to 2.11.0 ([2cd53e8](https://github.com/decanTyme/chartjs-plugin-tailwindcss-colors/commit/2cd53e873cfb18b24e6c3568efb2f2f9dd97ffab))
* **deps:** Update `chart.js` to 3.9.1 and peer dependency semver range ([04f3884](https://github.com/decanTyme/chartjs-plugin-tailwindcss-colors/commit/04f38846139c24d46cf857c582b8a805604637ad))
* **deps:** Update `tailwindcss` peer dependency semver range ([32cbad7](https://github.com/decanTyme/chartjs-plugin-tailwindcss-colors/commit/32cbad7009cca95ec4f2bee0f08a931c1040875e))
* **deps:** Update `tiny-invariant` to 1.3.1 ([a39532e](https://github.com/decanTyme/chartjs-plugin-tailwindcss-colors/commit/a39532ea97498d7aaefa233a29372bacb7581955))
* Fallback to `Chart.defaults` if no color at all is specified ([340445f](https://github.com/decanTyme/chartjs-plugin-tailwindcss-colors/commit/340445f7d231988d404656a8cf209a04d409681b))
* Improve alpha detection regex ([8798cac](https://github.com/decanTyme/chartjs-plugin-tailwindcss-colors/commit/8798cac42231ff7440a29a7898ef75eeab50f6ae))
* **plugin:** Manually set fill target for boolean fill values ([6d55e39](https://github.com/decanTyme/chartjs-plugin-tailwindcss-colors/commit/6d55e398a528f40f7dd2c350e3e4e300dfc5bd00))
* **plugin:** Use `beforeUpdate` hook for subsequent rerender parsing ([f90f059](https://github.com/decanTyme/chartjs-plugin-tailwindcss-colors/commit/f90f0597ddff3cdc0f9294970a00103898921917))
* **plugin:** Use `isValidTwColor()` instead of `includes()` ([673d1e8](https://github.com/decanTyme/chartjs-plugin-tailwindcss-colors/commit/673d1e8cd70686c859c55ebdb7c007ee0390ea99))


### Documentation

* **readme:** Add CDN and some minor edits ([1243c70](https://github.com/decanTyme/chartjs-plugin-tailwindcss-colors/commit/1243c7054582dcf48fb1cd39aa0443e9c4ce473a))
* **readme:** Add NPM latest status badge ([69c2796](https://github.com/decanTyme/chartjs-plugin-tailwindcss-colors/commit/69c2796d49f9ae76388051edd00b7a1779a63a5b))
* **readme:** Re-add package creation reason section ([9aa078b](https://github.com/decanTyme/chartjs-plugin-tailwindcss-colors/commit/9aa078b957752ca9d7f10f47801fffbb31e4f751))


### Miscellaneous

* Add `.gitattributes` ([9ce3289](https://github.com/decanTyme/chartjs-plugin-tailwindcss-colors/commit/9ce32896d4e28f6757be17624d3210933476c20d))
* **codestyle:** Ignore generated changelog ([e3a8a1a](https://github.com/decanTyme/chartjs-plugin-tailwindcss-colors/commit/e3a8a1a23061eaadd45ffe9f9b1ab11bfd5d904b))
* **deps:** Update jest and relevant deps to v29 ([ee5bccb](https://github.com/decanTyme/chartjs-plugin-tailwindcss-colors/commit/ee5bccb992ecb4e16f6efa8e807b1e56c5cdccc1))
* **github-workflows:** Update actions to latest ([79a9581](https://github.com/decanTyme/chartjs-plugin-tailwindcss-colors/commit/79a958180158d336bc53840110109dda2d69d191))
* Migrate to `@semantic-release/github` ([ac4704b](https://github.com/decanTyme/chartjs-plugin-tailwindcss-colors/commit/ac4704bada011a529d49af04144beacd05f9a805))
* Point homepage to README section ([972d019](https://github.com/decanTyme/chartjs-plugin-tailwindcss-colors/commit/972d019abcd4983466aaa74baa1e4f2f38804abf))
