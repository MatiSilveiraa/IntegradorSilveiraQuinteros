namespace Joki.LogicaNegocio.InterfacesRepositorio
{
    public interface IServicioEmail
    {
        void EnviarNotificacionInscripcion(string emailAlumno, string nombreGrupo);
    }
}