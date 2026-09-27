package com.demoapp.demo.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Map;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.demoapp.demo.model.UserPostReaction;
import com.demoapp.demo.repository.UserPostReactionRepository;

/**
 * Testes com Mockito.
 * Testam o PostService mockando suas dependências (o repositório),
 * sem subir a camada HTTP. O objetivo é isolar a unidade e simular
 * colaboradores.
 */
@ExtendWith(MockitoExtension.class)
class PostServiceMockitoTest {

  @Mock
  private UserPostReactionRepository reactionRepository;

  private PostService postService;

  @BeforeEach
  void setUp() {
    postService = new PostService(reactionRepository);
  }

  @Test
  void toggleLike_quandoAindaNaoCurtiu_deveCriarReacaoEMarcarComoCurtido() {
    Long userId = 1L;
    Long postId = 10L;

    when(reactionRepository.findByUserIdAndPostId(userId, postId))
        .thenReturn(Optional.empty());

    Map<String, Object> result = postService.toggleLike(postId, userId);

    verify(reactionRepository, times(1)).save(any(UserPostReaction.class));
    verify(reactionRepository, never()).delete(any(UserPostReaction.class));
    assertEquals(true, result.get("liked"));
    assertEquals(postId, result.get("postId"));
  }

  @Test
  void toggleLike_quandoJaCurtiu_deveRemoverReacaoEMarcarComoNaoCurtido() {
    Long userId = 1L;
    Long postId = 10L;

    UserPostReaction existingReaction = new UserPostReaction();
    existingReaction.setUserId(userId);
    existingReaction.setPostId(postId);

    when(reactionRepository.findByUserIdAndPostId(userId, postId))
        .thenReturn(Optional.of(existingReaction));

    Map<String, Object> result = postService.toggleLike(postId, userId);

    verify(reactionRepository, times(1)).delete(existingReaction);
    verify(reactionRepository, never()).save(any(UserPostReaction.class));
    assertEquals(false, result.get("liked"));
  }

}
