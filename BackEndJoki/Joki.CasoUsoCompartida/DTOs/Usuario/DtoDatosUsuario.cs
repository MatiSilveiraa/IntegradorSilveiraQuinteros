namespace Joki.CasoUsoCompartida.DTOs.Usuario
{
    public record class DtoDatosUsuario(
        int Id,
        string Nombre,
        string Apellido,
        string Email,
        string Rol
    );
}
