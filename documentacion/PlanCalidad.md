# Plan de Calidad - ERP Ferretería RC

Objetivos según ISO/IEC 25010:

- Disponibilidad: 99% (monitorización y backups en producción).
- Rendimiento: Respuesta < 3s en consultas críticas; optimizaciones de índices y consultas.
- Usabilidad: UI responsive con componentes reutilizables.
- Mantenibilidad: Código modular, documentado y con tests.

Estrategia de pruebas:

- Unit tests para lógica crítica.
- Integración: endpoints principales con Supertest.
- E2E: Cypress en fases posteriores.
