package com.demoapp.demo.service;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

public class UserServiceTests {

    @Test
    @DisplayName("deve retornar true para senha valida: Password123!")
    void deveRetornarTrueParaSenhaValida1() {
        UserService userService = new UserService(null);
        boolean resultado = userService.isPasswordValid("Password123!");
        assertTrue(resultado, "esperava que o retorno da funcao com a senha Password123! fosse true");
    }

    @Test
    @DisplayName("deve retornar false para senha sem caractere especial")
    void deveRetornarFalseParaSenhaSemCaractereEspecial() {
        UserService userService = new UserService(null);
        boolean resultado = userService.isPasswordValid("Password123");
        assertFalse(resultado, "esperava false pois falta caractere especial");
    }

    @Test
    @DisplayName("deve retornar false para senha menor que 8 caracteres")
    void deveRetornarFalseParaSenhaCurta() {
        UserService userService = new UserService(null);
        boolean resultado = userService.isPasswordValid("Ab1@");
        assertFalse(resultado, "esperava false pois a senha tem menos de 8 caracteres");
    }

    @Test
    @DisplayName("deve retornar true/false corretamente para validacao de e-mail")
    void deveValidarEmailComEArroba() {
        UserService userService = new UserService(null);
        assertTrue(userService.isEmailValid("usuario@teste.com"), "e-mail com @ deveria ser valido");
        assertFalse(userService.isEmailValid("usuario-teste.com"), "e-mail sem @ deveria ser invalido");
    }
}