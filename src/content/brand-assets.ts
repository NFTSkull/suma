/**
 * Registro de assets oficiales de marca.
 *
 * Los archivos oficiales viven en /public/brand/. Registra aquí su ruta y
 * proporción (ancho / alto) para usarlos en header/footer. Mientras un valor
 * sea null, el sitio usa el wordmark tipográfico provisional.
 */
export type BrandAsset = { src: string; ratio: number } | null;

export const brandAssets: {
  logoHorizontal: BrandAsset;
  logoHorizontalOnDark: BrandAsset;
  logoVertical: BrandAsset;
  wordmark: BrandAsset;
  isotipo: BrandAsset;
} = {
  logoHorizontal: null,
  logoHorizontalOnDark: null,
  logoVertical: null,
  wordmark: null,
  isotipo: null,
};
