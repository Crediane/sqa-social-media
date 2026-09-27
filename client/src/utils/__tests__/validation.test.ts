import { isEmailValid } from "@/utils/email";
import { isPasswordValid } from "@/utils/password";

/**
 * Testes Unitários (Funções Simples - Jest)
 * Testam funções puras que não envolvem renderização de componentes.
 */

describe("isEmailValid (utils/email.ts)", () => {
  it("deve retornar true para um e-mail em formato válido", () => {
    expect(isEmailValid("usuario@teste.com")).toBe(true);
  });

  it("deve retornar false para um e-mail sem o caractere '@'", () => {
    expect(isEmailValid("usuario-teste.com")).toBe(false);
  });
});

describe("isPasswordValid (utils/password.ts)", () => {
  it("deve retornar true para uma senha forte com 10 caracteres", () => {
    // Atende a todos os critérios: maiúscula, minúscula, número e caractere especial
    expect(isPasswordValid("Abcdefgh1@")).toBe(true);
  });

  // BUG DE FRONTEND CAPTURADO:
  // O requisito diz que a senha deve ter "mínimo 8 caracteres", ou seja,
  // uma senha com EXATAMENTE 8 caracteres que atenda aos demais critérios
  // deveria ser válida. A implementação usa `password.length <= 8`, o que
  // rejeita indevidamente senhas de exatamente 8 caracteres (erro de "off-by-one").
  it("deve retornar true para uma senha válida com exatamente 8 caracteres (requisito: mínimo 8)", () => {
    expect(isPasswordValid("Abcdef1@")).toBe(true);
  });
});
