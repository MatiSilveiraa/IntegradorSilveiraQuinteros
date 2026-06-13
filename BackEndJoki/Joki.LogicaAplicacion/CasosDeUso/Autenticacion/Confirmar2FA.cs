using Joki.CasoUsoCompartida.DTOs.Autenticacion;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Autenticacion;
using Joki.LogicaNegocio.Excepciones;
using Joki.LogicaNegocio.InterfacesRepositorio;
using OtpNet;

namespace Joki.LogicaAplicacion.CasosDeUso.Autenticacion
{
    public class Confirmar2FA : IConfirmar2FA
    {
        private readonly IRepositorioUsuario _repositorioUsuario;

        public Confirmar2FA(IRepositorioUsuario repositorioUsuario)
        {
            _repositorioUsuario = repositorioUsuario;
        }

        public void Ejecutar(
            int usuarioId,
            Confirmar2FARequest request)
        {
            var usuario =
                _repositorioUsuario.ObtenerPorId(usuarioId);

            if (usuario == null)
            {
                throw new LogicaNegocioException(
                    "Usuario no encontrado");
            }

            if (string.IsNullOrWhiteSpace(usuario.TwoFactorSecret))
            {
                throw new LogicaNegocioException(
                    "Debe generar primero la configuración 2FA");
            }

            var secretBytes =
                Base32Encoding.ToBytes(usuario.TwoFactorSecret);

            var totp =
                new Totp(secretBytes);

            bool valido =
                totp.VerifyTotp(
                    request.Codigo,
                    out _,
                    new VerificationWindow(
                        previous: 1,
                        future: 1));

            if (!valido)
            {
                throw new LogicaNegocioException(
                    "Código 2FA inválido");
            }

            usuario.TwoFactorEnabled = true;

            _repositorioUsuario.Modificar(usuario);
        }
    }
}