import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import PostCard from "@/components/PostCard";
import { Post } from "@/service/types";

const mockPost: Post = {
  id: 1,
  title: "Título de teste",
  body: "Corpo do post de teste",
  liked: false,
  reactions: { likes: 12, dislikes: 3 },
};

describe("PostCard", () => {
  beforeEach(() => {
    jest.spyOn(window, "alert").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("usuário deslogado: ao clicar em 'Curtir' deve exibir alert e não chamar onLike", () => {
    const onLike = jest.fn();

    render(
      <PostCard post={mockPost} isAuthenticated={false} onLike={onLike} />
    );

    fireEvent.click(screen.getByRole("button", { name: /curtir/i }));

    expect(window.alert).toHaveBeenCalledWith(
      "Você precisa estar autenticado para curtir posts!"
    );
    expect(onLike).not.toHaveBeenCalled();
  });

  it("usuário logado: ao clicar em 'Curtir' deve chamar onLike e exibir feedback visual de curtido", async () => {
    const onLike = jest.fn().mockResolvedValue(undefined);

    render(
      <PostCard post={mockPost} isAuthenticated={true} onLike={onLike} />
    );

    const button = screen.getByRole("button", { name: /curtir/i });
    fireEvent.click(button);

    expect(onLike).toHaveBeenCalledWith(mockPost.id);

    await waitFor(() => {
      expect(screen.getByText("Curtido")).toBeInTheDocument();
    });
  });

  it("exibe a quantidade de curtidas e descurtidas do post (objeto reactions)", () => {
    render(
      <PostCard post={mockPost} isAuthenticated={false} onLike={jest.fn()} />
    );

    expect(screen.getByTestId("post-likes")).toHaveTextContent("12");
    expect(screen.getByTestId("post-dislikes")).toHaveTextContent("3");
  });
});
