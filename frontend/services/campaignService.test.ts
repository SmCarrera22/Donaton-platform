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

import { campaignService } from "@/services/campaignService";
import type { Campaign } from "@/types/campaign";

describe("campaignService", () => {
    beforeEach(() => {
        getFromBffMock.mockReset();
        postToBffMock.mockReset();
    });

    describe("getAll", () => {
        it("debería solicitar todas las campañas", async () => {
            const campaigns: Campaign[] = [
                {
                    id: 1,
                    title: "Campaña de invierno",
                    description: "Recolección de ropa",
                    goalAmount: 1000,
                    collectedAmount: 250,
                    status: "ACTIVA",
                    createdAt: "2026-06-21T16:07:24",
                    endDate: "2026-08-01T00:00:00",
                },
            ];

            const expectedResponse = {
                ok: true,
                status: 200,
                body: campaigns,
            };

            getFromBffMock.mockResolvedValue(expectedResponse);

            const result = await campaignService.getAll();

            expect(getFromBffMock).toHaveBeenCalledTimes(1);
            expect(getFromBffMock).toHaveBeenCalledWith(
                "/api/campaigns"
            );
            expect(result).toEqual(expectedResponse);
        });
    });

    describe("create", () => {
        it("debería enviar una nueva campaña al endpoint correspondiente", async () => {
            const payload = {
                title: "Campaña Navidad",
                description: "Recolección de regalos",
                goalAmount: 1500,
                endDate: "2026-12-20T00:00:00",
            };

            const expectedResponse = {
                ok: true,
                status: 201,
                body: {
                    id: 4,
                    ...payload,
                    collectedAmount: 0,
                    status: "ACTIVA",
                    createdAt: "2026-07-11T20:00:00",
                },
            };

            postToBffMock.mockResolvedValue(expectedResponse);

            const result = await campaignService.create(payload);

            expect(postToBffMock).toHaveBeenCalledTimes(1);
            expect(postToBffMock).toHaveBeenCalledWith(
                "/api/campaigns",
                payload
            );
            expect(result).toEqual(expectedResponse);
        });

        it("debería permitir crear una campaña sin fecha de término", async () => {
            const payload = {
                title: "Campaña permanente",
                description: "Ayuda comunitaria continua",
                goalAmount: 5000,
                endDate: null,
            };

            await campaignService.create(payload);

            expect(postToBffMock).toHaveBeenCalledWith(
                "/api/campaigns",
                payload
            );
        });
    });
});