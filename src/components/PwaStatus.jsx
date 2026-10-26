import { useEffect } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";

// Registra el Service Worker y avisa al alumno:
//  - cuando la app ya quedó guardada para usarse sin conexión;
//  - cuando hay una versión nueva del test (al recuperar conexión).
export default function PwaStatus() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisterError(err) {
      console.warn("No se pudo activar el modo sin conexión:", err);
    },
  });

  // El aviso de "listo sin conexión" es informativo: se oculta solo.
  useEffect(() => {
    if (!offlineReady) return;
    const t = setTimeout(() => setOfflineReady(false), 7000);
    return () => clearTimeout(t);
  }, [offlineReady, setOfflineReady]);

  if (needRefresh)
    return (
      <div className="pwa-banner card" role="status">
        <span className="pwa-ic">↻</span>
        <div>
          <b>Hay una versión nueva del test</b>
          <span>Actualiza para verla. Tu progreso no se pierde.</span>
        </div>
        <div className="pwa-actions">
          <button className="btn sm" onClick={() => updateServiceWorker(true)}>Actualizar</button>
          <button className="btn sm ghost" onClick={() => setNeedRefresh(false)}>Luego</button>
        </div>
      </div>
    );

  if (offlineReady)
    return (
      <div className="pwa-banner card ok" role="status">
        <span className="pwa-ic">✓</span>
        <div>
          <b>Listo para usar sin conexión</b>
          <span>Si se va internet, podrás seguir con el test y descargar tu certificado.</span>
        </div>
        <div className="pwa-actions">
          <button className="btn sm ghost" onClick={() => setOfflineReady(false)}>Entendido</button>
        </div>
      </div>
    );

  return null;
}
