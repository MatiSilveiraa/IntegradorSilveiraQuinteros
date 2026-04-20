using Joki.LogicaNegocio.Enums;
using Joki.LogicaNegocio.ValueObjects;

namespace Joki.LogicaNegocio.Entidades
{
    public abstract class Usuario
    {
        public int UsuarioId { get; set; }
        public Nombre Nombre { get; set; }
        public Apellido Apellido { get; set; }
        public Email Email { get; set; }
        public Contrasena Password { get; set; }
        public string ProveedorAutenticacion { get; set; }
        public DateTime UltimoAcceso { get; set; }
        public Genero Genero { get; set; }
        public DateOnly FechaNacimiento { get; set; }
        public string PasswordHash { get; set; }
        public string Celular { get; set; }
        public string SocialMedia { get; set; }
        public EstadoUsuario Estado { get; set; }

        public virtual ICollection<Notificacion> Notificaciones { get; set; }
        public virtual ICollection<Auditoria> Auditorias { get; set; }

        protected Usuario()
        {
            Nombre = new Nombre();
            Apellido = new Apellido();
            Email = new Email();
            Password = new Contrasena();
            ProveedorAutenticacion = string.Empty;
            PasswordHash = string.Empty;
            Celular = string.Empty;
            SocialMedia = string.Empty;
            Estado = EstadoUsuario.ACTIVO;
            UltimoAcceso = DateTime.Now;
            Notificaciones = new List<Notificacion>();
            Auditorias = new List<Auditoria>();
        }
    }
}
