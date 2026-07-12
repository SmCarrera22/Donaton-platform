import {
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from "vitest";

const { postToBffMock } = vi.hoisted(() => ({
    postToBffMock: vi.fn(),
}));

vi.mock("@/lib/bff", () => ({
    postToBff: postToBffMock,
}));

import { authService } from "@/services/authService";

describe("authService", () => {
    beforeEach(() => {
        postToBffMock.mockReset();
    });

    describe("register", () => {
        it("debería enviar los datos del usuario al endpoint de registro", async () => {
            const formData = {
                fullName: "Sebastián Carrera",
                email: "sebastian@donaton.cl",
                password: "Password123!",
                phone: "+56912345678",
                address: "Av. Principal 123",
                region: "Metropolitana",
                comuna: "Santiago",
            };

            const expectedResponse = {
                ok: true,
                status: 201,
                body: {
                    id: 1,
                    name: formData.fullName,
                    email: formData.email,
                },
            };

            postToBffMock.mockResolvedValue(expectedResponse);

            const result = await authService.register(formData);

            expect(postToBffMock).toHaveBeenCalledTimes(1);
            expect(postToBffMock).toHaveBeenCalledWith(
                "/api/register",
                {
                    fullName: formData.fullName,
                    email: formData.email,
                    password: formData.password,
                    phone: formData.phone,
                    address: formData.address,
                    region: formData.region,
                    comuna: formData.comuna,
                }
            );

            expect(result).toEqual(expectedResponse);
        });
    });

    describe("login", () => {
        it("debería enviar las credenciales al endpoint de autenticación", async () => {
            const credentials = {
                email: "usuario@donaton.cl",
                password: "Password123!",
            };

            const expectedResponse = {
                ok: true,
                status: 200,
                body: {
                    token: "jwt-token",
                },
            };

            postToBffMock.mockResolvedValue(expectedResponse);

            const result = await authService.login(credentials);

            expect(postToBffMock).toHaveBeenCalledTimes(1);
            expect(postToBffMock).toHaveBeenCalledWith(
                "/api/login",
                credentials
            );
            expect(result).toEqual(expectedResponse);
        });
    });
});