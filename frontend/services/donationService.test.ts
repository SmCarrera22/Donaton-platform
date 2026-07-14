import {
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from "vitest";

const {
    getFromBffMock,
    postToBffMock,
} = vi.hoisted(() => ({
    getFromBffMock: vi.fn(),
    postToBffMock: vi.fn(),
}));

vi.mock("@/lib/bff", () => ({
    getFromBff: getFromBffMock,
    postToBff: postToBffMock,
}));

import { donationService } from "@/services/donationService";
import type {
    Donation,
    DonationCreateRequest,
} from "@/types/donation";

describe("donationService", () => {
    beforeEach(() => {
        getFromBffMock.mockReset();
        postToBffMock.mockReset();
    });

    describe("getAll", () => {
        it("debería solicitar todas las donaciones", async () => {
            const donations: Donation[] = [
                {
                    id: 1,
                    donorId: 10,
                    donorType: "PERSONA",
                    resourceType: "ALIMENTOS",
                    quantity: 5,
                    description: "Cajas de alimentos",
                    status: "REGISTRADA",
                    createdAt: "2026-07-11T18:00:00",
                },
            ];

            const expectedResponse = {
                ok: true,
                status: 200,
                body: donations,
            };

            getFromBffMock.mockResolvedValue(expectedResponse);

            const result = await donationService.getAll();

            expect(getFromBffMock).toHaveBeenCalledTimes(1);
            expect(getFromBffMock).toHaveBeenCalledWith(
                "/api/donations"
            );
            expect(result).toEqual(expectedResponse);
        });
    });

    describe("create", () => {
        it("debería enviar una donación al endpoint correspondiente", async () => {
            const payload: DonationCreateRequest = {
                resourceName: "Arroz",
                resourceType: "ALIMENTOS",
                donorType: "PERSONA",
                quantity: 10,
            };

            const expectedResponse = {
                ok: true,
                status: 201,
                body: {
                    id: 20,
                    donorId: 5,
                    donorType: payload.donorType,
                    resourceType: payload.resourceType,
                    quantity: payload.quantity,
                    description: payload.resourceName,
                    status: "REGISTRADA",
                    createdAt: "2026-07-11T19:00:00",
                },
            };

            postToBffMock.mockResolvedValue(expectedResponse);

            const result = await donationService.create(payload);

            expect(postToBffMock).toHaveBeenCalledTimes(1);
            expect(postToBffMock).toHaveBeenCalledWith(
                "/api/donations",
                payload
            );
            expect(result).toEqual(expectedResponse);
        });
    });
});