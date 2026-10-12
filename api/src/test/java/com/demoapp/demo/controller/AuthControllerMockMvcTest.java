package com.demoapp.demo.controller;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.demoapp.demo.model.User;
import com.demoapp.demo.service.UserService;

/**
 * Testes com MockMvc (Spring Test).
 * Exercitam os endpoints HTTP da API /auth (status, corpo JSON e mensagens),
 * validando o contrato da API. O UserService é mockado para isolar o
 * controller da camada de persistência.
 */
@WebMvcTest(AuthController.class)
class AuthControllerMockMvcTest {

  @Autowired
  private MockMvc mockMvc;

  @MockBean
  private UserService userService;

  @Test
  void signup_comEmailInvalido_deveRetornar422ComMensagemDeEmailInvalido() throws Exception {
    when(userService.isEmailValid(anyString())).thenReturn(true);

    String requestBody = """
        {
          "email": "cfxrfxdm",
          "password": "Abcdef1@"
        }
        """;

    mockMvc.perform(post("/auth/signup")
            .contentType(MediaType.APPLICATION_JSON)
            .content(requestBody))
        .andExpect(status().isUnprocessableEntity())
        .andExpect(jsonPath("$.message").value("E-mail inválido"));
  }

  /**
   * BUG DE BACKEND CAPTURADO:
   * O documento de requisitos exige que, ao tentar cadastrar um e-mail já
   * existente, o sistema exiba a mensagem "E-mail já cadastrado". A
   * implementação atual do AuthController retorna a mensagem
   * "E-mail já está em uso" em seu lugar. Este teste documenta o
   * comportamento esperado pelo requisito e falha contra a implementação
   * atual, capturando o bug.
   */
  @Test
  void signup_comEmailJaCadastrado_deveRetornar409ComMensagemDoRequisito() throws Exception {
    when(userService.isEmailValid(anyString())).thenReturn(true);
    when(userService.isPasswordValid(anyString())).thenReturn(true);
    when(userService.findByEmail("existente@teste.com")).thenReturn(new User());

    String requestBody = """
        {
          "email": "existente@teste.com",
          "password": "Abcdef1@"
        }
        """;

    mockMvc.perform(post("/auth/signup")
            .contentType(MediaType.APPLICATION_JSON)
            .content(requestBody))
        .andExpect(status().isConflict())
        .andExpect(jsonPath("$.message").value("E-mail já cadastrado"));
  }

}
