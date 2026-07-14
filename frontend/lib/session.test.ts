import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
    clearSession,
    getSession,
    getToken,
    isAuthenticated,
    saveSession,
} from "@/lib/session";
import type { AuthSession } from "@/types/user";

const SESSION_KEY = "donaton_session";

const validSession: AuthSession = {
    token: "jwt-token-de-prueba",
    email: "usuario@donaton.cl",
    role: "USER",
};

describe("session", () => {
    beforeEach(() => {
        sessionStorage.clear();
    });

    afterEach(() => {
        vi.unstubAllGlobals();
        sessionStorage.clear();
    });

    describe("saveSession", () => {
        it("debería guardar una sesión serializada en sessionStorage", () => {
            saveSession(validSession);

            expect(sessionStorage.getItem(SESSION_KEY)).toBe(
                JSON.stringify(validSession)
            );
        });

        it("no debería intentar guardar la sesión cuando window no existe", () => {
            const setItemSpy = vi.spyOn(Storage.prototype, "setItem");

            vi.stubGlobal("window", undefined);

            expect(() => saveSession(validSession)).not.toThrow();
            expect(setItemSpy).not.toHaveBeenCalled();
        });
    });

    describe("getSession", () => {
        it("debería recuperar una sesión válida", () => {
            sessionStorage.setItem(
                SESSION_KEY,
                JSON.stringify(validSession)
            );

            expect(getSession()).toEqual(validSession);
        });

        it("debería retornar null cuando no existe una sesión guardada", () => {
            expect(getSession()).toBeNull();
        });

        it("debería retornar null y eliminar datos JSON inválidos", () => {
            sessionStorage.setItem(SESSION_KEY, "{json-invalido");

            expect(getSession()).toBeNull();
            expect(sessionStorage.getItem(SESSION_KEY)).toBeNull();
        });

        it("debería retornar null cuando window no existe", () => {
            vi.stubGlobal("window", undefined);

            expect(getSession()).toBeNull();
        });
    });

    describe("clearSession", () => {
        it("debería eliminar la sesión almacenada", () => {
            sessionStorage.setItem(
                SESSION_KEY,
                JSON.stringify(validSession)
            );

            clearSession();

            expect(sessionStorage.getItem(SESSION_KEY)).toBeNull();
        });

        it("no debería intentar eliminar la sesión cuando window no existe", () => {
            const removeItemSpy = vi.spyOn(
                Storage.prototype,
                "removeItem"
            );

            vi.stubGlobal("window", undefined);

            expect(() => clearSession()).not.toThrow();
            expect(removeItemSpy).not.toHaveBeenCalled();
        });
    });

    describe("getToken", () => {
        it("debería retornar el token de la sesión guardada", () => {
            saveSession(validSession);

            expect(getToken()).toBe(validSession.token);
        });

        it("debería retornar null cuando no existe una sesión", () => {
            expect(getToken()).toBeNull();
        });
    });

    describe("isAuthenticated", () => {
        it("debería retornar true cuando existe un token", () => {
            saveSession(validSession);

            expect(isAuthenticated()).toBe(true);
        });

        it("debería retornar false cuando no existe un token", () => {
            expect(isAuthenticated()).toBe(false);
        });

        it("debería retornar false cuando el token está vacío", () => {
            saveSession({
                ...validSession,
                token: "",
            });

            expect(isAuthenticated()).toBe(false);
        });
    });
});