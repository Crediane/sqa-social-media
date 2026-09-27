import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import SignUp from "@/app/signup/page";

/**
 * Testes de Integração (Telas/Fluxos - Jest + Testing Library)
 * Testam a interação entre múltiplos componentes em uma página/fluxo.
 */

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

// Pequeno componente auxiliar só para poder disparar login() nos testes,
// simulando o que acontece após um signin/signup bem-sucedido na aplicação real.
function LoginHarness() {
  const { login } = useAuth();
  return (
    <button onClick={() => login({ id: 1, email: "user@teste.com" })}>
      fake-login
    </button>
  );
}

describe("Integração: Header + AuthContext (persistência de sessão)", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  // BUG DE FRONTEND CAPTURADO:
  // lib/localStorage.ts grava o usuário logado sob a chave "user"
  // (saveUser -> localStorage.setItem("user", ...)) mas lê sob a chave
  // "sqa_social_user" (getUser -> localStorage.getItem(USER_KEY)).
  // Resultado: o usuário aparenta estar logado enquanto o app está aberto,
  // mas ao recarregar a página (novo mount do AuthProvider) a sessão se perde,
  // violando o requisito de header para "usuários logados".
  it("usuário deve permanecer logado (Header com 'Sair') após um reload da página", async () => {
    const { unmount } = render(
      <AuthProvider>
        <LoginHarness />
        <Header />
      </AuthProvider>
    );

    fireEvent.click(screen.getByText("fake-login"));

    // Enquanto o app está montado, o estado em memória mostra o usuário logado
    await waitFor(() => {
      expect(screen.getByText("Sair")).toBeInTheDocument();
    });

    // Simula um reload da página: desmonta e remonta a árvore,
    // forçando o AuthProvider a reidratar o usuário a partir do localStorage
    unmount();
    render(
      <AuthProvider>
        <Header />
      </AuthProvider>
    );

    // Esperado (requisito): usuário continua autenticado e o header mostra "Sair"
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

    // Há dois botões "Criar Conta" na tela: o do header (navegação) e o de
    // envio do formulário. O botão de submit é o segundo, dentro do <form>.
    const submitButton = screen.getAllByRole("button", {
      name: /criar conta/i,
    })[1];
    fireEvent.click(submitButton);

    expect(screen.getByText("Email é obrigatório")).toBeInTheDocument();
    expect(screen.getByText("Senha é obrigatória")).toBeInTheDocument();
    expect(
      screen.getByText("Confirmação de senha é obrigatória")
    ).toBeInTheDocument();
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
    fireEvent.change(passwordInputs[0], {
      target: { value: "Abcdefgh1@" },
    });
    fireEvent.change(passwordInputs[1], {
      target: { value: "Outra123@" },
    });

    const submitButton = screen.getAllByRole("button", {
      name: /criar conta/i,
    })[1];
    fireEvent.click(submitButton);

    expect(screen.getByText("As senhas não coincidem")).toBeInTheDocument();
  });
});
