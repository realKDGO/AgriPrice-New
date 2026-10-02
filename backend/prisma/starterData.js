export const SNAPSHOT = "2026-09-05";
const cropSeed = [
  ["rice", "Rice", "Grain", 45, "rice.jpg"],
  ["tomato", "Tomato", "Vegetable", 65, "tomato.jpg"],
  ["eggplant", "Eggplant", "Vegetable", 58, "eggplant.jpg"],
  ["corn", "Corn", "Grain", 37, "Corn.jpg"],
  ["onion", "Onion", "Vegetable", 90, "Onion.jpg"],
  ["banana", "Banana", "Fruit", 48, "Banana.jpg"],
  ["cabbage", "Cabbage", "Vegetable", 52, "Cabbage.jpg"],
  ["garlic", "Garlic", "Vegetable", 130, "Garlic.jpg"],
];
export const crops = cropSeed.map(([id, name, category, base, image]) => ({
  id,
  name,
  category,
  base,
  image: "/images/" + image,
  status: "Active",
  unit: "kg",
}));
export const markets = [
  ["antipolo", "Antipolo Public Market", "Antipolo City, Rizal", 12, 180],
  ["cainta", "Cainta Public Market", "Cainta, Rizal", 9, 150],
  ["binangonan", "Binangonan Public Market", "Binangonan, Rizal", 18, 240],
  ["taytay", "Taytay Public Market", "Taytay, Rizal", 14, 200],
  ["angono", "Angono Public Market", "Angono, Rizal", 16, 220],
  ["rodriguez", "Rodriguez (Montalban) Market", "Rodriguez, Rizal", 22, 280],
  ["teresa", "Teresa Public Market", "Teresa, Rizal", 20, 260],
].map(([id, name, location, distanceKm, transport]) => ({
  id,
  name,
  location,
  distanceKm,
  transport,
  status: "Active",
}));
export const prices = crops.flatMap((c, i) =>
  markets.map((m, j) => ({
    id: `price-${c.id}-${m.id}`,
    cropId: c.id,
    marketId: m.id,
    price: c.base + [0, 2, -2, 3, -1, 1, 4][j],
    previous:
      c.base + [0, 2, -2, 3, -1, 1, 4][j] - [2, -3, 1, 0, 4, -1, 2, 3][i],
    date: SNAPSHOT,
    status: "Verified",
    source: "MAO record",
  })),
);
prices.push({
  id: "pending-tomato",
  cropId: "tomato",
  marketId: "teresa",
  price: 65,
  previous: 62,
  date: SNAPSHOT,
  status: "Pending",
  source: "Field submission",
});
prices.push({
  id: "pending-rice",
  cropId: "rice",
  marketId: "antipolo",
  price: 47,
  previous: 46,
  date: SNAPSHOT,
  status: "Pending",
  source: "Field submission",
});
export const history = crops.flatMap((c, cropIndex) =>
  markets.flatMap((m, marketIndex) =>
    Array.from({ length: 9 }, (_, i) => {
      const monthOffset = 8 - i;
      const date = new Date(Date.UTC(2026, monthOffset, 15));

      const marketOffset = [0, 2, -2, 3, -1, 1, 4][marketIndex];

      const seasonal =
        Math.sin((i + cropIndex) * 0.9) * 2.1;

      const marketVariation =
        Math.sin((marketIndex + cropIndex) * 1.3) * 0.8;

      const price = Math.max(
        1,
        Math.round(
          (
            c.base -
            4 +
            i * 0.55 +
            seasonal +
            marketOffset +
            marketVariation
          ) * 100,
        ) / 100,
      );

      const previous = Math.max(
        1,
        Math.round(
          (
            price -
            (0.6 + Math.sin(i + cropIndex) * 1.2)
          ) * 100,
        ) / 100,
      );

      return {
        id: `history-${c.id}-${m.id}-${i}`,
        cropId: c.id,
        marketId: m.id,
        date: date.toISOString().slice(0, 10),
        price,
        previous,
        status: "Verified",
      };
    }),
  ),
);
