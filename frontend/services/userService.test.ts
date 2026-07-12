import {
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from "vitest";

const {
    getFromBffMock,
    putToBffMock,
} = vi.hoisted(() => ({
    getFromBffMock: vi.fn(),
    putToBffMock: vi.fn(),
}));

vi.mock("@/lib/bff", () => ({
    getFromBff: getFromBffMock,
    putToBff: putToBffMock,
}));

import { userService } from "@/services/userService";
import type { UserProfile } from "@/types/user";

describe("userService", () => {
    beforeEach(() => {
        getFromBffMock.mockReset();
        putToBffMock.mockReset();
    });

    describe("getCurrentProfile", () => {
        it("debería solicitar el perfil del usuario autenticado", async () => {
            const profile: UserProfile = {
                id: 1,
                name: "Sebastián Carrera",
                email: "sebastian@donaton.cl",
                phone: "+56912345678",
                address: "Av. Principal 123",
                region: "Metropolitana",
                comuna: "Santiago",
                role: "USER",
            };

            const expectedResponse = {
                ok: true,
                status: 200,
                body: profile,
            };

            getFromBffMock.mockResolvedValue(expectedResponse);

            const result = await userService.getCurrentProfile();

            expect(getFromBffMock).toHaveBeenCalledTimes(1);
            expect(getFromBffMock).toHaveBeenCalledWith(
                "/api/users/me"
            );
            expect(result).toEqual(expectedResponse);
        });
    });

    describe("updateProfile", () => {
        it("debería actualizar el usuario utilizando su ID", async () => {
            const userId = 15;

            const payload = {
                name: "Sebastián Carrera",
                phone: "+56911112222",
                address: "Nueva dirección 456",
                region: "Valparaíso",
                comuna: "Viña del Mar",
            };

            const expectedResponse = {
                ok: true,
                status: 200,
                body: {
                    id: userId,
                    email: "sebastian@donaton.cl",
                    role: "USER",
                    ...payload,
                },
            };

            putToBffMock.mockResolvedValue(expectedResponse);

            const result = await userService.updateProfile(
                userId,
                payload
            );

            expect(putToBffMock).toHaveBeenCalledTimes(1);
            expect(putToBffMock).toHaveBeenCalledWith(
                `/api/users/${userId}`,
                payload
            );
            expect(result).toEqual(expectedResponse);
        });
    });
});