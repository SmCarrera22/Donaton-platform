import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from "vitest";

const { getTokenMock } = vi.hoisted(() => ({
    getTokenMock: vi.fn(),
}));

vi.mock("@/lib/session", () => ({
    getToken: getTokenMock,
}));

import {
    deleteFromBff,
    extractErrorMessage,
    getFromBff,
    postToBff,
    putToBff,
} from "@/lib/bff";

type ExampleResponse = {
    id: number;
    name: string;
};

describe("bff", () => {
    const fetchMock = vi.fn();

    beforeEach(() => {
        vi.stubGlobal("fetch", fetchMock);
        fetchMock.mockReset();
        getTokenMock.mockReset();
        getTokenMock.mockReturnValue(null);
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    describe("getFromBff", () => {
        it("debería ejecutar una solicitud GET y leer una respuesta JSON", async () => {
            const responseBody: ExampleResponse = {
                id: 1,
                name: "Recurso de prueba",
            };

            fetchMock.mockResolvedValue(
                new Response(JSON.stringify(responseBody), {
                    status: 200,
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
            );

            const result = await getFromBff<ExampleResponse>(
                "/api/resources/1"
            );

            expect(fetchMock).toHaveBeenCalledWith(
                "/api/resources/1",
                expect.objectContaining({
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
            );

            expect(result).toEqual({
                ok: true,
                status: 200,
                body: responseBody,
            });
        });

        it("debería agregar el token Bearer cuando existe una sesión", async () => {
            getTokenMock.mockReturnValue("token-seguro");

            fetchMock.mockResolvedValue(
                new Response(JSON.stringify([]), {
                    status: 200,
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
            );

            await getFromBff<unknown[]>("/api/resources");

            expect(fetchMock).toHaveBeenCalledWith(
                "/api/resources",
                expect.objectContaining({
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer token-seguro",
                    },
                })
            );
        });

        it("debería informar correctamente una respuesta HTTP no exitosa", async () => {
            const errorBody = {
                message: "Recurso no encontrado",
            };

            fetchMock.mockResolvedValue(
                new Response(JSON.stringify(errorBody), {
                    status: 404,
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
            );

            const result = await getFromBff<ExampleResponse>(
                "/api/resources/999"
            );

            expect(result).toEqual({
                ok: false,
                status: 404,
                body: errorBody,
            });
        });
    });

    describe("postToBff", () => {
        it("debería ejecutar POST con el payload serializado", async () => {
            const payload = {
                name: "Nueva donación",
                quantity: 5,
            };

            fetchMock.mockResolvedValue(
                new Response(
                    JSON.stringify({
                        id: 10,
                        ...payload,
                    }),
                    {
                        status: 201,
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                )
            );

            const result = await postToBff<ExampleResponse>(
                "/api/resources",
                payload
            );

            expect(fetchMock).toHaveBeenCalledWith(
                "/api/resources",
                expect.objectContaining({
                    method: "POST",
                    body: JSON.stringify(payload),
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
            );

            expect(result.ok).toBe(true);
            expect(result.status).toBe(201);
        });
    });

    describe("putToBff", () => {
        it("debería ejecutar PUT con el payload serializado", async () => {
            const payload = {
                name: "Recurso actualizado",
            };

            fetchMock.mockResolvedValue(
                new Response(JSON.stringify(payload), {
                    status: 200,
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
            );

            await putToBff<ExampleResponse>(
                "/api/resources/1",
                payload
            );

            expect(fetchMock).toHaveBeenCalledWith(
                "/api/resources/1",
                expect.objectContaining({
                    method: "PUT",
                    body: JSON.stringify(payload),
                })
            );
        });
    });

    describe("deleteFromBff", () => {
        it("debería ejecutar DELETE y procesar una respuesta sin contenido", async () => {
            fetchMock.mockResolvedValue(
                new Response(null, {
                    status: 204,
                })
            );

            const result = await deleteFromBff<null>(
                "/api/resources/1"
            );

            expect(fetchMock).toHaveBeenCalledWith(
                "/api/resources/1",
                expect.objectContaining({
                    method: "DELETE",
                })
            );

            expect(result).toEqual({
                ok: true,
                status: 204,
                body: null,
            });
        });
    });

    describe("lectura de respuestas", () => {
        it("debería retornar texto cuando la respuesta no es JSON", async () => {
            fetchMock.mockResolvedValue(
                new Response("Error interno del servidor", {
                    status: 500,
                    headers: {
                        "Content-Type": "text/plain",
                    },
                })
            );

            const result = await getFromBff<unknown>("/api/error");

            expect(result.body).toBe(
                "Error interno del servidor"
            );
            expect(result.ok).toBe(false);
            expect(result.status).toBe(500);
        });

        it("debería retornar null cuando la respuesta de texto está vacía", async () => {
            fetchMock.mockResolvedValue(
                new Response("", {
                    status: 200,
                    headers: {
                        "Content-Type": "text/plain",
                    },
                })
            );

            const result = await getFromBff<unknown>("/api/empty");

            expect(result.body).toBeNull();
        });

        it("debería propagar errores de conexión producidos por fetch", async () => {
            fetchMock.mockRejectedValue(
                new TypeError("Failed to fetch")
            );

            await expect(
                getFromBff("/api/unavailable")
            ).rejects.toThrow("Failed to fetch");
        });
    });

    describe("extractErrorMessage", () => {
        const fallback = "Ha ocurrido un error inesperado.";

        it("debería retornar un mensaje recibido como string", () => {
            expect(
                extractErrorMessage(
                    "Credenciales incorrectas",
                    fallback
                )
            ).toBe("Credenciales incorrectas");
        });

        it("debería leer la propiedad message", () => {
            expect(
                extractErrorMessage(
                    {
                        message: "Usuario no encontrado",
                    },
                    fallback
                )
            ).toBe("Usuario no encontrado");
        });

        it("debería leer la propiedad mensaje", () => {
            expect(
                extractErrorMessage(
                    {
                        mensaje: "Datos inválidos",
                    },
                    fallback
                )
            ).toBe("Datos inválidos");
        });

        it("debería leer la propiedad error", () => {
            expect(
                extractErrorMessage(
                    {
                        error: "Acceso denegado",
                    },
                    fallback
                )
            ).toBe("Acceso denegado");
        });

        it("debería usar el fallback cuando el cuerpo es null", () => {
            expect(
                extractErrorMessage(null, fallback)
            ).toBe(fallback);
        });

        it("debería usar el fallback cuando el string está vacío", () => {
            expect(
                extractErrorMessage("   ", fallback)
            ).toBe(fallback);
        });

        it("debería usar el fallback cuando el objeto no tiene un mensaje válido", () => {
            expect(
                extractErrorMessage(
                    {
                        message: "",
                        code: 500,
                    },
                    fallback
                )
            ).toBe(fallback);
        });
    });
});