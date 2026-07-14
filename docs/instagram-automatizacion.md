# Publicación automática de la historia de descuentos en Instagram

El cron `/api/cron/ig-story` publica cada mañana (7:15 am hora Colombia) la
imagen de `/api/ig/descuentos` como historia en la cuenta de Instagram de
Farmi, usando la API oficial de Meta. El código ya está listo; solo falta la
configuración de cuentas que únicamente el dueño puede hacer. Son 5 pasos, una
sola vez.

## Paso 1: Convertir la cuenta de Instagram a profesional

En la app de Instagram: **Configuración y actividad > Tipo de cuenta y
herramientas > Cambiar a cuenta profesional > Empresa**. Es gratis y no cambia
nada de lo publicado.

## Paso 2: Crear (o usar) una página de Facebook y vincularla

La API exige que la cuenta profesional esté vinculada a una página de
Facebook. Si Farmi no tiene página, se crea gratis en facebook.com/pages/create.
Luego, en Instagram: **Configuración > Centro de cuentas > Cuentas > Agregar
página de Facebook**, o desde la página de Facebook: **Configuración >
Cuentas vinculadas > Instagram**.

## Paso 3: Crear la app en Meta for Developers

1. Entra a https://developers.facebook.com con tu cuenta de Facebook.
2. **My Apps > Create App**. Tipo: **Business**. Nombre: por ejemplo "Farmi".
3. En el panel de la app, agrega el producto **Instagram Graph API** (o
   "Instagram" según la versión del panel).

La app puede quedarse en "modo desarrollo": para publicar en TU PROPIA cuenta
no se necesita revisión de Meta, siempre que tu usuario sea administrador de
la app.

## Paso 4: Obtener el token y el ID (Graph API Explorer)

1. Abre https://developers.facebook.com/tools/explorer y elige tu app.
2. En **Permissions** agrega: `instagram_basic`, `instagram_content_publish`,
   `pages_show_list`, `business_management`.
3. **Generate Access Token** e inicia sesión aceptando los permisos.
4. Consulta `me/accounts` → copia el `id` de tu página de Facebook.
5. Consulta `<id-de-la-pagina>?fields=instagram_business_account` → el `id`
   que devuelve es tu **IG_USER_ID** (un número largo).
6. El token del explorer dura 1 hora. Cámbialo por uno de larga duración
   (60 días) abriendo en el navegador (reemplaza los 3 valores):

   https://graph.facebook.com/v23.0/oauth/access_token?grant_type=fb_exchange_token&client_id=APP_ID&client_secret=APP_SECRET&fb_exchange_token=TOKEN_CORTO

   `APP_ID` y `APP_SECRET` están en el panel de la app, en **App settings >
   Basic**. La respuesta trae tu **IG_ACCESS_TOKEN**.

## Paso 5: Poner las variables en Vercel

En el proyecto de Vercel: **Settings > Environment Variables**, entorno
Production:

| Variable | Valor |
|---|---|
| `IG_USER_ID` | el id numérico del paso 4.5 |
| `IG_ACCESS_TOKEN` | el token largo del paso 4.6 |

Después haz **Redeploy** (o espera al siguiente deploy) para que las tome.

## Probar sin esperar a mañana

Con las variables puestas, abre (reemplaza el secreto por tu `CRON_SECRET`):

    https://www.farmi.com.co/api/cron/ig-story?secret=TU_CRON_SECRET

Si responde `{ "ok": true, "storyId": ... }`, revisa Instagram: la historia
debe estar publicada.

## Cosas para saber

- **El token dura 60 días.** Cuando expire, la historia deja de publicarse y
  el cron responde el error de Meta; se renueva repitiendo el paso 4.6 con el
  token anterior. Para un token permanente se usa un "System User" en Meta
  Business Suite (más pasos; se puede montar después si el hábito funciona).
- **Límite de la API**: Meta permite hasta 100 publicaciones por API cada 24 h
  por cuenta; una historia diaria está lejísimos del límite.
- **Reels**: la API también publica reels, pero requieren un VIDEO alojado en
  una URL pública. Hoy generamos una imagen fija; hacer un video diario es un
  proyecto aparte.
- La imagen publicada es exactamente la de
  https://www.farmi.com.co/api/ig/descuentos (rota a las 7:00 am, hora Bogotá).
