using Joki.CasoUsoCompartida.DTOs.Autenticacion;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Autenticacion;
using Joki.LogicaNegocio.Excepciones;
using Joki.LogicaNegocio.InterfacesRepositorio;
using OtpNet;
using QRCoder;

namespace Joki.LogicaAplicacion.CasosDeUso.Autenticacion
{
    public class Generar2FA : IGenerar2FA
    {
        private readonly IRepositorioUsuario _repositorioUsuario;

        public Generar2FA(IRepositorioUsuario repositorioUsuario)
        {
            _repositorioUsuario = repositorioUsuario;
        }

        public Generar2FAResponse Ejecutar(int usuarioId)
        {
            var usuario =
                _repositorioUsuario.ObtenerPorId(usuarioId);

            if (usuario == null)
            {
                throw new LogicaNegocioException(
                    "Usuario no encontrado");
            }

            byte[] secretBytes =
                KeyGeneration.GenerateRandomKey(20);

            string secret =
                Base32Encoding.ToString(secretBytes);

            usuario.TwoFactorSecret = secret;
            usuario.TwoFactorEnabled = false;

            _repositorioUsuario.Modificar(usuario);

            string issuer = "Joki Training Team";

            string otpauth =
                $"otpauth://totp/{issuer}:{usuario.Email.Valor}?secret={secret}&issuer={issuer}&digits=6";

            using QRCodeGenerator qrGenerator =
                new QRCodeGenerator();

            using QRCodeData qrCodeData =
                qrGenerator.CreateQrCode(
                    otpauth,
                    QRCodeGenerator.ECCLevel.Q);

            using PngByteQRCode qrCode =
                new PngByteQRCode(qrCodeData);

            byte[] qrBytes =
                qrCode.GetGraphic(20);

            string qrBase64 =
                Convert.ToBase64String(qrBytes);

            return new Generar2FAResponse
            {
                Secret = secret,
                QrCodeBase64 =
                    $"data:image/png;base64,{qrBase64}"
            };
        }
    }
}