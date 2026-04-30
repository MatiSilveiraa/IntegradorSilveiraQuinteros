using System;
using System.Collections.Generic;
using System.Text;

namespace Joki.LogicaNegocio.Entidades
{
    public class ListaEspera
    {
        public int Id { get; set; }
        public int AlumnoId { get; set; }
        public int GrupoId { get; set; }
        public DateTime FechaSolicitud { get; set; }
    }
}
