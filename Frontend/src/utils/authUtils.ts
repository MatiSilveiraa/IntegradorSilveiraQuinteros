export const usuarioBloqueado = (): boolean => {

  const usuario =
    JSON.parse(
      localStorage.getItem(
        "usuario"
      ) || "{}"
    );

  return (
    usuario.bloqueadoPorInasistencias === true
  );

};