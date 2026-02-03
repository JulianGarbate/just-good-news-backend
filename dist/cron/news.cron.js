import cron from "node-cron";
import { nuevasNoticias } from "../services/news.services.js";
let cronTask = null;
export function startNewsCron(schedule = "*/30 * * * *", url, sourceName) {
    if (cronTask) {
        console.log("⚠️ Cron ya está en ejecución");
        return;
    }
    // Ejecutar inmediatamente al iniciar
    console.log("🚀 Ejecutando búsqueda inicial de noticias...");
    nuevasNoticias(url, sourceName).catch(error => {
        console.error("❌ Error en búsqueda inicial:", error);
    });
    cronTask = cron.schedule(schedule, async () => {
        try {
            console.log("⏰ Cron ejecutado");
            await nuevasNoticias(url, sourceName);
        }
        catch (error) {
            console.error("❌ Error en cron:", error);
        }
    });
    console.log("✅ Cron iniciado con schedule:", schedule);
}
export function stopNewsCron() {
    if (cronTask) {
        cronTask.stop();
        cronTask = null;
        console.log("⏹️ Cron detenido");
    }
}
//# sourceMappingURL=news.cron.js.map