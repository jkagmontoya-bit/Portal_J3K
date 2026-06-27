# Reglas de Proyecto y Reglas de Negocio J3K (Antigravity Rules)

> **MÁXIMA AUTORIDAD:** Antes de hacer cualquier cambio en el proyecto, el agente debe leer este documento. Si alguna solicitud entra en conflicto con las reglas aquí descritas, el agente debe indicarlo antes de modificar el código.

## 1. Arquitectura del Proyecto
- **Frontend Vanilla:** El proyecto utiliza HTML5, CSS3 y JavaScript puro (Vanilla JS). NO se utiliza React, Vue, Angular, ni TailwindCSS a menos que el usuario lo solicite expresamente.
- **Base de Datos y Persistencia:** Se utiliza `localforage` (IndexDB/LocalStorage) para respaldo local y persistencia sin conexión, sincronizado con Firebase para el guardado en la nube.
- **Componentes / Módulos:** La arquitectura se divide en archivos HTML individuales por módulo (ej. `cotizacion.html`, `expedientes.html`, `dashboard.html`) ubicados en la carpeta `public/modules/`.
- **Lógica de Negocio JS:** La lógica pesada reside en los archivos JavaScript externos en `public/js/` (ej. `cotizacion.js`, `expedientes.js`). **CRÍTICO:** Los módulos en HTML pueden contener código JS embebido que interactúa o duplica funcionalidades, por lo que toda modificación en JS debe verificarse tanto en el archivo `.js` como en las etiquetas `<script>` del archivo `.html` correspondiente.

## 2. Convenciones de Código
- **Estilos Visuales (Bloqueado):** El diseño visual prioriza la usabilidad y los tonos corporativos de J3K (azules y verdes). No modifiques las clases CSS centrales sin confirmación. Todo rediseño debe verse profesional y moderno, usando CSS estándar.
- **Utilidades Globales:** Se debe usar `J3K_UTILS` (ubicado en `utils.js`) para tareas comunes como:
  - Formateo de moneda (`J3K_UTILS.formatSoles`)
  - Escape de HTML (`J3K_UTILS.escapeHTML`)
- **Evitar reescrituras:** Si un módulo (como Dashboard, Cotizaciones, Ventas) ya funciona estable, modifícalo quirúrgicamente. NO reescribas el archivo completo a menos que sea necesario.

## 3. Reglas de Negocio (Operaciones J3K)
### 3.1. Módulo de Cotizaciones
- Las propuestas/cotizaciones cuentan con dos formatos: Simple y Extendida.
- La IA puede autocompletar formularios, pero debe dejar intacta la estructura original de los editores enriquecidos (Quill.js).
- Existe un `J3K_MASTER_PIN` (Clave Maestra) necesario para aprobar, eliminar definitivamente o editar ciertas configuraciones.

### 3.2. Módulo de Expedientes (Compras, Ventas, RH)
- **Vincular Cotización:** En Ventas, es obligatorio que el usuario vincule la cotización (CUI) al inicio. Sin esto, se bloquea la interfaz de los demás pasos.
- **Restricciones de Archivos:**
  - *Factura de Venta:* Máximo 1 archivo permitido. El Responsable Interno debe ser digitado manualmente, no por IA.
  - *Cobranza (PAGO y/o DETRACCION):* Si la operación tiene detracción, permite hasta 2 archivos (Voucher de Pago y Constancia de Detracción). La constancia puede subirse en un segundo momento (después del voucher).
- **Expediente Activo:** Muestra siempre el `CUI | Proveedor/Cliente | Monto`. Solo se debe restringir la edición de un expediente al 100% mediante la solicitud del PIN Maesto (J3K_MASTER_PIN) permitiendo máximo 3 intentos.

## 4. Flujos Contables y Reglas Tributarias (Perú - MYPE)
J3K es una empresa bajo el régimen MYPE en Perú. El sistema debe estar preparado o respetar los siguientes lineamientos:
- **IGV:** El cálculo general es del 18%.
- **Detracciones:** Aplicables a servicios específicos regulados por SUNAT. Requiere constancia de depósito en la cuenta del Banco de la Nación.
- **Recibos por Honorarios (RH):** Retención del 8% a cuenta del Impuesto a la Renta de Cuarta Categoría si el recibo excede los S/ 1,500 y no cuenta con suspensión de 4ta categoría.
- **SIRE (Sistema Integrado de Registros Electrónicos):** Toda estructura de exportación o validación futura de Compras/Ventas deberá considerar el formato RCE y RVIE de SUNAT.
- **PDT 621 y Formulario 710:** Las declaraciones mensuales y anuales requerirán que los expedientes estén completos (100% validados en el sistema).
- **PLAME (Planilla Electrónica):** Futura integración para los recibos por honorarios y contratos laborales.

## 5. Metodología de Trabajo del Agente
1. **Analiza el impacto:** Revisa cómo un cambio en el backend/estado afecta a los archivos `.html` y `.js`.
2. **Edita de forma asilada:** Usa la herramienta de reemplazo múltiple o edición de líneas precisas para evitar corromper los scripts completos.
3. **Pregunta antes de borrar:** Nunca asumas que puedes eliminar un flujo de trabajo. Si algo es ambiguo, genera un `implementation_plan.md` y solicita feedback (pregunta abierta al usuario).

*(Nota: Este documento está diseñado para ser expandido por el usuario hasta alcanzar el nivel de detalle necesario para el proyecto).*
