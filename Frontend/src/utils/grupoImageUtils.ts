import funcionalImg from "../assets/clases/funcional.jpg";
import crossfitImg from "../assets/clases/crossfit.jpg";
import hiitImg from "../assets/clases/hiit.jpg";
import defaultImg from "../assets/clases/default.jpeg";

export const obtenerImagenGrupo = (
  nombreGrupo: string
) => {

  const nombre =
    nombreGrupo.toLowerCase();

  if (
    nombre.includes(
      "funcional"
    )
  ) {
    return funcionalImg;
  }

  if (
    nombre.includes(
      "crossfit"
    )
  ) {
    return crossfitImg;
  }

  if (
    nombre.includes(
      "hiit"
    )
  ) {
    return hiitImg;
  }

  return defaultImg;
};
