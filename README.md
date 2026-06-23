# Portal J3K

Versión lista para publicar en GitHub Pages.

## Archivo principal

GitHub Pages necesita que el archivo principal se llame:

```text
index.html
```

Este paquete ya lo incluye en la raíz del proyecto.

## Cómo subirlo a GitHub

1. Crea un repositorio en GitHub.
2. Sube todo el contenido de esta carpeta, no la carpeta completa como subcarpeta.
3. Verifica que `index.html` quede en la raíz del repositorio.
4. En GitHub entra a:
   `Settings > Pages`
5. En `Build and deployment`, selecciona:
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/root`
6. Guarda los cambios.
7. Espera unos minutos y GitHub te dará la URL pública del portal.

## Acceso a Contabilidad

```text
Usuario: admin
Contraseña: bonoalcontador
```

## Nota de seguridad

El login actual funciona en HTML/JavaScript local. Es útil para presentación o uso interno básico, pero no es seguridad real para información sensible. Para proteger datos contables reales se recomienda migrar a backend con autenticación segura.
