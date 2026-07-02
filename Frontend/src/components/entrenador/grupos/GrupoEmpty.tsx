export default function GrupoEmpty() {

    return (

        <div
            className="
                rounded-xl
                bg-[#1c2c26]
                border
                border-dashed
                border-[#355b4f]
                p-10
                text-center
            "
        >

            <h2
                className="
                    text-2xl
                    font-semibold
                "
            >
                No tienes grupos asignados
            </h2>

            <p
                className="
                    mt-3
                    text-gray-400
                "
            >
                Cuando un administrador te asigne grupos aparecerán aquí.
            </p>

        </div>

    );

}