/** @type {import("../../utils").FixtureConfig} */
module.exports = {
  config: {
    type: "scatter",
    data: {
      datasets: [
        {
          data: [
            { x: -3.5, y: -1.2 },
            { x: 2.8, y: 3.1 },
            { x: 0.6, y: -2.9 },
            { x: -1.8, y: 4.2 },
            { x: 4.5, y: -3.4 },
          ],
          pointRadius: 10,
        },
        {
          data: [
            { x: 1.2, y: 2.4 },
            { x: -2.1, y: -0.5 },
            { x: 3.3, y: -4.6 },
            { x: -4.8, y: -1.9 },
            { x: -0.4, y: 5.5 },
          ],
          pointRadius: 10,
        },
      ],
    },
    options: {
      scales: {
        x: { display: false },
        y: { display: false },
      },
      plugins: { legend: false },
    },
  },
}
