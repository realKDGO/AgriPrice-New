import { db } from "../config/db.js";
import { currentPrices } from "../services/priceService.js";
import { generateForecast } from "../services/forecastService.js";
try {
  for (const p of await currentPrices()) {
    try {
      await generateForecast(p.cropId, p.marketId, null);
    } catch (e) {
      if (e.status !== 422) throw e;
    }
  }
} finally {
  await db.$disconnect();
}
