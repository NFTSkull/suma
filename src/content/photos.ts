import type { PhotoKey } from "@/types/content";

export type Photo = {
  src: string;
  width: number;
  height: number;
  alt: string;
  credit: { author: string; source: string };
};

/** Fotografía con Licencia Unsplash (uso libre). Sustituir por sesión propia cuando exista. */
export const photos: Record<PhotoKey, Photo> = {
  pilatesEstudio: {
    src: "/images/pilates-estudio.jpg",
    width: 1800,
    height: 1200,
    alt: "Estudio de pilates con reformers y muros verdes, dos personas entrenando",
    credit: { author: "Ahmet Kurt", source: "https://unsplash.com/photos/lriXRISG-m0" },
  },
  pilatesTorre: {
    src: "/images/pilates-torre.jpg",
    width: 1800,
    height: 1200,
    alt: "Mujer realizando un ejercicio suspendida en una torre de pilates",
    credit: { author: "Ahmet Kurt", source: "https://unsplash.com/photos/3FdXv58Wsag" },
  },
  yogaEstudio: {
    src: "/images/yoga-estudio.jpg",
    width: 1800,
    height: 1350,
    alt: "Clase grupal de yoga en un estudio amplio con piso de madera",
    credit: { author: "Autor en Unsplash", source: "https://unsplash.com/photos/NlNYWD3ONXc" },
  },
  spaAlberca: {
    src: "/images/spa-alberca.jpg",
    width: 1800,
    height: 1200,
    alt: "Interior de spa con madera cálida y escalones que descienden al agua",
    credit: { author: "Antonio Araujo", source: "https://unsplash.com/photos/i1wR9DiCABc" },
  },
  spaCabina: {
    src: "/images/spa-cabina.jpg",
    width: 1600,
    height: 1067,
    alt: "Cabina de masaje limpia y luminosa lista para una sesión",
    credit: { author: "Jakub Klucký", source: "https://unsplash.com/photos/oAvwAKFiU7Q" },
  },
  fitnessClase: {
    src: "/images/fitness-clase.jpg",
    width: 1800,
    height: 1200,
    alt: "Grupo entrenando con los brazos extendidos en una clase de estudio",
    credit: { author: "Christian Harb", source: "https://unsplash.com/photos/OV3PU7FD6Fc" },
  },
  marcaSerum: {
    src: "/images/marca-serum.jpg",
    width: 1800,
    height: 1200,
    alt: "Frasco de sérum con gotero sobre una superficie rosa",
    credit: { author: "Maria Lupan", source: "https://unsplash.com/photos/BlcA2-o-7IM" },
  },
  marcaProductos: {
    src: "/images/marca-productos.jpg",
    width: 1800,
    height: 1200,
    alt: "Productos de cuidado personal sobre una bandeja de mármol con fondo beige",
    credit: { author: "Autor en Unsplash", source: "https://unsplash.com/photos/V2Ks2FTkdEk" },
  },
  retiroSauna: {
    src: "/images/retiro-sauna.jpg",
    width: 1800,
    height: 1200,
    alt: "Sauna de madera con ventanal hacia un bosque",
    credit: { author: "Clay Banks", source: "https://unsplash.com/photos/xY6H6qv6HmI" },
  },
  retiroMontana: {
    src: "/images/retiro-montana.jpg",
    width: 1800,
    height: 1013,
    alt: "Centro de retiro entre montañas cubiertas de vegetación",
    credit: { author: "Autor en Unsplash", source: "https://unsplash.com/photos/gguzGuQ0Fdg" },
  },
  profesionalMasaje: {
    src: "/images/profesional-masaje.jpg",
    width: 1800,
    height: 2700,
    alt: "Manos de una terapeuta durante un masaje de espalda",
    credit: { author: "Jakub Klucký", source: "https://unsplash.com/photos/7yeqemd-p90" },
  },
};
