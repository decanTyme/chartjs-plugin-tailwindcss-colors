# chartjs-plugin-tailwindcss-colors

![yarn-current](https://img.shields.io/badge/Yarn-v1-blue) ![npm peer dependency version](https://img.shields.io/npm/dependency-version/chartjs-plugin-tailwindcss-colors/peer/chart.js) [![release](https://img.shields.io/github/v/release/decanTyme/chartjs-plugin-tailwindcss-colors)](https://github.com/decanTyme/chartjs-plugin-tailwindcss-colors/releases) ![npm type definitions](https://img.shields.io/npm/types/chartjs-plugin-tailwindcss-colors) [![npm (latest)](https://img.shields.io/npm/v/chartjs-plugin-tailwindcss-colors/latest)](https://www.npmjs.com/package/chartjs-plugin-tailwindcss-colors/v/latest) [![CI](https://github.com/decanTyme/chartjs-plugin-tailwindcss-colors/actions/workflows/ci.yml/badge.svg)](https://github.com/decanTyme/chartjs-plugin-tailwindcss-colors/actions/workflows/ci.yml)

Colorize your [Chart.js](https://www.chartjs.org/) components using [TailwindCSS](https://tailwindcss.com/)!

This plugin integrates your existing TailwindCSS colors configuration so you can continue to use it on your Chart.js components, without the hassle.

## Getting started

### Installation

```shell
yarn add chartjs-plugin-tailwindcss-colors
```

### Integration

Simply include the plugin inside the `plugins` options in your Chart.js instance's config, provide your TailwindCSS config, and give it some [color options](https://www.chartjs.org/docs/latest/general/colors.html):

```js
import twColorsPlugin from "chartjs-plugin-tailwindcss-colors"
import twConfig from "./tailwind.config"

const config = {
  // ...
  options: {
    color: "black",
    borderColor: "yellow-500",
    backgroundColor: "yellow-500/50", // or #eab308/50
  },
  plugins: [twColorsPlugin(twConfig)],
}

// ...
const chart = new Chart(ctx, config)
```

And that's about it, you're good to go!

> **NOTE**: Only tested with vanilla JS and `react-chartjs-2` using `chart.js@3.7.1` as of initial release. If you encounter any problems with other frameworks and versions of Chart.js, please feel free to drop by or maybe submit to the [issue tracker](https://github.com/decanTyme/chartjs-plugin-tailwindcss-colors/issues)!

## Why did I even make this?

I absolutely _love_ how fast I can prototype things with TailwindCSS. It's like [Bootstrap](https://getbootstrap.com/) on steroids. However, keeping my Chart.js component's colors consistent with my TailwindCSS config has been pretty much a hassle, to say the least. While you can just use TailwindCSS's `resolveConfig` [helper function](https://tailwindcss.com/docs/configuration#referencing-in-java-script), it is far more intuitive and convenient to just use something like `red-500/50` rather than `fullConfig.theme.colors.red[500]`. What's more, it doesn't even handle opacity, which is something I use all the time.

That's why this plugin was made in order to seamlessly blend Chart.js's color options with my TailwindCSS workflow. Now I'm sharing this with all of you!

## Contributing

For making feature requests and other related information, please refer to the [contributing guidelines](CONTRIBUTING.md).

## License

`chartjs-plugin-tailwindcss-colors` is available under the [MIT license](LICENSE).
