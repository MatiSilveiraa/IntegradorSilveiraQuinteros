import type { Clase } from "../types";

const indiceDias: Record<string, number> = {
  domingo: 0,
  lunes: 1,
  martes: 2,
  miercoles: 3,
  jueves: 4,
  viernes: 5,
  sabado: 6,
};

function normalizarDia(diaSemana?: string): string {
  return String(diaSemana ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function obtenerMinutos(hora?: string): number {
  if (!hora) {
    return 0;
  }

  const partes = hora.split(":");

  const horas = Number(partes[0]);
  const minutos = Number(partes[1]);

  if (
    Number.isNaN(horas) ||
    Number.isNaN(minutos)
  ) {
    return 0;
  }

  return horas * 60 + minutos;
}

export function obtenerProximaClase(
  clases: Clase[],
): Clase | undefined {
  if (!Array.isArray(clases) || clases.length === 0) {
    return undefined;
  }

  const ahora = new Date();
  const diaActual = ahora.getDay();
  const minutosActuales =
    ahora.getHours() * 60 + ahora.getMinutes();

  const clasesCalculadas = clases
    .map((clase) => {
      const diaNormalizado = normalizarDia(
        clase.diaSemana,
      );

      const diaClase = indiceDias[diaNormalizado];

      if (diaClase === undefined) {
        console.warn(
          "Día de clase no reconocido:",
          clase.diaSemana,
          clase,
        );

        return null;
      }

      const minutosClase = obtenerMinutos(
        clase.horaInicio,
      );

      let distanciaDias = diaClase - diaActual;

      if (distanciaDias < 0) {
        distanciaDias += 7;
      }

      /*
       * Si la clase es hoy pero su horario ya pasó,
       * la próxima ocurrencia es dentro de una semana.
       */
      if (
        distanciaDias === 0 &&
        minutosClase <= minutosActuales
      ) {
        distanciaDias = 7;
      }

      return {
        clase,
        distanciaDias,
        minutosClase,
      };
    })
    .filter(
      (
        resultado,
      ): resultado is {
        clase: Clase;
        distanciaDias: number;
        minutosClase: number;
      } => resultado !== null,
    );

  clasesCalculadas.sort((a, b) => {
    if (a.distanciaDias !== b.distanciaDias) {
      return a.distanciaDias - b.distanciaDias;
    }

    return a.minutosClase - b.minutosClase;
  });

  return clasesCalculadas[0]?.clase;
}