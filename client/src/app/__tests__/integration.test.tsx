import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import SignUp from "@/app/signup/page";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

// Cada teste começa "deslogado": sem isso, o login feito em um teste ficaria salvo
// no localStorage e vazaria para o teste seguinte (o Header mostraria "Sair").
beforeEach(() => {
  window.localStorage.clear();
});

function LoginHarness() {
  const { login } = useAuth();
  return (
    <button onClick={() => login({ id: 1, email: "user@teste.com" })}>
      fake-login
    </button>
  );
}

describe("Integração: Header + AuthContext (persistência de sessão)", () => {
  it("usuário deve permanecer logado (Header com 'Sair') após um reload da página", async () => {
    const { unmount } = render(
      <AuthProvider>
        <LoginHarness />
        <Header />
      </AuthProvider>
    );

    fireEvent.click(screen.getByText("fake-login"));

    await waitFor(() => {
      expect(screen.getByText("Sair")).toBeInTheDocument();
    });

    unmount();
    render(
      <AuthProvider>
        <Header />
      </AuthProvider>
    );

    expect(await screen.findByText("Sair")).toBeInTheDocument();
  });
});

describe("Integração: fluxo do formulário de Criar Conta", () => {
  it("exibe mensagens de erro para todos os campos obrigatórios ao enviar o formulário vazio", () => {
    render(
      <AuthProvider>
        <SignUp />
      </AuthProvider>
    );

    const submitButton = screen.getAllByRole("button", { name: /criar conta/i })[1];
    fireEvent.click(submitButton);

    expect(screen.getByText("Email é obrigatório")).toBeInTheDocument();
    expect(screen.getByText("Senha é obrigatória")).toBeInTheDocument();
    expect(screen.getByText("Confirmação de senha é obrigatória")).toBeInTheDocument();
  });

  it("exibe erro de confirmação quando as senhas digitadas não coincidem", () => {
    render(
      <AuthProvider>
        <SignUp />
      </AuthProvider>
    );

    const passwordInputs = screen.getAllByPlaceholderText("••••••••");

    fireEvent.change(screen.getByPlaceholderText("seu@email.com"), {
      target: { value: "user@teste.com" },
    });
    fireEvent.change(passwordInputs[0], { target: { value: "Abcdefgh1@" } });
    fireEvent.change(passwordInputs[1], { target: { value: "Outra123@" } });

    const submitButton = screen.getAllByRole("button", { name: /criar conta/i })[1];
    fireEvent.click(submitButton);

    expect(screen.getByText("As senhas não coincidem")).toBeInTheDocument();
  });
});
