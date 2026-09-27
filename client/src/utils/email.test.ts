import { isEmailValid } from "./email"

describe('arquivo email do front end', ()=>{
    describe('funcao is email valid', ()=>{
        test('deve retornar true para o email valido: pedrotonin@fag.edu.br', ()=>{
            const resultado = isEmailValid('pedrotonin@fag.edu.br');
            expect(resultado).toBe(true); 
        })
    })
})
